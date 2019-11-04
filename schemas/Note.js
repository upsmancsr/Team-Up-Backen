const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a Team schema for MongoDB:
const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: Schema.Types.ObjectId, 
    ref: 'Team',     /* ref is the collection in which the _id is found */
    required: true
  },
  taggedUsers: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  } 
});

module.exports = Note = mongoose.model('Note', NoteSchema);