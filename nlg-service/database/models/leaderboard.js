const mongoose = require('mongoose');
const leaderboardEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: false },
    testtype: { type: String, required: false },
    level: { type: String, required: false },
    score: { type: Number, required: false, default: 0 },
    currentScore: { //score ek upar bhi hai 
        type: Number,
        default: 0,
    },
    totalPossibleScore: {  
        type: Number,
        default: 0,
    },
    levelIndex: { type: Number, required: false, default: 0 },
    testComplete: { type: Boolean, required: false, default: false },
});

const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);

module.exports = {
    LeaderboardEntry
};