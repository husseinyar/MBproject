// import userModel from "../Models/userModel.js"
// import bcrypt from "bcrypt"
// import crypto from "crypto"
// import Project from "../models/projectSchema.js"
// /* registerUser operation */

// export const registerUser = async (req, res) => {
//   const { username, email, password } = req.body;
//   console.log(req.body);
//   try {
//     // Bearbeta formulärdata för registrering

//     // Skapa en ny användare med automagiskt genererat projectID
//     let user = await userModel.findOne({ email });
//     if (user) return res.status(400).json("User already exists...");
//    const emailToken = crypto.randomBytes(64).toString('hex')
//     user = new userModel({
//       username,
//       email,
//       password,
//       emailToken: emailToken
//     });

//     await user.save();

//     // Omdirigera till inloggningssidan eller skicka ett framgångsrikt svar
//     res.json({ success: true, user, message: 'Registreringen lyckades. Vänligen kontrollera din e-post för bekräftelse.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internt serverfel' });
//   }
// };
// /* to do operations */
// /* Login operation */
// export const loginUser = async (req, res) => {

//   try {
//     const { inlogID, password } = req.body;

//     // Hitta användaren baserat på projectID
//     const user = await userModel.findOne({ inlogID });


//     // Om användaren inte hittas eller lösenordet inte matchar, skicka felmeddelande
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ success: false, message: 'Ogiltiga inloggningsuppgifter' });
//     }
    
//     // Skicka en framgångsrik inloggningssvar
//     res.json({ success: true, user, message: 'Inloggning lyckades' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internt serverfel' });
//   }
// };
// // verifyEmail
// export const verifyEmail = async (req, res) => {
//   const emailToken= req.body.emailToken
//   console.log(emailToken);
//   try {
  

//     // Check if emailToken is provided and not an empty string
//     if (!emailToken || emailToken.trim() === '') {
//       return res.status(400).json({ success: false, message: 'EmailToken not found or invalid.' });
//     }

//     // Convert both the stored token and input token to lowercase for case-insensitive search
//     const lowercasedEmailToken = emailToken.toLowerCase();
//     const user = await userModel.findOne({ emailToken: lowercasedEmailToken });

//     if (user) {
//       // Update user properties for email verification
//       user.emailToken = null;
//       user.isEmailVerified = true;

//       // Save the updated user to the database
//       await user.save();

//       res.status(200).json({
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         isEmailVerified: user?.isEmailVerified,
//       });
//     } else {
//       res.status(404).json({ success: false, message: 'Email verification failed, invalid token!' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };




// /* Email verification */



// /* Find specfic user operation */
// /* update specfic user operation */


// export const createUserAndProject = async (req, res) => {
  
//   const { username, email, password } = req.body;
//   try {

//     // Create a new user
//     const user = new userModel({
//       username,
//       email,
//       password,
//     });

//     // Save the user
//     await user.save();

//     // Generate a default project ID for the user's project
   

//     // Create a new project associated with the user
//     const project = new Project({
//       userID: user._id,
//       inlogID: user.inlogID
 
//       // ... other project details
//     });

//     // Save the project
//     await project.save();

//     // Update the user with the project ID
//     user.projectID = project._id;
//     console.log(user.projectID)

//     await user.save();
      
//     // Send a response
//     res.status(201).json({ user, project });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
