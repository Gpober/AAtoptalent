# AI Recruiter Setup Guide

The AI Recruiter is an intelligent chat assistant powered by Claude (Anthropic) that helps you with recruiting tasks, candidate matching, and pipeline management.

## Features

- 💬 Interactive chat interface accessible from any dashboard page
- 🤖 Powered by Claude 3.5 Sonnet for intelligent responses
- 📊 Access to your recruiting pipeline data (candidates, companies, jobs, applications)
- 🎯 Helps with candidate matching, sourcing, and screening
- 💡 Provides recruitment best practices and advice

## Setup Instructions

### 1. Get Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **Settings > API Keys**
4. Create a new API key and copy it

### 2. Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist):
   ```bash
   cp .env.example .env.local
   ```

2. Add your Anthropic API key to `.env.local`:
   ```env
   ANTHROPIC_API_KEY="your-actual-api-key-here"
   ```

3. Make sure `.env.local` is in your `.gitignore` (it should be by default)

### 3. Install Dependencies (if not already done)

```bash
npm install
```

The `@anthropic-ai/sdk` package is already included in package.json.

### 4. Restart Your Development Server

```bash
npm run dev
```

## Usage

1. Navigate to any page in the dashboard
2. Look for the blue bot icon in the bottom-right corner
3. Click the icon to open the chat interface
4. Start asking questions! Examples:
   - "How many candidates do we have?"
   - "What's the status of our open positions?"
   - "Help me match candidates for a software engineering role"
   - "What are best practices for phone screening?"

## How It Works

The AI Recruiter:
- Uses Claude 3.5 Sonnet for natural language understanding
- Has access to your real-time recruiting pipeline statistics
- Maintains conversation context throughout the chat session
- Provides helpful, professional recruiting assistance

## API Endpoint

The chat functionality is powered by `/api/chat` which:
- Accepts POST requests with conversation history
- Fetches current pipeline statistics from your database
- Sends the conversation to Claude API
- Returns intelligent responses based on your data

## Troubleshooting

**Error: "Anthropic API key is not configured"**
- Make sure you've added `ANTHROPIC_API_KEY` to your `.env.local` file
- Restart your development server after adding the key

**Error: "Invalid Anthropic API key"**
- Double-check that you copied the complete API key
- Ensure there are no extra spaces or quotes
- Verify the key is active in your Anthropic Console

**No response from AI**
- Check your browser console for errors
- Verify your API key has sufficient credits
- Check the server logs for detailed error messages

## Cost Considerations

The AI Recruiter uses Claude 3.5 Sonnet which has the following pricing:
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens

Typical chat messages use ~100-500 tokens, so costs are minimal for regular use.

## Future Enhancements

Planned features:
- Advanced candidate search and filtering
- Job matching recommendations
- Interview scheduling assistance
- Resume parsing and analysis
- Automated candidate outreach suggestions
