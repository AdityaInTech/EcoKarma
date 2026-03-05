const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['user', 'org'], 
        default: 'user' 
    },
    // --- GAMIFICATION & STATS ---
    points: { 
        type: Number, 
        default: 0 // Currency to spend on Perks
    },
    completedCleanups: {
        type: Number,
        default: 0 // Tracks effective work (approved posts)
    },
    level: {
        type: Number,
        default: 1 // Starts at Level 1
    },
    rankTitle: {
        type: String,
        default: 'Novice' // Upgrades as they do more effective work (e.g., Bronze, Silver, Eco-Warrior)
    },
    badges: [{ 
        type: String // Array to hold special awards like ["First Cleanup", "10kg Trash Removed"]
    }]
}, { 
    timestamps: true // Automatically saves the exact date they created their account
});

module.exports = mongoose.model('User', userSchema);