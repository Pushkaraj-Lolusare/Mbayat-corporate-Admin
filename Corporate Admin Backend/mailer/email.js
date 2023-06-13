const nodemailer = require('nodemailer');

async function sendUserCredentials(credentials) {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'developer@trymbayat.com',
                pass: 'waoyayqbfenmwrki',
            },
        });

        // Define the email content
        const mailOptions = {
            from: 'support@mbayat.com',
            to: credentials.email,
            subject: 'Mbayat Corporate Admin Login Credentials',
            text: `Here are your credentials:\n\nEmail: ${credentials.email}\nPassword: ${credentials.password} \n\n Thank You!`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('User credentials sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
module.exports = {
    sendUserCredentials,
};