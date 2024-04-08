
import bcrypt from "bcrypt";
import crypto from "crypto";
import { nanoid } from 'nanoid';
import cron from "node-cron";

import transporter from "../utils/transporter.js";
import moment from 'moment-timezone';
import CombinedModel from '../Models/CombinedModel.js'
/* Time zoon */
moment.tz.setDefault('Europe/Stockholm');

// Controller to register user information
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const { 
    projectName,
     projectNumber, 
     client ,
     constructionStartdate,
    projectAddress,
    constructionType,
    currentStage,
    customerID,
    customerName,
    invoiceReference,
  } = req.body;
  try {
   

    // Check if the email is already registered
    const existingUser = await CombinedModel.findOne({ 'user.email': email });
 
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate a new unique identifier (nanoid) of length 4
    const uniqueIdentifier = nanoid(4);

    // Combine username and nanoid to create a unique project ID
    const projectID = `${username}_${uniqueIdentifier}`;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
   

    const emailToken = crypto.randomBytes(16).toString('hex')
         
    // Create a new user
    const newUser = new CombinedModel({
      user: {
        username,
        email,
        password: hashedPassword,
        projectID,
        emailToken,
   
      },
      project: {
        projectName,
        projectNumber, 
        client ,
        constructionStartdate,
       projectAddress,
       constructionType,
       currentStage,
       customerID,
       customerName,
       invoiceReference,
      },
    });

    // Save the new user
        const verificationLink = `http://localhost:3000/verify-email?token=${emailToken}`;
        let emailSentSuccessfully = false;
        const mailOptions = {
          from:{
            name: "web hussein",
            adress: "mhpcompany94@gmail.com"
          },
          to: email,
          subject: 'Verify Your Email',
         
          html: `your project id is:::${projectID}<br/>Click <a href="${verificationLink}">here</a> to verify your email.`,// plain text body
        };
        
        try {
          await transporter.sendMail(mailOptions);
          await newUser.save();
          emailSentSuccessfully = true;
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          // You might want to handle this error and inform the user
        }



    res.status(201).json({ user: newUser.user, project: newUser.project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
// Controller to update user information
export const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { username, email,password} = req.body;

  try {
    // Find the combined document by userId
    const NewUSer = await CombinedModel.findOne({ 'user._id': userId });

    if (!NewUSer) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const uniqueIdentifier = nanoid(4);
    const projectID = `${username}${uniqueIdentifier}`;
    const newemailToken = crypto.randomBytes(16).toString('hex')
    // Update user information
    const hashedPassword = await bcrypt.hash(password, 10);
    
    NewUSer.user.username = username || NewUSer.user.username;
        
    NewUSer.user.username = username || NewUSer.user.username;
    NewUSer.user.password = hashedPassword || NewUSer.user.password;
    NewUSer.user.projectID = projectID || NewUSer.user.projectID;
    NewUSer.user.emailToken = newemailToken || NewUSer.user.newemailToken;

    // Save the updated document
    await NewUSer.save();

    // Respond with the updated user information
    res.status(200).json({
      user: NewUSer.user,
      message: 'User information updated successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/* to do operations */
/* Login operation */

export const loginUser = async (req, res) => {
  const currentTimeStockholmTimeZone = moment().tz('Europe/Stockholm');

  try {
    const { projectID, password } = req.body;

    // Find the user based on projectID
    const user = await CombinedModel.findOne({ 'user.projectID': projectID });

    // If the user is not found or the password doesn't match, send an error response
    if (!user || !(await bcrypt.compare(password, user.user.password))) {
      return res.status(401).json({ success: false, message: 'Ogiltiga inloggningsuppgifter' });
    }

    const isEmailVerified = user.user.isEmailVerified;

    if (!isEmailVerified) {
      // If the email is not verified, send an error response
      console.log('Email is not verified');
      return res.status(401).json({ success: false, message: 'Inloggning misslyckades, vänligen verifiera din e-postadress' });
    }

    // If the email is verified, update countLoginTime and save the user
    user.user.countLoginTime = currentTimeStockholmTimeZone;

    console.log(user.user.countLoginTime);

    // Save the updated user to the database
    await user.save();

    // Send a successful login response
    res.json({ success: true, user, message: 'Inloggning lyckades' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internt serverfel' });
  }
};

// verifyEmail
// AuthController.js


// Controller to verify email using token from URL
export const verifyEmailByUrl = async (req, res) => {
  const emailToken = req.query.token; // Get the emailToken from the URL query parameters

  try {
    // Check if emailToken is provided and not an empty string
    if (!emailToken || emailToken.trim() === '') {
      return res.status(400).json({ success: false, message: 'EmailToken not found or invalid.' });
    }

    // Convert both the stored token and input token to lowercase for case-insensitive search
    const lowercasedEmailToken = emailToken.toLowerCase();

    // Find the user by emailToken
    const user = await CombinedModel.findOne({ 'user.emailToken': lowercasedEmailToken });

    if (user) {
      // Update user properties for email verification
      user.user.emailToken = '';
      user.user.isEmailVerified = true;

      // Save the updated user to the database
      await user.save();

      // Respond with the updated user information
      res.status(200).json({
        _id: user._id,
        username: user.user.username,
        email: user.user.email,
        isEmailVerified: user.user.isEmailVerified,
        message: 'Email verification successful.',
      });
    } else {
      res.status(404).json({ success: false, message: 'Email verification failed, invalid token!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/* Email verification */
  // Find all users
export const findAllUsers = async (req, res) => {
  try {
    // Find all users
    const users = await CombinedModel.find();
    // const users = await CombinedModel.find({}, { user: 1 });

    // Respond with the list of users
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/* this function is checking if not veified  emails if it's found fro database, then the function will delete from database, */
//this function will scan the database every 1 minutes 

 export const checkEmails = async ()=>{
 
  
  cron.schedule('* * * * *', async () => {
    console.log('checking  fake Emails from the  databse.');
    try {
      // Find unverified users created more than one minute ago
      const unverifiedUsersToDelete = await CombinedModel.find({
        'user.isEmailVerified': false,
        'createdAt': { $lte: new Date(Date.now() - 60 * 1000) }, // One minute ago
      });
    
      // Check if there are unverified users to delete
      if (unverifiedUsersToDelete.length > 0) {
        // Delete unverified users
        await Promise.all(
          unverifiedUsersToDelete.map(async (user) => {
            await user.deleteMany();
          })
        );
  
        console.log('Scheduled job: Unverified users deleted.');
      } else {
        console.log('Scheduled job: No unverified users to delete.');
      }
    } catch (error) {
      console.error('Scheduled job error:', error);
    }
  });
  
}

/* Find specfic user operation */

