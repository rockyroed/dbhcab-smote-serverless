import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from 'node-fetch';

const handler = async (req: VercelRequest, res: VercelResponse) => {
	if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version");
        res.setHeader("Access-Control-Max-Age", "3600");
        return res.status(204).end();
    }

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const data = req.body;
		const hateSpeechApi = process.env.HATE_SPEECH_HCABSMOTE_API;
		
		if (!hateSpeechApi) {
			throw new Error("HATE_SPEECH_HCABSMOTE_API environment variable is not set.");
		}
		
		const response = await fetch(hateSpeechApi, {
			headers: {
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify(data)
		});
		
		if (!response.ok) {
			// Log the full response text if the request fails
			const errorText = await response.text();
			throw new Error(`API request failed with status ${response.status}, Response: ${errorText}`);
		}

		const result = await response.json();

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ error: `Internal server error: ${error.message}` });
	}
}

export default handler;
