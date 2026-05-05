import dotenv from 'dotenv'
import pool from './src/db/index.js'
import express from 'express';
import shortenRoute from './src/routes/urlRouter.js'
dotenv.config();

const app = express();
app.use(express.json());

app.use('/', shortenRoute);

app.listen(3000, () => {
    console.log("App is listening at post 3000");
})















// const [rows] = await pool.query("SELECT * FROM urls");
// console.log(rows);

// await pool.query("INSERT INTO urls (long_url, short_code) VALUES (?, ?)", ["https://google.com", "abc123"])