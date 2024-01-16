const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    instruction: {
        type: String,
        required: false,
    },
    totalShots: {
        type: Number,
        required: false,
        default: 1,
    },
    minShots: {
        type: Number,
        required: false,
        default: 1,
    },
    minScore: {
        type: Number,
        required: false,
        default: 1,
    },
});

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    levels: [levelSchema],
    timed: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    videoPath: String, 
    title: {
        type: String,
        maxlength: 255, 
    },
    testtype : String ,
    includeAttempts : {
        type: Boolean,
    },
    includeDistance :{
        type: Boolean,
    },
    includeTime :{
        type: Boolean,
    },
    isMaxthreshold :{
        type: Boolean,
    },
    isPractice:{
        type: Boolean,

    },
    archived: {  
        type: Boolean,
        default: false, 
    },
    order: {
        type: Number,
        default: Date.now(),
    },
});

const Test = mongoose.model('Test', testSchema);

module.exports = {
    Test
}