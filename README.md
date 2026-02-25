# AI Story Generator 🚀

## Deploy karne ke steps (sirf ek baar!)

### Step 1 — Groq API Key banao (Free, 2 min)
1. https://console.groq.com jaao
2. Sign Up karo (Google se bhi ho sakta hai)
3. Left menu mein "API Keys" click karo
4. "Create API Key" click karo
5. Key copy karo (gsk_ se shuru hogi)

### Step 2 — Vercel pe Deploy karo (Free, 3 min)
1. https://vercel.com jaao → Sign Up (GitHub se)
2. "Add New Project" click karo
3. "Upload Files" ya drag & drop karo ye folder
4. Deploy se PEHLE — "Environment Variables" mein jaao:
   - Name:  GROQ_API_KEY
   - Value: gsk_xxxxx (apni key paste karo)
5. "Deploy" click karo
6. Link mil jayega! ✅

## Project Structure
```
story-app/
├── index.html      → Beautiful frontend UI
├── api/
│   └── generate.js → Backend (Groq API call)
└── vercel.json     → Vercel config
```

## Features
- 6 Genres: Adventure, Comedy, Mystery, Sci-Fi, Horror, Romance
- 3 Lengths: Short / Medium / Long
- Copy story button
- Works on mobile too!
- Dark theme with animations
