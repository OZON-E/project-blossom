const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// Serve static files explicitly with proper MIME types and cache busting
app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.get('/config.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'config.js'));
});

// Serve image files explicitly
app.get('/blossompix.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, 'blossompix.png'));
});

app.get('/twitter button.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, 'twitter button.png'));
});

app.get('/Github button.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, 'Github button.png'));
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to generate art using Claude
app.post('/api/generate-art', async (req, res) => {
    console.log('POST /api/generate-art endpoint hit');
    try {
        console.log('Received request:', req.body);
        const { prompt, apiKey } = req.body;
        
        // Use server-side API key if client doesn't provide one
        const serverApiKey = process.env.CLAUDE_API_KEY || require('./config.js').CLAUDE_API_KEY;
        const finalApiKey = apiKey && apiKey !== 'YOUR_CLAUDE_API_KEY_HERE' ? apiKey : serverApiKey;
        
        if (!finalApiKey || finalApiKey === 'YOUR_CLAUDE_API_KEY_HERE') {
            return res.status(400).json({ 
                error: 'Claude API key not configured. Please set CLAUDE_API_KEY environment variable or provide API key.' 
            });
        }
        
        if (!prompt) {
            return res.status(400).json({ 
                error: 'Prompt not provided' 
            });
        }

        // Make request to Claude API
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': finalApiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-haiku-20241022',
                max_tokens: 4000,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!claudeResponse.ok) {
            const errorData = await claudeResponse.text();
            console.error('Claude API error:', errorData);
            return res.status(claudeResponse.status).json({ 
                error: `Claude API error: ${claudeResponse.status}` 
            });
        }

        const claudeData = await claudeResponse.json();
        const content = claudeData.content[0].text;
        
        console.log('Claude response content:', content);
        
        res.json({ 
            success: true, 
            content: content 
        });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Internal server error: ' + error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'CanvAI Backend Server is running' 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 CanvAI Backend Server running on http://localhost:${PORT}`);
        console.log(`📱 Open your browser and navigate to http://localhost:${PORT}`);
        console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

module.exports = app;
