// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
// // 1. User Info
// authorId: {
// type: mongoose.Schema.Types.ObjectId,
// ref: 'User',
// required: true
// },
// assignedOrgId: {
// type: mongoose.Schema.Types.ObjectId,
// ref: 'User',
// required: true
// },

// // 2. Work Details & Location
// workDescription: {
//     type: String,
//     required: true
// },
// workDetail: {
//     type: String,
//     required: true
// },
// location: {
//     type: String, 
//     required: true
// },

// // 3. Media Proof (Strictly 1 Video and 2 Images)
// videoProof: {
//     type: String, 
//     required: true
// },
// imageProof1: {
//     type: String,
//     required: true
// },
// imageProof2: {
//     type: String,
//     required: true
// },

// // 4. Verification & Points
// status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
// },
// pointsAwarded: {
//     type: Number,
//     default: 0
// },

// // 5. Public Feed & Timeline
// isPublic: {
//     type: Boolean,
//     default: true 
// },
// postingDate: {
//     type: Date,
//     default: Date.now // Automatically logs the exact date and time it is submitted
// }
// }, {
// timestamps: true
// });

// module.exports = mongoose.model('Post', postSchema);










const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    // 1. User Info
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedOrgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 2. Work Details & Location
    workDescription: {
        type: String,
        required: true
    },
    workDetail: {
        type: String,
        required: true
    },
    location: {
        type: String, 
        required: true
    },

    // 3. Media Proof (Strictly 1 Video and 2 Images)
    videoProof: {
        type: String, 
        required: true
    },
    imageProof1: {
        type: String,
        required: true
    },
    imageProof2: {
        type: String,
        required: true
    },

    // ✅ NEW: ADDED THE LIKES ARRAY SO IT SAVES IN THE DATABASE
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    // 4. Verification & Points
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    pointsAwarded: {
        type: Number,
        default: 0
    },

    // 5. Public Feed & Timeline
    isPublic: {
        type: Boolean,
        default: true 
    },
    postingDate: {
        type: Date,
        default: Date.now // Automatically logs the exact date and time it is submitted
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);