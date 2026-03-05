// const express = require('express');
// const router = express.Router();
// const postController = require('../controllers/postController');
// const upload = require('../middleware/upload'); 

// router.get('/', postController.getAllPosts);

// // ==========================================
// // 🚨 THE CLOUDINARY / MULTER TRAP
// // ==========================================
// router.post('/create', (req, res, next) => {
//     // We run the upload middleware manually so we can catch its errors!
//     upload.any()(req, res, (err) => {
//         if (err) {
//             console.error("🔥 CLOUDINARY/MULTER CRASHED:", err.message);
//             // This sends the exact upload error to your React frontend!
//             return res.status(500).json({ error: `File Upload Failed: ${err.message}` });
//         }
//         // If the upload succeeds, pass it to your controller
//         next();
//     });
// }, postController.createPost);

// router.put('/:id/approve', postController.approvePost);

// router.get('/approve-email/:id', postController.approveViaEmail);

// router.get('/user/:userId', postController.getUserPosts);

// module.exports = router;





const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload'); 

router.get('/', postController.getAllPosts);

// ==========================================
// 🚨 THE CLOUDINARY / MULTER TRAP
// ==========================================
router.post('/create', (req, res, next) => {
    // We run the upload middleware manually so we can catch its errors!
    upload.any()(req, res, (err) => {
        if (err) {
            console.error("🔥 CLOUDINARY/MULTER CRASHED:", err.message);
            // This sends the exact upload error to your React frontend!
            return res.status(500).json({ error: `File Upload Failed: ${err.message}` });
        }
        // If the upload succeeds, pass it to your controller
        next();
    });
}, postController.createPost);

router.put('/:id/approve', postController.approvePost);

router.get('/approve-email/:id', postController.approveViaEmail);

router.get('/user/:userId', postController.getUserPosts);

// ✅ NEW: Route to handle likes!
router.put('/:id/like', postController.toggleLike);

module.exports = router;