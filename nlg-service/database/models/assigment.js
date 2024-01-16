const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = {
    Assignment
}

