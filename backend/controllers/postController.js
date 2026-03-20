const Post = require('../models/Post');
const User = require('../models/User');
require('dotenv').config(); 

// ==========================================
// 1. CREATE POST & SEND EMAIL VIA RESEND
// ==========================================
exports.createPost = async (req, res) => {
    try {
        const { authorId, assignedOrgId, workDescription, workDetail, location } = req.body;

        let img1Url = null;
        let img2Url = null;
        let vidUrl = null;

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.fieldname === 'imageProof1') img1Url = file.path;
                if (file.fieldname === 'imageProof2') img2Url = file.path;
                if (file.fieldname === 'videoProof') vidUrl = file.path;
            });
            if (!img1Url && req.files[0]) img1Url = req.files[0].path;
        }

        const newPost = new Post({
            authorId, assignedOrgId, workDescription, workDetail, location,
            videoProof: vidUrl || "dummy_video_url_for_now.mp4", 
            imageProof1: img1Url || "dummy_image_1.jpg", 
            imageProof2: img2Url || "dummy_image_2.jpg"
        });

        await newPost.save();

        // ✅ Tell Frontend Success Immediately!
        res.status(201).json({ message: 'EcoKarma post submitted successfully!', post: newPost });

        const baseUrl = `https://ecokarma.onrender.com/api/posts/approve-email/${newPost._id}`;
        
        // ✅ Format for RESEND HTTP API
        const emailPayload = {
            from: "EcoKarma Platform <onboarding@resend.dev>", // MUST BE onboarding@resend.dev on free tier
            to: ["adityaskill05@gmail.com"], // MUST be the email you signed up to Resend with
            subject: `Review Required: ${workDetail}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #10b981;">EcoKarma Review Request</h2>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Description:</strong> ${workDescription}</p>
                    ${img1Url && img1Url !== "dummy_image_1.jpg" ? `<img src="${img1Url}" style="max-width: 100%; border-radius: 8px; margin-bottom: 15px;" />` : '<p><i>No image provided.</i></p>'}
                    <p style="font-weight: bold; margin-top: 20px;">Evaluate the evidence and select a reward tier below:</p>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <a href="${baseUrl}?points=50" style="background: #f1f5f9; color: #334155; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 1px solid #cbd5e1;">Good (50 Pts)</a>
                        <a href="${baseUrl}?points=100" style="background: #10b981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Great (100 Pts)</a>
                        <a href="${baseUrl}?points=200" style="background: #0f172a; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Exceptional (200 Pts)</a>
                    </div>
                </div>
            `
        };
        
        // ✅ Fire Resend Request (Bypasses Render Firewall)
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailPayload)
            });

            if (response.ok) {
                console.log("✅ EMAIL SENT VIA RESEND!");
            } else {
                const errData = await response.json();
                console.error("❌ Resend Rejected:", errData);
            }
        } catch (emailError) {
            console.error("❌ Fetch failed:", emailError.message);
        }
        
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ error: error.message }); 
    }
};

// ==========================================
// 2. APPROVE VIA EMAIL LINK
// ==========================================
exports.approveViaEmail = async (req, res) => {
    try {
        const postId = req.params.id;
        const pointsToAward = parseInt(req.query.points) || 50;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).send("Post not found.");
        if (post.status === 'approved') return res.send("Already Approved!");

        post.status = 'approved';
        post.pointsAwarded = pointsToAward;
        await post.save();

        const user = await User.findById(post.authorId);
        if (user) {
            user.points += pointsToAward;
            user.completedCleanups += 1;
            if (user.completedCleanups % 5 === 0) user.level += 1;
            await user.save();
        }

        res.send(`<h1 style="color:green; font-family:sans-serif; text-align:center; margin-top:50px;">✅ Successfully Approved! Awarded ${pointsToAward} Karma Points.</h1>`);
    } catch (error) {
        res.status(500).send("Error approving post.");
    }
};

// ==========================================
// 3. APPROVE VIA ORG DASHBOARD
// ==========================================
exports.approvePost = async (req, res) => {
    try {
        const postId = req.params.id; 
        const { pointsToAward } = req.body; 

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found!' });
        if (post.status === 'approved') return res.status(400).json({ message: 'This post is already approved!' });

        post.status = 'approved';
        post.pointsAwarded = pointsToAward;
        await post.save();

        const user = await User.findById(post.authorId);
        if (user) {
            user.points += pointsToAward; 
            user.completedCleanups += 1; 
            if (user.completedCleanups % 5 === 0) user.level += 1;
            await user.save();
        }

        res.status(200).json({ message: 'Post approved and user rewarded!', post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve post.' });
    }
};

// ==========================================
// 4. GET ALL POSTS (HOME PAGE FEED)
// ==========================================
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isPublic: true, status: 'approved' }).populate('authorId', 'name').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
};

// ==========================================
// 5. GET SPECIFIC USER POSTS (PROFILE PAGE)
// ==========================================
exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ authorId: userId }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user posts.' });
    }
};

// ==========================================
// 6. TOGGLE LIKE ON A POST
// ==========================================
exports.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (!post.likes) post.likes = [];

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ message: 'Like updated!', likes: post.likes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle like.' });
    }
};
