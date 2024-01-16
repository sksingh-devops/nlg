const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: false
    },
    name: {
        type: String,
        required: false,
    },
// Visitor id
    vid: {
        type: String,
        required: true,
        unique: false
    },

    visitorNumber: {
        type: Number,
        default: 0 // Initial value, will be incremented
      }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = {
    Visitor

}