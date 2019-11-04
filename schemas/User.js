const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a User schema to store users in MongoDB:
const UserSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

// Use mongoose .model() method 
// to convert UserSchema into a MongoDB compatible model;
// the first arg 'users' defines a new 'users' collection that will utilize the model:
module.exports = User = mongoose.model('User', UserSchema);