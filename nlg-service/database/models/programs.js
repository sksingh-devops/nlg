
const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: false,
  },
  css: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  buttonDetails: {
    type: String,
    required: false,
  },
  order: {
    type: Number,
    default: Date.now
  },
  buttonLink: {
    type: String,
    required: false,
  },
});

const Program = mongoose.model('Program', programSchema);

module.exports = {
    Program
}


// // Create and save the data
// MainHeadingModel.insertMany(Programs)
//     .then(() => {
//         console.log('Data saved successfully.');
//     })
//     .catch((error) => {
//         console.error('Error saving data:', error);
//     });
