const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require('fs');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const { User } = require("./database/models/user");
const { connectToDatabase, closeDatabase } = require("./database");
async function move(){
// await connectToDatabase();
    fs.createReadStream('nlgcsv.csv') // Update with the actual CSV file path
    .pipe(csvParser())
    .on('data', async (row) => {
      try {
       //password: "$2b$10$xTtkTj7uZ8NgxY3QJ2LjT.mhb9eNJy7elVOm0bDYRY6IeQvYbWMs6",
        const existingUser = await User.findOne({ email: row.Email });
  
        if (existingUser) {
            const newUser = new User({
                email: row["Email"],
                role : row["Role"],
                name: row["First"]+ " " + row["Last"],
                password: "$2b$10$xTtkTj7uZ8NgxY3QJ2LjT.mhb9eNJy7elVOm0bDYRY6IeQvYbWMs6",
                profilePictureLink: row["profilePictureLink"],
                graduationDate: row['Graduation Year'],
                height: row["Height"],
                weight: row["Weight"],
                highSchool: row['High School'],
                isApproved: false,
                satOverall : row["SAT Score"],
                phone: row["Phone"]
              });
              if (row['Status'] == 'APPROVED'){
                newUser.isApproved = true
              }
          await User.findOneAndUpdate({ email: row.Email }, { $set: newUser });
          
        } else {
          const newUser = new User({
            email: row["Email"],
            role : row["Role"],
            name: row["First"]+ " " + row["Last"],
            password: "$2b$10$xTtkTj7uZ8NgxY3QJ2LjT.mhb9eNJy7elVOm0bDYRY6IeQvYbWMs6",
            profilePictureLink: row["profilePictureLink"],
            graduationDate: row['Graduation Year'],
            height: row["Height"],
            weight: row["Weight"],
            highSchool: row['High School'],
            isApproved: false,
            satOverall : row["SAT Score"],
            phone: row["Phone"]
            // Add other fields from the CSV data
          });
          if (row['Status'] == 'APPROVED'){
            newUser.isApproved = true
          }
          if (row['Status'] != 'BLOCKED'){
            await newUser.save();
           // console.log(`User "${newUser.email}" inserted`);
          }
        
        }
      } catch (error) {
        console.error(`Error processing user "${row.Email}": ${error.message}`);
      }
    })
    .on('end', () => {
      console.log('Data processing completed');
      //closeDatabase()
    });

}
//move()
module.exports = {
    move,
};