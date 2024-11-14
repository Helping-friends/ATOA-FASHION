// emailTest.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create test transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Test function
async function testEmailConfig() {
    try {
        // Verify transporter configuration
        await transporter.verify();
        console.log('Email configuration is valid');

        // Send test email
        const testEmail = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to yourself for testing
            subject: 'ATOA Fashion - Email Configuration Test',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Email Configuration Test</h2>
                    <p>This is a test email to verify your email configuration is working correctly.</p>
                    <p>Configuration details:</p>
                    <ul>
                        <li>Timestamp: ${new Date().toLocaleString()}</li>
                        <li>Sender: ${process.env.EMAIL_USER}</li>
                    </ul>
                    <p>If you received this email, your email configuration is working!</p>
                </div>
            `
        });

        console.log('Test email sent successfully!');
        console.log('Message ID:', testEmail.messageId);
        return true;
    } catch (error) {
        console.error('Email configuration test failed:');
        console.error('Error:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Please check your email and app password.');
        }
        return false;
    }
}

// Run the test
testEmailConfig()
    .then(success => {
        if (success) {
            console.log('Email configuration test completed successfully');
        } else {
            console.log('Email configuration test failed');
        }
        process.exit();
    });