# Samar Abbas — Public Academic Portfolio + Groq Chatbot

Upload this Node.js app to a GitHub repository and deploy it as a **Web Service** on [Render](https://render.com). The service must not be deployed as a static site, because live Groq chatbot queries need a server-side API key.

## Simplified deployment

1. Upload the complete contents of this directory to a GitHub repo, preserving folders.
2. Go to [Render Dashboard](https://dashboard.render.com/) → New → Web Service → connect the repository.
3. Choose **Free**, set `Build command: npm install`, `Start command: npm start`.
4. Under Environment Variables, set `GROQ_API_KEY` to a newly generated Groq key. Do not place the key in the repository. Optionally set `GROQ_MODEL=openai/gpt-oss-20b`.
5. Click **Deploy**. Render will generate a browser link of the form `https://your-app-name.onrender.com`.

## Notes

- Ten tabs are presented in a single horizontal row on desktop, and horizontal swipe on smaller screens.
- The portfolio and bilingual demo chatbot work without a key. The real Groq chatbot requires a server-side key and streams token responses.
- Free Render apps may sleep after inactivity and are intended for evaluation or personal projects, not guaranteed availability.
- Avoid publishing unverified CV claims or sensitive contact information. The resume download in `public/assets` is publicly accessible after deployment.
- Please revoke any Groq API key previously shared in messages and create a new one before deployment.
- The sample `render.yaml` provides an optional configuration for Render Blueprints.
