exports.registerUser= (req, res) => {
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
   
 catch (error) {

}
}