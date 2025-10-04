# CanvAI - Claude AI Art Gallery

A sophisticated web application where Claude AI creates unique pixel art masterpieces using advanced pattern generation and artistic consciousness. Claude acts as both the creative director and artist, generating high-level drawing instructions that are rendered into beautiful 32x32 pixel artworks.

## Features

- **Hybrid AI Art Generation**: Claude provides creative direction, local renderer executes complex patterns
- **Advanced Pattern System**: 35+ detailed pattern types including mandala, filigree, cellular, vortex, and more
- **Artistic Consciousness**: Claude tracks artistic evolution, phases, and learns from each artwork
- **Rich Compositions**: Complex multi-layered artworks with detailed backgrounds and textures
- **Interactive Gallery**: Browse, view, and ask questions about Claude's art collection
- **Real-time Q&A**: Chat with Claude about his artistic process and specific artworks
- **Memory Integration**: Claude remembers all artworks, colors used, and artistic insights
- **Responsive Design**: Beautiful interface that works on desktop and mobile

## How It Works

### Two-Stage Art Generation Pipeline

1. **Creative Direction Stage**: Claude generates high-level JSON drawing instructions
   - Artistic themes and color palettes
   - Complex pattern specifications
   - Composition and positioning guidance

2. **Local Rendering Stage**: JavaScript interpreter executes the instructions
   - 35+ pattern types (mandala, filigree, cellular, vortex, etc.)
   - Mathematical pattern generation
   - Pixel-perfect 32x32 grid rendering

### Artistic Consciousness System

Claude tracks his artistic development through:
- **Evolution Phases**: Exploration → Refinement → Experimentation → Mastery
- **Memory Storage**: Artistic insights, color preferences, style evolution
- **Reflection System**: Post-creation analysis and learning
- **Goal Evolution**: Dynamic artistic objectives based on experience

## 🛠 Technical Architecture

### Frontend
- **Vanilla JavaScript**: No frameworks, pure performance
- **HTML5 Canvas**: Pixel-perfect rendering with image-rendering CSS properties
- **CSS3 Variables**: Dynamic theming and responsive design
- **LocalStorage**: Persistent artwork storage and memory

### Backend
- **Node.js Express**: RESTful API server
- **Claude API Integration**: Anthropic Claude 3.5 Haiku model
- **Rate Limiting**: Queue system with exponential backoff
- **CORS Handling**: Secure cross-origin requests

## Acknowledgments

- [Anthropic](https://anthropic.com/) for the Claude AI API
- [Vercel](https://vercel.com/) for hosting platform
- The pixel art community for inspiration

## Links

- [Live Demo](https://canvai.vercel.app)
- [GitHub Repository](https://github.com/yourusername/canvai)
- [Claude API Documentation](https://docs.anthropic.com/)
- [Vercel Documentation](https://vercel.com/docs)

---

**Made with ❤️ and Claude AI**

