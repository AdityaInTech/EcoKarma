// const express = require('express');
// const router = express.Router();
// const missionController = require('../controllers/missionController');

// // ✅ Import your Multer/Cloudinary upload middleware
// // (Double check this path matches where you put your upload.js file!)
// const upload = require('../middleware/upload'); 

// // 1. Drop a new SOS pin (POST /api/missions/create)
// // ✅ Added upload.single('evidenceImage') back in to catch the photo!
// router.post('/create', upload.single('evidenceImage'), missionController.createMission);

// // 2. Get all map pins (GET /api/missions)
// router.get('/', missionController.getOpenMissions);

// // 3. User claims a mission (PUT /api/missions/:id/claim)
// router.put('/:id/claim', missionController.claimMission);

// // 4. Mission is finished (PUT /api/missions/:id/resolve)
// router.put('/:id/resolve', missionController.resolveMission);

// module.exports = router;


const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const upload = require('../middleware/upload'); 

// 🚨 ADDED ERROR TRAP: If Cloudinary fails, this will print the exact reason in your terminal!
router.post('/create', (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) {
            console.error("🔥 CLOUDINARY UPLOAD FAILED:", err.message);
            return res.status(500).json({ error: `Upload Failed: ${err.message}` });
        }
        next();
    });
}, missionController.createMission);

router.get('/', missionController.getOpenMissions);
router.put('/:id/claim', missionController.claimMission);
router.put('/:id/resolve', missionController.resolveMission);

module.exports = router;