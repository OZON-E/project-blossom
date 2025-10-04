# Deployment Guide

## Vercel Deployment (Recommended)

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/canvai)

### Manual Deploy

1. **Fork this repository** on GitHub
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your forked repository

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add: `CLAUDE_API_KEY` = `your_claude_api_key_here`
   - Get your API key from [Anthropic Console](https://console.anthropic.com/)

4. **Deploy**:
   - Click "Deploy" button
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

## Other Deployment Platforms

### Railway
1. Connect GitHub repository
2. Set `CLAUDE_API_KEY` environment variable
3. Deploy automatically

### Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy with auto-deploy on push

### Heroku
1. Create Heroku app
2. Connect GitHub repository
3. Set config vars
4. Deploy

## Environment Variables

Required:
- `CLAUDE_API_KEY`: Your Claude API key from Anthropic

Optional:
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (production/development)

## Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/canvai.git
cd canvai

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your API key

# Start development server
npm start
```

## Troubleshooting

### API Key Issues
- Ensure your Claude API key is valid
- Check that the environment variable is set correctly
- Verify the API key has sufficient credits

### CORS Issues
- The backend handles CORS automatically
- No additional configuration needed

### Build Issues
- Ensure Node.js 16+ is installed
- Check that all dependencies are installed
- Verify environment variables are set

## Production Considerations

- Set `NODE_ENV=production` for optimal performance
- Use HTTPS in production
- Monitor API usage and costs
- Consider rate limiting for high traffic
