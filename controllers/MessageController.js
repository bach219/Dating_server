const Message = require('../models/message');
const response = require('../config/response')
const Room = require('../models/room')
const MAX_PAGE_SIZE = 50;

const cloudMessage = require('./CloudMessageController');


//send message and store it in database/
exports.sendMessage = async function (data, io) {

    //get user from database
    let room = await Room.findById(data.room);

    //check if there is such room
    if (!room) {
        //send error message
    }
    try {
        //create message model with received data
        let message = new Message(data);

        //save to data base
        await message.save();

        //set this message to room's last message
        await Room.findByIdAndUpdate(room._id, {last_msg_id: message._id});

        //get store message and populate it "from"
        let content = await Message.findById(message._id).populate('from', '_id name email avatar last_seen')

        //send back to user
        await io.sockets.in(room._id).emit('message', content);

    } catch (e) {
        console.log(e)
    }
};

//notify user that room has been changed
exports.notifyDataSetChanged = async function (roomId, io, clients) {

    //get room from database
    let room = await Room.findById(roomId);

    //check if there is a such room
    if (!room) {
        //send error message
    }
    try {
        //get the current room from database and populate all the ref
        let foundedRoom = await Room.findById(room._id)
            .populate("users", '_id name email avatar last_seen fcm_key')
            .populate("last_msg_id").populate({path: 'last_msg_id', populate: {path: 'from'}})
            .populate("admin", '_id name email avatar last_seen fcm_key');

        //create loop for every user in the room object
        await foundedRoom.users.forEach(function (user) {

            console.log('user', user)
            //check from the hashmap that is user was connect to socket or not
            let socketId = clients.search((user._id).toString());

            //if connected
            if (socketId) {
                //get socket id and emit the change and pass room object
                io.sockets.to(socketId).emit('change', foundedRoom);
            } else {
                //if not
                //notify user with firebase cloud messaging
                cloudMessage.unreadMessage(foundedRoom.last_msg_id, user.fcm_key);
            }
        })
    } catch (e) {
        console.log(e)
    }
};

//get message list
exports.messageList = async function (req, res) {
    try {
        //get query
        let room_id = req.query.room_id;
        let pageNo = parseInt(req.query.pageNo || 1);
        if (pageNo !== 0) {
            pageNo--; // decrement page no by 1
        }
        //get limitation for document's count
        let limit = parseInt(req.query.limit || MAX_PAGE_SIZE);

        //get count of the document
        let documentCount = await Message.countDocuments({room: room_id});

        //get all message from current room id
        let messageFounded = await Message.find({room: room_id})
            .skip(pageNo * limit) // skip
            .limit(limit) //limitation
            .sort({
                date: -1 //sort
            })
            .populate('from', '_id name email blocked avatar');

        //check count
        if (messageFounded.length <= 0) {
            return res.status(response.STATUS_OK).json(
                response.createResponse(response.FAILED, 'Kh??ng t??m th???y d??? li???u'));
        }
        return res.status(response.STATUS_OK).json(
            response.createResponse(response.SUCCESS, 'Th??nh c??ng', messageFounded, documentCount, pageNo, limit));
    } catch (e) {
        return res.status(response.STATUS_BAD_REQUEST).json(
            response.createResponse(response.ERROR, '???? x???y ra l???i ' + e));
    }
};