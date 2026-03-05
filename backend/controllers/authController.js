const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SIGN UP A NEW USER
exports.registerUser = async (req, res) => {
try {
const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email!' });
    }

    // Scramble (Hash) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in the database
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user' // Defaults to 'user' if they don't specify 'org'
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully!' });

} catch (error) {
    res.status(500).json({ error: 'Server error during registration.' });
}
};

// 2. LOG IN AN EXISTING USER
exports.loginUser = async (req, res) => {
try {
const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    // Check if the password matches the scrambled one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Create a digital ID badge (JWT) so they stay logged in
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, // We will add this secret key to your .env file next!
        { expiresIn: '7d' } // Keeps them logged in for 7 days
    );

    res.status(200).json({
        message: 'Logged in successfully!',
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
            points: user.points,
            level: user.level,
            rankTitle: user.rankTitle
        }
    });

} catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
}
}