const mongoose = require("mongoose");
const attemptsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  attempts: {
    type: Number,
    default: 0,
  },
});

const Attempttest = mongoose.model("Attempttest", attemptsSchema);

module.exports = {
    Attempttest,
};
