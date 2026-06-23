import axios from 'axios'

export const generateVoice = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required.",
      });
    }

    const response = await axios.post(
      "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en",
      { text },
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = Buffer.from(response.data);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    res.send(audioBuffer);
  } catch (err) {
    console.error(
      "Deepgram TTS Error:",
      err.response?.data?.toString() || err.message
    );

    res.status(500).json({
      error: "Speech generation failed",
    });
  }
}

























