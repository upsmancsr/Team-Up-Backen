const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

// Define a Team schema for MongoDB:
const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  users: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  adminUsers: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'     /* ref is the collection in which the _id is found */
  }],
  invitedUsers: [{
    type: String    /* email addresses for users invited to join team */
  }] 
});

// Create Team model from TeamSchema.
// With mongoose.model(), Mongoose *compiles* a model from the schema.
// The first arg is the singular name of the collection the model is for. 
// ** Mongoose automatically looks for the plural, lowercased version of your model name. **
module.exports = Team = mongoose.model('Team', TeamSchema);