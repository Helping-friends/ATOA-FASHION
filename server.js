const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date }
});

const User = mongoose.model('User ', userSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Register
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const newUser  = new User({ email, password: hashedPassword, verificationToken });
    await newUser .save();

    // Send verification email
    const verificationLink = `http://localhost:3000/verify/${verificationToken}`;
    await transporter.sendMail({
        to: email,
        subject: 'Verify your email',
        text: `Click this link to verify your email: ${verificationLink}`
    });

    res.status(201).send('User  registered. Please check your email to verify your account.');
});

// Verify Email
app.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        await User.updateOne({ email }, { isVerified: true, verificationToken: null });
        res.send('Email verified successfully!');
    } catch (error) {
        res.status(400).send('Invalid token');
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).send('Invalid email or password');
    }
    res.send('Login successful!');
});

// Forgot Password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User  not found');

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
        to: email,
        subject: 'Reset your password',
        text: `Click this link to reset your password: ${resetLink}`
    });

    res.send('Password reset link sent to your email.');
});

// Reset Password
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updateOne({ email }, { password: hashedPassword, resetToken