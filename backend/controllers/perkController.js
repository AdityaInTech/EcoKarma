const Perk = require('../models/Perk');
const User = require('../models/User');

// 1. USER DONATES A GIFT TO THE PLATFORM (Without Points)
exports.donateGift = async (req, res) => {
try {
const { userId, title, description, sponsorName } = req.body;

    const newGift = new Perk({
        title,
        description,
        image: "dummy_gift_image.jpg", // We will add Cloudinary later
        sponsorName: sponsorName || 'Community Member',
        donatedBy: userId,
        status: 'pending', // Waiting for Org to price it
        isMysteryPool: true 
    });

    await newGift.save();
    res.status(201).json({ message: 'Gift donated! Waiting for an Organization to assign it a tier.', perk: newGift });
} catch (error) {
    res.status(500).json({ error: 'Failed to donate gift.' });
}
};

// 2. ORGANIZATION PRICES THE GIFT & MAKES IT ACTIVE
exports.priceGift = async (req, res) => {
try {
const perkId = req.params.id;
const { cost, tier } = req.body; // Org decides it costs 500 points and belongs to Tier 2

    const perk = await Perk.findById(perkId);
    if (!perk) return res.status(404).json({ message: 'Gift not found.' });

    perk.cost = cost;
    perk.tier = tier;
    perk.status = 'active'; // It is now live in the Luck Game!
    await perk.save();

    res.status(200).json({ message: 'Gift priced and added to the Luck Game!', perk });
} catch (error) {
    res.status(500).json({ error: 'Failed to price gift.' });
}
};

// 3. THE LUCK GAME (User Spends Points for a Random Reward)
exports.playLuckGame = async (req, res) => {
try {
const { userId, pointsToSpend } = req.body;

    // Check if user has enough points
    const user = await User.findById(userId);
    if (!user || user.points < pointsToSpend) {
        return res.status(400).json({ message: 'Not enough Impact Points!' });
    }

    // Determine the Tier based on how much they spent
    let targetTier = 1;
    if (pointsToSpend >= 500 && pointsToSpend < 1000) targetTier = 2;
    else if (pointsToSpend >= 1000) targetTier = 3;

    // Find all active gifts in that specific Tier that are still in stock
    const availablePerks = await Perk.find({ tier: targetTier, status: 'active', stock: { $gt: 0 } });

    if (availablePerks.length === 0) {
        return res.status(404).json({ message: 'No prizes available in this tier right now. Try a different amount!' });
    }

    // Roll the dice! Pick a random winner from the array
    const randomIndex = Math.floor(Math.random() * availablePerks.length);
    const wonPerk = availablePerks[randomIndex];

    // Deduct the points from the User and reduce the Perk's stock
    user.points -= pointsToSpend;
    await user.save();

    wonPerk.stock -= 1;
    await wonPerk.save();

    res.status(200).json({ 
        message: `Congratulations! You won: ${wonPerk.title}!`, 
        prize: wonPerk,
        remainingPoints: user.points
    });

} catch (error) {
    res.status(500).json({ error: 'Error playing the Luck Game.' });
}
};

// 4. REGIFT / DONATE WON ITEM BACK TO COMMUNITY
exports.regift = async (req, res) => {
try {
const perkId = req.params.id;

    const perk = await Perk.findById(perkId);
    if (!perk) return res.status(404).json({ message: 'Perk not found.' });

    // Simply put it back on the shelf for someone else to win
    perk.stock += 1;
    await perk.save();

    res.status(200).json({ message: 'Thank you for your generosity! The item has been returned to the community pool.' });
} catch (error) {
    res.status(500).json({ error: 'Failed to regift.' });
}
};