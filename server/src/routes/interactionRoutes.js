const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

router.post('/', interactionController.logInteraction);
router.post('/behavior', interactionController.logBehavior);

module.exports = router;
