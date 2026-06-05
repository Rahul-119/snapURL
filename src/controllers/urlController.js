import pool from '../db/index.js';

async function shortenURL(req, res) {
    try {
        let url = req.body.url;
        if (!url) {
            res.status(400).json({ error: "URL is required" });
            return;
        }
        url = url.trim();

        if(URL.canParse(url)) {
            const shortCode = await generateUniqueCode();
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
}

async function redirectURL(req, res) {
    try {
        let code = req.params.code;

        const [rows] = await pool.query("SELECT long_url FROM urls WHERE short_code = ?", [code]);

        if(rows.length === 0) {
            res.status(404).json({error: "URL not found"})
            return;
        }

        await pool.query("UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?", [code])
        return res.redirect(rows[0].long_url);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Database Error"})
    }
}

async function getStats(req, res) {
    try {
        const code = req.params.code;

        const [rows] = await pool.query(
            "SELECT short_code, clicks FROM urls WHERE short_code = ?",
            [code]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "URL not found"
            });
        }

        return res.json({
            shortCode: rows[0].short_code,
            clicks: rows[0].clicks
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Database Error"
        });
    }
}

async function generateUniqueCode() {
    while(true) {
        const code = Math.random().toString(36).substring(2, 8);

        const [rows] = await pool.query("SELECT id FROM urls WHERE short_code = ?", [code]);

        if(rows.length === 0) {
            return code;
        }
    }
}
export {shortenURL, redirectURL, getStats}