import express from 'express';
import { shortenURL, redirectURL, getStats } from '../controllers/urlController.js';
const router = express.Router();

router.post('/shorten', (req, res) => {
    shortenURL(req, res);
})

router.get('/stats/:code',getStats);
router.get('/:code', (req, res) => {
    redirectURL(req, res);
})

export default router;