const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  contactNumber: { type: String },
  profilePicture: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);