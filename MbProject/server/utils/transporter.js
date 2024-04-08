
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",

  port: 587,
  secure:true,
  auth: {
    user: 'mhpcompany94@gmail.com',
    pass: 'ncni cjad siep exva', // Use the app password here
  },
});


export default  transporter;

