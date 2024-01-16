const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment');
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const { connectToDatabase, closeDatabase } = require("./database");
const { User } = require("./database/models/user");
const { Program } = require("./database/models/programs");
const { Notification } = require("./database/models/notification");
const { GolfTour } = require("./database/models/golfTour");
const { Videos } = require("./database/models/athleteVideos");
const { Test } = require("./database/models/test");
const { Usertest } = require("./database/models/usertest");
const { LeaderboardEntry } = require("./database/models/leaderboard");
const { defaultPrograms } = require("./database/defaultPograms");
const { generateRandomPassword } = require("./util");
const programController = require("./controller/program.js");
const aassController = require("./controller/assignment");
const bookmarkController = require("./controller/bookmark");
const naughtyController = require("./controller/notification");
const chatController = require("./controller/chat");
const visitorChatController = require("./controller/visitor.chat");
const bodyParser = require("body-parser");
const multer = require("multer");
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define the destination directory for uploaded files
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 10MB (adjust as needed)
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
      "-" +
      uniqueSuffix +
      "." +
      file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });
const app = express();
const { move } = require("./full");
const { JRUsertest } = require("./database/models/juniorusertest.js");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors()); // Enable CORS for all routes
// Retrieve email and password from environment variables
const adminemail = process.env.EMAIL;
const adminpassword = process.env.PASSWORD;

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); // Prevents caching
  res.setHeader('Pragma', 'no-cache');
  next();
});

// Invite user and assign roles
app.post("/invite", authenticateToken, (req, res) => {
  const { email, name, role, sendemail } = req.body;
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  User.findOne({ email }).then((existingUser) => {
    if (existingUser)
      return res.status(500).json({ message: "User already exists" });

    //  const password = generateRandomPassword(7)
    bcrypt.hash("Pa$$word", 10).then((hash) => {
      User.create({
        email: email,
        name: name,
        password: hash,
        role: role,
        isApproved: true,
      })
        .then(() => {
          if (!sendemail) {
            res.json({ message: "User added successfully" });
          } else {
            setTimeout(() => {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: adminemail,
                  pass: adminpassword,
                },
              });

              const mailOptions = {
                from: adminemail,
                to: email,
                cc: 'swingbylou@me.com',
                subject: "Invitation to NLG",
                html: `<p>You have been invited to join NLG as a ${role} </p>
                      <p>use Pa$$word as password</p>
                      <a href="https://www.next-level-golf.com"> Visit NLG </a>
                      <br />
                      <p style="color: blue;">
  NOW THAT YOU’RE REGISTERED TO NEXT LEVEL GOLF YOU CAN DECIDE HOW YOU WOULD LIKE TO DEVELOP YOUR GAME-HERE ARE THE FOLLOWING OPTIONS-
</p>

<ul style="color: blue;">
  <li>PRIVATE LESSONS</li>
  <li>GROUP INSTRUCTION</li>
  <li>NLG ONLINE TRAINING</li>
</ul>

<p style="color: blue;">
  PLEASE REACH OUT TO LOUIS SAUER TO HELP DECIDE WHICH DIRECTION YOU WOULD LIKE TO GO IN.
</p>`
                ,
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Failed to send email:", error);
                }
              });
            }, 0);
            res.json({ message: "Invitation email sent successfully" });
          }
        })
        .catch((err) => {
          console.error("Failed to invite user:", err);
          res.status(500).json({ message: "Failed to sent invite" });
        });
    });
  });
});
app.post("/join", (req, res) => {
  const { email } = req.body;
  setTimeout(() => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminemail,
        pass: adminpassword,
      },
    });

    const mailOptions = {
      from: adminemail,
      to: adminemail,
      cc: 'swingbylou@me.com',
      subject: "Request to Join NLG",
      html: `<p>New Request to join NLG  ${email} </p>
                <br />`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send email:", error);
      }
    });
  }, 0);
  res.json({ message: "sent successfully" });
});

app.post("/contactus", (req, res) => {
  const { email, firstname, lastname, phone, message } = req.body;
  setTimeout(() => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminemail,
        pass: adminpassword,
      },
    });

    const mailOptions = {
      from: adminemail,
      to: adminemail,
      cc: 'swingbylou@me.com',
      subject: "Contact US | NLG",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Request</title>
          <style>
              body {
                  background-color: lightgrey;
                  color: black;
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin: 0;
                  padding: 0;
              }
      
              h2 {
                  color: black;
              }
      
              ul {
                  list-style: none;
                  padding: 0;
              }
      
              li {
                  margin-bottom: 10px;
              }
      
              strong {
                  color: black;
              }
          </style>
      </head>
      <body>
      <style>
              body {
                  background-color: lightgrey;
                  color: black;
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin: 0;
                  padding: 0;
              }
      
              h2 {
                  color: black;
              }
      
              ul {
                  list-style: none;
                  padding: 0;
              }
      
              li {
                  margin-bottom: 10px;
              }
      
              strong {
                  color: black;
              }
          </style>
          <h2>Contact Request</h2>
          <p>New Contact Request is Received from <strong>${email}</strong></p>
          
          <h3>Contact Details</h3>
          <ul>
              <li><strong>First Name:</strong> ${firstname}</li>
              <li><strong>Last Name:</strong> ${lastname}</li>
              <li><strong>Phone:</strong> ${phone}</li>
          </ul>
      
          <h3>Message</h3>
          <p>${message}</p>
      </body>
      </html>
      
      
              `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send email:", error);
      }
    });
  }, 5000);
  res.json({ message: "sent successfully" });
});

app.post("/register", (req, res) => {
  const { email, role, businessUrl, linkedinProfile, name, password } =
    req.body;

  User.findOne({ email }).then((existingUser) => {
    if (existingUser)
      return res.status(500).json({ message: "User already exists" });
    bcrypt.hash(password, 10).then((hash) => {
      User.create({
        email: email,
        password: hash,
        role: role,
        businessUrl: businessUrl,
        linkedinProfile: linkedinProfile,
        name: name,
        isApproved: false,
        isAdmin: false,
      })
        .then((createdUser) => {
          setTimeout(() => {
            const transporter = nodemailer.createTransport({
              // Configure your email provider here
              service: "gmail",
              auth: {
                user: adminemail,
                pass: adminpassword,
              },
            });

            const mailOptions = {
              from: adminemail,
              to: email,
              cc: "swingbylou@me.com",
              subject: "Welcome to NLG ",
              html: ` <p>Hi ${name} </p>   
              <p>You have requested to join NLG as a ${role} </p>
                        <p>use ${password} as password once your acount is approved </p>
                        <p> <b>You will get a mail once your account is approved </b></p>
                        <a href="https://www.next-level-golf.com"> Visit NLG </a>
                        <br />
                        <p style="color: blue;">
  NOW THAT YOU’RE REGISTERED TO NEXT LEVEL GOLF YOU CAN DECIDE HOW YOU WOULD LIKE TO DEVELOP YOUR GAME-HERE ARE THE FOLLOWING OPTIONS-
</p>

<ul style="color: blue;">
  <li>PRIVATE LESSONS</li>
  <li>GROUP INSTRUCTION</li>
  <li>NLG ONLINE TRAINING</li>
</ul>

<p style="color: blue;">
  PLEASE REACH OUT TO LOUIS SAUER TO HELP DECIDE WHICH DIRECTION YOU WOULD LIKE TO GO IN.
</p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Failed to send email:", error);
              }
            });
          }, 10);
          const notifcationMessage = `${name} has registered on Next Level Golf`
          const userId = createdUser._id;
          sendNotification(notifcationMessage, userId)
          res.json({ message: "Registered successfully" });
        })
        .catch((err) => {
          console.error("Failed to invite user:", err);
          res.status(500).json({ message: "Failed to register , try again" });
        });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  authenticateUser(email, password)
    .then(({ token, role }) => {
      res.json({ token, role });
    })
    .catch((err) => {
      console.error("Failed to authenticate user:", err);
      res.status(401).json({ message: "Authentication failed" });
    });
});
const validateEmail = async (accessToken) => {
  try {
    const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log(res?.data?.email);
    return res?.data?.email
  }
  catch (error) {
    console.log(error);
    return ""
  }
}
app.post('/auth/google-login', async (req, res) => {
  try {
    const userEmail = req.body.email; // User's email obtained from Google OAuth or other secure means
    const accessToken = req.body.accessToken
    const accessEmail = await validateEmail(accessToken);
    if (userEmail === accessEmail) {
      // Create a JWT token with user's email
      authenticateUserGmail(userEmail).then(({ token, role }) => {
        res.json({ token, role });
      })
        .catch((err) => {
          console.error("Failed to authenticate user:", err);
          res.status(401).json({ message: "Authentication failed" });
        });
    }
    else {
      res.status(500).json({ message: "Invalid Email" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/auth/facebook-login', async (req, res) => {
  try {
    const userEmail = req.body.email; // User's email obtained from Google OAuth or other secure means
    console.log(userEmail);

    // Create a JWT token with user's email
    authenticateUserGmail(userEmail).then(({ token, role }) => {
      res.json({ token, role });
    })
      .catch((err) => {
        console.error("Failed to authenticate user:", err);
        res.status(401).json({ message: "Authentication failed" });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get("/admin", authenticateToken, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  res.json({ message: "Welcome, admin!" });
});
app.get("/user/:email?", authenticateToken, (req, res) => {
  const { email } = req.params;
  if (email && req.user.role === "athlete") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  usermail = email || req.user.email;
  User.findOne({ email: usermail })
    .select("-profilePicture")
    .lean()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.json({ ...user, password: "XXXXX", profilePicture: "" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
});

app.get("/pic/user/:email?", authenticateToken, (req, res) => {
  const { email } = req.params;
  // GOPAL
  // if (email && req.user.role === "athlete") {
  //   return res.status(403).json({ message: "Unauthorized" });
  // }
  usermail = email || req.user.email;
  User.findOne({ email: usermail })
    .lean()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User Profile found" });
      } else {
        return res.json({ profilePicture: user.profilePicture });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
});
//get all users
app.get("/users", authenticateToken, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  User.find({})
    .select("-password -profilePicture")
    .lean()
    .then(function (users) {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
});
app.get("/users/athletes", (req, res) => {
  User.find({ role: "athlete" })
    .select("-password -profilePicture")
    .lean()
    .then(function (users) {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
});
// Update user password ex
app.post("/users/updatepass", authenticateToken, (req, res) => {
  let { password } = req.body;
  password = password || "";
  if (password.length < 1)
    return res.status(403).json({ message: "Invalid Password" });
  User.findOne({ email: req.user.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      bcrypt.hash(password, 10).then((hash) => {
        // Update the user's password
        user.password = hash;
        user.save().then(() => {
          res.json({ message: "Password updated successfully" });
        });
      });
    })
    .catch((err) => {
      console.error("Failed to update password:", err);
      res.status(500).json({ message: "Failed to update password" });
    });
});

// Forget password {email}
//TODO Send OTP so that no one can missuse this API
//XXX Open Modal - email, - OTP 2 API one to get OPT on email one to send OTP (Rate email)

app.post("/password/forgot", (req, res) => {
  let { email } = req.body;
  email = email || "";
  if (email.length < 5 || email == "admin@nlg.com")
    return res.status(403).json({ message: "Invalid email" });

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let password = generateRandomPassword(7);
      bcrypt.hash(password, 10).then((hash) => {
        // Update the user's password
        user.password = hash;

        user.save().then(() => {
          res.json({ message: "Password reset successfully" });
        });
        setTimeout(() => {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: adminemail,
              pass: adminpassword,
            },
          });

          const mailOptions = {
            from: adminemail,
            to: email,
            subject: "NLG | Password Reset",
            html: `<p>Your request to change password is successful.</p>
                        <p>Use <b>${password}</b> as password.</p>
                        <a href="https://www.next-level-golf.com"> Visit NLG </a>
                        <br />`,
          };

          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.error("Failed to send email:", error);
            }
          });
        }, 0);
      });
    })
    .catch((err) => {
      console.error("Failed to reset password:", err);
      res.status(500).json({ message: "Failed to reset password" });
    });
});

app.post("/users/update", authenticateToken, (req, res) => {
  const {
    name,
    businessUrl,
    linkedinProfile,
    birthDate,
    gpa,
    graduationDate,
    height,
    highSchool,
    highSchoolPlay,
    homeGolfCourse,
    mathematics,
    missionHouseVolunteer,
    ncaaEligiblityCenter,
    otherHonors,
    parents,
    personalRefrences,
    pointOfContact,
    reading,
    satOverall,
    thePlayerStandardBearer,
    timTebowTournamentVolunteer,
    weight,
    writing,

    phone,
  } = req.body;
  console.log(highSchoolPlay);
  User.findOne({ email: req.user.email })

    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      Object.assign(user, {
        name,
        businessUrl,
        linkedinProfile,
        birthDate,
        gpa,
        graduationDate,
        height,
        highSchool,
        highSchoolPlay,
        homeGolfCourse,
        mathematics,
        missionHouseVolunteer,
        ncaaEligiblityCenter,
        otherHonors,
        parents,
        personalRefrences,
        pointOfContact,
        reading,
        satOverall,
        thePlayerStandardBearer,
        timTebowTournamentVolunteer,
        weight,
        writing,

        phone,
      });
      user
        .save()
        .then(() => {
          res.json({ message: "User Profile updated successfully" });
        })
        .catch((err) => {
          console.error("Failed to update PROFILE:", err);
          res.status(500).json({ message: "Failed to update profile" });
        });
    })
    .catch((err) => {
      console.error("Failed to update PROFILE:", err);
      res.status(500).json({ message: "Failed to update profile" });
    });
});
//profilePictureUpload

app.post("/profile/image", authenticateToken, (req, res) => {
  User.findOne({ email: req.user.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.profilePicture = req.body.pic;
      user
        .save()
        .then(() => {
          res
            .status(200)
            .json({ message: "Profile picture saved successfully" });
        })
        .catch((error) => {
          console.error("Error saving profile picture:", error);
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      console.error("Failed to Upload Picture", err);
      res.status(500).json({ message: "Failed to Upload Picture" });
    });
});

// Handle profile picture retrieval
app.get("/profile/picture", (req, res) => {
  User.findOne({}, "profilePicture", (err, profile) => {
    if (err) {
      console.error("Error retrieving profile picture:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    res.status(200).json({ profilePicture: profile.profilePicture });
  });
});

// Reset user password // reset
app.post("/users/reset-password", authenticateToken, (req, res) => {
  const { email } = req.body;
  const newPassword = "Pa$$word";
  User.findOne({ email: req.user.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Hash the new password
      bcrypt.hash(newPassword, 10).then((hash) => {
        // Update the user's password
        user.password = hash;
        user.save().then(() => {
          // Send password reset email
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: adminemail,
              pass: adminpassword,
            },
          });

          const mailOptions = {
            from: adminemail,
            to: user.email,
            subject: "Password Reset",
            text: `Your password has been reset successfully as ${newPassword} `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Failed to send password reset email:", error);
              res
                .status(500)
                .json({ message: "Failed to send password reset email" });
            } else {
              res.json({
                message:
                  "Password reset successfully. Check your email for further instructions.",
              });
            }
          });
        });
      });
    })
    .catch((err) => {
      console.error("Failed to reset password:", err);
      res.status(500).json({ message: "Failed to reset password" });
    });
});

app.get("/user/action/:action/:userid", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  const { action, userid } = req.params;
  switch (action) {
    case "delete":
    case "reject":
      try {
        const deletedUser = await User.findByIdAndRemove(userid);

        if (deletedUser) {
          res.json({
            message: `User ${deletedUser.name} has been ${action}ed.`,
          });
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    case "approve":
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userid,
          { isApproved: true },
          { new: true }
        );

        if (updatedUser) {
          res.json({ message: `User ${updatedUser.name} has been approved.` });
          setTimeout(() => {
            try {
              const transporter = nodemailer.createTransport({
                // Configure your email provider here
                service: "gmail",
                auth: {
                  user: adminemail,
                  pass: adminpassword,
                },
              });

              const mailOptions = {
                from: adminemail,
                to: updatedUser.email,
                cc: 'swingbylou@me.com',
                subject: "Welcome to NLG",
                html: `<p><b>Welcome</b> ${updatedUser.name},</p><p> Your Account is approved to join NLG as a ${updatedUser.role} </p>
                            <a href="https://www.next-level-golf.com"> Visit NLG </a>
                            <br />
                            <p style="color: blue;">
  NOW THAT YOU’RE REGISTERED TO NEXT LEVEL GOLF YOU CAN DECIDE HOW YOU WOULD LIKE TO DEVELOP YOUR GAME-HERE ARE THE FOLLOWING OPTIONS-
</p>

<ul style="color: blue;">
  <li>PRIVATE LESSONS</li>
  <li>GROUP INSTRUCTION</li>
  <li>NLG ONLINE TRAINING</li>
</ul>

<p style="color: blue;">
  PLEASE REACH OUT TO LOUIS SAUER TO HELP DECIDE WHICH DIRECTION YOU WOULD LIKE TO GO IN.
</p>`,
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Failed to send email:", error);
                }

                console.log("Invitation email sent:", info.response);
              });
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          }, 10);
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    case "suspend":
      try {
        const suspendedUser = await User.findByIdAndUpdate(
          userid,
          { isSuspended: true },
          { new: true }
        );

        if (suspendedUser) {
          res.json({
            message: `User ${suspendedUser.email} has been suspended.`,
          });
          setTimeout(() => {
            sendSuspensionEmail(suspendedUser);
          }, 10);
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    case "remove-suspend":
      try {
        const activeUser = await User.findByIdAndUpdate(
          userid,
          { isSuspended: false },
          { new: true }
        );

        if (activeUser) {
          res.json({
            message: `Suspension removed for user ${activeUser.email}.`,
          });
          setTimeout(() => {
            sendSuspensionRemovalEmail(activeUser);
          }, 10);
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    default:
      res.json({ message: "Invalid action" });
  }
});
app.get("/allathlete", async (req, res) => {
  try {
    // Fetch athletes and populate assigned coaches' names
    const athletes = await User.find({ role: "athlete" }).populate({
      path: "assignedCoach",
      model: "User",
      select:
        "name email graduationyear birthDate profilePicturePath profilePictureLink assignedCoach", // Include the desired fields
    });
    const athletesWithAssignedCoachNames = athletes.map((athlete) => {
      return {
        _id: athlete._id,
        name: athlete.name,
        email: athlete.email,
        birthDate: athlete.birthDate,
        graduationyear: athlete.graduationyear,
        profilePicturePath: athlete.profilePicturePath,
        cocah: athlete.assignedCoach,
        profilePictureLink: athlete.profilePictureLink,
      };
    });

    return res.status(200).json(athletesWithAssignedCoachNames);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
});

app.post("/programs", programController.createProgram);
app.get("/programs", programController.getAllPrograms);
app.get("/programs/:id", programController.getProgramById);
app.put("/programs/:id", programController.updateProgram);
app.delete("/programs/:id", programController.deleteProgram);
app.get("/programs/type/:type", programController.getAllProgramsByType);
// Assigment APIs
app.post(
  "/assign/assignment",
  authenticateToken,
  aassController.assigmentCoach
);
app.get("/assign/allathlete", authenticateToken, aassController.getAllAthlete);
app.get("/assign/allcoach", authenticateToken, aassController.getAllCoach);
app.delete(
  "/assign/remove-coach-assignment/:id",
  authenticateToken,
  aassController.removeCoachAssignment
);
// Notification APIs // TODO Move to file once integrated
app.get(
  "/notifications",
  authenticateToken,
  naughtyController.getAllNotification
);
app.get(
  "/notifications/count",
  authenticateToken,
  naughtyController.getNotificationCount
);
app.put(
  "/notifications/:id/mark-read",
  authenticateToken,
  naughtyController.markRead
);
app.put(
  "/notifications/mark-read",
  authenticateToken,
  naughtyController.markAllRead
);
app.delete(
  "/notifications/clear",
  authenticateToken,
  naughtyController.clearAll
);

// chat history for right side with paging
app.get(
  "/chat/history/:recipientId",
  authenticateToken,
  chatController.getHistory
);
// LEFT side
app.get("/chat/recent", authenticateToken, chatController.recentjugad);
// Right side send chat message
app.post(
  "/chat/send/:recipientId",
  authenticateToken,
  chatController.postMessage
);
// Search on popup or left side top
app.get("/chat/search", authenticateToken, chatController.chatSearch);
// mark read
app.put(
  "/chat/mark-read/:senderId",
  authenticateToken,
  chatController.markRead
);

// Bookmark
app.get("/bookmark/:athleteId", authenticateToken, bookmarkController.bookmark);
app.get(
  "/unbookmark/:athleteId",
  authenticateToken,
  bookmarkController.unbookmark
);
app.get(
  "/bookmarks/athletes",
  authenticateToken,
  bookmarkController.getBookmark
);
app.get("/busers/bookmarked", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Login" });
    }
    const bookmarkedUsers = await User.find({ _id: { $in: user.bookmarks } });
    res.json(bookmarkedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error finding bookmarked athletes." });
  }
});
// Role change 
app.get("/tiworole-ruerty/delta/:email/:role", async (req, res) => {
  try {
    const email = req.params.email;
    const newRole = req.params.role;
    const user = await User.findOne({ email });
    if (user) {
      user.role = newRole;
      await user.save();
      return res.status(200).json({ message: 'User role updated successfully', newRole: newRole, email: email });
    } else {
      return res.status(200).json({ message: 'User role not xxx', newRole: newRole, email: email });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error });
  }
})

// Cover picture
app.post(
  "/profile/cover",
  authenticateToken,
  upload.single("coverPicture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Assuming you're using a user ID in the request body to identify the user
    const userId = req.user.id; // Adjust the field name based on your setup

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.coverPicturePath = req.file.path; // Store the file path in the user model
      await user.save();

      res
        .status(200)
        .json({
          message: "File uploaded and user updated successfully",
          path: user.coverPicturePath,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);

app.post(
  "/profile/profilepic",
  authenticateToken,
  upload.single("profilePicture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Assuming you're using a user ID in the request body to identify the user
    const userId = req.user.id; // Adjust the field name based on your setup

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.profilePicturePath = req.file.path; // Store the file path in the user model
      await user.save();

      res
        .status(200)
        .json({
          message: "File uploaded and user updated successfully",
          path: user.profilePicturePath,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);
// Visitor Chat
// chat history for right side with paging
app.get("/vchat/history/:recipientId/:vid", visitorChatController.getHistory);
// LEFT side
app.get("/vchat/recent", authenticateToken, visitorChatController.recentAdmin);
// Right side send chat message
app.post("/vchat/send/:recipientId", visitorChatController.postMessage);

app.post("/vchat/addvisitor", visitorChatController.addVisitor);
app.get("/vchat/getvisitor", visitorChatController.getVisitor);

// TOUR
app.delete("/tour/delete/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    await GolfTour.findByIdAndDelete(id);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/tour/add", authenticateToken, async (req, res) => {
  try {
    const newData = req.body;
    newData.user = req.user.id;
    const golfData = new GolfTour(newData);
    await golfData.save();
    res.status(201).json({ message: "Record added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/tour/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const golfData = await GolfTour.find({ user: user._id });
    res.json(golfData);
  } catch (error) {
    console.error("Tour get updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// END TOUR
// VIDEO
app.post(
  "/add-video",
  authenticateToken,
  upload.single("videoFile"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, thumbnail } = req.body;
      const videoFile = req.file;
      if (!videoFile) {
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      // Create a new video document
      const newVideo = new Videos({
        title,
        path: videoFile.path,
        user: userId,
      });

      // Save the video to the database
      await newVideo.save();

      // Add the video's ID to the user's video array
      res.status(201).json({ message: "Video added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);
app.get("/videos/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const golfData = await Videos.find({ user: user._id });
    res.json(golfData);
  } catch (error) {
    console.error("Tour get updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/videos/delete/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    await Videos.findByIdAndDelete(id);
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// END VIDEO

// NEW PROFILE
app.get("/nprofile/:email?", (req, res) => {
  const { email } = req.params;
  usermail = email;
  User.findOne({ email: usermail })
    .select("-profilePicture")
    .lean()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.json({ ...user, password: "XXXXX", profilePicture: "" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
});
app.post("/nprofile/updateUser", authenticateToken, async (req, res) => {
  const formData = req.body;
  try {
    // Update the user model using the authenticated user's ID (req.user.id)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // Use the authenticated user's ID
      { $set: formData },
      { new: true } // To return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// END PROFILE


app.post('/tests/clone/:testId', authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  try {
    const testId = req.params.testId;
    const newName = req.body.newName;

    // Find the original test by its ID
    const originalTest = await Test.findById(testId);

    if (!originalTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Clone the test by creating a new one with the provided name
    const clonedTest = new Test({
      name: newName,
      levels: originalTest.levels, // Copy levels from the original test
      timed: originalTest.timed,   // Copy other properties as needed
      title: originalTest.title,
      testtype: originalTest.testtype,
      includeTime: originalTest.includeTime,
      includeAttempts: originalTest.includeAttempts,
      includeDistance: originalTest.includeDistance,
      videoPath: originalTest.videoPath,
      isPractice: originalTest.isPractice
    });

    // Save the cloned test to the database
    await clonedTest.save();

    res.status(201).json(clonedTest);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern) {
      res.status(400).json({ message: "Test name already exists. Please choose a different name." });
    } else {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
});
app.post(
  "/tests",
  authenticateToken,
  upload.single("videoFile"),
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });
    try {
      const {
        isMaxthreshold,
        name,
        timed,
        title,
        testtype,
        includeTime,
        includeAttempts,
        includeDistance,
        isPractice,
        testId,
        oldvideoPath,
      } = req.body;

      const levelObject = JSON.parse(req.body.levelsArr);
      let videoPat = "";
      // Check if the video file was uploaded
      if (req.file) {
        videoPat = req.file?.path;
      }
      const levelObjects = levelObject.map((level, index) => ({
        instruction: level.instruction || `Level ${index + 1}`,
        totalShots: level.totalShots || 1,
        minShots: level.minShots || 1,
        minScore: level.minScore || 1,
      }));

      const test = new Test({
        isMaxthreshold,
        name,
        levels: levelObjects,
        timed,
        title,
        isPractice,
        testtype,
        includeTime,
        includeAttempts,
        includeDistance,
        videoPath: videoPat,
      });
      if (testId) {
        const updatedTest = await Test.findOneAndUpdate(
          { _id: testId }, // Match by the _id field
          {
            isMaxthreshold,
            name,
            levels: levelObjects,
            timed,
            title,
            isPractice,
            testtype,
            includeTime,
            includeAttempts,
            includeDistance,
            videoPath: videoPat || oldvideoPath,
          },
          { new: true }
        );
      }
      else {
        await test.save();
      }

      res.status(201).send(test);
    } catch (error) {
      if (error.code === 11000 && error.keyPattern) {
        res.status(400).json({ message: "Test name already exists. Please choose a different name." });
      } else {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  }
);
app.get("/tests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const tests = await Test.find({}).sort({ order: 1 });
      res.status(200).send(tests);
    } else {
      const userId = req.user.id; // Assuming user ID is in req.user._id
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create a Mongoose query object to populate the "assignedTests" field
      const populatedUser = await User.findById(userId).populate("assignedTests");

      const assignedTests = populatedUser?.assignedTests || [];
      res.status(200).send(assignedTests);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
app.get("/testsPub", async (req, res) => {
  try {

    const tests = await Test.find({}).sort({ order: 1 });
    res.status(200).send(tests);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
app.post('/tests/updateOrder', authenticateToken, async (req, res) => {
  try {
    const updatedOrderValues = req.body.updatedOrderValues;
    for (const updatedValue of updatedOrderValues) {
      const testId = updatedValue.id;
      const order = updatedValue.order;
      await Test.findByIdAndUpdate(testId, { order });
    }
    res.status(200).json({ message: 'Order values updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get a specific test by ID
app.get("/tests/:id", authenticateToken, async (req, res) => {

  try {
    const test = await Test.findById(req.params.id);

    const userId = req.user.id;
    const userTest = await Usertest.findOne({ userId, testId: req.params.id });
    var testResult = {}
    if (userTest) {
      testResult = userTest;
    }

    if (!test) {
      return res.status(404).send("Test not found");
    }
    res.status(200).send({ test, testResult });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a test by ID
app.patch("/tests/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  const allowedUpdates = [
    "name",
    "levels",
    "totalShots",
    "timed",
    "videoPath",
    "description",
  ];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid updates");
  }

  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!test) {
      return res.status(404).send("Test not found");
    }
    res.status(200).send(test);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a test by ID
app.delete("/tests/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).send("Test not found");
    }
    res.status(200).send(test);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/toggle-archive/:testId', authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    test.archived = !test.archived;
    await test.save();

    res.json({
      message: `Test ${test.archived ? 'archived' : 'restored'} successfully`,
      test,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// GOPAL DAS
app.post('/assign-test/:testId/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const testId = req.params.testId;
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  try {
    // Check if the test is already assigned to the user
    const user = await User.findOne({ _id: userId, assignedTests: testId });
    if (user) {
      return res.status(400).json({ message: 'Test is already assigned to the user' });
    }

    // Find the user by ID and update their assignedTests array to include the test
    await User.findByIdAndUpdate(userId, { $push: { assignedTests: testId } });
    const userForNotification = await User.findOne({ _id: userId });

    const athlteNotification = new Notification({
      email: userForNotification.email,
      recipient: userForNotification._id,
      sender: req.user.id, // Admin's ID
      message: `A test has been assigned to you`,
    });
    await Promise.all([athlteNotification.save()]);
    res.status(200).json({ message: 'Test assigned to user successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to assign test to user. Try again' });
  }
});
app.get("/testsbyuser/:uid", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      res.status(410).send({});
    } else {
      const userId = req.params.uid; // Assuming user ID is in req.user._id
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const populatedUser = await User.findById(userId).populate("assignedTests");
      const assignedTests = populatedUser?.assignedTests || [];
      res.status(200).send(assignedTests);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
// all test find loop on test find only challenge type and assign to userID
app.post('/assign-multi-test/:userId', authenticateToken, async (req, res) => {

  const userId = req.params.userId;
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  try {
    const testIds = await Test.find({ isPractice: { $ne: true } }, '_id');
    const ids = testIds.map((test) => test._id);
    const user = await User.findById({ _id: userId });
    user.assignedTests = ids
    const athlteNotification = new Notification({
      email: user.email,
      recipient: user._id,
      sender: req.user.id, // Admin's ID
      message: `Multiple Challenge has been assigned to you`,
    });
    await Promise.all([athlteNotification.save()]);
    await user.save();
    res.status(200).json({ message: 'Test assigned to users successfully' });
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to assign test. Try again' });
  }
});
app.delete('/remove-user-from-test/:testId/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const testId = req.params.testId;
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });
  try {
    // Check if the user is assigned to the test
    const user = await User.findOne({ _id: userId, assignedTests: testId });

    if (!user) {
      return res.status(400).json({ message: 'User is not assigned to this test' });
    }

    // Remove the test assignment from the user
    await User.findByIdAndUpdate(userId, { $pull: { assignedTests: testId } });

    res.status(200).json({ message: 'Test assignment removed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to remove test assignment. Try again' });
  }
});
// table data jaha user dikhana hai
app.get('/assigned-users/:testId', authenticateToken, async (req, res) => {
  const { testId } = req.params;

  try {
    // Find the test by its ID
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Find all users who are assigned to this test
    const assignedUsers = await User.find({ assignedTests: testId }).select("-password -profilePicture");

    res.status(200).json({ assignedUsers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to retrieve assigned users' });
  }
});
// END SESSION

// SCORE AND RANK GO
app.get("/rank-current-user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user._id;
    const pipeline = [
      {
        $match: {
          'user': new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: '$testtype', // Group by test type
          bestScore: { $max: '$score' }, // Calculate the best score for each test type
          averageScore: { $avg: '$score' }, // Calculate the average score for each test type
          latestScore: { $last: '$score' }, // Get the latest score for each test type
          totalEntries: { $sum: 1 },
        },
      },
    ];

    const scoresByTestType = await LeaderboardEntry.aggregate(pipeline);
    res.json(scoresByTestType);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Ye Kaisy h jindgani - gopal bhand 
app.get("/athlete-performance/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user._id;

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$testId", // Group by testId
          levelsCompleted: { $sum: 1 }, // Calculate the count of completed levels for each test
          levelScores: {
            $push: {
              levelId: "$levelScore.levelId",
              score: "$levelScore.score",
            },
          }, // Collect level scores
        },
      },
    ];

    const testScores = await Usertest.aggregate(pipeline);

    // Fetch test names and other details from your Test model
    const testDetails = await Promise.all(
      testScores.map(async (testScore) => {
        // Retrieve test name and other details from the Test model using testId
        const test = await Test.findById(testScore._id);
        if (!test) {
          return null; // Skip this entry and return null
        }

        // Create a map to associate level IDs with their corresponding scores
        const levelScoresMap = {};
        testScore.levelScores.forEach((levelScore) => {
          levelScoresMap[levelScore.levelId] = levelScore.score;
        });

        // Create an array to store level details including scores
        const levelDetails = test.levels.map((level, levelIndex) => ({
          levelName: `Level ${levelIndex + 1}`,
          instruction: level.instruction,
          totalShots: level.totalShots || 0,
          minScore: level.minScore || 0,
          score: levelScoresMap[level._id] || 0, // Use 0 if no score recorded
        }));

        return {
          testName: test.name,
          levelsCompleted: testScore.levelsCompleted,
          levelDetails,
        };
      })
    );

    const filteredTestScores = testDetails.filter((testDetail) => testDetail !== null);

    res.json(filteredTestScores);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/athlete-performancehola1/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id;

    // The aggregation pipeline logic
    const userTestSummary = await Usertest.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "tests",
          localField: "testId",
          foreignField: "_id",
          as: "test",
        },
      },
      {
        $unwind: "$test",
      },
      {
        $lookup: {
          from: "tests",
          localField: "levelScore.levelId",
          foreignField: "levels._id",
          as: "levelDetails",
        },
      },
      {
        $unwind: {
          path: "$levelDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            testName: "$test.name",
            testType: "$test.testtype",
            levelId: "$levelScore.levelId",
          },
          totalShots: { $sum: "$levelScore.attempts" },
          totalScore: { $sum: "$levelScore.score" },
          tendency: { $sum: "$levelScore.tendency" },
          timing: { $sum: "$levelScore.timing" },
          consistency: { $sum: "$levelScore.consistency" },
          totalshotTaken: { $sum: "$levelScore.totalshotTaken" },
          availableShots: { $first: "$levelDetails.levels.totalShots" },
        },
      },
      {
        $group: {
          _id: {
            testName: "$_id.testName",
            testType: "$_id.testType",
          },
          totalShots: { $sum: "$totalShots" },
          totalScore: { $sum: "$totalScore" },
          tendency: { $sum: "$tendency" },
          timing: { $sum: "$timing" },
          consistency: { $sum: "$consistency" },
          totalshotTaken: { $sum: "$totalshotTaken" },
          totalLevels: { $sum: 1 }, // Count total levels in the group
          details: {
            $push: {
              levelId: "$_id.levelId",
              totalShots: "$totalShots",
              totalScore: "$totalScore",
              tendency: "$tendency",
              timing: "$timing",
              consistency: "$consistency",
              totalshotTaken: "$totalshotTaken",
              availableShots: "$availableShots",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          testName: "$_id.testName",
          testType: "$_id.testType",
          totalLevels: 1,
          totalShots: 1,
          totalScore: 1,
          tendency: 1,
          timing: 1,
          consistency: 1,
          totalshotTaken: 1,
          details: 1,
        },
      },
      {
        $sort: { testName: 1 },
      },
    ]);

    return res.status(200).json(userTestSummary);
  } catch (error) {
    console.error("Error fetching athlete performance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/athlete-performancehola/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id;

    // Find all documents in Usertest collection for the specified user ID
    const userTestDetails = await Usertest.find({ userId });

    // Use Promise.all to parallelize the asynchronous operations
    const userTestSummary = await Promise.all(
      userTestDetails.map(async (testDetail) => {
        const {
          testId,
          testtype,
          levelScore,
          createdAt,
          lastlevelAt,
          maxThreshold
        } = testDetail;

        // Get the corresponding test details
        const test = await Test.findById(testId);

        // Check if the test is not found
        if (!test) {
          console.warn(`Test not found for testId: ${testId}. Skipping.`);
          return null; // Skip to the next iteration
        }

        // Extract relevant details from the test document
        const {
          name: testName,
          testtype: testType,
          levels,
          timed,
          includeAttempts,
          includeDistance,
          includeTime,
        } = test;

        // Extract specific details from levelScore array, including tendency, timing, and consistency
        const details = levelScore.map((level, index) => ({
          levelId: level.levelId,
          totalShots: levels[index].totalShots,
          minScore: levels[index].minScore,
          totalScore: level.score,
          distanceInFeet: level.distanceInFeet,
          distanceInInches: level.distanceInInches,
          score: level.score,
          tendency: level.tendency,
          timing: level.timing,
          consistency: level.consistency,
          maxThreshold: level.maxThreshold,
          totalshotTaken: level.totalshotTaken,
          attempts: level.attempts,
          correctshapeTaken: level.correctshapeTaken,
        }));

        return {
          testName,
          testType,
          totalLevels: levels.length,
          maxThreshold,
          details,
          createdAt,
          lastlevelAt,
          testtype,
          timed,
          includeAttempts,
          includeDistance,
          includeTime,
        };
      })
    );

    // Filter out null values (skipped tests)
    const filteredUserTestSummary = userTestSummary.filter(Boolean);

    return res.status(200).json(filteredUserTestSummary);
  } catch (error) {
    console.error("Error fetching athlete performance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



// Hmarai kahani 

app.get("/rank-allathlete", async (req, res) => {
  try {
    // Fetch athletes and populate assigned coaches' names
    const athletes = await User.find({ role: "athlete" }).populate({
      path: "assignedCoach",
      model: "User",
      select:
        "name email graduationyear birthDate profilePicturePath profilePictureLink assignedCoach totalScores totalCompletedLevels", // Include the desired fields
    });
    const athletesWithAssignedCoachNames = athletes.map((athlete) => {
      return {
        _id: athlete._id,
        name: athlete.name,
        email: athlete.email,
        birthDate: athlete.birthDate,
        graduationyear: athlete.graduationyear,
        profilePicturePath: athlete.profilePicturePath,
        cocah: athlete.assignedCoach,
        profilePictureLink: athlete.profilePictureLink,
        totalScores: athlete.totalScores,
        totalCompletedLevels: athlete.totalCompletedLevels
      };
    });
    athletesWithAssignedCoachNames.sort((a, b) => {
      const rankA = a.totalCompletedLevels > 0 ? a.totalScores / a.totalCompletedLevels : 'N/A';
      const rankB = b.totalCompletedLevels > 0 ? b.totalScores / b.totalCompletedLevels : 'N/A';

      if (rankA === 'N/A' && rankB === 'N/A') {
        return 0;
      } else if (rankA === 'N/A') {
        return 1;
      } else if (rankB === 'N/A') {
        return -1;
      } else {
        return rankB - rankA;
      }
    });
    //matty1chiong@gmail.com
    athletesWithAssignedCoachNames.forEach((athlete, index) => {
      athlete.rank = (athlete.totalCompletedLevels > 0) ? (index + 1).toString() : 'N/A';
    });
    return res.status(200).json(athletesWithAssignedCoachNames);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
});
app.get("/gopalrank-allathlete", async (req, res) => {
  try {
    // Fetch athletes and populate assigned coaches' names
    const athletes = await User.find({ role: "athlete", totalCompletedLevels: { $ne: null, $gt: 0 } }).populate({
      path: "assignedCoach",
      model: "User",
      select:
        "name email graduationyear birthDate profilePicturePath profilePictureLink assignedCoach totalScores totalCompletedLevels", // Include the desired fields
    });
    const athletesWithAssignedCoachNames = athletes.map((athlete) => {
      return {
        _id: athlete._id,
        name: athlete.name,
        email: athlete.email,
        birthDate: athlete.birthDate,
        graduationyear: athlete.graduationyear,
        profilePicturePath: athlete.profilePicturePath,
        cocah: athlete.assignedCoach,
        profilePictureLink: athlete.profilePictureLink,
        totalScores: athlete.totalScores,
        totalCompletedLevels: athlete.totalCompletedLevels
      };
    });
    athletesWithAssignedCoachNames.sort((a, b) => {
      const totalCompletedLevelsA = a.totalCompletedLevels || 0;
      const totalCompletedLevelsB = b.totalCompletedLevels || 0;
      const totalCompletedLevelsDiff = totalCompletedLevelsB - totalCompletedLevelsA;
      if (totalCompletedLevelsDiff !== 0) {
        // If totalCompletedLevels is different, sort by it
        return totalCompletedLevelsDiff;
      }
      // If totalCompletedLevels is the same, sort by name
      return a.name.localeCompare(b.name);
    });
    //matty1chiong@gmail.com
    athletesWithAssignedCoachNames.forEach((athlete, index) => {
      athlete.rank = (athlete.totalCompletedLevels > 0) ? (index + 1).toString() : 'N/A';
    });
    return res.status(200).json(athletesWithAssignedCoachNames);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
});
app.get('/count-tests', async (req, res) => {
  try {
    const testCount = await Test.countDocuments({});
    res.json({ count: testCount });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/ranked-users/:testtype?', async (req, res) => {
  const { testtype } = req.params;
  try {
    const pipeline = [
      {
        $group: {
          _id: '$user', // Group by user
          averageScore: { $avg: '$score' }, // Calculate average score
        },
      },
    ];

    if (testtype) {
      // Optionally filter by testtype if provided
      pipeline.unshift({
        $match: {
          'testtype': testtype,
        },
      });
    }

    const leaderboardEntries = await LeaderboardEntry.aggregate(pipeline);

    // Sort users based on their average scores in descending order
    leaderboardEntries.sort((a, b) => b.averageScore - a.averageScore);

    // Fetch user details, including assigned coach, from your user database (User model)
    const rankedUsers = await Promise.all(leaderboardEntries.map(async (entry, index) => {
      const user = await User.findById(entry._id).populate('assignedCoach');
      if (!user) {
        return null; // Skip this entry and return null
      }
      return {
        userId: entry._id,
        averageScore: entry.averageScore,
        rank: index + 1,
        userDetails: {
          name: user.name,
          email: user.email,
          profilePicturePath: user.profilePicturePath,
          profilePictureLink: user.profilePictureLink,
          birthDate: user.birthDate,
          graduationyear: user.graduationyear,
          totalScores: user.totalScores,
          totalCompletedLevels: user.totalCompletedLevels

        },
        assignedCoach: {
          name: user.assignedCoach?.name,
          email: user.assignedCoach?.email,
        },
      };
    }));
    const filteredRankedUsers = rankedUsers.filter(user => user !== null);
    res.json(filteredRankedUsers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/gopalsampleranked-users/:testtype?', async (req, res) => {
  const { testtype } = req.params;

  try {
    const pipeline = [
      {
        $group: {
          _id: '$user', // Group by user
          totalCompletedLevels: { $sum: 1 }, // Calculate the maximum level as totalCompletedLevels
        },
      },
    ];

    if (testtype) {
      // Optionally filter by testtype if provided
      pipeline.unshift({
        $match: {
          'testtype': testtype,
        },
      });
    }

    const leaderboardEntries = await LeaderboardEntry.aggregate(pipeline);

    // Sort users based on their totalCompletedLevels in descending order
    leaderboardEntries.sort((a, b) => b.totalCompletedLevels - a.totalCompletedLevels);

    // Fetch user details from your user database (User model)
    const rankedUsers = await Promise.all(leaderboardEntries.map(async (entry, index) => {
      const user = await User.findById(entry._id);
      if (!user) {
        return null; // Skip this entry and return null
      }
      return {
        userId: entry._id,
        totalCompletedLevels: entry.totalCompletedLevels, // Add +1 to the totalCompletedLevels
        rank: index + 1,
        userDetails: {
          profilePicturePath: user.profilePicturePath,
          profilePictureLink: user.profilePictureLink,
          birthDate: user.birthDate,
          name: user.name,
          email: user.email,
          totalCompletedLevels: entry.totalCompletedLevels, // Add +1 to the totalCompletedLevels
          // Include other user details as needed
        },
      };
    }))

    const filteredRankedUsers = rankedUsers.filter(user => user !== null);
    res.json(filteredRankedUsers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/ranked-users-by-test', async (req, res) => {
  const { testId, levelwId, userId } = req.query;

  try {
    const pipeline = [];

    if (testId && testId !== 'All') {
      // Optionally filter by Test _id if provided
      pipeline.push({
        $match: {
          test: new mongoose.Types.ObjectId(testId),
        },
      });
    }

    if (levelwId && levelwId !== 'All') {
      // Optionally filter by level _id if provided
      pipeline.push({
        $match: {
          level: new mongoose.Types.ObjectId(levelwId),
        },
      });
    }

    if (userId && userId !== 'All') {
      // Optionally filter by user _id if provided
      pipeline.push({
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      });
    }

    pipeline.push({
      $group: {
        _id: '$user', // Group by user
        averageScore: { $avg: '$score' }, // Calculate average score
      },
    });

    const leaderboardEntries = await LeaderboardEntry.aggregate(pipeline);

    // Sort users based on their average scores in descending order
    leaderboardEntries.sort((a, b) => b.averageScore - a.averageScore);

    // Fetch user details, including assigned coach, from your user database (User model)
    const rankedUsers = await Promise.all(leaderboardEntries.map(async (entry, index) => {
      const user = await User.findById(entry._id).populate('assignedCoach');
      if (!user) {
        return null; // Skip this entry and return null
      }
      return {
        userId: entry._id,
        averageScore: entry.averageScore,
        rank: index + 1,
        userDetails: {
          name: user.name,
          email: user.email,
          profilePicturePath: user.profilePicturePath,
          profilePictureLink: user.profilePictureLink,
          birthDate: user.birthDate,
          graduationyear: user.graduationyear,
          totalScores: user.totalScores,
          totalCompletedLevels: user.totalCompletedLevels,
        },
        assignedCoach: {
          name: user.assignedCoach?.name,
          email: user.assignedCoach?.email,
        },
      };
    }));
    const filteredRankedUsers = rankedUsers.filter(user => user !== null);
    res.json(filteredRankedUsers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/gopalranked-users-by-test', async (req, res) => {
  const { testId, levelwId, userId } = req.query;

  try {
    const pipeline = [];

    if (testId && testId !== 'All') {
      // Optionally filter by Test _id if provided
      pipeline.push({
        $match: {
          test: new mongoose.Types.ObjectId(testId),
        },
      });
    }

    if (levelwId && levelwId !== 'All') {
      // Optionally filter by level _id if provided
      pipeline.push({
        $match: {
          level: new mongoose.Types.ObjectId(levelwId),
        },
      });
    }

    if (userId && userId !== 'All') {
      // Optionally filter by user _id if provided
      pipeline.push({
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      });
    }

    pipeline.push({
      $group: {
        _id: '$user', // Group by user
        totalCompletedLevels: { $sum: 1 }, // Calculate the maximum levelIndex as totalCompletedLevels
      },
    });

    const leaderboardEntries = await LeaderboardEntry.aggregate(pipeline);

    // Sort users based on their totalCompletedLevels in descending order
    leaderboardEntries.sort((a, b) => b.totalCompletedLevels - a.totalCompletedLevels);

    // Fetch user details, including assigned coach, from your user database (User model)
    const rankedUsers = await Promise.all(leaderboardEntries.map(async (entry, index) => {
      const user = await User.findById(entry._id).populate('assignedCoach');
      if (!user) {
        return null; // Skip this entry and return null
      }
      return {
        userId: entry._id,
        totalCompletedLevels: entry.totalCompletedLevels, // Add +1 to the totalCompletedLevels
        rank: index + 1,
        userDetails: {
          name: user.name,
          email: user.email,
          profilePicturePath: user.profilePicturePath,
          profilePictureLink: user.profilePictureLink,
          birthDate: user.birthDate,
          graduationyear: user.graduationyear,
          totalScores: user.totalScores,
          totalCompletedLevels: entry.totalCompletedLevels, // Add +1 to the totalCompletedLevels
        },
        assignedCoach: {
          name: user.assignedCoach?.name,
          email: user.assignedCoach?.email,
        },
      };
    }));

    const filteredRankedUsers = rankedUsers.filter(user => user !== null);
    res.json(filteredRankedUsers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// app.get('/athlete/test-results',authenticateToken,  async (req, res) => {
//   try {
//     const athleteId = req.user.id;
//     const athlete = await User.findById(athleteId);

//     if (!athlete) {
//       return res.status(404).json({ message: 'Athlete not found' });
//     }

//     const leaderboardEntries = await LeaderboardEntry.find({ user: athleteId });

//     if (leaderboardEntries.length === 0) {
//       return res.status(404).json({ message: 'No leaderboard entries found for the athlete' });
//     }

//     const results = [];

//     for (const entry of leaderboardEntries) {
//       const test = await Test.findById(entry.test);
//       if (!test) {
//         continue;
//       }

//       const levelIndex = entry.levelIndex;
//       const level = test.levels[levelIndex];
//       const testname = test.name;
//       const levelname = level.instruction;
//       const score = entry.score;

//       results.push({ testName: testname, levelName: levelname, score });
//     }

//     return res.status(200).json(results);
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });
app.get('/reset-abcdsxm-all-a', async (req, res) => {
  try {
    // Remove all entries from the LeaderboardEntry collection
    await LeaderboardEntry.deleteMany({});
    await Usertest.deleteMany({});

    res.status(200).json({ message: 'Leaderboard data reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/reset-abcdsxm-all-session0s', async (req, res) => {
  try {
    // Remove all entries from the LeaderboardEntry collection
    await Test.deleteMany({});

    res.status(200).json({ message: 'Leaderboard data reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/updateTestType', async (req, res) => {
  try {
    // Find and update documents with testtype 'Trackman combine'
    const result = await Usertest.updateMany(
      { testtype: 'Trackman Combine' },
      { $set: { testtype: 'tc' } }
    );

    const result2 = await LeaderboardEntry.updateMany(
      { testtype: 'Trackman Combine' },
      { $set: { testtype: 'tc' } }
    );


    return res.status(200).json({
      message: 'testtype updated successfully',
      "LeaderboardEntry": result2.nModified,
      "Usertest": result.nModified
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/allTestType', async (req, res) => {
  try {
    // Find and update documents with testtype 'Trackman combine'
    const result = await Usertest.find({})
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});






// Level ID = data._id h toh badiya nahi to array ka index 
app.put('/update-score/:testId/:levelId', authenticateToken, async (req, res) => {
  const { testId, levelId } = req.params;
  const { level, score, distanceInFeet, distanceInInches, testtype, tendency,
    timing,
    consistency, totalshotTaken, maxThreshold, correctshapeTaken, attempt } = req.body;
  const userId = req.user.id;

  try {
    // const gopaluser = await User.findOne({ _id: userId, assignedTests: testId });

    // if (!gopaluser) {
    //   return res.status(403).json({ message: 'You are not assigned to this test' });
    // }
    let userScoreData = await Usertest.findOne({ userId, testId });
    if (!userScoreData) {
      userScoreData = new Usertest({
        userId,
        testId,
        maxThreshold: maxThreshold,
        testtype: testtype,
        levelScore: [],
      });
    }
    if (!Array.isArray(userScoreData.levelScore)) {

      userScoreData.levelScore = [];
    }
    // Agar level Index pass kia h toh vo use kr lenge 
    let levelIndex = userScoreData.levelScore.findIndex(level => level.levelId.equals(levelId));
    const testComplete = levelIndex === userScoreData.levelScore.length - 1
    if (levelIndex !== -1) {
      userScoreData.levelScore[levelIndex].score = score;
      userScoreData.levelScore[levelIndex].totalshotTaken = totalshotTaken;
      userScoreData.levelScore[levelIndex].tendency = tendency;
      userScoreData.levelScore[levelIndex].timing = timing;
      userScoreData.levelScore[levelIndex].consistency = consistency;
      userScoreData.levelScore[levelIndex].maxThreshold = maxThreshold;
      userScoreData.levelScore[levelIndex].distanceInFeet = distanceInFeet;
      userScoreData.levelScore[levelIndex].distanceInInches = distanceInInches;
      userScoreData.levelScore[levelIndex].attempts = attempt;
      userScoreData.levelScore[levelIndex].correctshapeTaken = correctshapeTaken;
    } else {
      userScoreData.levelScore.push({
        levelId,
        totalshotTaken,
        score,
        tendency,
        timing,
        consistency,
        maxThreshold,
        distanceInFeet,
        distanceInInches,
        attempts: attempt,
        correctshapeTaken
      });
      levelIndex = 0
    }

    // Save the updated or new userScoreData document
    await userScoreData.save();

    const user = await User.findOne({ _id: userId });
    if (user) {
      user.totalScores += score;
      user.totalCompletedLevels += 1;
      await user.save();
    }
    // Update the leaderboard entry for this user, test type, and level
    const testcheck = await Test.findById(testId);
    if (!testcheck?.isPractice) {
      const leaderboardEntry = await LeaderboardEntry.findOneAndUpdate(
        { user: userId, test: testId, level: levelId, testtype: testtype },
        { score: score, levelIndex: levelIndex, testComplete: testComplete },
        { upsert: true }
      );
    }
    setTimeout(() => {
      const mssh = `${user.name} , ${user.email} has completed ${testtype}, Level - ${levelIndex + 1}`
      sendEmailTest(mssh)
      sendNotification(mssh, userId)
    }, 10)

    res.json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Fail to save score. Try again ' });
  }
});
app.put('/jr-update-score/:holeId', authenticateToken, async (req, res) => {
  const {  holeId } = req.params;
  const {score, par,fairway_hit,carry_distance,gir,correct_leave} = req.body;

  const userId = req.user.id;

  try {
    let userScoreData = await JRUsertest.findOne({ userId });
    if (!userScoreData) {
      userScoreData = new JRUsertest({
        userId,
        holeScore: [],
      });
    }
    if (!Array.isArray(userScoreData.holeScore)) {

      userScoreData.holeScore = [];
    }
    
    let holeIndex = userScoreData.holeScore.findIndex(hole => hole.holeId===holeId);
    if (holeIndex !== -1) {
      userScoreData.holeScore[holeIndex].score = score;
      userScoreData.holeScore[holeIndex].par = par;
      userScoreData.holeScore[holeIndex].fairway_hit = fairway_hit;
      userScoreData.holeScore[holeIndex].carry_distance = carry_distance;
      userScoreData.holeScore[holeIndex].gir = gir;
      userScoreData.holeScore[holeIndex].correct_leave = correct_leave;
    } else {
      userScoreData.holeScore.push({
        holeId,
        score, par, fairway_hit, carry_distance,gir, correct_leave
       
      });
      holeIndex = 0
    }
    await userScoreData.save();
    res.json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Fail to save score. Try again ' });
  }
});
app.get('/jruser-scores', async (req, res) => {
  try {
    const allScores = await JRUsertest.find().populate({
      path: 'userId',
      model: 'User',
      select: 'email name linkedinProfile  birthDate ',
  });
      res.json(allScores);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to fetch data. Try again.' });
  }
});
// SCORE AND RANK PAL
async function startServer() {
  try {
    await connectToDatabase();

    // Create an admin user on app start
    User.findOne({ email: "admin@nlg.com" }).then((user) => {
      if (!user) {
        bcrypt.hash("12345", 10).then((hash) => {
          User.create({
            email: "admin@nlg.com",
            password: hash,
            role: "admin",
            businessUrl: "business.com",
            linkedinProfile: "linkedin.com",
            name: "admin user",
            isAdmin: true,
            isApproved: true,
          })
            .then(() => console.log("Admin user created"))
            .catch((err) => console.error("Failed to create admin user", err));
        });
      } else {
        bcrypt.hash("12345", 10).then((hash) => {
          user.password = hash;
          user.isApproved = true;
          user
            .save()
            .then(() => console.log("Admin Password updated successfully"))
            .catch((err) => console.error("Failed to update password", err));
        });
      }
    });

    // Creating dummy users = recruiter
    // try {
    //   for (let index = 50; index < 60; index++) {
    //     User.create({
    //       email: `gopalgupta36270+${index + 1}@gmail.com`, password: "$2b$10$xTtkTj7uZ8NgxY3QJ2LjT.mhb9eNJy7elVOm0bDYRY6IeQvYbWMs6",
    //       role: 'recruiter', businessUrl: 'recruiter-' + 'business.com', linkedinProfile: 'athlete-' + 'linkedin.com', name: "recruiter" + index, isAdmin: false, isApproved: true
    //     })  
    //       .then(() => console.log('recruiter user created'))
    //       .catch(err => console.error('Failed to create admin user', err));
    //   }
    //   // Creating dummy users = athlete =
    //   for (let index = 60; index < 70; index++) {
    //     User.create({
    //       email: `gopalgupta36270+${index + 1}@gmail.com`, password: "$2b$10$xTtkTj7uZ8NgxY3QJ2LjT.mhb9eNJy7elVOm0bDYRY6IeQvYbWMs6",
    //       role: 'athlete', businessUrl: 'athlete-' + 'business.com', linkedinProfile: 'athlete-' + 'linkedin.com', name: "athlete" + index, isAdmin: false, isApproved: true
    //     })
    //       .then(() => console.log('athlete user created'))
    //       .catch(err => console.error('Failed to create admin user', err));
    //   }
    //   // Creating dummy users = coach
    //   for (let index = 70; index < 80; index++) {
    //     User.create({
    //       email: `gopalgupta36270+${index + 1}@gmail.com`, password: "$2b$10$xTtkTj7uZ8NgxY3QJ2LjT.mhb9eNJy7elVOm0bDYRY6IeQvYbWMs6",
    //       role: 'coach', businessUrl: 'coach-' + 'business.com', linkedinProfile: 'coach-' + 'linkedin.com', name: "coach" + index, isAdmin: false, isApproved: true
    //     })
    //       .then(() => console.log('athlete user created'))
    //       .catch(err => console.error('Failed to create admin user', err));
    //   }
    // JUST THIS IN TRY CATCH move();
    // } catch (err) {
    //   console.log(err);
    // }
    // Create Initial programs
    if (!process.env.ME_CONFIG_MONGODB_URL) {
      try {
        move();
      } catch (err) {
        console.log(err);
      }
    } checkData();

    // Start the server
    app.listen(8085, () => {
      console.log("Server started on port 8085");
      chatController.checkAndNotifyUsersPeriodically();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}
// Check if data exists in the database
const checkData = async () => {
  try {
    const existingPrograms = await Program.find();
    if (existingPrograms.length === 0) {
      await Program.create(defaultPrograms);
      console.log("Initial Program inserted into the database.");
    }
  } catch (err) {
    console.error("Error checking initial data:", err);
  }
};

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
}

function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    // Find the user by email
    User.findOne({
      email,
      isApproved: true,
      $or: [{ isSuspended: { $exists: false } }, { isSuspended: false }],
    })
      .then((user) => {
        if (!user) {
          reject(new Error("User not found"));
          return;
        }

        // Compare the password hash
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
            reject(new Error("Invalid password"));
            return;
          }

          // Generate a JWT token
          const token = jwt.sign(
            { email: user.email, role: user.role, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "21204h" }
          );
          resolve({ token, role: user.role });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function authenticateUserGmail(email) {
  return new Promise((resolve, reject) => {
    // Find the user by 
    console.log(email);
    User.findOne({
      email,
      isApproved: true,
      $or: [{ isSuspended: { $exists: false } }, { isSuspended: false }],
    })
      .then((user) => {
        if (!user) {
          reject(new Error("User not found"));
          return;
        }


        // Generate a JWT token
        const token = jwt.sign(
          { email: user.email, role: user.role, id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: "21204h" }
        );
        resolve({ token, role: user.role });
      })
      .catch((err) => {
        reject(err);
      });
  })

}
function sendSuspensionEmail(user) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: adminemail,
      pass: adminpassword,
    },
  });

  const mailOptions = {
    from: adminemail, // Replace with your admin email
    to: user.email,
    cc: 'swingbylou@me.com',
    subject: "Account Suspension",
    html: `
      <p>Hi,</p>
      <p>Your account has been suspended by the admin.</p>
      <p>If you believe this suspension is a mistake or have any questions, please contact the administrator.</p>
      <p>Thank you.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to send suspension email:", error);
    } else {
      console.log("Suspension email sent:", info.response);
    }
  });
}

// Function to send the suspension removal email
function sendSuspensionRemovalEmail(user) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: adminemail,
      pass: adminpassword,
    },
  });

  const mailOptions = {
    from: adminemail, // Replace with your admin email
    to: user.email,
    cc: 'swingbylou@me.com',
    subject: "Suspension Removal",
    html: `
      <p>Hi,</p>
      <p>Your account's suspension has been removed by the admin.</p>
      <p>You can now access your account as usual.</p>
      <p>If you have any questions, please contact the administrator.</p>
      <p>Thank you.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to send suspension removal email:", error);
    } else {
      console.log("Suspension removal email sent:", info.response);
    }
  });
}
async function sendNotification(message, userId) {
  const admins = await User.find({ role: "admin" });
  console.log(admins)
  try {
    const noitifcations = []
    for (const admin of admins) {
      const adminNotification = new Notification({
        email: admin.email,
        recipient: admin._id,
        sender: userId,
        message: message,
      });
      noitifcations.push(adminNotification.save());

    }
    Promise.all(noitifcations);
  }
  catch (error) {
    console.log(error);

  }
}
function sendEmailTest(message) {
  try {
    setTimeout(() => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: adminemail,
          pass: adminpassword,
        },
      });
      const htmlContent = `
    <body style="margin: auto; padding: 0; background-color: #BDC3C7; display: flex; justify-content: center; align-items: center; text-align: center">
    <div class="form" style="background-color: #fff; border-radius: 10px; width: 100%;color: #666; padding: 20px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); text-align: center;">
      <div class="top" style="background-color: rgb(4, 60, 4); height: 10px; box-shadow: 10px 12px 14px rgba(0, 0, 0, 0.3); margin-bottom: 20px;"></div>
      <div class="info">
        <h1 style="margin: 5px 0; color: rgb(4, 60, 4);">NLG Challenges</h1>
        <h1 style="margin: 5px 0;">Level Completed</h1>
        <h2 style="margin: 5px 0;"></h2>
        <p class="line" style="color: #999;">________________________________________</p>
        <h2>New Message</h2>
        <p style="margin: 5px 0;">${moment().format('LLLL')}</p>
        <br>
        <h2>${message}</h2>
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
      const mailOptions = {
        from: adminemail,
        to: adminemail,
        cc: 'swingbylou@me.com',
        subject: "Challenges Notification| NLG",
        html: htmlContent,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Failed to send email:", error);
        }
      });
    }, 5000);
  } catch (ed) {

  }
}

startServer();
