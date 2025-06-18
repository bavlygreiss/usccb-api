export default async function handler(req, res) {
  const { dateCode } = req.query;

  if (!dateCode || dateCode.length !== 6) {
    return res.status(400).json({ error: 'Missing or invalid dateCode' });
  }

  const url = `https://bible.usccb.org/bible/readings/${dateCode}.cfm`;

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Extract ALL <h2> tags
    const h2Matches = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)];

    // The second one contains the real Sunday title
    const title = h2Matches[1]?.[1].trim() || "Sunday title not found.";

    return res.status(200).json({ title });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Failed to fetch title." });
  }
}
