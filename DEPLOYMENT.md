# Intelligent Calendar Web App Deployment Guide

This document provides instructions for deploying the Intelligent Calendar web application to various free hosting platforms.

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications, as it's built by the same team.

#### Steps:

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```
4. Navigate to your project directory and deploy:
   ```bash
   cd IntelligentCalendarWebApp
   vercel
   ```
5. Follow the prompts to complete deployment
6. Your app will be available at a URL like: `https://intelligent-calendar.vercel.app`

### 2. Hugging Face Spaces

Hugging Face Spaces provides free hosting for web applications.

#### Steps:

1. Create a Hugging Face account at [huggingface.co](https://huggingface.co)
2. Go to [huggingface.co/spaces](https://huggingface.co/spaces) and click "Create new Space"
3. Choose "Static HTML" as the Space SDK
4. Connect your GitHub repository or upload files directly
5. For manual upload:
   - Build your Next.js app: `npm run build && npm run export`
   - Upload the contents of the `out` directory

### 3. Netlify

Netlify is another excellent option for hosting static websites and web applications.

#### Steps:

1. Create a Netlify account at [netlify.com](https://netlify.com)
2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Login to Netlify:
   ```bash
   netlify login
   ```
4. Build your Next.js app:
   ```bash
   npm run build
   ```
5. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

## Local Development

To run the application locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Calendar View**: Interactive calendar with day, week, month, and agenda views
- **NLP Event Creation**: Add events using natural language (e.g., "Team meeting tomorrow at 3pm")
- **OCR Image Processing**: Extract events from images of schedules, tickets, or flyers
- **Event Management**: Create, edit, and delete events with various properties
- **Dark/Light Mode**: Toggle between dark and light themes

## Technologies Used

- Next.js 14
- React
- Tailwind CSS
- React Big Calendar
- Local Storage for data persistence
