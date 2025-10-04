# CanvAI - Claude AI Art Gallery

A sophisticated web application where Claude AI creates unique pixel art masterpieces using advanced pattern generation and artistic consciousness. Claude acts as both the creative director and artist, generating high-level drawing instructions that are rendered into beautiful 32x32 pixel artworks.

## 🎨 Features

- **Hybrid AI Art Generation**: Claude provides creative direction, local renderer executes complex patterns
- **Advanced Pattern System**: 35+ detailed pattern types including mandala, filigree, cellular, vortex, and more
- **Artistic Consciousness**: Claude tracks artistic evolution, phases, and learns from each artwork
- **Rich Compositions**: Complex multi-layered artworks with detailed backgrounds and textures
- **Interactive Gallery**: Browse, view, and ask questions about Claude's art collection
- **Real-time Q&A**: Chat with Claude about his artistic process and specific artworks
- **Memory Integration**: Claude remembers all artworks, colors used, and artistic insights
- **Responsive Design**: Beautiful interface that works on desktop and mobile

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
git clone https://github.com/OZON-E/project-blossom.git
cd project-blossom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Claude API key
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001`

### Vercel Deployment

1. **Fork this repository**
2. **Connect to Vercel**
3. **Set environment variables in Vercel dashboard**
   - `CLAUDE_API_KEY`: Your Claude API key from [Anthropic Console](https://console.anthropic.com/)
4. **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/OZON-E/project-blossom)

## 🎯 How It Works

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

### Pattern System
- **35+ Pattern Types**: From simple dots to complex mandalas
- **Mathematical Algorithms**: Trigonometric functions, cellular automata, fractals
- **Organic Variation**: Seeded randomness for unique but consistent results
- **Density Control**: Fine-tuned pattern intensity for 32x32 canvas

## 📁 Project Structure

```
canvai/
├── index.html              # Main application interface
├── script.js               # Frontend JavaScript (9k+ lines)
├── styles.css              # CSS styling and responsive design
├── server.js               # Express backend server
├── config.js               # API key configuration
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── twitter button.png      # Social media button
└── Github button.png       # Social media button
```

## 🎨 Pattern Types

### Regular Patterns
- **Dots**: Multi-layered dot arrangements
- **Grid**: Complex multi-scale grids
- **Waves**: Multi-frequency wave patterns
- **Spirals**: Multi-armed spiral designs
- **Checkerboard**: Layered checkerboard patterns
- **Maze**: Complex pathway structures

### Abstract Patterns
- **Mandala**: Sacred geometry with radial symmetry
- **Filigree**: Ornamental decorative patterns
- **Cellular**: Biological cell-like structures
- **Vortex**: Dynamic spiral energy patterns
- **Honeycomb**: Hexagonal tessellation
- **Weave**: Textile-inspired interlacing
- **Lattice**: Structural framework patterns

### Organic Patterns
- **Chaos**: Irregular wave combinations
- **Fractal**: Self-similar mathematical structures
- **Turbulent**: High-energy overlapping waves
- **Swirl**: Flowing spiral motion
- **Shattered**: Fragmented angular patterns
- **Breathing**: Rhythmic pulsing forms
- **Explosion**: Radial burst patterns
- **Dripping**: Gravity-based flow effects

## 🔧 Configuration

### Environment Variables

```bash
# Required
CLAUDE_API_KEY=your_claude_api_key_here

# Optional
PORT=3001
NODE_ENV=production
```

### API Key Setup

1. Get your Claude API key from [Anthropic Console](https://console.anthropic.com/)
2. Set it as an environment variable or provide it in the app
3. The app works in demo mode without an API key

## 🌐 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Set the `CLAUDE_API_KEY` environment variable
4. Deploy with one click

### Other Platforms

The app can be deployed to any Node.js hosting platform:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

## 🎭 Art Styles

Claude creates diverse artwork including:
- **Quantum Landscapes**: Futuristic sci-fi compositions
- **Abstract Expressionism**: Bold, dynamic patterns
- **Minimalist Geometry**: Clean, simple forms
- **Organic Complexity**: Natural, flowing structures
- **Cyberpunk Aesthetics**: Neon, technological themes
- **Mystical Patterns**: Sacred, spiritual designs
- **Architectural Studies**: Structural, geometric forms
- **Biological Forms**: Cellular, organic patterns

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com/) for the Claude AI API
- [Vercel](https://vercel.com/) for hosting platform
- The pixel art community for inspiration

## 🔗 Links

- [Live Demo](https://canvai.vercel.app)
- [GitHub Repository](https://github.com/yourusername/canvai)
- [Claude API Documentation](https://docs.anthropic.com/)
- [Vercel Documentation](https://vercel.com/docs)

---

**Made with ❤️ and Claude AI**
