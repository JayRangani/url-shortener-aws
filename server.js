const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { saveUrl, getUrl, incrementClicks } = require("./db");
const { generateShortId } = require("./utils");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Create short URL
app.post("/shorten", async (req, res) => {
  const { long_url } = req.body;

  if (!long_url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let shortId;
  let existing;

  // Ensure unique ID
  do {
    shortId = generateShortId();
    existing = await getUrl(shortId);
  } while (existing);

  await saveUrl(shortId, long_url);

  res.json({
    short_url: `http://localhost:3000/${shortId}`
  });
});

// Redirect
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  const data = await getUrl(shortId);

  if (!data) {
    return res.status(404).json({ error: "URL not found" });
  }

  await incrementClicks(shortId);

  res.redirect(data.long_url);
});

// Analytics
app.get("/analytics/:shortId", async (req, res) => {
  const data = await getUrl(req.params.shortId);

  if (!data) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});