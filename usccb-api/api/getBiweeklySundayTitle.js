export default async function handler(req, res) {
  const { dateCode } = req.query; // expects MMDDYY

  try {
    const response = await fetch(`https://bible.usccb.org/bible/readings/${dateCode}.cfm`);
    const html = await response.text();

    const match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const title = match && !match[1].includes("Daily Readings") ? match[1].trim() : "Sunday title not found";

    res.status(200).json({ title });
  } catch (err) {
    console.error("❌ Error fetching Sunday title:", err);
    res.status(500).json({ error: "Failed to fetch Sunday title." });
  }
}
