const mongoose = require('mongoose');
const jruserScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    holeScore: [
        {
            holeId: {
               type: String,
                required: true,
            },
            score: {
                type: Number,
                required: true,
            },
            par: {
                type: Number,
                required: false,
            },
            fairway_hit: {
                type: Number,
                required: false,
            },
            carry_distance: {
                type: Number,
                required: false,
            },
            gir: {
                type: Number,
                required: false,
            },
            correct_leave: {
                type: Number,
                required: false,
            },
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const JRUsertest = mongoose.model('JRUsertest', jruserScoreSchema);

module.exports = {
    JRUsertest
} 