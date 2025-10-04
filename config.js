// Claude API Configuration
// Get your API key at: https://console.anthropic.com/

// Browser-compatible configuration
const CLAUDE_API_KEY = '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';

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLAUDE_API_KEY };
} else {
    // Make available globally in browser
    window.CLAUDE_API_KEY = CLAUDE_API_KEY;
}
