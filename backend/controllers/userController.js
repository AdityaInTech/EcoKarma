// const User = require('../models/User');

// // GET TOP USERS FOR THE KARMA BOARD
// exports.getLeaderboard = async (req, res) => {
//     try {
//         // Find users, sort by points (Highest first), and grab the top 5
//         const topUsers = await User.find()
//             .sort({ points: -1 }) 
//             .limit(5)
//             .select('name completedCleanups points'); // Only send necessary data
            
//         res.status(200).json(topUsers);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch leaderboard.' });
//     }
// };

// // --- NEW FUNCTION: Fetch a single user's profile data ---
// exports.getUserProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch user profile.' });
//     }
// };




const User = require('../models/User');

// GET TOP USERS FOR THE KARMA BOARD
// GET TOP USERS FOR THE KARMA BOARD
exports.getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ completedCleanups: -1 }) 
            .limit(50)
            // ✅ ADDED 'level' to the select list so the frontend can see it!
            .select('name completedCleanups points level'); 
            
        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard.' });
    }
};

// --- NEW FUNCTION: Fetch a single user's profile data ---
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
};
