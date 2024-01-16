const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false,
    },
    JGSR: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    graduationyear: {
        type: String,
        required: false,
    },
    social :{
        type: String,
        required: false,
    },
    isApproved: {
        type: Boolean,
        required: false,

    },
    isAdmin: {
        type: Boolean,
        required: false,

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        enum: ['admin', 'coach', 'recruiter', 'athlete']
    },
    businessUrl: {
        type: String,
        required: false
    },
    linkedinProfile: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    },
    birthDate: {
        type: String,
        required: false
    },
    gpa: {
        type: String,
        required: false
    },
    gpauw: {
        type: String,
        required: false
    },
    swing: {
        type: String,
        required: false
    },
    lr: {
        type: String,
        required: false
    },
    graduationDate: {
        type: String,
        required: false
    },
    height: {
        type: String,
        required: false
    },
    highSchool: {
        type: String,
        required: false
    },
    satOverall: {
        type: String,
        required: false
    },
    act: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    ref: {
        type: String,
        required: false
    },
    isSuspended: {
        type: Boolean,
        required: false,

    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    profilePictureLink: {
        type: String,
        required: false
    },
    assignedCoach: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coverPicturePath: { type: String, required: false },
    profilePicturePath: { type: String, required: false },
    totalScores: {
        type: Number,
        default: 0,
    },
    totalCompletedLevels: {
        type: Number,
        default: 0,
    },
    assignedTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User

}