const nodeMailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try{
         if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials are not set in environment variables");
    }

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: `<p>${text}</p>`,
    };
     await transporter.sendMail(mailOptions);
     console.log(`Email sent successfully`);
    }
catch(error){
    console.error(`Error sending email: ${error.message}`);
    throw error;
}
};  


module.exports = sendEmail;