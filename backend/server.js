const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Get available videos route
app.get("/api/videos", (req, res) => {
    const videosDir = path.join(__dirname, "videos");
    
    try {
        const files = fs.readdirSync(videosDir)
            .filter(file => file.endsWith('.mp4'))
            .map(file => ({
                name: file,
                path: `/video/${file}`
            }));
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Error reading video directory" });
    }
});

// Video streaming route
app.get("/video/:filename", (req, res) => {
    const videoPath = path.join(__dirname, "videos", req.params.filename);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send("Video not found");
    }

    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});