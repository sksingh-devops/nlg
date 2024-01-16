const { User } = require("../database/models/user");
const { Assignment } = require("../database/models/assigment");
const {Notification }= require("../database/models/notification");
const assigmentCoach = async (req, res) => {
        try {
          // Check if the requesting user is an admin
          if (req.user.role !== "admin")
          return res.status(403).json({ message: "Unauthorized" });
          const { coachId, athleteId } = req.body;
          // Check if coach and athlete exist
          const coach = await User.findById(coachId);
          const athlete = await User.findById(athleteId);
          if (!coach || coach.role !== 'coach' || !athlete || athlete.role !== 'athlete') {
            return res.status(400).json({ message: 'Invalid coach or athlete ID.' });
          }
      
          // Create the assignment
          const assignment = new Assignment({
            coach: coachId,
            athlete: athleteId,
          });
      
          await assignment.save();
      
          // Create notifications for coach and athlete
          const coachNotification = new Notification({
            email: coach.email,
            recipient: coachId,
            sender: req.user.id, // Admin's ID
            message: `You've been assigned as a coach to ${athlete.name || athlete.email}.`,
          });
      
          const athleteNotification = new Notification({
            recipient: athleteId,
            email: athlete.email,
            sender: req.user.id, // Admin's ID
            message: `You've been assigned ${coach.name || coach.email} as your coach.`,
          });
      
          await Promise.all([coachNotification.save(), athleteNotification.save()]);
      
          // Update the athlete's assignedCoach field
          athlete.assignedCoach = coachId;
          await athlete.save();
      
          return res.status(201).json({ message: 'Assignment created successfully.' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'An error occurred.' });
        }
     
};

const removeCoachAssignment = async (req, res) => {
    try {
      // Check if the requesting user is an admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      const athleteId  = req.params.id;
      const athlete = await User.findById(athleteId);
      const coach = await User.findById(athlete.assignedCoach);
      const coachId  = coach.id;
      // Find and remove the assignment
      await Assignment.findOneAndRemove({ coach: coach.id, athlete: athleteId });
  
      // Create notifications for coach and athlete
      const coachNotification = new Notification({
        email: coach.email,
        recipient: coachId,
        sender: req.user.id, // Admin's ID
        message: `Your coaching assignment with ${athlete.name || athlete.email} has been removed.`,
      });
  
      const athleteNotification = new Notification({
        recipient: athleteId,
        email: athlete.email,
        sender: req.user.id, // Admin's ID
        message: `Your coach assignment with ${coach.name || coach.email} has been removed.`,
      });
  
      await Promise.all([coachNotification.save(), athleteNotification.save()]);
  
      // Clear the athlete's assignedCoach field
      athlete.assignedCoach = null;
      await athlete.save();
  
      return res.status(200).json({ message: 'Assignment removed successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred.' });
    }
  };
// Read all athlete
const getAllAthlete = async (req, res) => {
    try {
        // Fetch athletes and populate assigned coaches' names
        const athletes = await User.find({ role: 'athlete' }).populate({
          path: 'assignedCoach',
          model: 'User',
          select: 'name email', // You can customize the fields you want to select
        });
        const athletesWithAssignedCoachNames = athletes.map(athlete => {
          return {
            _id: athlete._id,
            name: athlete.name,
            email : athlete.email,
            birthDate : athlete.birthDate,
            assignedCoachName: athlete.assignedCoach ? athlete.assignedCoach.name : null,
            assignedCoachEmail: athlete.assignedCoach ? athlete.assignedCoach.email : null,
            
          };
        });
    
        return res.status(200).json(athletesWithAssignedCoachNames);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred.' });
      }
};
// Read all programs
const getAllCoach = async (req, res) => {
    User.find({ role: 'coach' })
    .select("email _id")
    .lean()
    .then(function (users) {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
};



module.exports = {
    assigmentCoach,
    getAllAthlete,
    getAllCoach,
    removeCoachAssignment,
};
