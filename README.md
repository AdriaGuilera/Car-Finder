# Car Finder Website

My first approach to working with Google's Gemini AI! This project uses Gemini Vision AI to analyze car images and provide detailed information about them.

## Features
- Upload car images for instant analysis
- Get detailed information about:
  - Car make and model
  - Manufacturing year range
  - Estimated price range
  - Performance specs (HP, top speed)
  - Rarity assessment

## Tech Stack
- Frontend: React
- Backend: Flask
- AI: Google Gemini 1.5 Flash

## Setup
1. Clone the repository
2. Install dependencies:
   ```
   # Backend
   pip install -r requirements.txt

   # Frontend
   npm install
   ```
3. Create a `.env` file in the api folder with your Gemini API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
4. Run the application:
   ```
   # Backend
   python analyze.py

   # Frontend
   npm run dev
   ```

## Learning Experience
This project represents my first dive into the world of AI image analysis using Google's Gemini AI, while also strengthening my React development skills. It's been an exciting journey learning how to integrate AI capabilities into a web application!

## Aditional INFO
In case of deployment, linking between between fronted and backend through the API will neeed to be modified. (analize.py & vite.config.ts)


