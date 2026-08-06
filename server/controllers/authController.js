const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail.js');

const generateAuthToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}

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
  res.status(201).json({ message: 'User registered successfully', user: { username: user.username, email: user.email } });

   // otp validation 
   try{
     await sendEmail(email, 'Your OTP Code for AI COLDMAIL GENERATOR', `Your OTP code is: ${otp}. It will expire in 10 minutes.`);
   }
   catch(error){
    console.log({ message: 'Error sending OTP email', error: error.message });
   }

 }
  catch (error) {
   console.error("Error in registerUser:", error);
   res.status(500).json({ message: "Internal server error", error: error.message });
 }
}
//otp verification
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide both email and OTP' });
    }

    const user = await User.findOne({ email }).select('+otp otpExpiry isVerified');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification
    user.otpExpiry = null; // Clear OTP expiry after successful verification
    await user.save();
    
    const token =generateAuthToken(user._id);
    res.status(200).json({ token, message: 'User verified successfully' });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password isVerified');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'User is not verified. Please verify your account first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateAuthToken(user._id);
    res.status(200).json({ message: 'Login successful', token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}