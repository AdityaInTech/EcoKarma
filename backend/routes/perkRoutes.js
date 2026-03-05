const express = require('express');
const router = express.Router();
const perkController = require('../controllers/perkController');

// 1. User donates a gift (POST /api/perks/donate)
router.post('/donate', perkController.donateGift);

// 2. Org prices the gift (PUT /api/perks/:id/price)
router.put('/:id/price', perkController.priceGift);

// 3. User plays the Luck Game (POST /api/perks/luck-game)
router.post('/luck-game', perkController.playLuckGame);

// 4. User regifts a won item (PUT /api/perks/:id/regift)
router.put('/:id/regift', perkController.regift);

module.exports = router;