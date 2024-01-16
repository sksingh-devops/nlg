const mongoose = require('mongoose');
const userScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    testtype: {
        type: String,
        required: true,
    },
    lastlevelAt: {
        type: Number,
        default: -1,
        required: false,
    },
    maxThreshold: {
        type: Boolean,
        required: false,
    },
    levelScore: [
        {
            levelId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            score: {
                type: Number,
                required: true,
            },
            distanceInFeet: {
                type: Number,
                required: false,
            },
            tendency: {
                type: Number,
                required: false,
            },
            timing: {
                type: Number,
                required: false,
            },
            consistency: {
                type: Number,
                required: false,
            },
            maxThreshold: {
                type: Boolean,
                required: false,
            },
            distanceInInches: {
                type: Number,
                required: false,
            },
            attempts: {
                type: Number,
                default: 0,
            },
            currentScore: { //score ek upar bhi hai 
                type: Number,
                default: 0,
            },
            totalPossibleScore: {  
                type: Number,
                default: 0,
            },
            totalshotTaken:{
                type: Number,
                default: 0,
            },
            correctshapeTaken:{
                type: Number,
                default: 0,
            }
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Usertest = mongoose.model('Usertest', userScoreSchema);

module.exports = {
    Usertest
} 