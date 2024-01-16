// notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  email: String
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
    Notification
}
