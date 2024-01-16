const { Program } = require("../database/models/programs");

// Create a program
const createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({ message: "Program Created Successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Something Went Wrong" });
  }
};

// Read all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

// Read a single program
const getProgramById = async (req, res) => {
  try {
    let id = req.params.id;
    var program ;
    if (id == "nlg" || id == "junior") {
      program = {
        type: id,
        heading: `<p>New Program</p>`,
        css: {
            headerFontSize: "20px",
            backgroundColor: "grey",
            color: "black",
            textAlign: "center",
            buttonBackgroundColor: "#4096FF",
            buttonBorder: "none",
        },
        content: ``,
        buttonDetails: `<p>Purchase</p>`,
    }
    } else {
       program = await Program.findById(req.params.id);
    }
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json(program);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

// Update a program
const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ message: "Program Updated Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

// Delete a program
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

// List all programs by type
const getAllProgramsByType = async (req, res) => {
  try {
    const programs = await Program.find({ type: req.params.type }).sort({ order: 1 });
    res.json(programs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

module.exports = {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  getAllProgramsByType,
};
