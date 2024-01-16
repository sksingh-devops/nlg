
const { User } = require("../database/models/user");

const bookmark = async (req, res) => {
    const { athleteId } = req.params;
    const email = req.user.email
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Login' });
        }

        if (!user.bookmarks.includes(athleteId)) {
            user.bookmarks.push(athleteId);
            await user.save();
            return res.json({ message: 'Athlete bookmarked successfully.' });
        } else {
            return res.json({ message: 'Athlete bookmarked successfully.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Endpoint to unbookmark an athlete
const unbookmark = async (req, res) => {
    const { athleteId } = req.params;
    const email = req.user.email

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Login' });
        }

        if (user.bookmarks.includes(athleteId)) {
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== athleteId);
            await user.save();
            return res.json({ message: 'Athlete unbookmarked successfully.' });
        } else {
            return res.json({ message: 'Athlete unbookmarked successfully.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};
const getBookmark = async (req, res) => {
    const userId = req.user.email; 
    try {
      const user = await  User.findOne({ email: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found. Login' });
      }
      res.json({ bookmarks: user.bookmarks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }

module.exports = {
    bookmark,
    unbookmark,
    getBookmark
}