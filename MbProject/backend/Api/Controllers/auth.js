const  bcrypt = require ("bcryptjs") ;
const jwt = require ("jsonwebtoken");
const User = require ("../models/User.js");
const CryptoJS = require("crypto-js");

/* REGISTER USER */

exports.login = async (req, res) => {
  try{
      const user = await User.findOne(
          {
            email: req.body.email
          }
      );
 if(!user){
   return res.status(401).json("Wrong User Name");
 }
    

      const hashedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
      );


      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      const inputPassword = req.body.password;
      
      if(originalPassword != inputPassword ) 
         {
         return res.status(401).json("Wrong Password");
         } 

      const accessToken = jwt.sign(
      {
          id: user._id,
          isAdmin: user.isAdmin,
          superAdmi: user.superAdmi,
      },
      process.env.JWT_SECRET,
          {expiresIn:"3d"}
      );

      const { password, ...others } = user._doc;  
     return res.status(200).json({...others,
      status: "success",
      message: "Login Successfully!",
      accessToken});

  }catch(err){
    return   res.status(500).json(err);
  }

};
/* LOGGING IN */



exports.register = async (req, res) => {
  try {
  
  

    const {
        firstName,
        lastName,
        email,
        password,
        adress,
        phonenumber,
        superAdmi,
        isAdmin
      } = req.body;

    if(!email || !password ) return res.status(400).json({"message": "Email and password are require"})
    

         const exisistEmail = User.findOne(email);

       

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
        adress,
        phonenumber,
        superAdmi,
        isAdmin,

    });
    const result = await newUser.save();
 
    res.json({ status: "success", message: "New user created", result });
  
  } catch (err) {
    console.log("err::", err.message )
    res.status(500).json({ error: err.message });
    
  }
};

exports.Logut = async (req, res) => {
	const { accessToken } = req.headers;
	//this data coming form database
	const user = req.userId;

	// 2. delete accessJWT from redis database
	

	if (!user) {
		return res.json({ status: "success", user,  message: "Loged out successfully" });

	}
  console.log(user._Id )
	res.json({
		status: "error",
		message: "Unable to logg you out, plz try again later",
	});
};