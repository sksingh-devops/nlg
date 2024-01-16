

  const mongoose = require('mongoose');

  const golfDataSchema = new mongoose.Schema({
    year: String,
    date: Date,
    tournamentName: String,
    r1: String,
    r2: String,
    r3: String,
    r4: String,
    total: String,
    finalPOS: String,
    totalStrokes: String,
    totRounds: String,
    avgScore: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
  });

const GolfTour = mongoose.model('tours', golfDataSchema);

module.exports = {
    GolfTour
}