// File: /api/getBiweeklySundayTitle.js

import fetch from 'node-fetch'; // Ensure you have node-fetch installed if local

export default async function handler(req, res) {
  const { dateCode } = req.query;

  if (!dateCode || dateCode.length !== 6) {
    return res.status(400).json({ error: 'Missing or invalid dateCode' });
  }

  const url = `https://bible.usccb.org/bible/readings/${dateCode}.cfm`;

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Clean version: extract only h2 under .innerblock
    const match = html.match(/<div class="innerblock">.*?<h2[^>]*>(.*?)<\/h2>/is);
    const title = match ? match[1].trim() : 'Sunday title not found.';

    res.status(200).json({ title });
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ error: 'Server crashed fetching title' });
  }
}
