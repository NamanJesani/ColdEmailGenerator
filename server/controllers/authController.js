const User = require('../models/User');
const sendEmail = require('../utils/sendEmail.js');

exports.registerUser= async (req, res) => {
 try{
   const { username, email, password } = req.body;
   if(!username || !email || !password){
     return res.status(400).json({ message: 'Please provide all required fields' });
   }
   if(password.length < 6){
     return res.status(400).json({ message: 'Password must be at least 6 characters long' });
   }
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
     return res.status(400).json({ message: 'Please provide a valid email address' });
   }
      const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: 'Email already in use' });
    }

    const otp= Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry= new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes;


   const user = await User.create({ username, email, password,otp,otpExpiry });
  res.status(201).json({ message: 'User registered successfully', user });

   // otp validation 
   try{
     await sendEmail(email, 'Your OTP Code for AI COLDMAIL GENERATOR', `Your OTP code is: ${otp}. It will expire in 10 minutes.`);
   }
   catch(error){
    console.log({ message: 'Error sending OTP email', error: error.message });
   }

 }
 catch(error) {
}
}