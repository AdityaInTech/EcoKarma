const mongoose = require('mongoose');

const perkSchema = new mongoose.Schema({
// 1. Basic Info
title: { type: String, required: true },
description: { type: String, required: true },
image: { type: String, required: true }, // Cloudinary URL

// 2. The Luck Game & Tiers
cost: { type: Number, default: 0 }, // The Org sets this.
tier: { type: Number, default: 1 }, // e.g., Tier 1 (Low points), Tier 5 (High points)
isMysteryPool: { type: Boolean, default: false }, // If true, it only appears in the Luck Game

// 3. Community Donations (User -> Org)
donatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Records which user gave this item to the platform
},
sponsorName: { 
    type: String, 
    default: 'Community Gift' // e.g., "Starbucks" or "Community Gift"
},

// 4. Store Operations
stock: { type: Number, default: 1 },
status: {
    type: String,
    enum: ['pending', 'active', 'hidden'],
    default: 'active' // User-donated gifts start as 'pending' until the Org prices them
}
}, {
timestamps: true
});

module.exports = mongoose.model('Perk', perkSchema);