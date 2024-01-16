const mongoose = require('mongoose');

const visitorChatMessageSchema = new mongoose.Schema({
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: false },
  sender: { type: String, unique: false },
  recipient: { type: String, unique: false },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  vemail: { type: String ,unique: false},
  vname : { type: String ,unique: false, required: false},
});

const VisitorChatMessage = mongoose.model('VisitorChatMessage', visitorChatMessageSchema);

module.exports = {
  VisitorChatMessage
}