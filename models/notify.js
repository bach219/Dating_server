var mongoose = require('mongoose');

var Schema = mongoose.Schema;
const moment = require('moment-timezone');
const dateVN = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");

var NotifySchema = new Schema({
  name: { type: String, required: true, enum: ['Kết đôi mới', 'Tin nhắn mới', 'Lươt thích mới'], default: 'Kết đôi mới' },
  time: { type: Date, required: true, default: dateVN },
  content: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: 'User', required: true },
});


// Export model.
module.exports = mongoose.model('Notify', NotifySchema);