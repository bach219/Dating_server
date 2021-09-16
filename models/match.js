var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MatchSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
});


// Export model.
module.exports = mongoose.model('Match', MatchSchema);