# AI CashFlow Pro 🚀
AI-Powered Financial Intelligence Platform for Enterprise & Personal Statements.

This project is built using a modern fullstack architecture: **React 19 + TypeScript + Vite + Express** and is powered by the **Google Gemini API**.

---

## ⚠️ VS Code में Red Lines (Errors) क्यों आ रही हैं? (Hindi / Hinglish Help)

अगर आपने इस प्रोजेक्ट को VS Code में खोला है और आपको `.tsx` फ़ाइलों में बहुत सारे **Red Squiggles (लाल रंग की लाइनें under code)** या errors दिख रहे हैं, तो **gabraiye mat (घबराएं नहीं)!** यह कोई कोडिंग एरर नहीं है।

ऐसा इसलिए हो रहा है क्योंकि आपने अभी तक **Dependencies (Packages)** इंस्टॉल नहीं की हैं। जब आप पहली बार कोई React + TypeScript प्रोजेक्ट खोलते हैं, तो VS Code को लाइब्रेरीज़ (जैसे `react`, `lucide-react`, `motion`, `recharts` आदि) नहीं मिलतीं जब तक आप `npm install` न कर लें।

इसे **फिक्स करने के लिए नीचे दिए गए Steps को फॉलो करें:**

### Step 1: Open Terminal (टर्मिनल खोलें)
VS Code में ऊपर मेनू से `Terminal -> New Terminal` पर क्लिक करें (या शॉर्टकट दबाएं: `` Ctrl + ` `` या `` Cmd + ` ``).

### Step 2: Install Dependencies (पैकेज इंस्टॉल करें)
टर्मिनल में नीचे दी गई कमांड लिखें और **Enter** दबाएं:
```bash
npm install
```
*यह कमांड इंटरनेट से सभी ज़रूरी फाइलों को डाउनलोड करके `node_modules` फोल्डर बना देगी। इसे पूरा होने में 1-2 मिनट लग सकते हैं। इसके बाद आपकी VS Code की सारी Red/Error lines अपने आप गायब हो जाएंगी!*

### Step 3: API Key Setup (.env फ़ाइल)
प्रोजेक्ट के रूट फोल्डर में एक नई फ़ाइल बनाएं जिसका नाम रखें `.env` और उसमें अपनी Gemini API Key डालें:
```env
GEMINI_API_KEY="आपकी-असली-GEMINI-API-KEY-यहाँ-डालें"
```

### Step 4: Run the App (ऐप को स्थानीय रूप से चालू करें)
अब टर्मिनल में ऐप को स्टार्ट करने के लिए चलाएं:
```bash
npm run dev
```
अब आपका सर्वर local machine पर चालू हो जाएगा। ब्राउज़र में `http://localhost:3000` खोलें और आपका शानदार **AI CashFlow Pro** प्रोजेक्ट चलने लगेगा!

---

## Quick Setup Instructions (English)

If you have just opened this project in VS Code, you might see many red squiggly lines inside the `.tsx` files. **This is completely normal and expected** because the dependencies are not installed yet in your local environment.

Follow these simple steps to set up and run the project locally on your machine error-free:

### Prerequisites
Make sure you have [Node.js (LTS version recommended)](https://nodejs.org/) installed on your computer.

### Step 1: Install packages
Open your terminal in VS Code and run:
```bash
npm install
```
This will fetch all required libraries (`react`, `@google/genai`, `motion`, `lucide-react`, etc.) into your local workspace. All IDE errors will disappear instantly!

### Step 2: Configure Environment Secret Variables
Create a file named `.env` at the root of the project and add your Google Gemini API key:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

### Step 3: Run the app locally
Start the local full-stack server using:
```bash
npm run dev
```
Now, navigate to **`http://localhost:3000`** in your browser to view and interact with **AI CashFlow Pro**!

---

## Project Structure
- `src/App.tsx` - The primary executive dashboard view with visual tab rails.
- `src/components/` - High-fidelity subcomponents like charts, insights, transactions, and chatbot assistant.
- `server.ts` - Express backend proxy server that manages database loading, file storage (`/data/db.json`), and interacts with the Gemini API safely.
- `zip_project.py` - Short helper script to zip the project directories cleanly if needed.

## Zipping the project cleanly via Python
If you want to zip this project manually dynamically from terminal:
```bash
python zip_project.py
```
This will generate `ai_cashflow_pro.zip` in your working directory. Ensure your terminal is matching the location of this directory! (e.g. `cd AI-CashFlow-Pro`).
