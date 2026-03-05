const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    // 1. The Reporter (Who found it)
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reporterName: { 
        type: String 
    },
    phoneNo: { 
        type: String 
    },

    // 2. The Location & Visuals
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    locationName: { 
        type: String, 
        required: true 
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    evidenceImage: { 
        type: String, 
        required: true // Cloudinary URL
    },

    // 3. The Gamification (Bounty)
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    bountyPoints: {
        type: Number,
        default: 0 
    },

    // 4. Mission Status & Solo Claim
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved'],
        default: 'open'
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mission', missionSchema);