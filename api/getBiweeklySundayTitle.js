// File: /api/getBiweeklySundayTitle.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { dateCode } = req.query;

  if (!dateCode || dateCode.length !== 6) {
    return res.status(400).json({ error: 'Missing or invalid dateCode' });
  }

  const url = `https://bible.usccb.org/bible/readings/${dateCode}.cfm`;

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Extract ONLY the <h2> inside <div class="innerblock">
    const match = html.match(/<div class="innerblock">[\s\S]*?<h2>(.*?)<\/h2>/i);
    const title = match ? match[1].trim() : 'Sunday title not found.';

    res.status(200).json({ title });
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch title." });
  }
}
