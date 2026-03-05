// const Mission = require('../models/Mission');
// const User = require('../models/User');

// // 1. DROP A PIN (Create a new SOS Mission)
// exports.createMission = async (req, res) => {
//     try {
//         const { reporterId, reporterName, phoneNo, title, description, locationName, lat, lng, urgency, bountyPoints } = req.body;

//         // ✅ Grab the real Cloudinary URL if an image was uploaded!
//         let imageUrl = "dummy_sos_image.jpg";
//         if (req.file && req.file.path) {
//             imageUrl = req.file.path; 
//         }

//         const newMission = new Mission({
//             reporterId,
//             reporterName, 
//             phoneNo,      
//             title,
//             description,
//             locationName, 
//             coordinates: { lat, lng },
//             evidenceImage: imageUrl, // ✅ Now saves the real image URL!
//             urgency: urgency || 'medium',
//             bountyPoints: bountyPoints || 100 
//         });

//         await newMission.save();
//         res.status(201).json({ message: 'SOS Pin dropped successfully!', mission: newMission });
//     } catch (error) {
//         console.error("Crash in createMission:", error);
//         res.status(500).json({ error: 'Failed to create mission.' });
//     }
// };

// // 2. GET ALL OPEN MISSIONS (To display on the Map)
// exports.getOpenMissions = async (req, res) => {
//     try {
//         // ✅ ADDED .sort({ createdAt: -1 }) to put newest posts at the top!
//         const missions = await Mission.find({ status: { $ne: 'resolved' } }).sort({ createdAt: -1 });
//         res.status(200).json(missions);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch missions.' });
//     }
// };

// // 3. ACCEPT MISSION (User claims it)
// exports.claimMission = async (req, res) => {
//     try {
//         const missionId = req.params.id;
//         const { userId } = req.body;

//         const mission = await Mission.findById(missionId);
//         if (!mission) return res.status(404).json({ message: 'Mission not found.' });

//         if (mission.status !== 'open') {
//             return res.status(400).json({ message: 'This mission is already in progress or completed!' });
//         }

//         mission.status = 'in-progress';
//         mission.claimedBy = userId;
//         await mission.save();

//         res.status(200).json({ message: 'Mission accepted! Good luck!', mission });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to claim mission.' });
//     }
// };

// // 4. RESOLVE MISSION & AWARD BOUNTY
// exports.resolveMission = async (req, res) => {
//     try {
//         const missionId = req.params.id;

//         const mission = await Mission.findById(missionId);
//         if (!mission) return res.status(404).json({ message: 'Mission not found.' });
//         if (mission.status === 'resolved') return res.status(400).json({ message: 'Already resolved.' });

//         mission.status = 'resolved';
//         await mission.save();

//         // Award the bounty to the user who claimed it
//         if (mission.claimedBy) {
//             const user = await User.findById(mission.claimedBy);
//             if (user) {
//                 user.points += mission.bountyPoints;
//                 user.completedCleanups += 1;
//                 await user.save();
//             }
//         }

//         res.status(200).json({ message: 'Mission accomplished! Bounty awarded.', mission });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to resolve mission.' });
//     }
// };





const Mission = require('../models/Mission');
const User = require('../models/User');

// 1. DROP A PIN (Create a new SOS Mission)
exports.createMission = async (req, res) => {
    try {
        const { reporterId, reporterName, phoneNo, title, description, locationName, lat, lng, urgency, bountyPoints } = req.body;

        // ✅ BULLETPROOF IMAGE CATCHER
        let imageUrl = "dummy_sos_image.jpg";
        
        // Check if upload.single() was used
        if (req.file && req.file.path) {
            imageUrl = req.file.path; 
        } 
        // Check if upload.any() was used (which creates an array)
        else if (req.files && req.files.length > 0) {
            imageUrl = req.files[0].path;
        }

        console.log("📸 Image URL being saved to Database:", imageUrl);

        const newMission = new Mission({
            reporterId,
            reporterName, 
            phoneNo,      
            title,
            description,
            locationName, 
            coordinates: { lat, lng },
            evidenceImage: imageUrl, // Saves the real Cloudinary URL
            urgency: urgency || 'medium',
            bountyPoints: bountyPoints || 100 
        });

        await newMission.save();
        res.status(201).json({ message: 'SOS Pin dropped successfully!', mission: newMission });
    } catch (error) {
        console.error("Crash in createMission:", error);
        res.status(500).json({ error: 'Failed to create mission.' });
    }
};

// 2. GET ALL OPEN MISSIONS (To display on the Map)
exports.getOpenMissions = async (req, res) => {
    try {
        // Sorts by newest first
        const missions = await Mission.find({ status: { $ne: 'resolved' } }).sort({ createdAt: -1 });
        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch missions.' });
    }
};

// 3. ACCEPT MISSION (User claims it)
exports.claimMission = async (req, res) => {
    try {
        const missionId = req.params.id;
        const { userId } = req.body;

        const mission = await Mission.findById(missionId);
        if (!mission) return res.status(404).json({ message: 'Mission not found.' });

        if (mission.status !== 'open') {
            return res.status(400).json({ message: 'This mission is already in progress or completed!' });
        }

        mission.status = 'in-progress';
        mission.claimedBy = userId;
        await mission.save();

        res.status(200).json({ message: 'Mission accepted! Good luck!', mission });
    } catch (error) {
        res.status(500).json({ error: 'Failed to claim mission.' });
    }
};

// 4. RESOLVE MISSION & AWARD BOUNTY
exports.resolveMission = async (req, res) => {
    try {
        const missionId = req.params.id;

        const mission = await Mission.findById(missionId);
        if (!mission) return res.status(404).json({ message: 'Mission not found.' });
        if (mission.status === 'resolved') return res.status(400).json({ message: 'Already resolved.' });

        mission.status = 'resolved';
        await mission.save();

        // Award the bounty to the user who claimed it
        if (mission.claimedBy) {
            const user = await User.findById(mission.claimedBy);
            if (user) {
                user.points += mission.bountyPoints;
                user.completedCleanups += 1;
                await user.save();
            }
        }

        res.status(200).json({ message: 'Mission accomplished! Bounty awarded.', mission });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve mission.' });
    }
};