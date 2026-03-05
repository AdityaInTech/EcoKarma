const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// --- ADDED: Import Models for Demo Data ---
const User = require('./models/User');
const Post = require('./models/Post');
const Perk = require('./models/Perk');
const Mission = require('./models/Mission');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('Successfully connected to MongoDB!');
    
    // --- ADDED: DEMO DATA INJECTION ---
    try {
        // We check if the demo user exists so it doesn't create duplicate data every time you save the file!
        const existingUser = await User.findOne({ email: 'aditya@demo.com' });
        
        if (!existingUser) {
            console.log('Injecting demo data into MongoDB...');
            
            // 1. Create a Demo User and a Demo Organization
            const demoUser = await User.create({
                name: 'Aditya Parmale',
                email: 'aditya@demo.com',
                password: 'hashed_password_placeholder', 
                role: 'user',
                points: 500
            });

            const demoOrg = await User.create({
                name: 'Green Earth NGO',
                email: 'org@demo.com',
                password: 'hashed_password_placeholder',
                role: 'org'
            });

            // 2. Create a Demo Post
            await Post.create({
                authorId: demoUser._id,
                assignedOrgId: demoOrg._id,
                workDescription: 'Lake Cleanup',
                workDetail: 'Removed 15kg of plastic waste.',
                location: 'Rankala Lake, Kolhapur',
                videoProof: 'dummy_video.mp4',
                imageProof1: 'dummy_img1.jpg',
                imageProof2: 'dummy_img2.jpg',
                status: 'approved',
                pointsAwarded: 200
            });

            // 3. Create a Demo Perk for the Store
            await Perk.create({
                title: 'Free Coffee',
                description: 'Redeem for one free coffee at the cafe.',
                image: 'coffee_perk.jpg',
                cost: 150,
                tier: 1,
                sponsorName: 'Local Cafe',
                stock: 50,
                status: 'active'
            });

            // 4. Create an Open Mission on the Map
            await Mission.create({
                reporterId: demoUser._id,
                title: 'Street Cleanup Needed',
                description: 'Lots of wrappers blown into the alley.',
                locationName: 'Mahadwar Road',
                coordinates: { lat: 16.6933, lng: 74.2281 },
                evidenceImage: 'trash_alley.jpg',
                urgency: 'high',
                bountyPoints: 300,
                status: 'open'
            });

            console.log('Success! All demo collections are now visible in MongoDB Atlas.');
        }
    } catch (err) {
        console.log('Error injecting demo data:', err.message);
    }
    // --- END DEMO DATA INJECTION ---
})
.catch((error) => console.log('Database connection failed:', error.message));

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // All auth routes will start with /api/auth

const postRoutes = require('./routes/postRoutes'); 
app.use('/api/posts', postRoutes);

const perkRoutes = require('./routes/perkRoutes'); 
app.use('/api/perks', perkRoutes);                

const missionRoutes = require('./routes/missionRoutes'); 
app.use('/api/missions', missionRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// --- END ROUTES ---

app.get('/', (req, res) => {
    res.send('Impact Platform Backend is running perfectly!!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // ✅ Fixed the backticks here so the port number actually prints!
    console.log(`Success! Server is actively running on port ${PORT}`);
});