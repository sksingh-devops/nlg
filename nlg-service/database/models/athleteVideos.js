const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  path: String, 
  thumbnail: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Videos = mongoose.model('Video', videoSchema);

module.exports = {
    Videos
}