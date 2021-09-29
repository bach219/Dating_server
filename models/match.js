var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MatchSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  match: { type: Boolean, default: false },
  owner: { type: Schema.ObjectId, ref: 'User' },
});


// Export model.
module.exports = mongoose.model('Match', MatchSchema);