var User = require('../models/user')
var Room = require('../models/room')
const hashMap = require('hashmap');
const messageApi = require('../controllers/MessageController');
const jwt = require('jsonwebtoken');
const redis_client = require('../config/redis_connect');
const db = require('../config/config').get();

exports.socket_connect = function (io) {
  let clients = new hashMap(); // for store online users

  io.use(async (socket, next) => {

    try {
      // Bearer tokenstring
      const token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, db.JWT_ACCESS_SECRET);
      const id = decoded.sub;

      // varify blacklisted access token.
      redis_client.get('BL_' + id.toString(), async (err, data) => {
        if (err) return res.status(401).json({ status: false, message: err });

        else if (data === token) return res.status(401).json({ status: false, message: "blacklisted token." });

        else{
          let user = await User.findOne({ _id: id });
          if (user) {//exist : store user to hashmap and next()
            clients.set(socket.id, (user._id).toString())
            console.log(clients)
            await User.findByIdAndUpdate(user._id, { last_seen: 0 });
            return next();
          } else {//not exist: don't allow user
            return res.status(401).json({ status: false, message: "Không tìm thấy người dùng." });
          }
        }
      })

    } catch (error) {
      return res.status(401).json({ status: false, message: "Your session is not valid.", data: error });
    }

  })

  io.on('connection', function (socket) {

    console.log("[socket] connected :" + socket.id);

    //event join room
    socket.on('join', async function (room) {
      //android device pass parameter "room id " to the event and join
      socket.join(room);
    })

    socket.on('message_detection', async function (data) {
      //detect the message and send it to user
      await messageApi.sendMessage(data, io, socket)

      //notify user that have new message
      await messageApi.notifyDataSetChanged(data.room, io, clients)
    })

    socket.on('disconnect', async function () {
      console.log("[socket] disconnected :" + socket.id);
      //in this event we get user from database and set last seen to now
      await User.findByIdAndUpdate(clients.get(socket.id), { last_seen: new Date().getTime() });
      //search in hashmap and find the related socket and delete it
      await clients.delete(socket.id);
    })

  });
}
