import express from 'express';
import pool from '../db/index.js';
const router = express.Router();

router.post('/shorten', async (req, res) => {
    try {
        let url = req.body.url;
        if (!url) {
            res.status(400).json({ error: "URL is required" });
            return;
        }
        url = url.trim();

        if(URL.canParse(url)) {
            const shortCode = Math.random().toString(36).substring(2, 8);
            await pool.query("INSERT INTO urls (long_url, short_code) VALUES (?, ?)", [url, shortCode])
            res.json({
                shortUrl: `http://localhost:3000/${shortCode}`
            });
            return;
        }
        else {
            res.status(400).json({error: "Invalid URL"});
            return;
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Server Error"})
    }
})

router.get('/:code', async (req, res) => {
    try {
        console.log(req.params);
        
        let code = req.params.code;

        const [rows] = await pool.query("SELECT long_url FROM urls WHERE short_code = ?", [code]);

        if(rows.length === 0) {
            res.status(404).json({error: "URL not found"})
            return;
        }
        return res.redirect(rows[0].long_url);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Database Error"})
    }
})
export default router;