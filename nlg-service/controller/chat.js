const { User } = require("../database/models/user");
const { Assignment } = require("../database/models/assigment");
const { ChatMessage } = require("../database/models/chat");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const moment = require('moment');
const adminemail = process.env.EMAIL;
const adminpassword = process.env.PASSWORD;
const userListChats = {}
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipientId = req.params.recipientId;
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
    const limit = parseInt(req.query.limit) || 30; // Get the limit from the query parameter

    const skip = (page - 1) * limit;

    const chatHistory = await ChatMessage.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    })
      .sort('timestamp')
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name populate')
      .exec();

    // Delete the conversation entry for the recipient
    if (userListChats[userId] && userListChats[userId][recipientId]) {
      delete userListChats[userId][recipientId];
    }
    markReadAsync(userId, recipientId)

    res.json(chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};

// GET /api/chat/search?q=abc
const chatSearch = async (req, res) => {
  try {
    const searchQuery = req.query.q; // Get the search query from the query parameter

    // Search for users whose name contains the search query
    const users = await User.find(
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      '_id name email profilePicture profilePictureLink' // Select only the required fields
    );


    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}

const recent = async (req, res) => {
  try {
    const userId = req.user.id;
    const recentConversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'senderData',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'recipient',
          foreignField: '_id',
          as: 'recipientData',
        },
      },
      {
        $unwind: '$senderData',
      },
      {
        $unwind: '$recipientData',
      },
      {
        $project: {
          senderData: {
            _id: 1,
            name: 1,
            profilePicture: 1,
            profilePictureLink: 1,
            email: 1,
          },
          recipientData: {
            _id: 1,
            name: 1,
            profilePicture: 1,
            profilePictureLink: 1,
            email: 1,
          },
          message: 1,
          timestamp: 1,
          read: 1,
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipientData',
              '$senderData',
            ],
          },
          lastMessage: { $last: '$message' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', userId] },
                    { $eq: ['$read', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          timestamp: { $last: '$timestamp' },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);

    res.json(recentConversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}

const postMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const recipientId = req.params.recipientId;
    const messageContent = req.body.message;
    const newMessage = new ChatMessage({
      sender: senderId,
      recipient: recipientId,
      message: messageContent,
    });

    await newMessage.save();
    try {
      if (!userListChats[recipientId]) {
        userListChats[recipientId] = {};
      }
      userListChats[recipientId][senderId] = {
        message: messageContent,
        sender: senderId,
        ts: Date.now(),
      };
    } catch (err) {
      console.log(err)
    }
    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}
const markRead = async (req, res) => {
  try {
    const recipientId = req.user.id; // The logged-in user's ID
    const otherUserId = req.params.senderId;
    // Update unread messages sent from the other user to the logged-in user
    await ChatMessage.updateMany(
      {
        sender: otherUserId,
        recipient: recipientId,
        read: false,
      },
      { $set: { read: true } }
    );

    // Update unread messages sent from the logged-in user to the other user
    // await ChatMessage.updateMany(
    //   {
    //     sender: recipientId,
    //     recipient: otherUserId,
    //     read: false,
    //   },
    //   { $set: { read: true } }
    // );

    res.json({ message: 'Chat messages marked as read.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}
const markReadAsync = async (otherUserId, recipientId) => {
  try {


    await ChatMessage.updateMany(
      {
        sender: recipientId,
        recipient: otherUserId,
        read: false,
      },
      { $set: { read: true } }
    );
  } catch (error) {
    console.error(error);
  }
}


const recentjugad = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);
    const userInteractions = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { recipient: currentUserId },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', currentUserId] },
              then: '$recipient',
              else: '$sender',
            },
          },
          lastInteraction: { $max: '$timestamp' },
        },
      },
      {
        $sort: { lastInteraction: -1 },
      },
    ]).exec();


    const interactionsResponse = [];

    for (const interaction of userInteractions) {
      const userId = interaction._id;

      if (userId.toString() !== currentUserId) {
        const lastMessage = await ChatMessage.findOne({
          $or: [
            { sender: currentUserId, recipient: userId },
            { sender: userId, recipient: currentUserId }
          ]
        })
          .sort({ timestamp: -1 })
          .populate('sender', 'name email profilePictureLink')
          .populate('recipient', 'name email profilePictureLink')
          .exec();

        if (lastMessage) {
          const isLastMessageRead = lastMessage.read;
          interactionsResponse.push({
            userId: userId,
            isLastMessageRead: isLastMessageRead,
            lastMessage: lastMessage
          });
        }
      }
    }

    res.json({ interactionsResponse: interactionsResponse, currentUserId: req.user.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}
const checkAndNotifyUsers = () => {
  const currentTime = Date.now();
  const notificationThreshold = 15 * 60 * 1000; // 20 minutes in milliseconds

  for (const recipientId in userListChats) {
    for (const senderId in userListChats[recipientId]) {
      const conversation = userListChats[recipientId][senderId];
      if (currentTime - conversation.ts >= notificationThreshold) {
        sendNotificationEmail(recipientId, senderId, conversation.message, conversation.ts);
      }
    }
  }
};

const sendNotificationEmail = async (recipientId, senderId, messageContent, ts) => {
  try {
    const recipientUser = await User.findById(recipientId);
    const senderUser = await User.findById(senderId);
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminemail,
        pass: adminpassword,
      },
    });

    // Generate the HTML content of the email using the provided template
    const htmlContent = `
    <body style="margin: auto; padding: 0; background-color: #BDC3C7; display: flex; justify-content: center; align-items: center; text-align: center">
  <div class="form" style="background-color: #fff; width: 100%; border-radius: 10px; color: #666; padding: 20px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); text-align: center;">
    <div class="top" style="background-color: rgb(4, 60, 4); height: 10px; box-shadow: 10px 12px 14px rgba(0, 0, 0, 0.3); margin-bottom: 20px;"></div>
    <div class="info">
      <h1 style="margin: 5px 0; color: rgb(4, 60, 4);">Welcome to NLG</h1>
      <h1 style="margin: 5px 0;">Hi</h1>
      <h2 style="margin: 5px 0;"></h2>
      <p class="line" style="color: #999;">________________________________________</p>
      <h2>New Message</h2>
      <p style="margin: 5px 0; font-size: 20px">From: ${senderUser.name || senderUser.email}</p>
      <p style="margin: 5px 0;">${moment(ts).format('LLLL')}</p>
      <br>
      <h2>${messageContent}</h2>
      <div style="margin: 20px 0; color: #999;">________________________________________</div>
      <div class="bottom">
        <button class="accept" style="background-color: rgb(4, 60, 4); box-shadow: 10px 12px 14px rgba(0, 0, 0, 0.3); color: white; border: none; border-radius: 10px; padding: 20px 50px;">
          <a href="https://www.next-level-golf.com" style="text-decoration: none; color: white;"> Visit NLG </a>
        </button>
      </div>
    </div>
  </div>
</body>

    `;
    // Send the email
    const mailOptions = {
      from: adminemail,
      to: recipientUser.email,
      cc: 'swingbylou@me.com',
      subject: 'New Message Notification',
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
    if (userListChats[recipientId] && userListChats[recipientId][senderId]) {
      delete userListChats[recipientId][senderId];
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const checkAndNotifyUsersPeriodically = async () => {
  // Call the function immediately
  checkAndNotifyUsers();

  // Set the interval to call the function every 20 minutes
  const interval = 20 * 60 * 1000; // 20 minutes in milliseconds
  setInterval(() => {
    checkAndNotifyUsers();
  }, interval);
};
module.exports = {
  getHistory,
  chatSearch,
  recent,
  postMessage,
  markRead,
  recentjugad,
  checkAndNotifyUsersPeriodically
};