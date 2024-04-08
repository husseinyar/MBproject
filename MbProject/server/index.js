
//  set up a project 
// require packages for runing the app -start and --
import express from "express";
import mongoose from "mongoose";



import bodyParser from "body-parser";
import cors from "cors";
import userRoute from "./Routes/userRouter.js";
import moment from 'moment-timezone';
import transporter from "./utils/transporter.js";
import {checkEmails} from "./Controllers/userController.js"


// require packages for runing the app -start and -- ends here.


// Initialization the app 
const app = express();
moment.tz.setDefault('Europe/Stockholm');

transporter.verify((error, success)=> {
  if(error){
    console.log(error)
  }else 
  console.log("reday to send email")
  console.log(success)}) 


// Display the current time in the default time zone
console.log('Current time in default time zone:', moment().format());

// Display the current time in the specified time zone
const currentTimeStockholmTimeZone = moment().tz('Europe/Stockholm');

console.log('Current time in Europe/Stockholm:', currentTimeStockholmTimeZone.format());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// Configuring. the port for localhost -
const PORT = 3001;
// end

// Schedule a job to run every minute
// Schedule a job to run every minute

// Database connectton
mongoose.connect('mongodb://localhost:27017/minDatabas', { useNewUrlParser: true, useUnifiedTopology: true });

// Configuring Routers
app.use("/api/users", userRoute);

//checkEmails
//checkEmails();


// luching the app for localhost:c3000

app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
  });