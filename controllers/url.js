function shortid(n = 9) {
    const s = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let shortId = "";
    while (n--) {
        shortId += s.charAt(Math.floor(Math.random() * 62 + 1));
    }
    return shortId;
}

const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body) return res.status(400).json({ error: "URL is required" });
    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: []
    });
    return res.render("home",
        {id: shortId ,});
};

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    console.log("SHort Id from request : ", `${req.params.shortId}`);
    if (!result) return res.status(404).json({ error: "URL not found" });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
};