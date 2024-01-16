const { User } = require("../database/models/user");
const { Assignment } = require("../database/models/assigment");
const {Notification }= require("../database/models/notification");

const clearAll = async (req, res) => {
    try {
      // Delete all notifications for the authenticated user
      await Notification.deleteMany({ recipient: req.user.id });
      return res.status(200).json({ message: 'All notifications cleared.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred.' });
    }
  }

const markAllRead = async (req, res) => {
    try {
      // Mark all unread notifications as read for the authenticated user
      await Notification.updateMany(
        { recipient: req.user.id, isRead: false },
        { $set: { isRead: true } }
      );
  
      return res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred.' });
    
    }
}
const markRead = async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found.' });
      }
      return res.status(200).json({ message: 'Notification marked as read.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred.' });
    }
  }

const getAllNotification = async (req, res) => {
    try {
      // Fetch notifications for the authenticated user
      const notifications = await Notification.find({ email: req.user.email })
        .sort({ createdAt: -1 })
        .populate('sender', 'username');
        const unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
      return res.status(200).json({notifications, unreadCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred.' });
    }
  }
const getNotificationCount = async (req, res) => {
    try {
      
        const unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
      return res.status(200).json({ unreadCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred.' });
    }
  }
  module.exports = {
    clearAll,
    markAllRead,
    markRead,
    getAllNotification,
    getNotificationCount,
};