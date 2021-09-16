var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
  url: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: 'User', required: true },
});


// Export model.
module.exports = mongoose.model('Photo', PhotoSchema);