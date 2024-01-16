const { User } = require("../database/models/user");
const { Assignment } = require("../database/models/assigment");
const { Visitor } = require("../database/models/visitor");

const { VisitorChatMessage } = require("../database/models/visitor.chat");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const moment = require('moment');
const adminemail = process.env.EMAIL;
const adminpassword = process.env.PASSWORD;
const getHistory = async (req, res) => {
  try {
    const userId = req.params.vid;
    const recipientId = req.params.recipientId;  //always admin
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
    const limit = parseInt(req.query.limit) || 30; // Get the limit from the query parameter
    const skip = (page - 1) * limit;
    const chatHistory = await VisitorChatMessage.find({
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

    res.json(chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};

const recentAdmin = async (req, res) => {
  try {
    const result = await VisitorChatMessage.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$visitor',
          lastMessage: { $first: '$message' },
          timestamp: { $first: '$timestamp' },
          vname: { $first: '$vname' },
          visitor: { $first: '$visitor'},
        }
      },
      {
        $lookup: {
          from: 'visitors',
          localField: 'visitor', 
          foreignField: '_id',
          as: 'visitorInfo'
        }
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          timestamp: 1,
          vname : 1,
          visitor :1,
          visitorInfo: { $arrayElemAt: ['$visitorInfo', 0] }
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

const postMessage = async (req, res) => {
  try {
    // req.body has email then send message to user
    const recipientId = req.params.recipientId;
    const messageContent = req.body.message;
    const vid = req.body.vid;
    const email = req.body.email;
    senderId = recipientId === "admin" ? vid : "admin"
    const newMessage = new VisitorChatMessage({
      sender: senderId,
      visitor : vid,
      recipient: recipientId,
      message: messageContent, 
      email
    });
    let visitor = await Visitor.findById( vid );
    
    if (visitor && visitor.name){
      newMessage.vname = visitor.name || visitor.vid
    }
    await newMessage.save();
    if(recipientId === "admin"){
    setTimeout(() => {
      sendAdminNotificationEmail(newMessage,email)
    }, 10);
  }else{
    setTimeout(() => {
      visitor && sendVisitorNotificationEmail(newMessage, email)
    }, 10);
  }
    // sendNotificationEmail()
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const addVisitor = async (req, res) => {
  try {
    const { vid, email, name } = req.body;
    let visitor
    if (!vid || !mongoose.isValidObjectId(vid)) {
    visitor = await Visitor.findById( vid );
    }
   var updatedVisitor

    if (visitor) {
      if(email){
        visitor.email = email;
      }
      if(name){
      visitor.name = name;}
      await visitor.save();
      updatedVisitor = visitor
    } else {
      const lastVisitor = await Visitor.findOne().sort({ visitorNumber: -1 });
      const newVisitorNumber = lastVisitor ? lastVisitor.visitorNumber + 1 : 1;
      visitor = new Visitor({ vid, visitorNumber: newVisitorNumber });
      if(email){
        visitor.email = email;
      }
      visitor.name = "Visitor " + newVisitorNumber
      visitor.vid = "Visitor " + newVisitorNumber

      updatedVisitor = await visitor.save();
    }
    res.json(updatedVisitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getVisitor = async (req, res) => {
  try {
    const vid = req.params.vid
    let visitor = await Visitor.findOne({ vid });
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const sendAdminNotificationEmail = async (newMessage, emailss) => {
  try {
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
  <div class="form" style="background-color: #fff; border-radius: 10px; width: 100%;color: #666; padding: 20px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); text-align: center;">
    <div class="top" style="background-color: rgb(4, 60, 4); height: 10px; box-shadow: 10px 12px 14px rgba(0, 0, 0, 0.3); margin-bottom: 20px;"></div>
    <div class="info">
      <h1 style="margin: 5px 0; color: rgb(4, 60, 4);">New Visitor chat</h1>
      <h1 style="margin: 5px 0;">Hi</h1>
      <h2 style="margin: 5px 0;"></h2>
      <p class="line" style="color: #999;">________________________________________</p>
      <h2>New Message</h2>
      <p style="margin: 5px 0; font-size: 20px">From: ${newMessage.vname || newMessage.vid}</p>
      <p style="margin: 5px 0; font-size: 20px">Email: ${emailss || 'Not Given'}</p>
      <p style="margin: 5px 0;">${moment(newMessage.timestamp).format('LLLL')}</p>
      <br>
      <h2>${newMessage.message}</h2>
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
      to: adminemail,
      cc: 'swingbylou@me.com',
      subject: 'New Visitor Message Notification',
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const sendVisitorNotificationEmail = async (newMessage, email) => {
  if (!email){
    return
  } 
  try {
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
  <div class="form" style="background-color: #fff; border-radius: 10px; width: 100%;color: #666; padding: 20px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); text-align: center;">
    <div class="top" style="background-color: rgb(4, 60, 4); height: 10px; box-shadow: 10px 12px 14px rgba(0, 0, 0, 0.3); margin-bottom: 20px;"></div>
    <div class="info">
      <h1 style="margin: 5px 0; color: rgb(4, 60, 4);">New Message from NLG</h1>
      <h1 style="margin: 5px 0;">Hi</h1>
      <h2 style="margin: 5px 0;"></h2>
      <p class="line" style="color: #999;">________________________________________</p>
      <h2>New Message</h2>
      <p style="margin: 5px 0; font-size: 20px">From: NLG Admin</p>
      <p style="margin: 5px 0;">${moment(newMessage.timestamp).format('LLLL')}</p>
      <br>
      <h2>${newMessage.message}</h2>
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
      to: email,
      cc: 'swingbylou@me.com',
      subject: 'New Message Notification',
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
module.exports = {
  addVisitor,
  getHistory,
  recentAdmin,
  postMessage,
  getVisitor
};