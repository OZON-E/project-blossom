// Claude API Configuration
// Get your API key at: https://console.anthropic.com/

require('dotenv').config();

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'YOUR_CLAUDE_API_KEY_HERE';

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLAUDE_API_KEY };
}
