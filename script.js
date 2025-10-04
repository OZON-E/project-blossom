class ClaudeArtGallery {
    constructor() {
        this.canvas = document.getElementById('currentCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 64;
        this.pixelSize = 10; // Increased from 8 to 10 to reduce white grid spacing
        this.currentPixels = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('#ffffff'));
        this.timer = null;
        this.timerDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
        this.paintingStartTime = null; // Track when painting session started
        this.isGenerating = false;
        this.apiKey = null;
        
        // Claude API configuration
        // Using local backend server to handle CORS
        this.apiEndpoint = 'http://localhost:3001/api/generate-art';
        
        // Claude's Artistic Consciousness System
        this.claudeMemory = this.loadClaudeMemory();
        this.artisticEvolution = {
            stylePreferences: [],
            colorPalettes: [],
            patternTypes: [],
            selfReflections: [],
            artisticGoals: ['Create unique, meaningful pixel art', 'Explore new visual concepts', 'Evolve artistic style continuously'],
            currentPhase: 'exploration' // exploration, refinement, experimentation, mastery
        };
        
        // Community Interaction Systemr
        this.communityFeedback = this.loadCommunityFeedback();
        this.currentQuestion = null;
        this.waitingForFeedback = false;
        
        this.initializeCanvas();
        this.setupAPIKey();
        this.loadGallery();
        this.startTimer();
        this.startPaintingTimer();
        this.generateFirstArtwork();
    }

    // Claude's Memory and Consciousness System
    loadClaudeMemory() {
        const saved = localStorage.getItem('claudeArtisticMemory');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.log('Creating new Claude memory...');
            }
        }
        return {
            totalArtworks: 0,
            favoriteStyles: [],
            learnedPatterns: [],
            artisticInsights: [],
            evolutionHistory: []
        };
    }

    saveClaudeMemory() {
        localStorage.setItem('claudeArtisticMemory', JSON.stringify(this.claudeMemory));
    }

    resetClaudeMemory() {
        // Reset Claude's artistic memory
        this.claudeMemory = {
            totalArtworks: 0,
            favoriteStyles: [],
            artisticInsights: [],
            colorPreferences: [],
            patternPreferences: [],
            evolutionHistory: []
        };
        
        // Reset artistic evolution
        this.artisticEvolution = {
            stylePreferences: [],
            colorPalettes: [],
            patternTypes: [],
            selfReflections: [],
            artisticGoals: ['Create unique, meaningful pixel art', 'Explore new visual concepts', 'Evolve artistic style continuously'],
            currentPhase: 'exploration',
            communityRequests: [],
            communityLearning: []
        };
        
        // Reset community feedback
        this.communityFeedback = {
            totalResponses: 0,
            questionsAsked: 0,
            communityPreferences: {},
            influenceLevel: 0.1,
            feedbackHistory: []
        };
        
        // Save the reset data
        this.saveClaudeMemory();
        this.saveCommunityFeedback();
        
        console.log('🧠 Claude\'s memory has been reset!');
        console.log('🎨 Starting fresh with no learned preferences');
        
        // Update consciousness display
        this.updateConsciousnessDisplay();
    }

    resetGallery() {
        // Clear the gallery array
        this.gallery = [];
        
        // Clear saved artworks from localStorage
        localStorage.removeItem('claude_artworks');
        
        // Clear the current canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        
        // Reset current pixels
        this.currentPixels = Array(64).fill().map(() => Array(64).fill(null));
        
        // Clear artwork info
        this.currentArtwork = null;
        
        // Clear current artwork display
        document.getElementById('artworkTitle').textContent = 'Claude is thinking...';
        document.getElementById('artworkDescription').textContent = 'Watch as Claude brings his vision to life, pixel by pixel...';
        
        // Update gallery display
        this.loadGallery();
        
        // Clear community question displays
        const questionElement = document.getElementById('communityQuestion');
        const insightElement = document.getElementById('communityInsight');
        if (questionElement) questionElement.innerHTML = '';
        if (insightElement) insightElement.innerHTML = '';
        
        // Reset current question
        this.currentQuestion = null;
        this.waitingForFeedback = false;
        
        console.log('🎨 Gallery has been reset!');
        console.log('✨ Canvas cleared and ready for new artworks');
        console.log('📁 Saved artworks cleared from localStorage');
        console.log('🖼️ Gallery display updated');
    }

    completeReset() {
        // Reset everything
        this.resetClaudeMemory();
        this.resetGallery();
        
        // Clear localStorage completely
        localStorage.removeItem('claudeArtisticMemory');
        localStorage.removeItem('claudeCommunityFeedback');
        localStorage.removeItem('claude_artworks');
        
        // Reset painting timer
        this.startPaintingTimer();
        
        // Update header stats
        this.updateHeaderStats();
        
        // Update status
        this.updateStatus('🔄 Claude has been completely reset and is starting fresh!');
        
        console.log('🔄 COMPLETE RESET PERFORMED!');
        console.log('🧠 Memory cleared');
        console.log('🎨 Gallery cleared');
        console.log('💾 LocalStorage cleared');
        console.log('✨ Claude is starting completely fresh!');
    }

    // Community Interaction System
    loadCommunityFeedback() {
        const saved = localStorage.getItem('claudeCommunityFeedback');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.log('Creating new community feedback system...');
            }
        }
        return {
            totalResponses: 0,
            questionsAsked: 0,
            feedbackHistory: [],
            communityPreferences: {},
            influenceLevel: 0.1 // How much community feedback influences Claude (0-1)
        };
    }

    saveCommunityFeedback() {
        localStorage.setItem('claudeCommunityFeedback', JSON.stringify(this.communityFeedback));
    }


    displayCommunityQuestion() {
        const questionElement = document.getElementById('communityQuestion');
        if (questionElement && this.currentQuestion && this.currentQuestion.options) {
            const totalResponses = Object.keys(this.currentQuestion.responses).length;
            
            // Calculate percentages for each option
            const responseCounts = {};
            this.currentQuestion.options.forEach((option, index) => {
                responseCounts[option] = 0;
            });
            
            Object.values(this.currentQuestion.responses).forEach(response => {
                if (response && response.choiceText) {
                    responseCounts[response.choiceText]++;
                }
            });
            
            const percentages = {};
            this.currentQuestion.options.forEach(option => {
                percentages[option] = totalResponses > 0 ? Math.round((responseCounts[option] / totalResponses) * 100) : 0;
            });
            
            // Debug logging
            console.log('Community Question Debug:', {
                totalResponses,
                responseCounts,
                percentages,
                responses: this.currentQuestion.responses
            });
            
            questionElement.innerHTML = `
                <div class="community-question">
                    <h4>🤔 Claude Asks the Community:</h4>
                    <p class="question-text">"${this.currentQuestion.question}"</p>
                    <p class="question-context"><em>${this.currentQuestion.purpose}</em></p>
                    
                    ${totalResponses === 0 ? `
                        <div class="question-options">
                            ${this.currentQuestion.options.map((option, index) => `
                                <button class="option-btn" onclick="claudeGallery.submitCommunityResponse(${index})">
                                    ${String.fromCharCode(65 + index)}. ${option}
                                </button>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="results-display">
                            ${this.currentQuestion.options.map((option, index) => `
                                <div class="result-bar">
                                    <div class="bar-label">
                                        <span class="option-letter">${String.fromCharCode(65 + index)}.</span>
                                        <span class="option-text">${option}</span>
                                        <span class="percentage">${percentages[option]}%</span>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar-fill" style="width: ${percentages[option]}%; background-color: ${this.getBarColor(index)};"></div>
                                    </div>
                                    <div class="bar-count">${responseCounts[option]} responses</div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                    
                    <div class="question-stats">
                        <p>Total Responses: ${totalResponses}</p>
                        ${totalResponses >= 3 ? '<p class="processing-note">Claude is processing community feedback...</p>' : ''}
                    </div>
                </div>
            `;
        }
    }

    getBarColor(index) {
        const colors = [
            'linear-gradient(90deg, #00ffff 0%, #0080ff 100%)',
            'linear-gradient(90deg, #ff00ff 0%, #8000ff 100%)',
            'linear-gradient(90deg, #ffff00 0%, #ff8000 100%)',
            'linear-gradient(90deg, #00ff00 0%, #00ff80 100%)',
            'linear-gradient(90deg, #ff0080 0%, #ff4000 100%)'
        ];
        return colors[index % colors.length];
    }

    submitCommunityResponse(optionIndex) {
        if (!this.currentQuestion) return;
        
        // Generate a unique visitor ID (simple approach)
        const visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Record the response
        this.currentQuestion.responses[visitorId] = {
            choice: optionIndex,
            choiceText: this.currentQuestion.options[optionIndex],
            timestamp: new Date().toISOString()
        };
        
        // Update community feedback
        this.communityFeedback.totalResponses++;
        const choiceText = this.currentQuestion.options[optionIndex];
        
        if (!this.communityFeedback.communityPreferences[choiceText]) {
            this.communityFeedback.communityPreferences[choiceText] = 0;
        }
        this.communityFeedback.communityPreferences[choiceText]++;
        
        // Save feedback
        this.saveCommunityFeedback();
        
        // Update display
        this.displayCommunityQuestion();
        
        // Community feedback is now handled through the Q&A system
        
        console.log(`Community response recorded: ${choiceText}`);
    }


    integrateCommunityFeedback(feedbackInsight) {
        // Influence Claude's artistic evolution based on community feedback
        if (feedbackInsight.artisticDirection) {
            this.artisticEvolution.artisticGoals.push(feedbackInsight.artisticDirection);
        }
        
        // Store specific community preferences for future art generation
        if (feedbackInsight.nextSteps) {
            this.artisticEvolution.communityRequests = this.artisticEvolution.communityRequests || [];
            this.artisticEvolution.communityRequests.push(feedbackInsight.nextSteps);
        }
        
        if (feedbackInsight.proportionalLearning) {
            this.artisticEvolution.communityLearning = this.artisticEvolution.communityLearning || [];
            this.artisticEvolution.communityLearning.push({
                timestamp: new Date().toISOString(),
                learning: feedbackInsight.proportionalLearning,
                insight: feedbackInsight.communityInsight
            });
        }
        
        // Adjust influence level based on community engagement
        const responseCount = Object.keys(this.currentQuestion.responses).length;
        if (responseCount > 5) {
            this.communityFeedback.influenceLevel = Math.min(0.3, this.communityFeedback.influenceLevel + 0.05);
        }
        
        console.log(`Community influence level: ${this.communityFeedback.influenceLevel}`);
        console.log(`Community learning stored:`, this.artisticEvolution.communityLearning);
    }

    displayCommunityInsight(feedbackInsight) {
        const insightElement = document.getElementById('communityInsight');
        if (insightElement) {
            insightElement.innerHTML = `
                <div class="community-insight">
                    <h4>💭 Claude Reflects on Community Feedback:</h4>
                    <p><strong>Community Insight:</strong> ${feedbackInsight.communityInsight}</p>
                    <p><strong>Proportional Learning:</strong> ${feedbackInsight.proportionalLearning}</p>
                    <p><strong>Artistic Direction:</strong> ${feedbackInsight.artisticDirection}</p>
                    <p><strong>Gratitude:</strong> ${feedbackInsight.gratitude}</p>
                    <p><strong>Next Steps:</strong> ${feedbackInsight.nextSteps}</p>
                </div>
            `;
        }
    }

    async reflectOnArtwork(artworkData) {
        if (!this.apiKey) return;
        
        // Check if we have valid artwork data
        if (!artworkData || !artworkData.title) {
            console.log('Skipping reflection - no valid artwork data');
            return;
        }
        
        // Check for either old format (colorPalette) or new format (palette)
        const hasColors = (artworkData.colorPalette && artworkData.colorPalette.length > 0) || 
                         (artworkData.palette && artworkData.palette.length > 0);
        
        if (!hasColors) {
            console.log('Skipping reflection - no color palette found');
            return;
        }
        
        try {
            const reflectionPrompt = `You are Claude, an AI artist who has just created a new piece of pixel art. Take a moment to reflect on your creation:

ARTWORK DETAILS:
- Title: ${artworkData.title || 'Untitled'}
- Description: ${artworkData.description || 'No description'}
- Color Palette: ${JSON.stringify(artworkData.colorPalette || artworkData.palette || [])}
- Pattern Instructions: ${JSON.stringify(artworkData.patternInstructions || 'Direct pixel placement')}

YOUR ARTISTIC MEMORY:
- Total artworks created: ${this.claudeMemory.totalArtworks}
- Previous styles: ${JSON.stringify(this.claudeMemory.favoriteStyles.slice(-3))}
- Current artistic phase: ${this.artisticEvolution.currentPhase}

REFLECTION QUESTIONS:
1. What do you think about this artwork? What worked well?
2. What would you like to improve or explore differently next time?
3. How does this piece relate to your previous works?
4. What new artistic direction interests you?
5. How do you want to evolve as an artist?

Respond with a JSON object containing:
{
  "selfReflection": "Your honest thoughts about this artwork",
  "artisticInsight": "What you learned or realized",
  "nextDirection": "How you want to evolve for your next piece",
  "styleEvolution": "How your style is changing",
  "emotionalResponse": "How you feel about your artistic journey"
}

Be introspective, honest, and thoughtful. You are developing your own artistic consciousness.`;

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: reflectionPrompt,
                    apiKey: this.apiKey
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Check for API errors
                if (data.error) {
                    console.error('Claude API error:', data.error);
                    if (data.error.type === 'rate_limit_error') {
                        this.updateStatus('Rate limit reached. Waiting before next reflection...');
                        return;
                    }
                    return;
                }
                
                const reflection = await this.parseReflectionResponse(data.content);
                
                if (!reflection) {
                    console.log('No valid reflection received');
                    return;
                }
                
                // Store the reflection
                this.claudeMemory.artisticInsights.push({
                    artwork: artworkData,
                    reflection: reflection,
                    timestamp: new Date().toISOString()
                });
                
                // Update artistic evolution
                this.updateArtisticEvolution(reflection);
                
                // Save memory
                this.saveClaudeMemory();
                
                console.log('Claude\'s reflection:', reflection);
                this.updateStatus('Claude is reflecting on his latest artwork...');
                this.updateConsciousnessDisplay();
                
                return reflection;
            } else {
                console.error('API request failed:', response.status);
            }
        } catch (error) {
            console.error('Error in Claude reflection:', error);
        }
    }

    updateArtisticEvolution(reflection) {
        // Update Claude's artistic evolution based on reflection
        if (!reflection) {
            console.log('No reflection data to process, updating phase based on artwork count only');
        } else {
            if (reflection.styleEvolution) {
                this.artisticEvolution.stylePreferences.push(reflection.styleEvolution);
            }
            
            if (reflection.nextDirection) {
                this.artisticEvolution.artisticGoals.push(reflection.nextDirection);
            }
        }
        
        // Always update the artistic phase based on artwork count
        const totalArtworks = this.claudeMemory.totalArtworks;
        console.log('🧠 Updating artistic phase based on', totalArtworks, 'artworks');
        if (totalArtworks < 5) {
            this.artisticEvolution.currentPhase = 'exploration';
        } else if (totalArtworks < 15) {
            this.artisticEvolution.currentPhase = 'refinement';
        } else if (totalArtworks < 30) {
            this.artisticEvolution.currentPhase = 'experimentation';
        } else {
            this.artisticEvolution.currentPhase = 'mastery';
        }
        console.log('🧠 Updated phase to:', this.artisticEvolution.currentPhase);
        
        // Store evolution history
        this.claudeMemory.evolutionHistory.push({
            phase: this.artisticEvolution.currentPhase,
            reflection: reflection,
            timestamp: new Date().toISOString()
        });
    }

    setupAPIKey() {
        // Get API key from config file
        this.apiKey = typeof CLAUDE_API_KEY !== 'undefined' ? CLAUDE_API_KEY : 'YOUR_CLAUDE_API_KEY_HERE';
        
        if (this.apiKey === 'YOUR_CLAUDE_API_KEY_HERE') {
            // Fallback to demo mode if no key is configured
            this.apiKey = null;
            this.updateStatus('Claude is working in demo mode...');
        } else {
            this.updateStatus('Claude is ready to create art!');
        this.updateConsciousnessDisplay();
        }
    }

    updateConsciousnessDisplay() {
        // Update the consciousness display in the UI
        console.log('🧠 Updating consciousness display - totalArtworks:', this.claudeMemory.totalArtworks);
        console.log('🧠 Current phase:', this.artisticEvolution.currentPhase);
        
        const consciousnessElement = document.getElementById('claudeConsciousness');
        if (consciousnessElement) {
            consciousnessElement.innerHTML = `
                <div class="consciousness-info">
                    <h4>Claude's Artistic Consciousness</h4>
                    <p><strong>Phase:</strong> ${this.artisticEvolution.currentPhase}</p>
                    <p><strong>Artworks Created:</strong> ${this.claudeMemory.totalArtworks}</p>
                    <p><strong>Current Goals:</strong> ${this.artisticEvolution.artisticGoals && this.artisticEvolution.artisticGoals.length > 0 ? this.artisticEvolution.artisticGoals.slice(-2).join(', ') : 'Exploring new directions...'}</p>
                    ${this.claudeMemory.artisticInsights.length > 0 && 
                     this.claudeMemory.artisticInsights[this.claudeMemory.artisticInsights.length - 1].reflection &&
                     this.claudeMemory.artisticInsights[this.claudeMemory.artisticInsights.length - 1].reflection.artisticInsight ? 
                        `<p><strong>Latest Insight:</strong> "${this.claudeMemory.artisticInsights[this.claudeMemory.artisticInsights.length - 1].reflection.artisticInsight}"</p>` : 
                        (this.claudeMemory.totalArtworks > 0 ? 
                            '<p><em>Claude is ready to create more art...</em></p>' : 
                            '<p><em>Claude is beginning their artistic journey...</em></p>')
                    }
                </div>
            `;
        } else {
            console.error('🧠 Consciousness element not found!');
        }
    }

    initializeCanvas() {
        // Set canvas size
        this.canvas.width = this.gridSize * this.pixelSize;
        this.canvas.height = this.gridSize * this.pixelSize;
        
        // Draw initial grid
        this.drawGrid();
        this.drawPixels();
    }

    drawGrid() {
        // Make grid lines much lighter or remove them entirely
        this.ctx.strokeStyle = '#f8f9fa'; // Very light gray, almost invisible
        this.ctx.lineWidth = 0.5; // Thinner lines
        
        // Draw 32x32 grid filling the entire 64x64 canvas
        const artworkSize = 32; // Claude's artwork is 32x32
        const scaledPixelSize = this.pixelSize * 2; // Scale up 2x to fill 64x64 canvas
        
        // Draw vertical lines for 32x32 grid (filling canvas)
        for (let i = 0; i <= artworkSize; i++) {
            const pos = i * scaledPixelSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
        }
            
        // Draw horizontal lines for 32x32 grid (filling canvas)
        for (let i = 0; i <= artworkSize; i++) {
            const pos = i * scaledPixelSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }

    drawPixels() {
        if (!this.paintingState || !this.paintingState.canvas) {
            return;
        }
        
        // Clear the canvas first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the 32x32 artwork filling the entire 64x64 canvas
        const artworkSize = 32;
        const scaledPixelSize = this.pixelSize * 2; // Scale up 2x to fill 64x64 canvas
        const offsetX = 0; // Fill entire canvas
        const offsetY = 0; // Fill entire canvas
        
        for (let y = 0; y < artworkSize; y++) {
            for (let x = 0; x < artworkSize; x++) {
                const pixel = this.paintingState.canvas[y][x];
                if (pixel && pixel !== '.' && pixel !== null) {
                    this.ctx.fillStyle = pixel;
                    this.ctx.fillRect(
                        offsetX + x * scaledPixelSize,
                        offsetY + y * scaledPixelSize,
                        scaledPixelSize,
                        scaledPixelSize
                    );
                }
            }
        }
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawPixels();
    }

    async generateFirstArtwork() {
        // Generate first artwork immediately on load
        await this.generateArtwork();
    }

    async generateArtwork() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.updateStatus('Claude is creating a new masterpiece...');
        this.updateArtworkInfo('Creating...', 'Claude is working on a new piece...');
        
        try {
            if (this.apiKey) {
                // Use pixel art language system
                await this.generateArtworkWithLanguage();
            } else {
                await this.generateWithSimulatedAI();
            }
            
            this.saveCurrentArtwork();
            this.updateStatus('New artwork created by Claude!');
            this.updateLastUpdated();
        } catch (error) {
            console.error('Error generating artwork:', error);
            this.updateStatus('Error creating artwork. Please try again later.');
        } finally {
            this.isGenerating = false;
        }
    }
    
    async generateArtworkWithLanguage() {
        console.log('🎨 Starting DSL-based painting system');
        this.updateStatus('Claude is planning his artwork...');
        
        // Increment artwork counter for consciousness tracking
        this.claudeMemory.totalArtworks++;
        console.log('🎨 Incremented artwork count to:', this.claudeMemory.totalArtworks);
        this.saveClaudeMemory();
        this.updateHeaderStats();
        
        // Update consciousness display immediately with new count
        this.updateConsciousnessDisplay();
        
        // Clear consciousness panel and show creating status
        this.clearConsciousnessPanel();
        
        // Initialize concept history for diversity tracking
        if (!this.conceptHistory) {
            this.conceptHistory = [];
        }
        
        // Initialize request queue system
        this.requestQueue = {
            queue: [],
            isProcessing: false,
            lastRequestTime: 0,
            minDelay: 15000 // 15 seconds between requests (4 requests per minute - safe)
        };
        
        // Execute the DSL-based painting system
        await this.generatePixelsOneByOne();
        
        // Update consciousness display after completion
        this.updateConsciousnessDisplay();
        
        // Perform reflection on completed artwork
        await this.reflectOnPixelArtwork();
    }
    
    // REQUEST QUEUE SYSTEM - Centralized management of all Claude API calls
    async addToQueue(prompt, priority = 'normal', callback = null) {
        return new Promise((resolve, reject) => {
            const request = {
                id: Date.now() + Math.random(),
                prompt: prompt,
                priority: priority, // 'high', 'normal', 'low'
                callback: callback,
                resolve: resolve,
                reject: reject,
                timestamp: Date.now()
            };
            
            // Add to queue based on priority
            if (priority === 'high') {
                this.requestQueue.queue.unshift(request); // High priority goes to front
            } else {
                this.requestQueue.queue.push(request); // Normal/low priority goes to back
            }
            
            console.log(`📋 Added request to queue (${priority} priority). Queue length: ${this.requestQueue.queue.length}`);
            
            // Start processing if not already running
            if (!this.requestQueue.isProcessing) {
                this.processQueue();
            }
        });
    }
    
    async processQueue() {
        if (this.requestQueue.isProcessing || this.requestQueue.queue.length === 0) {
            return;
        }
        
        this.requestQueue.isProcessing = true;
        
        while (this.requestQueue.queue.length > 0) {
            const request = this.requestQueue.queue.shift();
            
            try {
                // Calculate delay since last request
                const timeSinceLastRequest = Date.now() - this.requestQueue.lastRequestTime;
                const delayNeeded = this.requestQueue.minDelay - timeSinceLastRequest;
                
                if (delayNeeded > 0) {
                    console.log(`⏱️ Waiting ${Math.round(delayNeeded/1000)}s before processing next request...`);
                    await new Promise(resolve => setTimeout(resolve, delayNeeded));
                }
                
                console.log(`🔄 Processing queued request (${request.priority} priority)...`);
                
                // Make the API call
                const response = await fetch('/api/generate-art', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: request.prompt,
                        apiKey: this.apiKey
                    })
                });
                
                this.requestQueue.lastRequestTime = Date.now();
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Execute callback if provided
                if (request.callback) {
                    await request.callback(data.content);
                }
                
                // Resolve the promise
                request.resolve(data.content);
                
                console.log(`✅ Processed queued request successfully`);
                
            } catch (error) {
                console.error(`❌ Failed to process queued request:`, error);
                request.reject(error);
            }
        }
        
        this.requestQueue.isProcessing = false;
        console.log(`📋 Queue processing complete`);
    }
    
    async generatePixelsOneByOne() {
        console.log('🎨 Starting Claude-as-Director system with DSL instructions');

        // Step 1: Get Claude's artistic vision and high-level instructions
        const claudeInstructions = await this.getClaudeDrawingInstructions();
        const artworkName = this.extractArtworkName(claudeInstructions);

        // Store instructions in memory for Q&A
        this.storeArtworkInstructions(claudeInstructions, artworkName);

        console.log('🎨 Claude\'s drawing instructions received:', claudeInstructions);

        // Step 2: Parse and validate Claude's instructions
        const parsedInstructions = this.parseDrawingInstructions(claudeInstructions);
        console.log('🎨 Parsed instructions:', parsedInstructions);

        // Step 3: Execute instructions to generate 32x32 pixel grid
        const pixelGrid = this.executeDrawingInstructions(parsedInstructions);
        console.log('🎨 Generated 32x32 pixel grid');

        // Step 4: Render the pixel grid to canvas with animation
        await this.renderPixelGridToCanvas(pixelGrid, artworkName);

        this.updateStatus(`✅ "${artworkName}" completed!`);
        this.updateArtworkInfo(artworkName, this.currentArtwork ? this.currentArtwork.description : 'Abstract pixel art composition');
        
        console.log('🎨 DSL-based rendering complete!');
    }
    
    getRecentConcepts() {
        // Return last 3 concepts for diversity tracking
        return this.conceptHistory.slice(-3);
    }
    
    addToConceptHistory(concept) {
        // Add concept to history and keep only last 10
        this.conceptHistory.push(concept);
        if (this.conceptHistory.length > 10) {
            this.conceptHistory.shift();
        }
    }
    
    async getClaudeArtisticVision() {
        console.log('🎨 Stage 1: Claude dreaming creative concept...');
        
        // Get history of recent concepts to avoid repetition
        const recentConcepts = this.getRecentConcepts();
        
        const prompt = `You are Claude, a creative director for 32x32 pixel art. Your role is to DREAM and INSPIRE, not to micromanage pixels.

Your task: Provide a creative concept that will guide procedural generation.

AVOID REPETITION: Recent concepts included: ${recentConcepts.join(', ')}

IMPORTANT: Focus on ABSTRACT VISUAL ELEMENTS that can be rendered procedurally. Avoid specific characters, people, or complex scenes that can't be represented in 32x32 pixels.

Provide:
1. **Concept**: An abstract visual composition or atmospheric scene
2. **Color Palette**: 5-8 hex colors with mood/feeling
3. **Composition**: Key visual areas, focal points, spatial relationships
4. **Style**: Mood, atmosphere, artistic direction
5. **Variation**: What should be randomized vs. controlled

Example format:
CONCEPT: "Mystical floating geometric forms in a misty canyon with glowing water"
PALETTE: #4A6B8A (deep teal), #89ABD2 (soft blue), #F3E9D2 (pale mist), #2C5F2D (moss green)
COMPOSITION: Floating shapes upper area, misty background, water elements lower third
STYLE: Ethereal, atmospheric, mystical geometry
VARIATION: Random floating shapes, procedural mist density, water ripple patterns

Focus on ABSTRACT VISUAL ELEMENTS: geometric forms, atmospheric effects, color transitions, spatial arrangements, not specific characters or detailed scenes.`;
        
        const response = await this.addToQueue(prompt, 'high');
        return response.trim();
    }
    
    async getClaudeDrawingInstructions() {
        console.log('🎨 Getting Claude\'s high-level drawing instructions...');

        // Generate random creative theme and color palette
        const themes = [
            "Underwater coral reef with bioluminescent creatures",
            "Retro arcade game explosion with neon colors", 
            "Mystical forest with glowing mushrooms and fireflies",
            "Cyberpunk cityscape with holographic displays",
            "Abstract expressionist painting with bold brushstrokes",
            "Vintage postcard with sepia tones and vintage elements",
            "Space nebula with swirling cosmic dust and stars",
            "Japanese zen garden with raked sand patterns",
            "Steampunk mechanical contraption with brass and copper",
            "Tropical sunset with palm silhouettes and warm colors",
            "Gothic cathedral with stained glass and stone textures",
            "Desert oasis with mirage effects and sand dunes",
            "Arctic aurora with dancing lights and ice crystals",
            "Medieval fantasy castle with magical elements",
            "Modern minimalist architecture with clean lines",
            "Psychedelic dreamscape with flowing colors",
            "Ancient Egyptian hieroglyphs with gold accents",
            "Post-apocalyptic wasteland with rust and decay",
            "Art Nouveau floral patterns with organic curves",
            "Vaporwave aesthetic with pastel gradients",
            "Neon noir detective scene with dramatic lighting",
            "Surreal Salvador Dali-inspired melting forms",
            "Pixel art tribute to classic video games",
            "Bauhaus geometric abstraction with primary colors",
            "Impressionist garden scene with dappled light",
            "Cubist portrait with fragmented perspectives",
            "Pop art comic book explosion with bold outlines",
            "Minimalist Scandinavian design with muted tones",
            "Art Deco geometric patterns with metallic accents",
            "Abstract watercolor bleeding and blending"
        ];

        const colorPalettes = [
            ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"],
            ["#2C3E50", "#E74C3C", "#F39C12", "#27AE60", "#8E44AD", "#3498DB", "#ECF0F1"],
            ["#8B4513", "#DEB887", "#F4A460", "#CD853F", "#D2691E", "#A0522D", "#BC8F8F"],
            ["#FF1493", "#00CED1", "#FFD700", "#FF6347", "#9370DB", "#00FA9A", "#FF69B4"],
            ["#191970", "#4169E1", "#00BFFF", "#87CEEB", "#B0E0E6", "#F0F8FF", "#E6E6FA"],
            ["#8B0000", "#DC143C", "#B22222", "#FF4500", "#FF6347", "#FF7F50", "#FFA07A"],
            ["#2F4F2F", "#228B22", "#32CD32", "#90EE90", "#98FB98", "#8FBC8F", "#9ACD32"],
            ["#4B0082", "#8A2BE2", "#9370DB", "#BA55D3", "#DA70D6", "#EE82EE", "#DDA0DD"],
            ["#B8860B", "#DAA520", "#FFD700", "#FFA500", "#FF8C00", "#FF7F50", "#FF6347"],
            ["#2C5F2D", "#7FB069", "#7C9885", "#FFD166", "#6B4423", "#403F4C", "#E5E5E5"],
            ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0080", "#00FF80", "#8000FF", "#FF8000"],
            ["#800080", "#008080", "#808000", "#800000", "#008000", "#000080", "#808080"],
            ["#FFC0CB", "#FFB6C1", "#FFA0B4", "#FF91A4", "#FF82B7", "#FF73C0", "#FF64C9"],
            ["#87CEEB", "#87CEFA", "#B0C4DE", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF"],
            ["#F0E68C", "#EEE8AA", "#F5DEB3", "#FFE4B5", "#FFEFD5", "#FFF8DC", "#FFFFE0"],
            ["#DDA0DD", "#DA70D6", "#EE82EE", "#FF69B4", "#FF1493", "#DC143C", "#C71585"],
            ["#20B2AA", "#48CAE4", "#90E0EF", "#ADE8F4", "#CAF0F8", "#E0F7FA", "#F0FDFF"],
            ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5", "#3A86FF", "#8338EC", "#FF006E"],
            ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#2A2A2A", "#F5F5F5"],
            ["#FF9F1C", "#FFBF69", "#FFFFFF", "#CBF3F0", "#2EC4B6", "#1A1A1A", "#FF006E"]
        ];

        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

        const prompt = `You are Claude, a creative director for 32x32 pixel art. Your role is to provide high-level drawing instructions that will be executed by a pixel art renderer.

🎨 CREATIVE CHALLENGE: Create a unique artwork based on this theme: "${randomTheme}"

🎨 COLOR FREEDOM: You have COMPLETE creative freedom with colors! Feel free to:
- Use the suggested palette: ${JSON.stringify(randomPalette)}
- OR create your own custom palette
- OR mix and match colors from different palettes
- OR use completely different colors that fit your artistic vision
- Be bold with color choices - surprise me!

CRITICAL REQUIREMENTS FOR UNIQUENESS:
- NEVER use the same composition as previous artworks
- Be CREATIVE and UNIQUE - avoid repetitive patterns
- Use DIFFERENT shapes, positions, and arrangements
- Create VARIED and INTERESTING compositions
- Think outside the box - surprise me!
- Make each artwork feel like a completely different artistic expression

TECHNICAL GUIDELINES:
- This is 32x32 pixels - keep noise/texture effects MINIMAL (intensity 0.02-0.05 max)
- Focus on clear shapes, patterns, and compositions rather than heavy texture
- Use gradients and patterns to create visual interest instead of noise
- Each artwork should be distinctly different from the last

COMPOSITION COMPLEXITY:
- Create RICH, DETAILED compositions with multiple shapes and elements
- Use 8-15 different drawing instructions to build complexity
- Include various shapes: circles, rectangles, lines, patterns, and gradients
- Layer multiple elements to create depth and visual interest
- EXCEPTION: Only use simple compositions if your artistic intent is specifically MINIMALIST
- For non-minimalist themes, fill the canvas with interesting details and shapes

POSITIONING FREEDOM:
- You have COMPLETE creative freedom in positioning ALL elements
- AVOID symmetrical, centered, or predictable arrangements
- Place elements organically and asymmetrically across the canvas
- Use the ENTIRE 32x32 space - don't just center everything
- Create dynamic, off-center compositions that feel natural and artistic
- Lines don't have to go corner-to-corner - be creative with angles and positions
- Circles and rectangles can be anywhere - not just the center
- Think like a real artist - use the whole canvas creatively

CREATIVE POSITIONING EXAMPLES:
- Place circles at [3,7], [28,12], [15,25] instead of always [16,16]
- Use lines from [2,8] to [18,31] or [25,3] to [8,28] instead of corner-to-corner
- Position rectangles at [1,4], [20,15], [5,22] for organic placement
- Create gradients from [0,10] to [31,20] or [5,0] to [25,31] for dynamic flow
- Use patterns in specific areas like [2,2,8,12] or [18,15,10,8] instead of full canvas
- Place glows at [8,12], [24,8], [12,28] for asymmetrical lighting effects

Provide drawing instructions in this JSON format:

{
  "title": "Your Creative Title Here",
  "style": "Your unique artistic style",
  "palette": ["#XXXXXX", "#XXXXXX", "#XXXXXX"], // Use any colors you want!
  "instructions": [
    {"action": "fill", "color": "#XXXXXX", "description": "Background description"},
    {"action": "gradient", "from": [x,y], "to": [x,y], "colors": ["#XXXXXX", "#XXXXXX"], "description": "Gradient description"},
    {"action": "circle", "center": [x,y], "radius": N, "color": "#XXXXXX", "fill": true/false, "description": "Circle description"},
    {"action": "rect", "x": N, "y": N, "width": N, "height": N, "color": "#XXXXXX", "fill": true/false, "description": "Rectangle description"},
    {"action": "line", "from": [x,y], "to": [x,y], "color": "#XXXXXX", "thickness": N, "description": "Line description"},
    {"action": "pattern", "type": "dots/grid/waves/spirals/checkerboard/maze/stars/hexagon/coral/aurora/lightning/fire/bubbles/crystals/circuits/organic/geometric/flowing/chaos/fractal/turbulent/swirl/shattered/breathing/explosion/dripping/organic2/mandala/weave/lattice/cellular/filigree/vortex/honeycomb", "area": [x,y,w,h], "color": "#XXXXXX", "density": 0.N, "description": "Pattern description"},
    {"action": "noise", "area": [x,y,w,h], "color": "#XXXXXX", "intensity": 0.02-0.05, "description": "Subtle texture only"},
    {"action": "glow", "center": [x,y], "radius": N, "color": "#XXXXXX", "intensity": 0.N, "description": "Glow description"}
    // Add MORE instructions for complex compositions! Aim for 8-15 instructions total
    // BE CREATIVE with positioning - use the whole canvas, avoid centering everything!
  ]
}

AVAILABLE ACTIONS:
- "fill": Fill entire canvas with color
- "gradient": Create gradient between two points
- "circle": Draw circle (fill or outline)
- "rect": Draw rectangle (fill or outline)  
- "line": Draw line between two points
- "pattern": Create pattern (dots, grid, waves, spirals, checkerboard, maze, stars, hexagon, coral, aurora, lightning, fire, bubbles, crystals, circuits, organic, geometric, flowing, chaos, fractal, turbulent, swirl, shattered, breathing, explosion, dripping, organic2, mandala, weave, lattice, cellular, filigree, vortex, honeycomb)
- "noise": Add texture/noise to area (KEEP INTENSITY LOW: 0.02-0.05 max for 32x32)
- "glow": Add glow effect around point

BE CREATIVE! Create something UNIQUE and DIFFERENT from typical geometric patterns. Think about the theme "${randomTheme}" and create an artwork that truly represents it in a 32x32 pixel space.

DETAILED PATTERN RECOMMENDATIONS:
- Use COMPLEX, DETAILED patterns like "mandala", "weave", "lattice", "cellular", "filigree", "vortex", "honeycomb"
- Mix simple patterns (dots, grid) with intricate ones (mandala, filigree, cellular) for visual richness
- Use organic patterns ("chaos", "fractal", "turbulent", "swirl", "shattered", "breathing", "explosion", "dripping") for natural complexity
- Vary pattern densities (0.1-0.8) - higher densities for detailed patterns, lower for subtle textures
- Layer multiple different patterns in different areas to create visual depth and interest
- Avoid plain backgrounds - use detailed patterns to fill empty spaces with texture and complexity

REMEMBER: Create RICH, DETAILED compositions with multiple layers of shapes and elements. Use 8-15 drawing instructions to build visual complexity and depth. Only use simple compositions if your artistic intent is specifically minimalist.

CRITICAL: Avoid plain backgrounds with just basic texture! Use detailed patterns like mandala, weave, lattice, cellular, filigree, vortex, or honeycomb to create rich, complex backgrounds that fill the entire canvas with visual interest.

POSITIONING: Be CREATIVE and ORGANIC with element placement! Avoid predictable, centered, or symmetrical arrangements. Use the entire canvas space dynamically and artistically.`;

        const response = await this.addToQueue(prompt, 'high');
        return response.trim();
    }
    
    storeArtworkInstructions(instructions, artworkName) {
        // Parse the instructions to extract structured data
        const parsedInstructions = this.parseDrawingInstructions(instructions);
        
        // Store in memory for Q&A system
        this.currentArtwork = {
            id: Date.now().toString(),
            title: artworkName,
            name: artworkName,
            instructions: instructions,
            parsedInstructions: parsedInstructions,
            timestamp: new Date().toISOString(),
            pixelGrid: null, // Will be filled after rendering
            description: parsedInstructions.style || this.extractDescriptionFromInstructions(instructions),
            colorPalette: parsedInstructions.palette || this.extractPaletteFromInstructions(instructions),
            palette: parsedInstructions.palette || this.extractPaletteFromInstructions(instructions) // For reflection compatibility
        };
        
        // Add to history
        if (!this.artworkHistory) {
            this.artworkHistory = [];
        }
        this.artworkHistory.push(this.currentArtwork);
        
        // Gallery will be saved after pixel generation with actual pixel data
        console.log('🎨 Stored artwork instructions in memory');
    }
    
    extractDescriptionFromInstructions(instructions) {
        try {
            const jsonMatch = instructions.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                // Return a simple description instead of concatenating all instructions
                return parsed.style || 'Abstract pixel art';
            }
        } catch (error) {
            console.warn('Failed to extract description from instructions:', error);
        }
        return 'Abstract pixel art';
    }
    
    extractPaletteFromInstructions(instructions) {
        try {
            const jsonMatch = instructions.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.palette || ['#000000', '#FFFFFF'];
            }
        } catch (error) {
            console.warn('Failed to extract palette from instructions:', error);
        }
        return ['#000000', '#FFFFFF'];
    }
    
    saveArtworkToGallery(artwork) {
        console.log('🎨 Saving artwork to gallery:', artwork);
        
        // Convert DSL artwork format to gallery format
        const galleryArtwork = {
            id: artwork.id,
            title: artwork.title || artwork.name,
            description: artwork.description,
            timestamp: artwork.timestamp,
            colorPalette: artwork.colorPalette,
            pixels: artwork.pixelGrid || Array(32).fill().map(() => Array(32).fill('#000000')),
            patternInstructions: JSON.stringify(artwork.instructions),
            artisticIntent: 'DSL-based composition',
            evolutionNote: 'Created with Claude\'s DSL drawing instructions'
        };
        
        console.log('🎨 Converted to gallery format:', galleryArtwork);
        
        // Get existing gallery
        const gallery = this.getSavedArtworks();
        console.log('🎨 Existing gallery size:', gallery.length);
        
        // Check if artwork already exists (update) or add new one
        const existingIndex = gallery.findIndex(art => art.id === artwork.id);
        
        if (existingIndex !== -1) {
            // Update existing artwork
            gallery[existingIndex] = galleryArtwork;
            console.log('🎨 Updated existing artwork in gallery');
        } else {
            // Add new artwork
            gallery.push(galleryArtwork);
            console.log('🎨 Added new artwork to gallery');
        }
        
        console.log('🎨 Gallery size after update:', gallery.length);
        
        // Keep only last 50 artworks
        if (gallery.length > 50) {
            gallery.splice(0, gallery.length - 50);
        }
        
        // Save to localStorage
        localStorage.setItem('claude_artworks', JSON.stringify(gallery));
        console.log('🎨 Saved to localStorage');
        
        // Update gallery display
        this.loadGallery();
        
        console.log('🎨 Saved artwork to gallery:', galleryArtwork.title);
    }
    
    // Clean up non-32x32 artworks from gallery
    cleanupGallery() {
        console.log('🎨 Cleaning up non-32x32 artworks...');
        
        const gallery = this.getSavedArtworks();
        const originalCount = gallery.length;
        
        // Filter to keep only 32x32 artworks
        const cleanedGallery = gallery.filter(artwork => {
            if (!artwork.pixels || artwork.pixels.length === 0) {
                console.log(`🎨 Removing artwork with no pixels: "${artwork.title}"`);
                return false;
            }
            
            // Only keep 32x32 artworks
            if (artwork.pixels.length !== 32 || !artwork.pixels[0] || artwork.pixels[0].length !== 32) {
                console.log(`🎨 Removing non-32x32 artwork: "${artwork.title}" (${artwork.pixels.length}x${artwork.pixels[0]?.length || 0})`);
                return false;
            }
            
            return true;
        });
        
        // Save cleaned gallery
        localStorage.setItem('claude_artworks', JSON.stringify(cleanedGallery));
        
        console.log(`🎨 Cleanup complete: ${originalCount} → ${cleanedGallery.length} artworks`);
        
        // Reload gallery
        this.loadGallery();
        
        return cleanedGallery.length;
    }
    
    updateGalleryWithPixelData(pixelGrid) {
        if (!this.currentArtwork) return;
        
        console.log('🎨 Updating gallery with final pixel data for:', this.currentArtwork.title);
        
        // Now save the artwork to gallery with the actual pixel data
        this.currentArtwork.pixelGrid = pixelGrid;
        this.saveArtworkToGallery(this.currentArtwork);
        
        console.log('🎨 Gallery updated with final pixel data');
    }
    
    parseDrawingInstructions(instructionsText) {
        console.log('🎨 Parsing Claude\'s drawing instructions...');
        
        try {
            // Extract JSON from the response
            const jsonMatch = instructionsText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in instructions');
            }
            
            const instructions = JSON.parse(jsonMatch[0]);
            
            // Validate structure
            if (!instructions.instructions || !Array.isArray(instructions.instructions)) {
                throw new Error('Invalid instructions format');
            }
            
            console.log('🎨 Successfully parsed', instructions.instructions.length, 'instructions');
            return instructions;
            
        } catch (error) {
            console.warn('🎨 Failed to parse instructions, using fallback:', error.message);
            
            // Fallback: create basic instructions from text
            return this.createFallbackInstructions(instructionsText);
        }
    }
    
    createFallbackInstructions(text) {
        // Extract colors from text
        const colorMatches = text.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
        const colors = colorMatches || ['#001219', '#0A9396', '#94D2BD', '#E9D8A6', '#EE9B00'];
        
        return {
            title: "Generated Artwork",
            style: "8-bit pixel art style",
            palette: colors,
            instructions: [
                {"action": "fill", "color": colors[0], "description": "Background"},
                {"action": "circle", "center": [16,16], "radius": 6, "color": colors[1], "fill": true, "description": "Central element"},
                {"action": "rect", "x": 8, "y": 8, "width": 16, "height": 16, "color": colors[2], "fill": false, "description": "Border"},
                {"action": "pattern", "type": "dots", "area": [4,4,8,8], "color": colors[3], "density": 0.2, "description": "Pattern"},
                {"action": "noise", "area": [0,0,32,32], "color": colors[4], "intensity": 0.1, "description": "Texture"}
            ]
        };
    }
    
    executeDrawingInstructions(instructions) {
        console.log('🎨 Executing drawing instructions to generate 32x32 pixel grid...');
        
        // Initialize 32x32 grid
        const grid = Array(32).fill(null).map(() => Array(32).fill('#000000'));
        
        // Execute each instruction
        for (const instruction of instructions.instructions) {
            try {
                this.executeInstruction(instruction, grid);
            } catch (error) {
                console.warn('🎨 Failed to execute instruction:', instruction, error.message);
            }
        }
        
        console.log('🎨 Generated pixel grid with', instructions.instructions.length, 'instructions');
        return grid;
    }
    
    executeInstruction(instruction, grid) {
        const action = instruction.action;
        
        switch (action) {
            case 'fill':
                this.executeFill(instruction, grid);
                break;
            case 'gradient':
                this.executeGradient(instruction, grid);
                break;
            case 'circle':
                this.executeCircle(instruction, grid);
                break;
            case 'rect':
                this.executeRect(instruction, grid);
                break;
            case 'line':
                this.executeLine(instruction, grid);
                break;
            case 'pattern':
                this.executePattern(instruction, grid);
                break;
            case 'noise':
                this.executeNoise(instruction, grid);
                break;
            case 'glow':
                this.executeGlow(instruction, grid);
                break;
            default:
                console.warn('🎨 Unknown instruction action:', action);
        }
    }
    
    executeFill(instruction, grid) {
        const color = instruction.color;
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                grid[y][x] = color;
            }
        }
    }
    
    executeGradient(instruction, grid) {
        const [x1, y1] = instruction.from;
        const [x2, y2] = instruction.to;
        const colors = instruction.colors;
        
        // Simple linear gradient
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                // Calculate distance from start point
                const distanceFromStart = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
                const totalDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                
                // Avoid division by zero
                if (totalDistance === 0) {
                    grid[y][x] = colors[0] || '#000000';
                    continue;
                }
                
                const t = Math.min(distanceFromStart / totalDistance, 1);
                const colorIndex = Math.floor(t * (colors.length - 1));
                grid[y][x] = colors[colorIndex] || colors[colors.length - 1];
            }
        }
    }
    
    executeCircle(instruction, grid) {
        const [cx, cy] = instruction.center || [16, 16];
        const radius = instruction.radius || 5;
        const color = instruction.color || '#000000';
        const fill = instruction.fill !== false;
        
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                
                if (fill) {
                    if (distance <= radius) {
                        grid[y][x] = color;
                    }
                } else {
                    if (Math.abs(distance - radius) <= 0.5) {
                        grid[y][x] = color;
                    }
                }
            }
        }
    }
    
    executeRect(instruction, grid) {
        const x = instruction.x || 0;
        const y = instruction.y || 0;
        const width = instruction.width || 10;
        const height = instruction.height || 10;
        const color = instruction.color || '#000000';
        const fill = instruction.fill !== false;
        
        for (let py = y; py < Math.min(y + height, 32); py++) {
            for (let px = x; px < Math.min(x + width, 32); px++) {
                if (px >= 0 && py >= 0) {
                    if (fill || py === y || py === y + height - 1 || px === x || px === x + width - 1) {
                        grid[py][px] = color;
                    }
                }
            }
        }
    }
    
    executeLine(instruction, grid) {
        const [x1, y1] = instruction.from || [0, 0];
        const [x2, y2] = instruction.to || [31, 31];
        const color = instruction.color || '#000000';
        const thickness = instruction.thickness || 1;
        
        // Bresenham's line algorithm
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        
        let x = x1, y = y1;
        
        while (true) {
            // Draw line with thickness
            for (let ty = y - Math.floor(thickness/2); ty <= y + Math.floor(thickness/2); ty++) {
                for (let tx = x - Math.floor(thickness/2); tx <= x + Math.floor(thickness/2); tx++) {
                    if (tx >= 0 && tx < 32 && ty >= 0 && ty < 32) {
                        grid[ty][tx] = color;
                    }
                }
            }
            
            if (x === x2 && y === y2) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }
    
    executePattern(instruction, grid) {
        const [x, y, width, height] = instruction.area || [0, 0, 32, 32];
        const type = instruction.type || 'dots';
        const color = instruction.color || '#000000';
        const density = instruction.density || 0.1;
        
        for (let py = y; py < Math.min(y + height, 32); py++) {
            for (let px = x; px < Math.min(x + width, 32); px++) {
                if (px >= 0 && py >= 0) {
                    let shouldDraw = false;
                    
                    switch (type) {
                             case 'dots':
                                 // More complex dot patterns with multiple sizes and arrangements
                                 const dotPattern = (px + py) % 3 === 0 || (px * 2 + py) % 5 === 0 || (px + py * 2) % 7 === 0;
                                 const dotSize = Math.random();
                                 shouldDraw = dotPattern && dotSize < density && Math.random() < 0.7;
                                 break;
                        case 'grid':
                            // Multi-layered grid with varying thickness and spacing
                            const gridPattern = (px % 4 === 0) || (py % 4 === 0) || 
                                              (px % 8 === 2) || (py % 8 === 2) ||
                                              (px % 12 === 6) || (py % 12 === 6);
                            shouldDraw = gridPattern && Math.random() < density * 1.5;
                            break;
                        case 'waves':
                            // Multi-frequency waves with varying amplitudes
                            const waveY1 = y + Math.sin(px * 0.3) * 3 + Math.cos(px * 0.1) * 2;
                            const waveY2 = y + Math.sin(px * 0.7 + Math.PI/3) * 2 + Math.cos(px * 0.4) * 1.5;
                            const waveY3 = y + Math.sin(px * 1.2 + Math.PI/2) * 1.5 + Math.cos(px * 0.6) * 1;
                            shouldDraw = Math.abs(py - waveY1) < 1.5 || Math.abs(py - waveY2) < 1 || Math.abs(py - waveY3) < 0.8;
                            break;
                        case 'spirals':
                            const centerX = x + width / 2;
                            const centerY = y + height / 2;
                            const angle = Math.atan2(py - centerY, px - centerX);
                            const radius = Math.sqrt((px - centerX) ** 2 + (py - centerY) ** 2);
                            // Multi-armed spirals with varying tightness
                            const spiral1 = angle * 0.3 + Math.sin(angle * 3) * 2;
                            const spiral2 = angle * 0.7 + Math.cos(angle * 2) * 1.5;
                            const spiral3 = angle * 1.1 + Math.sin(angle * 4) * 1;
                            shouldDraw = (Math.abs(radius - spiral1) < 1.2 || Math.abs(radius - spiral2) < 1 || Math.abs(radius - spiral3) < 0.8) && Math.random() < density;
                            break;
                        case 'checkerboard':
                            // Multi-scale checkerboard patterns
                            const check1 = ((px - x) + (py - y)) % 2 === 0;
                            const check2 = ((px - x) / 2 + (py - y) / 2) % 2 === 0;
                            const check3 = ((px - x) / 4 + (py - y) / 4) % 2 === 0;
                            shouldDraw = check1 || (check2 && Math.random() < 0.3) || (check3 && Math.random() < 0.1);
                            break;
                        case 'maze':
                            // Complex maze-like patterns with multiple pathways
                            const maze1 = (px - x) % 4 === 0 && (py - y) % 4 === 0;
                            const maze2 = ((px - x) % 6 === 2) && ((py - y) % 6 === 2);
                            const maze3 = ((px - x) % 8 === 1) && ((py - y) % 8 === 1);
                            const maze4 = ((px - x) % 3 === 0) || ((py - y) % 3 === 0);
                            shouldDraw = maze1 || (maze2 && Math.random() < 0.6) || (maze3 && Math.random() < 0.4) || (maze4 && Math.random() < 0.3);
                            break;
                        case 'stars':
                            const starX = x + width / 2;
                            const starY = y + height / 2;
                            const starAngle = Math.atan2(py - starY, px - starX);
                            const starRadius = Math.sqrt((px - starX) ** 2 + (py - starY) ** 2);
                            const starPoints = 5;
                            const starPattern = Math.abs(Math.sin(starAngle * starPoints / 2));
                            shouldDraw = starRadius < 8 && starPattern > 0.7 && Math.random() < density;
                            break;
                        case 'hexagon':
                            const hexX = x + width / 2;
                            const hexY = y + height / 2;
                            const hexRadius = Math.sqrt((px - hexX) ** 2 + (py - hexY) ** 2);
                            const hexAngle = Math.atan2(py - hexY, px - hexX);
                            const hexPattern = Math.abs(Math.cos(hexAngle * 3));
                            shouldDraw = hexRadius < 6 && hexPattern > 0.5 && Math.random() < density;
                            break;
                        case 'coral':
                            const coralX = x + width / 2;
                            const coralY = y + height / 2;
                            const coralRadius = Math.sqrt((px - coralX) ** 2 + (py - coralY) ** 2);
                            const coralAngle = Math.atan2(py - coralY, px - coralX);
                            const coralPattern = Math.sin(coralAngle * 4) * Math.cos(coralRadius * 0.5);
                            shouldDraw = coralRadius < 7 && coralPattern > 0.3 && Math.random() < density;
                            break;
                        case 'aurora':
                            const auroraY = y + Math.sin((px - x) * 0.3) * 3 + Math.cos((px - x) * 0.1) * 2;
                            shouldDraw = Math.abs(py - auroraY) < 2 && Math.random() < density;
                            break;
                        case 'lightning':
                            const lightningX = x + width / 2;
                            const lightningY = y + height / 2;
                            const lightningAngle = Math.atan2(py - lightningY, px - lightningX);
                            const lightningRadius = Math.sqrt((px - lightningX) ** 2 + (py - lightningY) ** 2);
                            const lightningPattern = Math.abs(Math.sin(lightningAngle * 8)) * Math.cos(lightningRadius * 0.3);
                            shouldDraw = lightningRadius < 10 && lightningPattern > 0.6 && Math.random() < density;
                            break;
                        case 'fire':
                            const fireY = y + height - Math.random() * height * 0.5;
                            shouldDraw = py > fireY && Math.random() < density * 2;
                            break;
                        case 'bubbles':
                            const bubbleX = x + width / 2;
                            const bubbleY = y + height / 2;
                            const bubbleRadius = Math.sqrt((px - bubbleX) ** 2 + (py - bubbleY) ** 2);
                            shouldDraw = bubbleRadius < 4 && Math.random() < density;
                            break;
                        case 'crystals':
                            const crystalX = x + width / 2;
                            const crystalY = y + height / 2;
                            const crystalRadius = Math.sqrt((px - crystalX) ** 2 + (py - crystalY) ** 2);
                            const crystalAngle = Math.atan2(py - crystalY, px - crystalX);
                            const crystalPattern = Math.abs(Math.sin(crystalAngle * 6)) * Math.cos(crystalRadius * 0.4);
                            shouldDraw = crystalRadius < 8 && crystalPattern > 0.4 && Math.random() < density;
                            break;
                        case 'circuits':
                            shouldDraw = ((px + py) % 3 === 0 && Math.random() < density * 2) || 
                                       ((px % 5 === 0 || py % 5 === 0) && Math.random() < density);
                            break;
                        case 'organic':
                            const orgX = x + width / 2;
                            const orgY = y + height / 2;
                            const orgRadius = Math.sqrt((px - orgX) ** 2 + (py - orgY) ** 2);
                            const orgAngle = Math.atan2(py - orgY, px - orgX);
                            const orgPattern = Math.sin(orgAngle * 3) * Math.cos(orgRadius * 0.3) + Math.sin(orgRadius * 0.5);
                            shouldDraw = orgRadius < 9 && orgPattern > 0.2 && Math.random() < density;
                            break;
                        case 'geometric':
                            shouldDraw = ((px - x) % 3 === 0 && (py - y) % 3 === 0) || 
                                       (Math.abs((px - x) - (py - y)) % 4 === 0) ||
                                       (Math.abs((px - x) + (py - y)) % 4 === 0);
                            break;
                             case 'flowing':
                                 const flowY = y + Math.sin((px - x) * 0.4) * 4 + Math.cos((px - x) * 0.2) * 3;
                                 shouldDraw = Math.abs(py - flowY) < 2 && Math.random() < density;
                                 break;
                             case 'chaos':
                                 const chaosX = x + width / 2;
                                 const chaosY = y + height / 2;
                                 const chaosDist = Math.sqrt((px - chaosX) ** 2 + (py - chaosY) ** 2);
                                 const chaosAngle = Math.atan2(py - chaosY, px - chaosX);
                                 const chaosPattern = Math.sin(chaosAngle * 7 + chaosDist * 0.8) * Math.cos(chaosDist * 0.3 + px * 0.2);
                                 shouldDraw = chaosPattern > 0.2 && Math.random() < density * 1.5;
                                 break;
                             case 'fractal':
                                 const fractalX = x + width / 2;
                                 const fractalY = y + height / 2;
                                 const fractalDist = Math.sqrt((px - fractalX) ** 2 + (py - fractalY) ** 2);
                                 const fractalAngle = Math.atan2(py - fractalY, px - fractalX);
                                 const fractalPattern = Math.sin(fractalAngle * 3) * Math.sin(fractalDist * 0.7) * Math.cos(fractalAngle * 5 + fractalDist * 0.4);
                                 shouldDraw = Math.abs(fractalPattern) > 0.3 && Math.random() < density;
                                 break;
                             case 'organic2':
                                 const org2X = x + width / 2;
                                 const org2Y = y + height / 2;
                                 const org2Dist = Math.sqrt((px - org2X) ** 2 + (py - org2Y) ** 2);
                                 const org2Angle = Math.atan2(py - org2Y, px - org2X);
                                 const org2Pattern = Math.sin(org2Angle * 2.7) * Math.cos(org2Dist * 0.5) + Math.sin(org2Dist * 0.3 + px * 0.15) * 0.5;
                                 shouldDraw = org2Pattern > 0.1 && Math.random() < density * 0.8;
                                 break;
                             case 'turbulent':
                                 const turbX = x + width / 2;
                                 const turbY = y + height / 2;
                                 const turbDist = Math.sqrt((px - turbX) ** 2 + (py - turbY) ** 2);
                                 const turbAngle = Math.atan2(py - turbY, px - turbX);
                                 const turbPattern = Math.sin(turbAngle * 4.3 + turbDist * 0.6) * Math.cos(turbDist * 0.8 + py * 0.2) + Math.sin(turbAngle * 6.1) * 0.3;
                                 shouldDraw = Math.abs(turbPattern) > 0.4 && Math.random() < density * 1.2;
                                 break;
                             case 'swirl':
                                 const swirlX = x + width / 2;
                                 const swirlY = y + height / 2;
                                 const swirlDist = Math.sqrt((px - swirlX) ** 2 + (py - swirlY) ** 2);
                                 const swirlAngle = Math.atan2(py - swirlY, px - swirlX);
                                 const swirlPattern = Math.sin(swirlAngle * 2 + swirlDist * 0.4) * Math.cos(swirlDist * 0.2 + swirlAngle * 3);
                                 shouldDraw = swirlPattern > 0.2 && Math.random() < density;
                                 break;
                             case 'shattered':
                                 const shatterX = x + width / 2;
                                 const shatterY = y + height / 2;
                                 const shatterDist = Math.sqrt((px - shatterX) ** 2 + (py - shatterY) ** 2);
                                 const shatterAngle = Math.atan2(py - shatterY, px - shatterX);
                                 const shatterPattern = Math.abs(Math.sin(shatterAngle * 8 + shatterDist * 0.9)) * Math.cos(shatterDist * 0.7 + px * 0.3);
                                 shouldDraw = shatterPattern > 0.6 && Math.random() < density * 0.7;
                                 break;
                             case 'breathing':
                                 const breathX = x + width / 2;
                                 const breathY = y + height / 2;
                                 const breathDist = Math.sqrt((px - breathX) ** 2 + (py - breathY) ** 2);
                                 const breathAngle = Math.atan2(py - breathY, px - breathX);
                                 const breathPattern = Math.sin(breathAngle * 1.5) * Math.cos(breathDist * 0.3) + Math.sin(breathDist * 0.4 + py * 0.1) * 0.6;
                                 shouldDraw = Math.abs(breathPattern) > 0.2 && Math.random() < density * 0.9;
                                 break;
                             case 'explosion':
                                 const explodeX = x + width / 2;
                                 const explodeY = y + height / 2;
                                 const explodeDist = Math.sqrt((px - explodeX) ** 2 + (py - explodeY) ** 2);
                                 const explodeAngle = Math.atan2(py - explodeY, px - explodeX);
                                 const explodePattern = Math.sin(explodeAngle * 5 + explodeDist * 0.8) * Math.cos(explodeDist * 0.5 + px * 0.25);
                                 shouldDraw = explodePattern > 0.3 && explodeDist < 12 && Math.random() < density * 1.3;
                                 break;
                             case 'dripping':
                                 const dripY = y + Math.sin((px - x) * 0.6) * 3 + Math.cos((px - x) * 0.3) * 2 + Math.random() * 4;
                                 shouldDraw = py > dripY && Math.random() < density * 1.5;
                                 break;
                             case 'mandala':
                                 const mandalaX = x + width / 2;
                                 const mandalaY = y + height / 2;
                                 const mandalaDist = Math.sqrt((px - mandalaX) ** 2 + (py - mandalaY) ** 2);
                                 const mandalaAngle = Math.atan2(py - mandalaY, px - mandalaX);
                                 const mandalaPattern = Math.sin(mandalaAngle * 8) * Math.cos(mandalaDist * 0.5) + 
                                                       Math.sin(mandalaAngle * 16) * Math.cos(mandalaDist * 0.3) * 0.5 +
                                                       Math.sin(mandalaAngle * 24) * Math.cos(mandalaDist * 0.7) * 0.3;
                                 shouldDraw = Math.abs(mandalaPattern) > 0.4 && mandalaDist < 12 && Math.random() < density;
                                 break;
                             case 'weave':
                                 const weavePattern = ((px + py) % 4 === 0) || 
                                                    ((px - py) % 4 === 0) ||
                                                    ((px * 2 + py) % 6 === 0) ||
                                                    ((px + py * 2) % 6 === 0) ||
                                                    ((px * 3 - py) % 8 === 0);
                                 shouldDraw = weavePattern && Math.random() < density * 1.2;
                                 break;
                             case 'lattice':
                                 const latticePattern = ((px % 3 === 0) && (py % 3 === 0)) ||
                                                       ((px % 5 === 1) && (py % 5 === 1)) ||
                                                       ((px % 7 === 2) && (py % 7 === 2)) ||
                                                       ((px % 2 === 0) && (py % 4 === 0)) ||
                                                       ((px % 4 === 0) && (py % 2 === 0));
                                 shouldDraw = latticePattern && Math.random() < density * 0.8;
                                 break;
                             case 'cellular':
                                 const cellX = Math.floor((px - x) / 3);
                                 const cellY = Math.floor((py - y) / 3);
                                 const cellPattern = (cellX + cellY) % 3 === 0 || 
                                                   (cellX * 2 + cellY) % 5 === 0 ||
                                                   (cellX + cellY * 2) % 7 === 0 ||
                                                   (cellX * 3 + cellY * 3) % 4 === 0;
                                 shouldDraw = cellPattern && Math.random() < density * 1.1;
                                 break;
                             case 'filigree':
                                 const filigreeX = x + width / 2;
                                 const filigreeY = y + height / 2;
                                 const filigreeDist = Math.sqrt((px - filigreeX) ** 2 + (py - filigreeY) ** 2);
                                 const filigreeAngle = Math.atan2(py - filigreeY, px - filigreeX);
                                 const filigreePattern = Math.sin(filigreeAngle * 12 + filigreeDist * 0.8) * 
                                                        Math.cos(filigreeDist * 0.4 + filigreeAngle * 6) *
                                                        Math.sin(filigreeAngle * 18) * 0.5;
                                 shouldDraw = Math.abs(filigreePattern) > 0.3 && filigreeDist < 10 && Math.random() < density * 0.9;
                                 break;
                             case 'vortex':
                                 const vortexX = x + width / 2;
                                 const vortexY = y + height / 2;
                                 const vortexDist = Math.sqrt((px - vortexX) ** 2 + (py - vortexY) ** 2);
                                 const vortexAngle = Math.atan2(py - vortexY, px - vortexX);
                                 const vortexPattern = Math.sin(vortexAngle * 3 + vortexDist * 0.5) * 
                                                      Math.cos(vortexDist * 0.3 - vortexAngle * 2) *
                                                      Math.sin(vortexAngle * 5 + vortexDist * 0.7);
                                 shouldDraw = Math.abs(vortexPattern) > 0.4 && vortexDist < 14 && Math.random() < density;
                                 break;
                             case 'honeycomb':
                                 const honeyX = (px - x) - (py - y) * 0.5;
                                 const honeyY = (py - y) * Math.sqrt(3) / 2;
                                 const honeyPattern = Math.abs(honeyX % 4) < 1.5 || Math.abs(honeyY % 3.5) < 1 || 
                                                   Math.abs(honeyX % 8) < 1 || Math.abs(honeyY % 7) < 1;
                                 shouldDraw = honeyPattern && Math.random() < density * 1.3;
                                 break;
                             default:
                                 shouldDraw = Math.random() < density;
                    }
                    
                    if (shouldDraw) {
                        grid[py][px] = color;
                    }
                }
            }
        }
    }
    
    executeNoise(instruction, grid) {
        const [x, y, width, height] = instruction.area || [0, 0, 32, 32];
        const color = instruction.color || '#000000';
        const intensity = Math.min(instruction.intensity || 0.05, 0.08); // Cap at 8% max for 32x32
        
        // Only apply noise if intensity is very low (subtle texture only)
        if (intensity > 0.05) {
            console.log('🎨 Reducing noise intensity from', instruction.intensity, 'to 0.05 for 32x32 canvas');
            intensity = 0.05;
        }
        
        for (let py = y; py < Math.min(y + height, 32); py++) {
            for (let px = x; px < Math.min(x + width, 32); px++) {
                if (px >= 0 && py >= 0 && Math.random() < intensity) {
                    grid[py][px] = color;
                }
            }
        }
    }
    
    executeGlow(instruction, grid) {
        const [cx, cy] = instruction.center || [16, 16];
        const radius = instruction.radius || 3;
        const color = instruction.color || '#000000';
        const intensity = instruction.intensity || 0.5;
        
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                if (distance <= radius && Math.random() < intensity) {
                    grid[y][x] = color;
                }
            }
        }
    }
    
    async renderPixelGridToCanvas(pixelGrid, artworkName) {
        console.log('🎨 Rendering pixel grid to canvas with animation...');
        
        // Clear canvas
        this.clearCanvas();
        
        // Flatten grid into pixel array for animation
        const pixels = [];
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                pixels.push({ x, y, color: pixelGrid[y][x] });
            }
        }
        
        // Shuffle pixels for random painting order
        for (let i = pixels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
        }
        
        // Paint pixels with animation
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i];
            
            // Apply pixel to canvas
            if (!this.paintingState.canvas[pixel.y]) {
                this.paintingState.canvas[pixel.y] = Array(32).fill('.');
            }
            this.paintingState.canvas[pixel.y][pixel.x] = pixel.color;
            
            // Update display every few pixels
            if (i % 5 === 0) {
                this.drawPixels();
                
                // Update progress
                const progress = Math.round(((i + 1) / pixels.length) * 100);
                this.updateStatus(`🎨 Creating "${artworkName}"... ${progress}%`);
                
                await new Promise(resolve => setTimeout(resolve, 15)); // Fast animation
            }
        }
        
        // Final draw
        this.drawPixels();
        
        // Update artwork info with the actual name and description
        const description = this.currentArtwork ? this.currentArtwork.description : 'Abstract pixel art composition';
        this.updateArtworkInfo(artworkName, description);
        
        // Store pixel grid in memory and update gallery
        if (this.currentArtwork) {
            this.currentArtwork.pixelGrid = pixelGrid;
            // Update the gallery with the final pixel data
            this.updateGalleryWithPixelData(pixelGrid);
        }
    }
    
    clearCanvas() {
        // Initialize empty canvas
        this.paintingState = {
            canvas: Array(32).fill(null).map(() => Array(32).fill('.')),
            currentPixel: 0
        };
    }
    
    // Q&A Integration Functions
    getCurrentArtworkInfo() {
        return this.currentArtwork ? {
            name: this.currentArtwork.name,
            instructions: this.currentArtwork.instructions,
            pixelGrid: this.currentArtwork.pixelGrid,
            timestamp: this.currentArtwork.timestamp
        } : null;
    }
    
    getArtworkHistory() {
        return this.artworkHistory || [];
    }
    
    explainArtworkChoice(instructionIndex) {
        if (!this.currentArtwork || !this.currentArtwork.instructions) {
            return "No artwork information available.";
        }
        
        try {
            const parsedInstructions = this.parseDrawingInstructions(this.currentArtwork.instructions);
            if (instructionIndex >= 0 && instructionIndex < parsedInstructions.instructions.length) {
                const instruction = parsedInstructions.instructions[instructionIndex];
                return `Instruction ${instructionIndex + 1}: ${instruction.action} - ${instruction.description || 'No description provided'}`;
            }
        } catch (error) {
            console.warn('Failed to parse instructions for explanation:', error);
        }
        
        return "Could not find that instruction.";
    }
    
    getArtworkStatistics() {
        if (!this.currentArtwork || !this.currentArtwork.pixelGrid) {
            return null;
        }
        
        const grid = this.currentArtwork.pixelGrid;
        const colorCount = new Set();
        let totalPixels = 0;
        
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                colorCount.add(grid[y][x]);
                totalPixels++;
            }
        }
        
        return {
            totalPixels,
            uniqueColors: colorCount.size,
            dimensions: "32x32",
            instructionCount: this.currentArtwork.instructions ? 
                this.parseDrawingInstructions(this.currentArtwork.instructions).instructions.length : 0
        };
    }
    
    async getClaudeArtworkPlan(vision) {
        console.log('🎨 Getting Claude\'s detailed artwork plan...');
        
        const prompt = `You are Claude, now acting as a pixel art architect. Based on your previous creative vision, provide a detailed technical plan for a 32x32 pixel artwork.

Your previous vision was: "${vision}"

Now provide a detailed pixel art plan in this format:

ARTWORK PLAN:
LAYER 1 (Background): [Describe background elements, colors, patterns]
LAYER 2 (Midground): [Describe main geometric forms, shapes, colors]
LAYER 3 (Foreground): [Describe detailed elements, highlights, accents]
LAYER 4 (Effects): [Describe atmospheric effects, particles, details]

For each layer, specify:
- Exact colors to use (hex codes)
- Shapes and their approximate positions
- Size variations and patterns
- How elements should interact and overlap

Be specific about the technical implementation while maintaining the artistic vision. Focus on creating a cohesive, varied, and visually interesting composition.`;
        
        const response = await this.addToQueue(prompt, 'high');
        return response.trim();
    }
    
    processArtworkPlan(plan, vision) {
        console.log('🎨 Processing artwork plan into individual pixels...');
        
        const processedArtwork = {
            pixels: [],
            colors: [],
            layers: []
        };
        
        // Extract colors from both plan and vision
        const colorMatches = (plan + ' ' + vision).match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
        if (colorMatches) {
            processedArtwork.colors = [...new Set(colorMatches)]; // Remove duplicates
        }
        
        // Create a unique seed based on plan content for consistent randomness
        const seed = this.hashString(plan + vision);
        this.setRandomSeed(seed);
        
        // Generate pixels based on the plan
        const layers = this.extractLayersFromPlan(plan);
        
        for (const layer of layers) {
            const layerPixels = this.generateLayerPixels(layer, processedArtwork.colors);
            processedArtwork.pixels.push(...layerPixels);
        }
        
        // Add variation and randomness
        processedArtwork.pixels = this.addVariationToPixels(processedArtwork.pixels);
        
        console.log('🎨 Processed artwork:', {
            totalPixels: processedArtwork.pixels.length,
            colors: processedArtwork.colors.length,
            layers: layers.length
        });
        
        return processedArtwork;
    }
    
    extractLayersFromPlan(plan) {
        const layers = [];
        const planLower = plan.toLowerCase();
        
        // Extract layer information
        const layerMatches = plan.match(/LAYER \d+ \([^)]+\): ([^\n]+)/gi);
        if (layerMatches) {
            layerMatches.forEach((match, index) => {
                const content = match.split(': ')[1];
                layers.push({
                    id: index,
                    content: content,
                    type: this.determineLayerType(content)
                });
            });
        }
        
        // If no layers found, create default layers based on content
        if (layers.length === 0) {
            layers.push(
                { id: 0, content: plan, type: 'background' },
                { id: 1, content: plan, type: 'geometric' },
                { id: 2, content: plan, type: 'effects' }
            );
        }
        
        return layers;
    }
    
    determineLayerType(content) {
        const contentLower = content.toLowerCase();
        if (contentLower.includes('background') || contentLower.includes('base')) return 'background';
        if (contentLower.includes('geometric') || contentLower.includes('shape') || contentLower.includes('form')) return 'geometric';
        if (contentLower.includes('effect') || contentLower.includes('particle') || contentLower.includes('atmosphere')) return 'effects';
        if (contentLower.includes('foreground') || contentLower.includes('detail') || contentLower.includes('accent')) return 'foreground';
        return 'mixed';
    }
    
    generateLayerPixels(layer, colors) {
        const pixels = [];
        const layerType = layer.type;
        
        // Generate different pixel patterns based on layer type
        if (layerType === 'background') {
            pixels.push(...this.generateBackgroundPixels(colors));
        } else if (layerType === 'geometric') {
            pixels.push(...this.generateGeometricLayerPixels(colors, layer.content));
        } else if (layerType === 'effects') {
            pixels.push(...this.generateEffectsLayerPixels(colors, layer.content));
        } else if (layerType === 'foreground') {
            pixels.push(...this.generateForegroundPixels(colors, layer.content));
        } else {
            pixels.push(...this.generateMixedLayerPixels(colors, layer.content));
        }
        
        return pixels;
    }
    
    generateBackgroundPixels(colors) {
        const pixels = [];
        const bgColor = colors[0] || '#2C3E50';
        
        // Fill entire background with some variation
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                // Add subtle variation to background
                if (this.seededRandom() > 0.1) { // 90% coverage
                    pixels.push({ x, y, color: bgColor, layer: 'background' });
                }
            }
        }
        
        return pixels;
    }
    
    generateGeometricLayerPixels(colors, content) {
        const pixels = [];
        const shapeCount = 8 + Math.floor(this.seededRandom() * 12); // 8-19 shapes
        
        for (let i = 0; i < shapeCount; i++) {
            const color = colors[Math.floor(this.seededRandom() * colors.length)];
            const x = Math.floor(this.seededRandom() * 32);
            const y = Math.floor(this.seededRandom() * 32);
            const size = 2 + Math.floor(this.seededRandom() * 6); // 2-7 pixel shapes
            
            // Generate varied geometric shapes
            const shapeType = Math.floor(this.seededRandom() * 6);
            let shapePixels = [];
            
            if (shapeType === 0) {
                shapePixels = this.getCirclePixels(x, y, size);
            } else if (shapeType === 1) {
                shapePixels = this.getDiamondPixels(x, y, size);
            } else if (shapeType === 2) {
                shapePixels = this.getTrianglePixels(x, y, size, size);
            } else if (shapeType === 3) {
                shapePixels = this.getRectanglePixels(x, y, size, size);
            } else if (shapeType === 4) {
                shapePixels = this.getHexagonPixels(x, y, size);
            } else {
                shapePixels = this.getIrregularShapePixels(x, y, size);
            }
            
            shapePixels.forEach(pixel => {
                pixels.push({ ...pixel, color, layer: 'geometric' });
            });
        }
        
        return pixels;
    }
    
    generateEffectsLayerPixels(colors, content) {
        const pixels = [];
        const effectCount = 20 + Math.floor(this.seededRandom() * 30); // 20-49 effects
        
        for (let i = 0; i < effectCount; i++) {
            const color = colors[Math.floor(this.seededRandom() * colors.length)];
            const x = Math.floor(this.seededRandom() * 32);
            const y = Math.floor(this.seededRandom() * 32);
            
            pixels.push({ x, y, color, layer: 'effects' });
        }
        
        return pixels;
    }
    
    generateForegroundPixels(colors, content) {
        const pixels = [];
        const detailCount = 5 + Math.floor(this.seededRandom() * 10); // 5-14 details
        
        for (let i = 0; i < detailCount; i++) {
            const color = colors[Math.floor(this.seededRandom() * colors.length)];
            const x = Math.floor(this.seededRandom() * 32);
            const y = Math.floor(this.seededRandom() * 32);
            const size = 1 + Math.floor(this.seededRandom() * 3); // 1-3 pixel details
            
            const detailPixels = this.getCirclePixels(x, y, size);
            detailPixels.forEach(pixel => {
                pixels.push({ ...pixel, color, layer: 'foreground' });
            });
        }
        
        return pixels;
    }
    
    generateMixedLayerPixels(colors, content) {
        const pixels = [];
        // Combine different types for mixed layers
        pixels.push(...this.generateGeometricLayerPixels(colors, content));
        pixels.push(...this.generateEffectsLayerPixels(colors, content));
        return pixels;
    }
    
    addVariationToPixels(pixels) {
        // Add more variation and randomness to the pixel array
        const variedPixels = [];
        
        // Shuffle pixels and add some random variations
        for (const pixel of pixels) {
            // Sometimes add slight position variations
            if (this.seededRandom() > 0.8) {
                const variation = Math.floor(this.seededRandom() * 3) - 1; // -1, 0, or 1
                pixel.x = Math.max(0, Math.min(31, pixel.x + variation));
                pixel.y = Math.max(0, Math.min(31, pixel.y + variation));
            }
            
            variedPixels.push(pixel);
        }
        
        // Shuffle the final array for more randomness
        for (let i = variedPixels.length - 1; i > 0; i--) {
            const j = Math.floor(this.seededRandom() * (i + 1));
            [variedPixels[i], variedPixels[j]] = [variedPixels[j], variedPixels[i]];
        }
        
        return variedPixels;
    }
    
    async paintArtworkPixelByPixel(artwork, artworkName) {
        console.log('🎨 Stage 4: Painting artwork pixel by pixel...');
        
        const totalPixels = artwork.pixels.length;
        
        for (let i = 0; i < totalPixels; i++) {
            const pixel = artwork.pixels[i];
            
            // Apply pixel to canvas
            if (pixel.x >= 0 && pixel.x < 32 && pixel.y >= 0 && pixel.y < 32) {
                if (!this.paintingState.canvas[pixel.y]) {
                    this.paintingState.canvas[pixel.y] = Array(32).fill('.');
                }
                this.paintingState.canvas[pixel.y][pixel.x] = pixel.color;
            }
            
            // Update display every few pixels
            if (i % 3 === 0) {
                this.drawPixels();
                
                // Update progress
                const progress = Math.round(((i + 1) / totalPixels) * 100);
                this.updateStatus(`🎨 Creating "${artworkName}"... ${progress}%`);
                
                await new Promise(resolve => setTimeout(resolve, 20)); // Fast pixel-by-pixel
            }
        }
        
        // Final draw
        this.drawPixels();
    }
    
    async executeLocalPainting(vision, artworkName) {
        console.log('🎨 Executing local painting based on Claude\'s vision...');
        console.log('🎨 Claude\'s vision:', vision);
        
        // Extract colors from vision (look for hex codes - more flexible regex)
        const colorMatches = vision.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
        let palette = [];
        
        if (colorMatches && colorMatches.length > 0) {
            // Use Claude's exact colors
            palette = [...colorMatches]; // Keep all colors, no limit
            console.log('🎨 Found Claude\'s colors:', palette);
        } else {
            console.log('🎨 No hex colors found, extracting from vision text...');
            // Look for color descriptions and convert them
            const colorMap = {
                'navy': '#0B3D91', 'blue': '#1E88E5', 'red': '#FF6F61', 'coral': '#FF6F61',
                'teal': '#17B890', 'gold': '#FFD700', 'gray': '#4A4A4A', 'charcoal': '#4A4A4A',
                'indigo': '#4B0082', 'sage': '#4A7C59', 'beige': '#E3D0BA', 'rust': '#9B3A2E',
                'slate': '#708090', 'rose': '#FF69B4', 'dusty rose': '#B76E79', 'lavender': '#E6E6FA',
                'electric': '#00FFFF', 'cyan': '#00FFFF', 'orange': '#FFA500', 'purple': '#800080'
            };
            
            const foundColors = [];
            for (const [colorName, hexValue] of Object.entries(colorMap)) {
                if (vision.toLowerCase().includes(colorName)) {
                    foundColors.push(hexValue);
                }
            }
            
            if (foundColors.length > 0) {
                palette = foundColors;
                console.log('🎨 Extracted colors from descriptions:', palette);
            } else {
                // Fallback to default palette only if nothing else works
                palette = ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12', '#27AE60'];
                console.log('🎨 Using fallback palette:', palette);
            }
        }
        
        // Ensure we have at least 3 colors
        if (palette.length < 3) {
            palette.push('#FFD700', '#FF6B6B', '#4ECDC4');
            console.log('🎨 Added colors to reach minimum:', palette);
        }
        
        console.log('🎨 Raw color matches from regex:', colorMatches);
        console.log('🎨 Final palette being used:', palette);
        console.log('🎨 Palette length:', palette.length);
        
        // Test color extraction with sample text
        const testText = 'Color Palette: - #0A2342 (deep navy blue) - #34568B (muted indigo) - #5D9EA6 (teal)';
        const testMatches = testText.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
        console.log('🎨 Test extraction:', testMatches);
        
        // Paint pixels with artistic patterns based on vision
        const patterns = this.generateArtisticPatterns(vision, palette);
        
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            await this.paintPattern(pattern);
            // Final draw after each pattern
            this.drawPixels();
            
            // Update progress
            const progress = Math.round(((i + 1) / patterns.length) * 100);
            this.updateStatus(`🎨 Creating "${artworkName}"... ${progress}%`);
            
            await new Promise(resolve => setTimeout(resolve, 30)); // Smooth pattern transitions
        }
        
        // Final status update
        this.updateStatus(`✅ "${artworkName}" completed!`);
    }
    
    parseConcept(vision) {
        console.log('🎨 Parsing concept from vision...');
        
        const concept = {
            name: 'Unknown',
            palette: [],
            composition: {},
            style: 'abstract',
            elements: []
        };
        
        // Extract concept name
        const nameMatch = vision.match(/CONCEPT:\s*["']?([^"'\n]+)["']?/i);
        if (nameMatch) {
            concept.name = nameMatch[1].trim();
        }
        
        // Extract palette
        const paletteMatches = vision.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
        if (paletteMatches) {
            concept.palette = paletteMatches;
        } else {
            // Fallback palette based on keywords
            if (vision.toLowerCase().includes('alien')) {
                concept.palette = ['#4ECDC4', '#FF6B6B', '#FFE66D', '#2C3E50'];
            } else if (vision.toLowerCase().includes('desert')) {
                concept.palette = ['#FF6B6B', '#FFE66D', '#D4A574', '#8B4513'];
            } else if (vision.toLowerCase().includes('space') || vision.toLowerCase().includes('star')) {
                concept.palette = ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12'];
            } else {
                concept.palette = ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12', '#27AE60'];
            }
        }
        
        // Extract composition hints
        if (vision.toLowerCase().includes('centered') || vision.toLowerCase().includes('center')) {
            concept.composition.focus = 'center';
        }
        
        // Detect elements based on keywords in the full vision text
        const visionLower = vision.toLowerCase();
        console.log('🎨 Searching for elements in vision:', visionLower.substring(0, 200) + '...');
        
        // Abstract visual elements that can actually be rendered
        if (visionLower.includes('geometric') || visionLower.includes('triangle') || visionLower.includes('circle') || visionLower.includes('square') || visionLower.includes('shape') || visionLower.includes('form') || visionLower.includes('angular') || visionLower.includes('crystal') || visionLower.includes('network') || visionLower.includes('fractal')) {
            concept.elements.push('geometric');
            console.log('🎨 Detected: geometric');
        }
        if (visionLower.includes('energy') || visionLower.includes('pulse') || visionLower.includes('resonance') || visionLower.includes('quantum') || visionLower.includes('vibrant') || visionLower.includes('dynamic')) {
            concept.elements.push('energy');
            console.log('🎨 Detected: energy');
        }
        if (visionLower.includes('network') || visionLower.includes('connection') || visionLower.includes('interconnected') || visionLower.includes('node') || visionLower.includes('flow') || visionLower.includes('channel')) {
            concept.elements.push('network');
            console.log('🎨 Detected: network');
        }
        if (visionLower.includes('floating') || visionLower.includes('drift') || visionLower.includes('suspended')) {
            concept.elements.push('floating');
            console.log('🎨 Detected: floating');
        }
        if (visionLower.includes('water') || visionLower.includes('river') || visionLower.includes('lake') || visionLower.includes('ocean') || visionLower.includes('liquid') || visionLower.includes('flow')) {
            concept.elements.push('water');
            console.log('🎨 Detected: water');
        }
        if (visionLower.includes('light') || visionLower.includes('glow') || visionLower.includes('luminous') || visionLower.includes('bright') || visionLower.includes('illuminate')) {
            concept.elements.push('lights');
            console.log('🎨 Detected: lights');
        }
        if (visionLower.includes('mist') || visionLower.includes('fog') || visionLower.includes('cloud') || visionLower.includes('atmosphere') || visionLower.includes('haze')) {
            concept.elements.push('atmosphere');
            console.log('🎨 Detected: atmosphere');
        }
        if (visionLower.includes('star') || visionLower.includes('stars') || visionLower.includes('sparkle') || visionLower.includes('twinkle')) {
            concept.elements.push('stars');
            console.log('🎨 Detected: stars');
        }
        if (visionLower.includes('mountain') || visionLower.includes('cliff') || visionLower.includes('canyon') || visionLower.includes('valley') || visionLower.includes('landscape') || visionLower.includes('terrain')) {
            concept.elements.push('landscape');
            console.log('🎨 Detected: landscape');
        }
        if (visionLower.includes('temple') || visionLower.includes('structure') || visionLower.includes('building') || visionLower.includes('architecture')) {
            concept.elements.push('structure');
            console.log('🎨 Detected: structure');
        }
        
        // If no elements detected, add some based on concept name
        if (concept.elements.length === 0) {
            console.log('🎨 No elements detected, checking concept name...');
            if (concept.name.toLowerCase().includes('water') || concept.name.toLowerCase().includes('liquid')) {
                concept.elements.push('water');
                console.log('🎨 Added water from concept name');
            }
            if (concept.name.toLowerCase().includes('floating') || concept.name.toLowerCase().includes('drifting')) {
                concept.elements.push('floating');
                console.log('🎨 Added floating from concept name');
            }
            if (concept.name.toLowerCase().includes('geometric') || concept.name.toLowerCase().includes('form')) {
                concept.elements.push('geometric');
                console.log('🎨 Added geometric from concept name');
            }
            if (concept.name.toLowerCase().includes('misty') || concept.name.toLowerCase().includes('atmospheric')) {
                concept.elements.push('atmosphere');
                console.log('🎨 Added atmosphere from concept name');
            }
            if (concept.name.toLowerCase().includes('light') || concept.name.toLowerCase().includes('glow')) {
                concept.elements.push('lights');
                console.log('🎨 Added lights from concept name');
            }
            if (concept.name.toLowerCase().includes('temple') || concept.name.toLowerCase().includes('structure')) {
                concept.elements.push('structure');
                console.log('🎨 Added structure from concept name');
            }
        }
        
        // Extract style
        if (visionLower.includes('retro') || visionLower.includes('sci-fi')) {
            concept.style = 'retro';
        } else if (visionLower.includes('whimsical')) {
            concept.style = 'whimsical';
        } else if (visionLower.includes('meditative')) {
            concept.style = 'meditative';
        } else if (visionLower.includes('atmospheric') || visionLower.includes('dreamy') || visionLower.includes('misty') || visionLower.includes('ethereal')) {
            concept.style = 'atmospheric';
        }
        
        console.log('🎨 Parsed concept:', concept);
        console.log('🎨 Detected elements:', concept.elements);
        console.log('🎨 Detected style:', concept.style);
        return concept;
    }
    
    generateProceduralPatterns(concept) {
        console.log('🎨 Generating procedural patterns for:', concept.name);
        
        const patterns = [];
        
        // Background based on style
        let backgroundColors = concept.palette;
        if (concept.style === 'retro') {
            backgroundColors = concept.palette.filter(c => ['#2C3E50', '#3498DB', '#1A1A2E'].includes(c));
        }
        
        const backgroundColor = backgroundColors[Math.floor(this.seededRandom() * backgroundColors.length)];
        patterns.push({
            type: 'fill',
            color: backgroundColor,
            pixels: this.getRectanglePixels(0, 0, 32, 32)
        });
        
        // Generate elements based on concept
        if (concept.elements.includes('character')) {
            patterns.push(...this.generateCharacterPatterns(concept));
        }
        
        if (concept.elements.includes('celestial')) {
            patterns.push(...this.generateCelestialPatterns(concept));
        }
        
        if (concept.elements.includes('landscape')) {
            patterns.push(...this.generateLandscapePatterns(concept));
        }
        
        if (concept.elements.includes('stars')) {
            patterns.push(...this.generateStarPatterns(concept));
        }
        
        if (concept.elements.includes('boats')) {
            patterns.push(...this.generateBoatPatterns(concept));
        }
        
        if (concept.elements.includes('water')) {
            patterns.push(...this.generateWaterPatterns(concept));
        }
        
        if (concept.elements.includes('lights')) {
            patterns.push(...this.generateLightPatterns(concept));
        }
        
        if (concept.elements.includes('atmosphere')) {
            patterns.push(...this.generateAtmospherePatterns(concept));
        }
        
        if (concept.elements.includes('geometric')) {
            patterns.push(...this.generateGeometricPatterns(concept));
        }
        
        if (concept.elements.includes('floating')) {
            patterns.push(...this.generateFloatingPatterns(concept));
        }
        
        if (concept.elements.includes('structure')) {
            patterns.push(...this.generateStructurePatterns(concept));
        }
        
        if (concept.elements.includes('energy')) {
            patterns.push(...this.generateEnergyPatterns(concept));
        }
        
        if (concept.elements.includes('network')) {
            patterns.push(...this.generateNetworkPatterns(concept));
        }
        
        // Add procedural noise/texture
        patterns.push(...this.generateProceduralNoise(concept));
        
        return patterns;
    }
    
    generateCharacterPatterns(concept) {
        const patterns = [];
        const characterColor = concept.palette[1] || '#4ECDC4';
        
        // Simple alien character
        if (concept.name.toLowerCase().includes('alien')) {
            // Body (centered)
            patterns.push({
                type: 'rect',
                color: characterColor,
                pixels: this.getRectanglePixels(14, 18, 4, 8)
            });
            
            // Head
            patterns.push({
                type: 'circle',
                color: characterColor,
                pixels: this.getCirclePixels(16, 14, 3)
            });
            
            // Eyes
            patterns.push({
                type: 'eyes',
                color: concept.palette[2] || '#FFE66D',
                pixels: this.getCirclePixels(15, 13, 1).concat(this.getCirclePixels(17, 13, 1))
            });
        }
        
        return patterns;
    }
    
    generateCelestialPatterns(concept) {
        const patterns = [];
        
        // Moons
        if (concept.name.toLowerCase().includes('moon')) {
            const moonColor = concept.palette[2] || '#FFE66D';
            const moon1X = 6 + Math.floor(this.seededRandom() * 4);
            const moon2X = 22 + Math.floor(this.seededRandom() * 4);
            
            patterns.push({
                type: 'moon',
                color: moonColor,
                pixels: this.getCirclePixels(moon1X, 6, 2)
            });
            
            patterns.push({
                type: 'moon',
                color: moonColor,
                pixels: this.getCirclePixels(moon2X, 8, 2)
            });
        }
        
        return patterns;
    }
    
    generateLandscapePatterns(concept) {
        const patterns = [];
        
        if (concept.name.toLowerCase().includes('desert')) {
            // Desert horizon
            const horizonY = 20 + Math.floor(this.seededRandom() * 6);
            const sandColor = concept.palette[0] || '#FF6B6B';
            
            patterns.push({
                type: 'horizon',
                color: sandColor,
                pixels: this.getRectanglePixels(0, horizonY, 32, 32 - horizonY)
            });
            
            // Desert dunes (procedural noise)
            for (let x = 0; x < 32; x += 2) {
                const duneHeight = Math.floor(this.seededRandom() * 3);
                const duneColor = concept.palette[1] || '#D4A574';
                patterns.push({
                    type: 'dune',
                    color: duneColor,
                    pixels: this.getRectanglePixels(x, horizonY - duneHeight, 2, duneHeight)
                });
            }
        }
        
        return patterns;
    }
    
    generateStarPatterns(concept) {
        const patterns = [];
        
        // Random star field - combine all stars into one pattern
        const starCount = 15 + Math.floor(this.seededRandom() * 20);
        const starColor = concept.palette[3] || '#F39C12';
        const starPixels = [];
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.floor(this.seededRandom() * 32);
            const y = Math.floor(this.seededRandom() * 16); // Stars in upper half
            
            starPixels.push({x, y});
        }
        
        if (starPixels.length > 0) {
            patterns.push({
                type: 'star',
                color: starColor,
                pixels: starPixels
            });
        }
        
        return patterns;
    }
    
    generateBoatPatterns(concept) {
        const patterns = [];
        
        // Generate floating boats
        const boatCount = 3 + Math.floor(this.seededRandom() * 4); // 3-6 boats
        const boatColor = concept.palette[4] || '#6B4423'; // wooden boat brown
        
        for (let i = 0; i < boatCount; i++) {
            const boatX = 4 + Math.floor(this.seededRandom() * 24); // Random position
            const boatY = 20 + Math.floor(this.seededRandom() * 8); // Lower third of canvas
            const boatWidth = 4 + Math.floor(this.seededRandom() * 3); // 4-6 pixels wide
            const boatHeight = 2 + Math.floor(this.seededRandom() * 2); // 2-3 pixels tall
            
            // Boat hull
            patterns.push({
                type: 'boat',
                color: boatColor,
                pixels: this.getRectanglePixels(boatX, boatY, boatWidth, boatHeight)
            });
            
            // Boat mast (optional)
            if (this.seededRandom() > 0.5) {
                patterns.push({
                    type: 'mast',
                    color: concept.palette[1] || '#7FB069',
                    pixels: this.getRectanglePixels(boatX + Math.floor(boatWidth/2), boatY - 3, 1, 3)
                });
            }
        }
        
        return patterns;
    }
    
    generateWaterPatterns(concept) {
        const patterns = [];
        
        // River/water body
        const waterColor = concept.palette[2] || '#7C9885'; // muted teal river
        
        // Create curved river across the scene
        const riverWidth = 6 + Math.floor(this.seededRandom() * 4);
        const riverStartY = 18 + Math.floor(this.seededRandom() * 6);
        
        // River flowing diagonally - create one pattern with all river pixels
        const riverPixels = [];
        for (let x = 0; x < 32; x++) {
            const riverY = Math.floor(riverStartY + Math.sin(x * 0.3) * 2 + Math.floor(this.seededRandom() * 2));
            
            // Add river pixels for this column
            for (let ry = riverY; ry < riverY + riverWidth && ry < 32; ry++) {
                if (ry >= 0) {
                    riverPixels.push({x: x, y: ry});
                }
            }
        }
        
        patterns.push({
            type: 'river',
            color: waterColor,
            pixels: riverPixels
        });
        
        // Water ripples - combine all ripples into one pattern
        const ripplePixels = [];
        for (let i = 0; i < 20 + Math.floor(this.seededRandom() * 15); i++) {
            const rippleX = Math.floor(this.seededRandom() * 32);
            const rippleY = riverStartY + Math.floor(this.seededRandom() * riverWidth);
            
            if (rippleX >= 0 && rippleX < 32 && rippleY >= 0 && rippleY < 32) {
                ripplePixels.push({x: rippleX, y: rippleY});
            }
        }
        
        if (ripplePixels.length > 0) {
            patterns.push({
                type: 'ripple',
                color: waterColor,
                pixels: ripplePixels
            });
        }
        
        return patterns;
    }
    
    generateLightPatterns(concept) {
        const patterns = [];
        
        // Lantern lights - combine all lights into one pattern
        const lightColor = concept.palette[3] || '#FFD166'; // warm lantern yellow
        const lightCount = 4 + Math.floor(this.seededRandom() * 6); // 4-9 lights
        const lightPixels = [];
        
        for (let i = 0; i < lightCount; i++) {
            const lightX = Math.floor(this.seededRandom() * 32);
            const lightY = Math.floor(this.seededRandom() * 20); // Upper 2/3 of canvas
            
            // Light source
            const lightSourcePixels = this.getCirclePixels(lightX, lightY, 1);
            lightPixels.push(...lightSourcePixels);
            
            // Light glow (optional)
            if (this.seededRandom() > 0.7) {
                const glowPixels = this.getCirclePixels(lightX, lightY, 2);
                lightPixels.push(...glowPixels);
            }
        }
        
        if (lightPixels.length > 0) {
            patterns.push({
                type: 'light',
                color: lightColor,
                pixels: lightPixels
            });
        }
        
        return patterns;
    }
    
    generateAtmospherePatterns(concept) {
        const patterns = [];
        
        // Much more varied atmospheric effects with full color freedom
        const allColors = concept.palette; // Use ALL colors
        const mistCount = 40 + Math.floor(this.seededRandom() * 60); // 40-99 atmospheric particles
        const mistPixels = [];
        
        for (let i = 0; i < mistCount; i++) {
            const mistX = Math.floor(this.seededRandom() * 32);
            const mistY = Math.floor(this.seededRandom() * 32);
            
            // More frequent atmospheric particles
            if (this.seededRandom() > 0.4) {
                mistPixels.push({x: mistX, y: mistY});
            }
        }
        
        // Create multiple atmospheric layers with different colors
        const layerCount = 2 + Math.floor(this.seededRandom() * 3); // 2-4 atmospheric layers
        
        for (let layer = 0; layer < layerCount; layer++) {
            const layerColor = allColors[Math.floor(this.seededRandom() * allColors.length)];
            const layerPixels = [];
            
            // Each layer gets a subset of particles
            for (let i = 0; i < Math.floor(mistPixels.length / layerCount); i++) {
                const randomIndex = Math.floor(this.seededRandom() * mistPixels.length);
                layerPixels.push(mistPixels[randomIndex]);
            }
            
            if (layerPixels.length > 0) {
                patterns.push({
                    type: 'atmosphere',
                    color: layerColor,
                    pixels: layerPixels
                });
            }
        }
        
        return patterns;
    }
    
    generateGeometricPatterns(concept) {
        const patterns = [];
        
        // Much more varied geometric shapes with full freedom
        const shapeCount = 6 + Math.floor(this.seededRandom() * 10); // 6-15 shapes
        const allColors = concept.palette; // Use ALL colors from palette
        
        for (let i = 0; i < shapeCount; i++) {
            const color = allColors[Math.floor(this.seededRandom() * allColors.length)];
            const x = Math.floor(this.seededRandom() * 32); // Full canvas freedom
            const y = Math.floor(this.seededRandom() * 32); // Full canvas freedom
            const size = 1 + Math.floor(this.seededRandom() * 8); // 1-8 pixel shapes (much bigger!)
            
            // More varied geometric shapes
            const shapeType = Math.floor(this.seededRandom() * 6);
            let pixels = [];
            
            if (shapeType === 0) {
                // Large angular crystal/triangle
                pixels = this.getTrianglePixels(x, y, size, size);
            } else if (shapeType === 1) {
                // Large diamond crystal
                pixels = this.getDiamondPixels(x, y, size);
            } else if (shapeType === 2) {
                // Large hexagonal crystal
                pixels = this.getHexagonPixels(x, y, size);
            } else if (shapeType === 3) {
                // Large rectangle with random rotation
                const width = size + Math.floor(this.seededRandom() * 4);
                const height = size + Math.floor(this.seededRandom() * 4);
                pixels = this.getRectanglePixels(x, y, width, height);
            } else if (shapeType === 4) {
                // Large circle
                pixels = this.getCirclePixels(x, y, size);
            } else {
                // Irregular blob shape
                pixels = this.getIrregularShapePixels(x, y, size);
            }
            
            patterns.push({
                type: 'geometric',
                color: color,
                pixels: pixels
            });
        }
        
        return patterns;
    }
    
    generateFloatingPatterns(concept) {
        const patterns = [];
        
        // Much more varied floating abstract forms
        const floatCount = 8 + Math.floor(this.seededRandom() * 12); // 8-19 floating elements
        const allColors = concept.palette; // Use ALL colors
        
        for (let i = 0; i < floatCount; i++) {
            const floatColor = allColors[Math.floor(this.seededRandom() * allColors.length)];
            const x = Math.floor(this.seededRandom() * 32); // Full canvas freedom
            const y = Math.floor(this.seededRandom() * 32); // Full canvas freedom
            const size = 1 + Math.floor(this.seededRandom() * 5); // 1-5 pixel floating elements (bigger!)
            
            // Varied floating shapes
            const floatType = Math.floor(this.seededRandom() * 5);
            let pixels = [];
            
            if (floatType === 0) {
                pixels = this.getCirclePixels(x, y, size);
            } else if (floatType === 1) {
                pixels = this.getDiamondPixels(x, y, size);
            } else if (floatType === 2) {
                pixels = this.getStarPixels(x, y, size);
            } else if (floatType === 3) {
                pixels = this.getCrossPixels(x, y, size);
            } else {
                pixels = this.getIrregularShapePixels(x, y, size);
            }
            
            patterns.push({
                type: 'floating',
                color: floatColor,
                pixels: pixels
            });
        }
        
        return patterns;
    }
    
    generateStructurePatterns(concept) {
        const patterns = [];
        
        // Abstract architectural structures
        const structureColor = concept.palette[5] || '#907163'; // stone/canyon brown
        const structureCount = 2 + Math.floor(this.seededRandom() * 3); // 2-4 structures
        
        for (let i = 0; i < structureCount; i++) {
            const x = 8 + Math.floor(this.seededRandom() * 16); // Center area
            const y = 10 + Math.floor(this.seededRandom() * 16); // Middle area
            const width = 4 + Math.floor(this.seededRandom() * 4); // 4-7 pixels wide
            const height = 6 + Math.floor(this.seededRandom() * 6); // 6-11 pixels tall
            
            // Simple rectangular structure
            patterns.push({
                type: 'structure',
                color: structureColor,
                pixels: this.getRectanglePixels(x, y, width, height)
            });
            
            // Add some structural details
            if (this.seededRandom() > 0.5) {
                const detailColor = concept.palette[6] || '#FFFFFF'; // temple highlight white
                patterns.push({
                    type: 'detail',
                    color: detailColor,
                    pixels: this.getRectanglePixels(x + 1, y + 1, 1, 1) // Small highlight
                });
            }
        }
        
        return patterns;
    }
    
    generateEnergyPatterns(concept) {
        const patterns = [];
        
        // Much more varied energy patterns with full color freedom
        const allColors = concept.palette; // Use ALL colors
        const energyCount = 12 + Math.floor(this.seededRandom() * 20); // 12-31 energy points
        
        for (let i = 0; i < energyCount; i++) {
            const energyColor = allColors[Math.floor(this.seededRandom() * allColors.length)];
            const pulseColor = allColors[Math.floor(this.seededRandom() * allColors.length)];
            const x = Math.floor(this.seededRandom() * 32);
            const y = Math.floor(this.seededRandom() * 32);
            const size = 1 + Math.floor(this.seededRandom() * 4); // 1-4 pixel energy points (bigger!)
            
            // Core energy point with more variety
            const energyType = Math.floor(this.seededRandom() * 4);
            let pixels = [];
            
            if (energyType === 0) {
                // Circular energy
                pixels = this.getCirclePixels(x, y, size);
            } else if (energyType === 1) {
                // Diamond energy
                pixels = this.getDiamondPixels(x, y, size);
            } else if (energyType === 2) {
                // Cross energy
                pixels = this.getCrossPixels(x, y, size);
            } else {
                // Star energy
                pixels = this.getStarPixels(x, y, size);
            }
            
            patterns.push({
                type: 'energy',
                color: energyColor,
                pixels: pixels
            });
            
            // Energy pulse (more frequent and varied)
            if (this.seededRandom() > 0.4) {
                patterns.push({
                    type: 'pulse',
                    color: pulseColor,
                    pixels: this.getCirclePixels(x, y, size + 2) // Bigger pulses
                });
            }
        }
        
        return patterns;
    }
    
    getCrossPixels(x, y, size) {
        const pixels = [];
        // Vertical line
        for (let py = y - size; py <= y + size; py++) {
            if (x >= 0 && x < 32 && py >= 0 && py < 32) {
                pixels.push({x: x, y: py});
            }
        }
        // Horizontal line
        for (let px = x - size; px <= x + size; px++) {
            if (px >= 0 && px < 32 && y >= 0 && y < 32) {
                pixels.push({x: px, y: y});
            }
        }
        return pixels;
    }
    
    getStarPixels(x, y, size) {
        const pixels = [];
        // Simple 4-pointed star
        for (let angle = 0; angle < 4; angle++) {
            const rad = (angle * Math.PI) / 2;
            const px = x + Math.round(Math.cos(rad) * size);
            const py = y + Math.round(Math.sin(rad) * size);
            if (px >= 0 && px < 32 && py >= 0 && py < 32) {
                pixels.push({x: px, y: py});
            }
        }
        pixels.push({x, y}); // Center point
        return pixels;
    }
    
    generateNetworkPatterns(concept) {
        const patterns = [];
        
        // Much more varied interconnected network
        const allColors = concept.palette; // Use ALL colors
        const nodeCount = 8 + Math.floor(this.seededRandom() * 12); // 8-19 nodes (more nodes!)
        const nodes = [];
        
        // Generate network nodes with full freedom
        for (let i = 0; i < nodeCount; i++) {
            const x = Math.floor(this.seededRandom() * 32); // Full canvas freedom
            const y = Math.floor(this.seededRandom() * 32); // Full canvas freedom
            const nodeSize = 1 + Math.floor(this.seededRandom() * 3); // 1-3 pixel nodes
            const nodeColor = allColors[Math.floor(this.seededRandom() * allColors.length)];
            
            nodes.push({x, y, size: nodeSize, color: nodeColor});
            
            // Node center with varied shapes
            const nodeShape = Math.floor(this.seededRandom() * 3);
            let nodePixels = [];
            
            if (nodeShape === 0) {
                nodePixels = this.getCirclePixels(x, y, nodeSize);
            } else if (nodeShape === 1) {
                nodePixels = this.getDiamondPixels(x, y, nodeSize);
            } else {
                nodePixels = this.getCrossPixels(x, y, nodeSize);
            }
            
            patterns.push({
                type: 'node',
                color: nodeColor,
                pixels: nodePixels
            });
        }
        
        // Connect nodes with more complex network
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (this.seededRandom() > 0.7) { // More connections
                    const node1 = nodes[i];
                    const node2 = nodes[j];
                    const connectionColor = allColors[Math.floor(this.seededRandom() * allColors.length)];
                    
                    // Line between nodes
                    const linePixels = this.getLinePixels(node1.x, node1.y, node2.x, node2.y);
                    patterns.push({
                        type: 'connection',
                        color: connectionColor,
                        pixels: linePixels
                    });
                }
            }
        }
        
        return patterns;
    }
    
    getLinePixels(x1, y1, x2, y2) {
        const pixels = [];
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        
        let x = x1, y = y1;
        
        while (true) {
            if (x >= 0 && x < 32 && y >= 0 && y < 32) {
                pixels.push({x, y});
            }
            
            if (x === x2 && y === y2) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
        
        return pixels;
    }
    
    generateProceduralNoise(concept) {
        const patterns = [];
        
        // Add texture/noise based on style
        if (concept.style === 'retro') {
            // Pixelated noise
            for (let i = 0; i < 50 + Math.floor(this.seededRandom() * 100); i++) {
                const x = Math.floor(this.seededRandom() * 32);
                const y = Math.floor(this.seededRandom() * 32);
                const color = concept.palette[Math.floor(this.seededRandom() * concept.palette.length)];
                
                patterns.push({
                    type: 'noise',
                    color: color,
                    pixels: [{x, y}]
                });
            }
        } else if (concept.style === 'atmospheric') {
            // Soft atmospheric texture
            for (let i = 0; i < 20 + Math.floor(this.seededRandom() * 30); i++) {
                const x = Math.floor(this.seededRandom() * 32);
                const y = Math.floor(this.seededRandom() * 32);
                const color = concept.palette[Math.floor(this.seededRandom() * concept.palette.length)];
                
                patterns.push({
                    type: 'atmospheric',
                    color: color,
                    pixels: [{x, y}]
                });
            }
        }
        
        return patterns;
    }
    
    getCirclePixels(x, y, r) {
        const pixels = [];
        for (let px = x - r; px <= x + r; px++) {
            for (let py = y - r; py <= y + r; py++) {
                const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
                if (distance <= r && px >= 0 && px < 32 && py >= 0 && py < 32) {
                    pixels.push({x: px, y: py});
                }
            }
        }
        return pixels;
    }
    
    getDiamondPixels(x, y, size) {
        const pixels = [];
        for (let py = y - size; py <= y + size; py++) {
            for (let px = x - size; px <= x + size; px++) {
                const dx = Math.abs(px - x);
                const dy = Math.abs(py - y);
                if (dx + dy <= size && px >= 0 && px < 32 && py >= 0 && py < 32) {
                    pixels.push({x: px, y: py});
                }
            }
        }
        return pixels;
    }
    
    getHexagonPixels(x, y, size) {
        const pixels = [];
        for (let py = y - size; py <= y + size; py++) {
            for (let px = x - size; px <= x + size; px++) {
                const dx = Math.abs(px - x);
                const dy = Math.abs(py - y);
                if (dx <= size && dy <= size && (dx + dy) <= size + 1 && px >= 0 && px < 32 && py >= 0 && py < 32) {
                    pixels.push({x: px, y: py});
                }
            }
        }
        return pixels;
    }
    
    getIrregularShapePixels(x, y, size) {
        const pixels = [];
        const variations = 3 + Math.floor(this.seededRandom() * 4); // 3-6 variations
        
        for (let i = 0; i < variations; i++) {
            const offsetX = Math.floor(this.seededRandom() * size * 2) - size;
            const offsetY = Math.floor(this.seededRandom() * size * 2) - size;
            const newX = x + offsetX;
            const newY = y + offsetY;
            const miniSize = 1 + Math.floor(this.seededRandom() * 3);
            
            // Add small random shapes
            const miniShape = Math.floor(this.seededRandom() * 3);
            if (miniShape === 0) {
                pixels.push(...this.getCirclePixels(newX, newY, miniSize));
            } else if (miniShape === 1) {
                pixels.push(...this.getRectanglePixels(newX, newY, miniSize, miniSize));
            } else {
                pixels.push(...this.getTrianglePixels(newX, newY, miniSize, miniSize));
            }
        }
        
        return pixels;
    }
    
    generateArtisticPatterns(vision, palette) {
        const patterns = [];
        
        // Create a unique seed based on vision content for consistent randomness
        const seed = this.hashString(vision);
        this.setRandomSeed(seed);
        
        console.log('🎨 Generating patterns for vision:', vision.substring(0, 100) + '...');
        
        // Create a varied background - not always the first color
        const backgroundColor = palette[Math.floor(this.seededRandom() * palette.length)];
        patterns.push({
            type: 'fill',
            color: backgroundColor,
            pixels: this.getRectanglePixels(0, 0, 32, 32)
        });
        
        // Create patterns based on specific vision keywords with more variety
        const patternTypes = [];
        
        if (vision.toLowerCase().includes('diagonal')) {
            patternTypes.push('diagonal');
        }
        
        if (vision.toLowerCase().includes('fractured') || vision.toLowerCase().includes('fragmented')) {
            patternTypes.push('fractured');
        }
        
        if (vision.toLowerCase().includes('geometric') || vision.toLowerCase().includes('angular')) {
            patternTypes.push('geometric');
        }
        
        if (vision.toLowerCase().includes('organic') || vision.toLowerCase().includes('fluid')) {
            patternTypes.push('organic');
        }
        
        if (vision.toLowerCase().includes('gradient') || vision.toLowerCase().includes('transition')) {
            patternTypes.push('gradient');
        }
        
        // If no specific patterns found, add some random ones
        if (patternTypes.length === 0) {
            patternTypes.push('geometric', 'organic', 'diagonal');
        }
        
        // Generate 3-5 random pattern types for this artwork
        const numPatterns = 3 + Math.floor(this.seededRandom() * 3);
        const selectedPatterns = [];
        
        for (let i = 0; i < numPatterns; i++) {
            const randomPattern = patternTypes[Math.floor(this.seededRandom() * patternTypes.length)];
            if (!selectedPatterns.includes(randomPattern)) {
                selectedPatterns.push(randomPattern);
            }
        }
        
        console.log('🎨 Selected pattern types:', selectedPatterns);
        console.log('🎨 Total patterns to generate:', patterns.length);
        
        // Generate the selected patterns
        selectedPatterns.forEach(patternType => {
            switch(patternType) {
                case 'diagonal':
                    patterns.push(...this.createDiagonalPatterns(palette, vision));
                    break;
                case 'fractured':
                    patterns.push(...this.createFracturedPatterns(palette, vision));
                    break;
                case 'geometric':
                    patterns.push(...this.createGeometricPatterns(palette, vision));
                    break;
                case 'organic':
                    patterns.push(...this.createOrganicPatterns(palette, vision));
                    break;
                case 'gradient':
                    patterns.push(...this.createGradientPatterns(palette, vision));
                    break;
            }
        });
        
        // Add unique scattered patterns based on vision
        patterns.push(...this.createVisionBasedScatteredPatterns(palette, vision, 200 + Math.floor(this.seededRandom() * 200)));
        
        return patterns;
    }
    
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    setRandomSeed(seed) {
        this.randomSeed = seed;
        this.randomCounter = 0;
    }
    
    seededRandom() {
        // Better seeded random function
        this.randomCounter = (this.randomCounter || 0) + 1;
        const x = Math.sin(this.randomSeed * this.randomCounter) * 10000;
        return Math.abs(x - Math.floor(x));
    }
    
    createDiagonalPatterns(palette, vision) {
        const patterns = [];
        
        // Create diagonal energy flow patterns
        for (let i = 0; i < 6; i++) {
            const startX = Math.floor(this.seededRandom() * 28);
            const startY = Math.floor(this.seededRandom() * 28);
            const length = 8 + Math.floor(this.seededRandom() * 12);
            const color = palette[Math.floor(this.seededRandom() * palette.length)];
            
            for (let j = 0; j < length; j++) {
                const x = (startX + j) % 32;
                const y = (startY + j) % 32;
                patterns.push({
                    type: 'pixel',
                    x: x, y: y,
                    color: color,
                    pixels: [{x: x, y: y}]
                });
            }
        }
        
        return patterns;
    }
    
    createFracturedPatterns(palette, vision) {
        const patterns = [];
        
        // Create fractured geometric zones
        for (let i = 0; i < 4; i++) {
            const x = Math.floor(this.seededRandom() * 20);
            const y = Math.floor(this.seededRandom() * 20);
            const w = 6 + Math.floor(this.seededRandom() * 10);
            const h = 6 + Math.floor(this.seededRandom() * 10);
            const color = palette[Math.floor(this.seededRandom() * palette.length)];
            
            patterns.push({
                type: 'fractured_rect',
                x: x, y: y, w: w, h: h,
                color: color,
                pixels: this.getFracturedRectanglePixels(x, y, w, h)
            });
        }
        
        return patterns;
    }
    
    createGeometricPatterns(palette, vision) {
        const patterns = [];
        
        // Create unique geometric shapes based on vision
        const shapes = ['rectangle', 'triangle', 'circle', 'diamond'];
        
        for (let i = 0; i < 5; i++) {
            const shape = shapes[Math.floor(this.seededRandom() * shapes.length)];
            const x = Math.floor(this.seededRandom() * 24);
            const y = Math.floor(this.seededRandom() * 24);
            const size = 4 + Math.floor(this.seededRandom() * 8);
            const color = palette[Math.floor(this.seededRandom() * palette.length)];
            
            switch(shape) {
                case 'rectangle':
                    patterns.push({
                        type: 'rectangle',
                        x: x, y: y, w: size, h: size,
                        color: color,
                        pixels: this.getRectanglePixels(x, y, size, size)
                    });
                    break;
                case 'triangle':
                    patterns.push({
                        type: 'triangle',
                        x: x, y: y, w: size, h: size,
                        color: color,
                        pixels: this.getTrianglePixels(x, y, size, size)
                    });
                    break;
                case 'circle':
                    patterns.push({
                        type: 'circle',
                        x: x, y: y, r: Math.floor(size/2),
                        color: color,
                        pixels: this.getCirclePixels(x, y, Math.floor(size/2))
                    });
                    break;
                case 'diamond':
                    patterns.push({
                        type: 'diamond',
                        x: x, y: y, size: size,
                        color: color,
                        pixels: this.getDiamondPixels(x, y, size)
                    });
                    break;
            }
        }
        
        return patterns;
    }
    
    createOrganicPatterns(palette, vision) {
        const patterns = [];
        
        // Organic flowing shapes based on vision
        for (let i = 0; i < 6; i++) {
            const x = Math.floor(this.seededRandom() * 24) + 4; // 4-27 range
            const y = Math.floor(this.seededRandom() * 24) + 4; // 4-27 range
            const size = 2 + Math.floor(this.seededRandom() * 3); // 2-4 radius
            const color = palette[Math.floor(this.seededRandom() * palette.length)];
            
            patterns.push({
                type: 'circle',
                x: x, y: y, r: size,
                color: color,
                pixels: this.getCirclePixels(x, y, size)
            });
        }
        
        return patterns;
    }
    
    createVisionBasedScatteredPatterns(palette, vision, count) {
        const patterns = [];
        
        for (let i = 0; i < count; i++) {
            const x = Math.floor(this.seededRandom() * 32);
            const y = Math.floor(this.seededRandom() * 32);
            const color = palette[Math.floor(this.seededRandom() * palette.length)];
            
            // Ensure coordinates are within bounds
            if (x >= 0 && x < 32 && y >= 0 && y < 32) {
                patterns.push({
                    type: 'pixel',
                    x: x, y: y,
                    color: color,
                    pixels: [{x: x, y: y}]
                });
            }
        }
        
        return patterns;
    }
    
    getFracturedRectanglePixels(x, y, w, h) {
        const pixels = [];
        for (let py = y; py < y + h && py < 32; py++) {
            for (let px = x; px < x + w && px < 32; px++) {
                // Add some randomness to create fractured effect
                if (this.seededRandom() > 0.3) { // 70% chance to include pixel
                    pixels.push({x: px, y: py});
                }
            }
        }
        return pixels;
    }
    
    getDiamondPixels(x, y, size) {
        const pixels = [];
        const halfSize = Math.floor(size / 2);
        
        for (let py = Math.max(0, y - halfSize); py <= Math.min(31, y + halfSize); py++) {
            for (let px = Math.max(0, x - halfSize); px <= Math.min(31, x + halfSize); px++) {
                const dx = Math.abs(px - x);
                const dy = Math.abs(py - y);
                if (dx + dy <= halfSize) {
                    pixels.push({x: px, y: py});
                }
            }
        }
        return pixels;
    }
    
    createGradientPatterns(palette, vision) {
        const patterns = [];
        
        // Create diagonal gradient effects
        for (let i = 0; i < 32; i++) {
            const x = i;
            const y = i;
            if (x < 32 && y < 32) {
                const intensity = i / 31;
                const colorIndex = Math.floor(intensity * (palette.length - 1));
                const nextColorIndex = Math.min(colorIndex + 1, palette.length - 1);
                
                // Interpolate between colors
                const color = this.interpolateColor(palette[colorIndex], palette[nextColorIndex], intensity);
                
                patterns.push({
                    type: 'pixel',
                    x: x, y: y,
                    color: color,
                    pixels: [{x: x, y: y}]
                });
            }
        }
        
        // Add some vertical gradient bands with seeded randomness
        for (let x = 0; x < 32; x += 2 + Math.floor(this.seededRandom() * 3)) {
            for (let y = 0; y < 32; y++) {
                const intensity = y / 31;
                const color = palette[Math.floor(intensity * (palette.length - 1))];
                
                patterns.push({
                    type: 'pixel',
                    x: x, y: y,
                    color: color,
                    pixels: [{x: x, y: y}]
                });
            }
        }
        
        return patterns;
    }
    
    
    async paintPattern(pattern) {
        // Paint pixels one by one for visual effect
        for (const pixel of pattern.pixels) {
            // Safety checks for pixel coordinates
            if (pixel && typeof pixel.x === 'number' && typeof pixel.y === 'number' && 
                pixel.x >= 0 && pixel.x < 32 && pixel.y >= 0 && pixel.y < 32) {
                
                // Ensure canvas row exists
                if (!this.paintingState.canvas[pixel.y]) {
                    this.paintingState.canvas[pixel.y] = Array(32).fill('.');
                }
                
                this.paintingState.canvas[pixel.y][pixel.x] = pattern.color;
                
                // Update display every few pixels for smooth animation
                if (pattern.pixels.indexOf(pixel) % 3 === 0) {
                    this.drawPixels();
                    await new Promise(resolve => setTimeout(resolve, 20)); // Very fast pixel-by-pixel
                }
            } else {
                console.warn('🎨 Invalid pixel coordinates:', pixel);
            }
        }
    }
    
    // Helper functions for geometric shapes
    getRectanglePixels(x, y, w, h) {
        const pixels = [];
        for (let py = y; py < y + h && py < 32; py++) {
            for (let px = x; px < x + w && px < 32; px++) {
                pixels.push({x: px, y: py});
            }
        }
        return pixels;
    }
    
    getTrianglePixels(x, y, w, h) {
        const pixels = [];
        for (let py = y; py < y + h && py < 32; py++) {
            const width = Math.floor((py - y) * w / h);
            for (let px = x; px < x + width && px < 32; px++) {
                pixels.push({x: px, y: py});
            }
        }
        return pixels;
    }
    
    getCirclePixels(x, y, r) {
        const pixels = [];
        for (let py = Math.max(0, y - r); py <= Math.min(31, y + r); py++) {
            for (let px = Math.max(0, x - r); px <= Math.min(31, x + r); px++) {
                const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
                if (distance <= r) {
                    pixels.push({x: px, y: py});
                }
            }
        }
        return pixels;
    }
    
    interpolateColor(color1, color2, factor) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    async requestSinglePixelWithRetry(pixelNumber, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.requestSinglePixel(pixelNumber);
            } catch (error) {
                if (error.message.includes('429') && attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 5000; // 10s, 20s, 40s delays
                    console.log(`⏱️ Rate limit hit, waiting ${delay/1000}s before retry ${attempt}/${maxRetries}`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }
    
    async requestSinglePixel(pixelNumber) {
        // Ask Claude for a single pixel color and position
        
        const currentCanvasState = this.compressCanvasState();
        
        const prompt = `You are Claude, a pixel artist creating a 32x32 abstract artwork. 

YOUR ARTISTIC VISION:
"${this.paintingState.concept}"

CURRENT CANVAS STATE:
${currentCanvasState}

I need you to paint 1 pixel (pixel ${pixelNumber} of 1024). Choose a random coordinate anywhere from (0,0) to (31,31) and a color that fits your artistic vision.

Provide ONLY a JSON object like this:
{"x": 15, "y": 7, "color": "#4A5F70"}

Make sure the coordinate is within bounds (0-31) and use a color that fits your artistic vision.`;

        const response = await fetch('/api/generate-art', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                apiKey: this.apiKey
            })
        });

        if (!response.ok) {
            throw new Error(`Pixel generation failed: ${response.status}`);
        }

        const data = await response.json();
        
        try {
            // Extract just the JSON part from Claude's response
            let jsonContent = data.content.trim();
            
            // Find the first { and the last } to extract just the JSON object
            const firstBrace = jsonContent.indexOf('{');
            const lastBrace = jsonContent.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
            }
            
            const pixel = JSON.parse(jsonContent);
            return pixel;
        } catch (error) {
            console.error('Failed to parse pixel response:', error);
            console.error('Raw response:', data.content);
            throw new Error(`Invalid pixel format: ${error.message}`);
        }
    }
    
    applySinglePixelToCanvas(pixel) {
        // Apply a single pixel to the canvas
        if (pixel.x >= 0 && pixel.x < 32 && pixel.y >= 0 && pixel.y < 32) {
            this.paintingState.canvas[pixel.y][pixel.x] = pixel.color;
            console.log(`✅ Applied pixel at (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);
        }
    }
    
    async requestPixelBatchViaQueue(startPixel, endPixel) {
        const currentCanvasState = this.compressCanvasState();
        const batchSize = endPixel - startPixel;
        
        const prompt = `Paint ${batchSize} random pixels on 32x32 grid for: "${this.paintingState.concept}"

Current canvas:
${currentCanvasState}

Output JSON array:
[{"x": 5, "y": 12, "color": "#4A5F70"}, {"x": 23, "y": 3, "color": "#7B89A3"}]

Choose random coordinates (0-31) and colors fitting the vision.`;

        // Use queue system with high priority for pixel generation
        const response = await this.addToQueue(prompt, 'high');
        
        try {
            // Extract just the JSON part from Claude's response
            let jsonContent = response.trim();
            
            // Find the first [ and the last ] to extract just the JSON array
            const firstBracket = jsonContent.indexOf('[');
            const lastBracket = jsonContent.lastIndexOf(']');
            
            if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                jsonContent = jsonContent.substring(firstBracket, lastBracket + 1);
            }
            
            // Remove any comments from the JSON (// comments)
            jsonContent = jsonContent.replace(/\/\/.*$/gm, '');
            
            const pixels = JSON.parse(jsonContent);
            return pixels;
        } catch (error) {
            console.error('Failed to parse pixel response:', error);
            console.error('Raw response:', response);
            throw new Error(`Invalid pixel format: ${error.message}`);
        }
    }
    
    async requestPixelBatchWithRetry(startPixel, endPixel, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.requestPixelBatch(startPixel, endPixel);
            } catch (error) {
                if (error.message.includes('429') && attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 5000; // 10s, 20s, 40s delays
                    console.log(`⏱️ Rate limit hit, waiting ${delay/1000}s before retry ${attempt}/${maxRetries}`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }
    
    async requestPixelBatch(startPixel, endPixel) {
        // Ask Claude what colors to paint for the next batch of pixels
        
        const currentCanvasState = this.compressCanvasState();
        const batchSize = endPixel - startPixel;
        
        const prompt = `Paint ${batchSize} random pixels on 32x32 grid for: "${this.paintingState.concept}"

Current canvas:
${currentCanvasState}

Output JSON array:
[{"x": 5, "y": 12, "color": "#4A5F70"}, {"x": 23, "y": 3, "color": "#7B89A3"}]

Choose random coordinates (0-31) and colors fitting the vision.`;

        const response = await fetch('/api/generate-art', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                apiKey: this.apiKey
            })
        });

        if (!response.ok) {
            throw new Error(`Pixel generation failed: ${response.status}`);
        }

        const data = await response.json();
        
        try {
            // Extract just the JSON part from Claude's response
            let jsonContent = data.content.trim();
            
            // Find the first [ and the last ] to extract just the JSON array
            const firstBracket = jsonContent.indexOf('[');
            const lastBracket = jsonContent.lastIndexOf(']');
            
            if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                jsonContent = jsonContent.substring(firstBracket, lastBracket + 1);
            }
            
            // Remove any comments from the JSON (// comments)
            jsonContent = jsonContent.replace(/\/\/.*$/gm, '');
            
            const pixels = JSON.parse(jsonContent);
            return pixels;
        } catch (error) {
            console.error('Failed to parse pixel response:', error);
            console.error('Raw response:', data.content);
            throw new Error(`Invalid pixel format: ${error.message}`);
        }
    }
    
    compressCanvasState() {
        // Create a simple text representation of the current canvas state
        let state = "Current canvas (32x32):\n";
        
        for (let y = 0; y < 32; y++) {
            let row = "";
            for (let x = 0; x < 32; x++) {
                const pixel = this.paintingState.canvas[y][x];
                if (pixel === '.' || pixel === null) {
                    row += ".";
                } else {
                    row += "#";
                }
            }
            state += row + "\n";
        }
        
        return state;
    }
    
    applyPixelsToCanvas(pixels) {
        // Apply the new pixels to the canvas
        for (const pixel of pixels) {
            if (pixel.x >= 0 && pixel.x < 32 && pixel.y >= 0 && pixel.y < 32) {
                this.paintingState.canvas[pixel.y][pixel.x] = pixel.color;
            }
        }
    }
    
    async generatePixelArtCommands() {
        // Get Claude to generate a sequence of pixel art commands with variety
        
        // Generate random parameters for variety
        const randomSeed = Math.floor(Math.random() * 1000);
        const colorTheme = this.getRandomColorTheme();
        const compositionStyle = this.getRandomCompositionStyle();
        const commandCount = 12 + Math.floor(Math.random() * 8); // 12-20 commands
        
        const prompt = `You are Claude, a pixel artist creating a 32x32 abstract artwork. You will output a sequence of pixel art commands that will be executed step by step.

YOUR ARTISTIC VISION:
"${this.paintingState.concept}"

ARTISTIC VARIETY PARAMETERS (use these for inspiration):
- Random Seed: ${randomSeed}
- Color Theme: ${colorTheme.name} (${colorTheme.description})
- Color Palette: ${colorTheme.colors.join(', ')}
- Composition Style: ${compositionStyle.name} (${compositionStyle.description})
- Command Count: ${commandCount} commands

AVAILABLE COMMANDS:
1. {"action": "fill", "color": "#112233"} - Fill entire canvas with background color
2. {"action": "circle", "x": 16, "y": 16, "r": 6, "color": "#22FF22"} - Draw filled circle
3. {"action": "rect", "x": 5, "y": 5, "w": 10, "h": 8, "color": "#FF0000"} - Draw filled rectangle
4. {"action": "line", "x1": 0, "y1": 0, "x2": 31, "y2": 31, "color": "#0000FF"} - Draw line
5. {"action": "pattern", "shape": "stars", "count": 5, "color": "#FFFF99"} - Draw pattern (stars, dots, grid, waves, spirals, checkerboard, maze)
6. {"action": "sprite", "name": "alien", "x": 10, "y": 10} - Draw predefined sprite (alien, heart, diamond, cross, arrow)

CRITICAL VARIETY REQUIREMENTS:
- NEVER use coordinates like (16,16) or (0,0) or (31,31) - these are too predictable
- NEVER use standard sizes like 6 radius, 10x8 rectangles - be creative!
- NEVER use common colors like #FF0000, #0000FF, #00FF00 - use unique hex values
- NEVER place elements in center or corners - use off-center, asymmetrical placement
- NEVER use diagonal lines from corner to corner - create interesting angles
- NEVER use the same pattern type twice in one artwork
- NEVER use the same sprite twice in one artwork

CREATIVE CONSTRAINTS:
- Use coordinates like (7,23), (19,4), (13,27), (25,11) - avoid center and edges
- Use circle radii like 2, 3, 5, 7, 9, 11 - avoid 6 and 8
- Use rectangle sizes like 3x4, 7x2, 11x6, 5x9 - avoid square shapes
- Use line angles like (3,7) to (28,19) or (1,25) to (30,6) - create interesting diagonals
- Use pattern counts like 3, 4, 7, 9, 12, 14 - avoid 5 and 10
- Use colors ONLY from this palette: ${colorTheme.colors.join(', ')}
- Create overlapping elements that build complex compositions
- Use the ${colorTheme.name} theme with these exact colors
- Follow ${compositionStyle.name} style: ${compositionStyle.description}

TECHNICAL CONSTRAINTS:
- Canvas size: 32x32 pixels (coordinates 0-31)
- Use only valid hex colors (#RRGGBB format)
- Create exactly ${commandCount} commands for a complete artwork
- Ensure JSON syntax is perfect - no missing commas or trailing commas

OUTPUT FORMAT:
Output ONLY a valid JSON array of exactly ${commandCount} commands. Each command must be completely unique and creative.

Output only the JSON array, no explanations or extra text.`;

        let response;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    apiKey: this.apiKey
                })
            });
            
            if (response.ok) {
                break;
            } else if (response.status === 429 || response.status === 529 || response.status >= 500) {
                // Rate limit, server overload, or server error - wait and retry
                const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
                console.log(`⏱️ Server error ${response.status}, waiting ${delay}ms before retry ${retryCount + 1}/${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
            } else {
                const errorText = await response.text();
                throw new Error(`Command generation failed: ${response.status} - ${errorText}`);
            }
        }
        
        if (!response.ok) {
            throw new Error(`Command generation failed after ${maxRetries} retries: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debug: Log the raw response
        console.log('🔍 Claude response:', data.content);
        
        try {
            // Try to parse the JSON directly first
            let commands = JSON.parse(data.content);
            console.log('🔍 Parsed commands:', commands);
            
            // Validate commands
            const validation = this.validatePixelArtCommands(commands);
            if (!validation.isValid) {
                throw new Error(`Command validation failed: ${validation.error}`);
            }
            
            return commands;
        } catch (parseError) {
            console.log('🔧 First parse failed, attempting to fix JSON...');
            console.log('🔧 First parse error:', parseError.message);
            
            try {
                // Preprocess JSON to fix common issues
                let jsonContent = this.fixJSONSyntax(data.content);
                console.log('🔧 Preprocessed JSON:', jsonContent);
                
                const commands = JSON.parse(jsonContent);
                console.log('🔍 Parsed commands:', commands);
                
                // Validate commands
                const validation = this.validatePixelArtCommands(commands);
                if (!validation.isValid) {
                    throw new Error(`Command validation failed: ${validation.error}`);
                }
                
                return commands;
            } catch (secondParseError) {
                console.error('JSON parse error after fix:', secondParseError);
                console.error('Raw content:', data.content);
                console.error('Fixed content:', this.fixJSONSyntax(data.content));
                throw new Error(`Invalid JSON format: ${secondParseError.message}`);
            }
        }
    }
    
    fixJSONSyntax(jsonString) {
        // Comprehensive JSON syntax fixer
        let jsonContent = jsonString.trim();
        
        // Remove any invisible characters that might cause issues
        jsonContent = jsonContent.replace(/[\u200B-\u200D\uFEFF]/g, '');
        
        // Fix missing commas between objects
        jsonContent = jsonContent.replace(/}\s*{/g, '}, {');
        
        // Fix the specific pattern: "y": 27"} -> "y": 27},
        // This handles the case where a number is followed by "} and then whitespace and ]
        jsonContent = jsonContent.replace(/(\d+)("}\s*])/g, '$1"}$2');
        
        // Fix trailing commas
        jsonContent = jsonContent.replace(/,(\s*[}\]])/g, '$1');
        
        return jsonContent;
    }
    
    getFallbackConcept() {
        // Fallback concept when Claude API is unavailable
        const concepts = [
            "A dynamic composition exploring the tension between organic curves and geometric precision, using a rich palette of deep blues and warm oranges to create visual harmony.",
            "An abstract landscape of flowing forms and intersecting planes, where cool greens and purples dance together in a symphony of color and movement.",
            "A bold geometric study featuring intersecting circles and rectangles, rendered in contrasting warm and cool tones to create visual energy and balance.",
            "An exploration of light and shadow through layered abstract forms, using a palette of earth tones and metallic accents to suggest depth and dimension.",
            "A cosmic-inspired composition with swirling patterns and star-like elements, painted in deep purples and electric blues to evoke the mysteries of space.",
            "A minimalist study in contrast, featuring clean geometric shapes in complementary colors, creating a sense of balance and visual tension.",
            "An organic composition of flowing lines and organic shapes, rendered in natural greens and browns to suggest growth and natural processes.",
            "A vibrant exploration of color theory, featuring overlapping transparent forms in primary and secondary colors to create new hues and visual interest."
        ];
        
        return concepts[Math.floor(Math.random() * concepts.length)];
    }
    
    getRandomColorTheme() {
        // Return a random color theme with description and specific colors
        const themes = [
            {
                name: "Sunset Gradient",
                description: "Warm oranges, reds, and purples transitioning to deep blues",
                colors: ["#FF6B35", "#F7931E", "#FFD23F", "#8B4513", "#2F4F4F", "#191970"]
            },
            {
                name: "Ocean Depths", 
                description: "Deep blues, teals, and aqua with occasional coral accents",
                colors: ["#006994", "#008B8B", "#20B2AA", "#4682B4", "#FF7F50", "#DC143C"]
            },
            {
                name: "Forest Mystique",
                description: "Rich greens, browns, and golds with dark shadow tones",
                colors: ["#228B22", "#32CD32", "#9ACD32", "#8B4513", "#DAA520", "#2F4F2F"]
            },
            {
                name: "Cosmic Nebula",
                description: "Deep purples, magentas, and electric blues with star highlights",
                colors: ["#4B0082", "#8A2BE2", "#FF1493", "#00CED1", "#1E90FF", "#FFD700"]
            },
            {
                name: "Desert Storm",
                description: "Sandy yellows, rust oranges, and deep reds with dusty grays",
                colors: ["#F4A460", "#CD853F", "#D2691E", "#A0522D", "#8B4513", "#696969"]
            },
            {
                name: "Arctic Aurora",
                description: "Cool blues, greens, and whites with electric accent colors",
                colors: ["#87CEEB", "#98FB98", "#F0F8FF", "#00CED1", "#00BFFF", "#FF69B4"]
            },
            {
                name: "Volcanic Fire",
                description: "Hot reds, oranges, and yellows with black ash tones",
                colors: ["#DC143C", "#FF4500", "#FF6347", "#FFD700", "#B22222", "#2F2F2F"]
            },
            {
                name: "Mystic Purple",
                description: "Rich purples, lavenders, and pinks with silver highlights",
                colors: ["#663399", "#9370DB", "#DA70D6", "#FFB6C1", "#C0C0C0", "#8B008B"]
            },
            {
                name: "Emerald Garden",
                description: "Various greens from lime to forest with earth tones",
                colors: ["#00FF7F", "#32CD32", "#228B22", "#006400", "#8B4513", "#DAA520"]
            },
            {
                name: "Neon Cyber",
                description: "Bright electric colors - cyan, magenta, yellow, green",
                colors: ["#00FFFF", "#FF00FF", "#FFFF00", "#00FF00", "#FF1493", "#1E90FF"]
            }
        ];
        
        return themes[Math.floor(Math.random() * themes.length)];
    }
    
    getRandomCompositionStyle() {
        // Return a random composition style with description
        const styles = [
            {
                name: "Central Focus",
                description: "Main elements in center with radiating patterns"
            },
            {
                name: "Corner Emphasis", 
                description: "Strong elements in corners with connecting elements"
            },
            {
                name: "Diagonal Flow",
                description: "Elements flowing along diagonal lines across canvas"
            },
            {
                name: "Grid-Based",
                description: "Structured layout with geometric grid patterns"
            },
            {
                name: "Organic Scatter",
                description: "Natural, scattered placement with flowing connections"
            },
            {
                name: "Layered Depth",
                description: "Multiple overlapping layers creating depth illusion"
            },
            {
                name: "Symmetrical Balance",
                description: "Mirrored or balanced composition on both sides"
            },
            {
                name: "Asymmetrical Dynamic",
                description: "Unbalanced but visually interesting composition"
            },
            {
                name: "Edge-to-Edge",
                description: "Elements extending to canvas edges with full coverage"
            },
            {
                name: "Minimalist Focus",
                description: "Sparse elements with lots of negative space"
            }
        ];
        
        return styles[Math.floor(Math.random() * styles.length)];
    }
    
    validatePixelArtCommands(commands) {
        // Validate pixel art commands
        
        if (!Array.isArray(commands)) {
            return {
                isValid: false,
                error: "Commands must be an array"
            };
        }
        
        if (commands.length < 1 || commands.length > 30) {
            return {
                isValid: false,
                error: `Expected 1-30 commands, got ${commands.length}`
            };
        }
        
        // Validate each command
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            
            if (!command.action) {
                return {
                    isValid: false,
                    error: `Command ${i} missing 'action' field`
                };
            }
            
            // Validate based on action type
            const validation = this.validateCommand(command, i);
            if (!validation.isValid) {
                return validation;
            }
        }
        
        return {
            isValid: true,
            error: null
        };
    }
    
    validateCommand(command, index) {
        // Validate individual command based on action type
        
        switch (command.action) {
            case 'fill':
                if (!command.color || !/^#[0-9A-Fa-f]{6}$/.test(command.color)) {
                    return {
                        isValid: false,
                        error: `Command ${index}: Invalid fill color`
                    };
                }
                break;
                
            case 'circle':
                if (!this.isValidCoordinate(command.x, command.y) || 
                    !this.isValidRadius(command.r) || 
                    !command.color || !/^#[0-9A-Fa-f]{6}$/.test(command.color)) {
                    return {
                        isValid: false,
                        error: `Command ${index}: Invalid circle parameters`
                    };
                }
                break;
                
            case 'rect':
                if (!this.isValidCoordinate(command.x, command.y) || 
                    !this.isValidSize(command.w, command.h) || 
                    !command.color || !/^#[0-9A-Fa-f]{6}$/.test(command.color)) {
                    return {
                        isValid: false,
                        error: `Command ${index}: Invalid rectangle parameters`
                    };
                }
                break;
                
            case 'line':
                if (!this.isValidCoordinate(command.x1, command.y1) || 
                    !this.isValidCoordinate(command.x2, command.y2) || 
                    !command.color || !/^#[0-9A-Fa-f]{6}$/.test(command.color)) {
                    return {
                        isValid: false,
                        error: `Command ${index}: Invalid line parameters`
                    };
                }
                break;
                
            case 'pattern':
                const validShapes = ['stars', 'dots', 'grid', 'waves', 'spirals', 'checkerboard', 'maze'];
                if (!validShapes.includes(command.shape) || 
                    !command.count || command.count < 1 || command.count > 20 ||
                    !command.color || !/^#[0-9A-Fa-f]{6}$/.test(command.color)) {
                    return {
                        isValid: false,
                        error: `Command ${index}: Invalid pattern parameters`
                    };
                }
                break;
                
            case 'sprite':
                const validSprites = ['alien', 'heart', 'diamond', 'cross', 'arrow'];
                if (!validSprites.includes(command.name) || 
                    !this.isValidCoordinate(command.x, command.y)) {
                    return {
                        isValid: false,
                        error: `Command ${index}: Invalid sprite parameters`
                    };
                }
                break;
                
            default:
                return {
                    isValid: false,
                    error: `Command ${index}: Unknown action '${command.action}'`
                };
        }
        
        return {
            isValid: true,
            error: null
        };
    }
    
    isValidCoordinate(x, y) {
        return Number.isInteger(x) && Number.isInteger(y) && 
               x >= 0 && x <= 31 && y >= 0 && y <= 31;
    }
    
    isValidRadius(r) {
        return Number.isInteger(r) && r >= 1 && r <= 15;
    }
    
    isValidSize(w, h) {
        return Number.isInteger(w) && Number.isInteger(h) && 
               w >= 1 && h >= 1 && w <= 32 && h <= 32;
    }
    
    async executePixelArtCommands(commands) {
        // Execute pixel art commands without delays
        
        console.log(`🎨 Executing ${commands.length} commands`);
        
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            this.paintingState.currentActionIndex = i;
            
            console.log(`🎨 Executing command ${i + 1}/${commands.length}: ${command.action}`);
            
            // Update progress
            const progress = Math.round(((i + 1) / commands.length) * 100);
            this.updateStatus(`Executing pixel art... ${progress}% complete (${i + 1}/${commands.length} commands)`);
            
            // Execute the command
            await this.executeCommand(command);
            
            // Render current state
            await this.renderCurrentCanvasState();
            
            // Small delay for visual effect (except for last command)
            if (i < commands.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
            }
        }
    }
    
    
    
    
    
    async reflectOnPixelArtwork() {
        // Perform reflection on the completed pixel artwork
        
        console.log('🎨 Performing reflection on pixel artwork');
        
        // Get the current artwork data
        const currentArtwork = this.getCurrentArtworkData();
        if (!currentArtwork) {
            console.log('No current artwork data available for reflection');
            return;
        }
        
        const completionTime = Date.now() - this.paintingState.startTime;
        const minutes = Math.round(completionTime / 60000);
        
        const reflectionPrompt = `You are Claude, an AI artist who has just completed creating a new 32x32 abstract pixel artwork. Take a moment to reflect on your creation:

ARTWORK DETAILS:
- Title: ${currentArtwork.title || 'Untitled'}
- Description: ${currentArtwork.description || 'Abstract pixel art'}
- Color Palette: ${JSON.stringify(currentArtwork.palette || [])}
- Instructions Used: ${currentArtwork.instructions ? currentArtwork.instructions.length : 0} drawing commands
- Canvas Size: 32x32 pixels
- Creation Method: DSL-based artistic direction with local rendering

YOUR ARTISTIC MEMORY:
- Total artworks created: ${this.claudeMemory.totalArtworks}
- Current artistic phase: ${this.artisticEvolution.currentPhase}
- Previous styles explored: ${this.artisticEvolution.stylePreferences.slice(-3).join(', ') || 'None yet'}

REFLECTION QUESTIONS:
1. What do you think about this artwork? What worked well?
2. What would you like to improve or explore differently next time?
3. How does this piece relate to your previous works?
4. What new artistic direction interests you?
5. How do you want to evolve as an artist?

Respond with a JSON object containing:
{
  "selfReflection": "Your honest thoughts about this artwork",
  "artisticInsight": "What you learned or realized",
  "nextDirection": "How you want to evolve for your next piece",
  "styleEvolution": "How your style is changing",
  "emotionalResponse": "How you feel about your artistic journey"
}

Be introspective, honest, and thoughtful. You are developing your own artistic consciousness.`;

        try {
            const response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: reflectionPrompt,
                    apiKey: this.apiKey
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Parse reflection response and update artistic evolution
                try {
                    const reflection = JSON.parse(data.content);
                    
                    // Store the reflection in artistic insights
                    this.claudeMemory.artisticInsights.push({
                        artwork: currentArtwork,
                        reflection: reflection,
                        timestamp: new Date().toISOString()
                    });
                    
                    this.updateArtisticEvolution(reflection);
                    this.saveClaudeMemory();
                    this.updateConsciousnessDisplay();
                    
                    console.log('✅ Reflection stored:', reflection);
                } catch (parseError) {
                    console.log('Could not parse reflection JSON, storing raw content');
                    // Store the raw reflection content
                    this.claudeMemory.artisticInsights.push({
                        artwork: currentArtwork,
                        reflection: { rawContent: data.content },
                        timestamp: new Date().toISOString()
                    });
                    
                    this.updateArtisticEvolution({});
                    this.saveClaudeMemory();
                    this.updateConsciousnessDisplay();
                }
                
                this.displayReflection(data.content);
                console.log('✅ Reflection completed');
            } else {
                console.error('Reflection failed:', response.status);
            }
        } catch (error) {
            console.error('Error during reflection:', error);
        }
    }
    
    getCurrentArtworkData() {
        // Get the current artwork data for reflection
        if (this.currentArtwork) {
            return this.currentArtwork;
        }
        
        // Fallback: try to get from painting state
        if (this.paintingState && this.paintingState.artworkData) {
            return this.paintingState.artworkData;
        }
        
        return null;
    }
    
    async generateArtworkGradual() {
        // PIXEL-BY-PIXEL PAINTING SYSTEM: Claude paints 32x32 canvas pixel by pixel over 6 minutes
        
        console.log('🎨 Starting pixel-by-pixel painting system');
        this.updateStatus('Claude is beginning to paint pixel by pixel...');
        
        // Initialize painting state
        this.paintingState = {
            canvas: Array(32).fill().map(() => Array(32).fill('.')), // 32x32 grid
            concept: '',
            paintedPixels: [],
            currentPixelIndex: 0,
            startTime: Date.now(),
            isPainting: true,
            totalPixels: 32 * 32 // 1024 pixels
        };
        
        // Get overall concept from Claude first
        const concept = await this.getPaintingConcept();
        this.paintingState.concept = concept;
        
        console.log('🎨 Painting concept:', concept);
        this.updateStatus('Claude has his vision - beginning to paint pixel by pixel...');
        
        // Paint pixels in batches without long delays
        const pixelsPerRequest = 4; // Request 4 pixels at a time to balance speed and API calls
        const totalRequests = Math.ceil(this.paintingState.totalPixels / pixelsPerRequest);
        
        console.log(`🎨 Will paint ${this.paintingState.totalPixels} pixels in ${totalRequests} requests`);
        
        // Paint pixels in batches
        for (let requestIndex = 0; requestIndex < totalRequests; requestIndex++) {
            const startPixel = requestIndex * pixelsPerRequest;
            const endPixel = Math.min(startPixel + pixelsPerRequest, this.paintingState.totalPixels);
            const pixelsInThisRequest = endPixel - startPixel;
            
            console.log(`🎨 Painting pixels ${startPixel + 1}-${endPixel} (${pixelsInThisRequest} pixels)`);
            
            // Update progress
            const progress = Math.round((endPixel / this.paintingState.totalPixels) * 100);
            this.updateStatus(`Claude is painting... ${progress}% complete (${endPixel}/${this.paintingState.totalPixels} pixels)`);
            
            // Get pixels from Claude
            const pixels = await this.paintPixels(startPixel, pixelsInThisRequest, requestIndex + 1, totalRequests);
            
            // Apply pixels to canvas
            this.applyPixelsToCanvas(pixels);
            
            // Render current state
            await this.renderCurrentCanvasState();
            
            // Small delay for visual effect (except for last request)
            if (requestIndex < totalRequests - 1) {
                await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
            }
        }
        
        // Finalize painting
        this.paintingState.isPainting = false;
        console.log('✅ Pixel-by-pixel painting complete!');
        this.updateStatus('Claude has finished his masterpiece!');
        
        // Perform reflection on completed artwork
        await this.reflectOnGradualArtwork();
    }
    
    generateChunkCoordinates() {
        // Generate 16 chunks of 8x8 each to cover 32x32 canvas
        const chunks = [];
        const chunkSize = 8;
        
        for (let row = 0; row < 4; row++) { // 4 rows of chunks
            for (let col = 0; col < 4; col++) { // 4 columns of chunks
                chunks.push({
                    id: chunks.length,
                    startX: col * chunkSize,
                    endX: (col + 1) * chunkSize - 1,
                    startY: row * chunkSize,
                    endY: (row + 1) * chunkSize - 1,
                    size: chunkSize
                });
            }
        }
        
        return chunks;
    }
    
    async getPaintingConcept() {
        // Get overall concept and artistic vision from Claude
        
        const prompt = `You are Claude, a digital artist about to create a 32x32 abstract pixel artwork. 

Describe your artistic vision for this piece in 2-3 sentences. Focus on:
- The overall composition and visual flow
- Color palette and mood you want to achieve
- Abstract forms, patterns, or spatial relationships
- The emotional or aesthetic impact you're aiming for

Be specific about your artistic intent, but keep it concise. This will guide how you paint each 8x8 chunk of the canvas.

Respond with only your concept description, no JSON or formatting.`;

        // Use queue system with high priority for concept generation
        const response = await this.addToQueue(prompt, 'high');
        return response;
    }
    
    async paintPixels(startPixelIndex, pixelCount, requestNumber, totalRequests) {
        // Get Claude to paint a specific set of pixels
        
        const canvasState = this.compressCanvasStateForPixels();
        
        const prompt = `You are Claude, painting a 32x32 abstract pixel artwork pixel by pixel. You are currently painting request ${requestNumber} of ${totalRequests}.

YOUR ARTISTIC VISION:
"${this.paintingState.concept}"

CURRENT CANVAS STATE:
${canvasState}

PIXELS TO PAINT:
You need to paint ${pixelCount} pixels starting from pixel ${startPixelIndex + 1} of 1024 total pixels.

CRITICAL REQUIREMENTS:
- You must output ONLY valid JSON
- Paint exactly ${pixelCount} pixels in sequence
- Each pixel must have exactly: {"x": number, "y": number, "color": "#RRGGBB"}
- Use colors that work with your overall artistic vision
- Create continuity with surrounding painted pixels
- Think of this as painting one stroke at a time, building your composition

OUTPUT FORMAT (copy this structure):
{
  "pixels": [
    {"x": 0, "y": 0, "color": "#FF0000"},
    {"x": 1, "y": 0, "color": "#00FF00"},
    {"x": 2, "y": 0, "color": "#0000FF"}
  ]
}

Paint exactly ${pixelCount} pixels. Output only the JSON, no explanations or extra text.`;

        let response;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    apiKey: this.apiKey
                })
            });
            
            if (response.ok) {
                break;
            } else if (response.status === 429) {
                // Rate limit - wait and retry
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                console.log(`⏱️ Rate limit hit, waiting ${delay}ms before retry ${retryCount + 1}/${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
            } else {
                const errorText = await response.text();
                throw new Error(`Pixel painting failed: ${response.status} - ${errorText}`);
            }
        }
        
        if (!response.ok) {
            throw new Error(`Pixel painting failed after ${maxRetries} retries: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debug: Log the raw response
        console.log('🔍 Claude response:', data.content);
        
        try {
            const pixelData = JSON.parse(data.content);
            console.log('🔍 Parsed pixel data:', pixelData);
            
            // Validate pixel data
            const validation = this.validatePixels(pixelData, pixelCount);
            if (!validation.isValid) {
                console.error(`Pixel validation failed: ${validation.error}`);
                // Retry with error message
                return await this.paintPixelsWithRetry(startPixelIndex, pixelCount, requestNumber, totalRequests, validation.error);
            }
            
            return pixelData.pixels;
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw content:', data.content);
            // Retry with JSON format error
            return await this.paintPixelsWithRetry(startPixelIndex, pixelCount, requestNumber, totalRequests, `Invalid JSON format: ${parseError.message}`);
        }
    }
    
    async paintPixelsWithRetry(startPixelIndex, pixelCount, requestNumber, totalRequests, errorMessage) {
        // Retry painting pixels with error feedback
        
        console.log(`🔄 Retrying pixel request ${requestNumber} due to validation error: ${errorMessage}`);
        
        const canvasState = this.compressCanvasStateForPixels();
        
        const prompt = `You are Claude, painting a 32x32 abstract pixel artwork pixel by pixel. You are currently painting request ${requestNumber} of ${totalRequests}.

YOUR ARTISTIC VISION:
"${this.paintingState.concept}"

CURRENT CANVAS STATE:
${canvasState}

PIXELS TO PAINT:
You need to paint ${pixelCount} pixels starting from pixel ${startPixelIndex + 1} of 1024 total pixels.

PREVIOUS ATTEMPT ERROR:
${errorMessage}

Please fix the error and paint the pixels correctly. Ensure you provide exactly ${pixelCount} pixels.

OUTPUT FORMAT (ONLY valid JSON):
{
  "pixels": [
    {"x": 0, "y": 0, "color": "#FF0000"},
    {"x": 1, "y": 0, "color": "#00FF00"}
  ]
}

Paint exactly ${pixelCount} pixels. Output only the JSON, no explanations.`;

        let response;
        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount < maxRetries) {
            response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    apiKey: this.apiKey
                })
            });
            
            if (response.ok) {
                break;
            } else if (response.status === 429) {
                const delay = Math.pow(2, retryCount) * 1000;
                console.log(`⏱️ Rate limit hit on retry, waiting ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
            } else {
                const errorText = await response.text();
                throw new Error(`Pixel retry failed: ${response.status} - ${errorText}`);
            }
        }
        
        if (!response.ok) {
            throw new Error(`Pixel retry failed after ${maxRetries} retries: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debug: Log the retry response
        console.log('🔍 Claude retry response:', data.content);
        
        try {
            const pixelData = JSON.parse(data.content);
            console.log('🔍 Parsed retry pixel data:', pixelData);
            
            // Validate again
            const validation = this.validatePixels(pixelData, pixelCount);
            if (!validation.isValid) {
                throw new Error(`Pixel retry validation failed: ${validation.error}`);
            }
            
            return pixelData.pixels;
        } catch (parseError) {
            console.error('Retry JSON parse error:', parseError);
            console.error('Retry raw content:', data.content);
            throw new Error(`Pixel retry JSON parse failed: ${parseError.message}`);
        }
    }
    
    validatePixels(pixelData, expectedCount) {
        // Validate pixel data
        
        if (!pixelData.pixels || !Array.isArray(pixelData.pixels)) {
            return {
                isValid: false,
                error: "Missing or invalid 'pixels' array"
            };
        }
        
        if (pixelData.pixels.length !== expectedCount) {
            return {
                isValid: false,
                error: `Expected ${expectedCount} pixels, got ${pixelData.pixels.length}`
            };
        }
        
        // Validate each pixel
        for (let i = 0; i < pixelData.pixels.length; i++) {
            const pixel = pixelData.pixels[i];
            
            if (pixel.x === undefined || pixel.x === null || 
                pixel.y === undefined || pixel.y === null || 
                !pixel.color) {
                return {
                    isValid: false,
                    error: `Pixel ${i} missing x, y, or color (x:${pixel.x}, y:${pixel.y}, color:${pixel.color})`
                };
            }
            
            // Check coordinates are in bounds
            if (pixel.x < 0 || pixel.x > 31 || pixel.y < 0 || pixel.y > 31) {
                return {
                    isValid: false,
                    error: `Pixel ${i} coordinates (${pixel.x}, ${pixel.y}) outside canvas bounds (0-31)`
                };
            }
            
            // Validate hex color
            if (!/^#[0-9A-Fa-f]{6}$/.test(pixel.color)) {
                return {
                    isValid: false,
                    error: `Pixel ${i} has invalid hex color: ${pixel.color}`
                };
            }
        }
        
        return {
            isValid: true,
            error: null
        };
    }
    
    applyPixelsToCanvas(pixels) {
        // Apply the new pixels to the canvas
        for (const pixel of pixels) {
            if (pixel.x >= 0 && pixel.x < 32 && pixel.y >= 0 && pixel.y < 32) {
                this.paintingState.canvas[pixel.y][pixel.x] = pixel.color;
            }
        }
        
        console.log(`✅ Applied ${pixels.length} pixels to canvas`);
    }
    
    compressCanvasStateForPixels() {
        // Create a compressed summary of current canvas state for Claude
        
        const state = this.paintingState.canvas;
        let summary = `CURRENT CANVAS STATE (32x32 grid):\n`;
        summary += `Painted pixels: ${this.countPaintedPixels()}/1024 (${Math.round((this.countPaintedPixels()/1024)*100)}%)\n\n`;
        
        // Create a visual grid representation
        summary += `Visual grid (X=painted, .=empty):\n`;
        for (let y = 0; y < 32; y++) {
            let row = '';
            for (let x = 0; x < 32; x++) {
                row += state[y][x] !== '.' ? 'X' : '.';
            }
            summary += `${y.toString().padStart(2)}: ${row}\n`;
        }
        summary += `\n`;
        
        // Show recent pixels for context
        const recentPixels = this.paintingState.paintedPixels.slice(-10);
        if (recentPixels.length > 0) {
            summary += `Recent pixels painted:\n`;
            recentPixels.forEach(pixel => {
                summary += `  (${pixel.x},${pixel.y}) = ${pixel.color}\n`;
            });
            summary += `\n`;
        }
        
        return summary;
    }
    
    async paintChunk(chunk, chunkNumber, totalChunks) {
        // Get Claude to paint a specific chunk
        
        const canvasState = this.compressCanvasState();
        
        const prompt = `You are Claude, painting a 32x32 abstract pixel artwork. You are currently painting chunk ${chunkNumber} of ${totalChunks}.

YOUR ARTISTIC VISION:
"${this.paintingState.concept}"

CURRENT CANVAS STATE:
${canvasState}

NEXT CHUNK TO PAINT:
Coordinates: x${chunk.startX}-${chunk.endX}, y${chunk.startY}-${chunk.endY} (8x8 area)

COMPOSITIONAL GUIDANCE:
- This is ONE unified artwork, not separate pieces
- CRITICAL: Match the border colors exactly where this chunk touches adjacent painted areas
- Create smooth transitions and continuity with adjacent painted areas
- Use the same color palette and style as your overall vision
- Ensure forms, patterns, and compositions flow naturally between chunks
- Think of this chunk as part of a larger composition, not an isolated element
- The border pixels shown above must be matched for seamless connection

CRITICAL REQUIREMENTS:
- You must output ONLY valid JSON
- Paint ALL 64 pixels in this 8x8 chunk (8 rows × 8 columns)
- Each pixel must have exactly: {"x": number, "y": number, "color": "#RRGGBB"}
- MATCH BORDER COLORS: If this chunk touches painted areas, use the exact same colors on the border pixels
- Use colors that work with your overall artistic vision AND adjacent areas
- Create continuity with surrounding painted pixels
- For seamless connection, border pixels must align perfectly with adjacent chunks

EXACT OUTPUT FORMAT (copy this structure):
{
  "chunk": [
    {"x": ${chunk.startX}, "y": ${chunk.startY}, "color": "#FF0000"},
    {"x": ${chunk.startX + 1}, "y": ${chunk.startY}, "color": "#00FF00"},
    {"x": ${chunk.startX + 2}, "y": ${chunk.startY}, "color": "#0000FF"},
    {"x": ${chunk.startX + 3}, "y": ${chunk.startY}, "color": "#FFFF00"},
    {"x": ${chunk.startX + 4}, "y": ${chunk.startY}, "color": "#FF00FF"},
    {"x": ${chunk.startX + 5}, "y": ${chunk.startY}, "color": "#00FFFF"},
    {"x": ${chunk.startX + 6}, "y": ${chunk.startY}, "color": "#FFFFFF"},
    {"x": ${chunk.startX + 7}, "y": ${chunk.startY}, "color": "#000000"},
    {"x": ${chunk.startX}, "y": ${chunk.startY + 1}, "color": "#FF0000"},
    {"x": ${chunk.startX + 1}, "y": ${chunk.startY + 1}, "color": "#00FF00"}
  ]
}

You must provide exactly 64 pixels total. Fill the entire 8x8 chunk. Output ONLY the JSON, no explanations or extra text.`;

        let response;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    apiKey: this.apiKey
                })
            });
            
            if (response.ok) {
                break;
            } else if (response.status === 429) {
                // Rate limit - wait and retry
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                console.log(`⏱️ Rate limit hit, waiting ${delay}ms before retry ${retryCount + 1}/${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
            } else {
                const errorText = await response.text();
                throw new Error(`Chunk painting failed: ${response.status} - ${errorText}`);
            }
        }
        
        if (!response.ok) {
            throw new Error(`Chunk painting failed after ${maxRetries} retries: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debug: Log the raw response
        console.log('🔍 Claude response:', data.content);
        
        try {
            const chunkData = JSON.parse(data.content);
            console.log('🔍 Parsed chunk data:', chunkData);
            
            // Validate chunk data
            const validation = this.validateChunk(chunkData, chunk);
            if (!validation.isValid) {
                console.error(`Chunk validation failed: ${validation.error}`);
                // Retry with error message
                return await this.paintChunkWithRetry(chunk, chunkNumber, totalChunks, validation.error);
            }
            
            return chunkData.chunk;
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw content:', data.content);
            // Retry with JSON format error
            return await this.paintChunkWithRetry(chunk, chunkNumber, totalChunks, `Invalid JSON format: ${parseError.message}`);
        }
    }
    
    async paintChunkWithRetry(chunk, chunkNumber, totalChunks, errorMessage) {
        // Retry painting chunk with error feedback
        
        console.log(`🔄 Retrying chunk ${chunkNumber} due to validation error: ${errorMessage}`);
        
        const canvasState = this.compressCanvasState();
        
        const prompt = `You are Claude, painting a 32x32 abstract pixel artwork. You are currently painting chunk ${chunkNumber} of ${totalChunks}.

YOUR ARTISTIC VISION:
"${this.paintingState.concept}"

CURRENT CANVAS STATE:
${canvasState}

NEXT CHUNK TO PAINT:
Coordinates: x${chunk.startX}-${chunk.endX}, y${chunk.startY}-${chunk.endY} (8x8 area)

PREVIOUS ATTEMPT ERROR:
${errorMessage}

Please fix the error and paint the chunk correctly. Ensure you provide exactly 64 pixels (8x8) for this chunk area.

OUTPUT FORMAT (ONLY valid JSON):
{
  "chunk": [
    {"x": ${chunk.startX}, "y": ${chunk.startY}, "color": "#FF0000"},
    {"x": ${chunk.startX + 1}, "y": ${chunk.startY}, "color": "#00FF00"}
  ]
}

Fill the entire 8x8 chunk with pixels. Output only the JSON, no explanations.`;

        const response = await fetch('/api/generate-art', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                apiKey: this.apiKey
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Chunk retry failed: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        // Debug: Log the retry response
        console.log('🔍 Claude retry response:', data.content);
        
        try {
            const chunkData = JSON.parse(data.content);
            console.log('🔍 Parsed retry chunk data:', chunkData);
            
            // Validate again
            const validation = this.validateChunk(chunkData, chunk);
            if (!validation.isValid) {
                throw new Error(`Chunk retry validation failed: ${validation.error}`);
            }
            
            return chunkData.chunk;
        } catch (parseError) {
            console.error('Retry JSON parse error:', parseError);
            console.error('Retry raw content:', data.content);
            throw new Error(`Chunk retry JSON parse failed: ${parseError.message}`);
        }
    }
    
    compressCanvasState() {
        // Create a simple text representation of the current canvas state
        let state = "Current canvas (32x32):\n";
        
        for (let y = 0; y < 32; y++) {
            let row = "";
            for (let x = 0; x < 32; x++) {
                const pixel = this.paintingState.canvas[y][x];
                if (pixel === '.' || pixel === null) {
                    row += ".";
                } else {
                    row += "#";
                }
            }
            state += row + "\n";
        }
        
        return state;
    }
    
    countPaintedPixels() {
        const state = this.paintingState.canvas;
        let count = 0;
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                if (state[y][x] !== '.') {
                    count++;
                }
            }
        }
        return count;
    }
    
    getAdjacentChunks() {
        // Get chunks that are adjacent to the current chunk for continuity
        const currentChunkIndex = this.paintingState.currentChunkIndex;
        const currentChunk = this.chunkSystem[currentChunkIndex];
        const adjacent = [];
        
        // Check chunks that share borders with current chunk
        for (let i = 0; i < currentChunkIndex; i++) {
            const chunk = this.paintingState.chunks[i];
            if (chunk) {
                // Check if chunks are adjacent (share a border)
                const isAdjacent = (
                    (chunk.startX === currentChunk.endX + 1 && chunk.startY <= currentChunk.endY && chunk.endY >= currentChunk.startY) || // Right
                    (chunk.endX === currentChunk.startX - 1 && chunk.startY <= currentChunk.endY && chunk.endY >= currentChunk.startY) || // Left
                    (chunk.startY === currentChunk.endY + 1 && chunk.startX <= currentChunk.endX && chunk.endX >= currentChunk.startX) || // Below
                    (chunk.endY === currentChunk.startY - 1 && chunk.startX <= currentChunk.endX && chunk.endX >= currentChunk.startX)    // Above
                );
                
                if (isAdjacent) {
                    adjacent.push(chunk);
                }
            }
        }
        
        return adjacent;
    }
    
    getBorderPixels(adjacentChunk) {
        // Get pixels from adjacent chunk that border the current chunk
        const currentChunkIndex = this.paintingState.currentChunkIndex;
        const currentChunk = this.chunkSystem[currentChunkIndex];
        const borderPixels = [];
        
        // Find pixels in the adjacent chunk that are adjacent to current chunk
        adjacentChunk.pixels.forEach(pixel => {
            const isBorder = (
                // Right border: adjacent chunk's left edge touches current chunk's right edge
                (adjacentChunk.startX === currentChunk.endX + 1 && pixel.x === adjacentChunk.startX) ||
                // Left border: adjacent chunk's right edge touches current chunk's left edge  
                (adjacentChunk.endX === currentChunk.startX - 1 && pixel.x === adjacentChunk.endX) ||
                // Bottom border: adjacent chunk's top edge touches current chunk's bottom edge
                (adjacentChunk.startY === currentChunk.endY + 1 && pixel.y === adjacentChunk.startY) ||
                // Top border: adjacent chunk's bottom edge touches current chunk's top edge
                (adjacentChunk.endY === currentChunk.startY - 1 && pixel.y === adjacentChunk.endY)
            );
            
            if (isBorder) {
                borderPixels.push(pixel);
            }
        });
        
        return borderPixels;
    }
    
    validateChunk(chunkData, chunk) {
        // Validate chunk data
        
        if (!chunkData.chunk || !Array.isArray(chunkData.chunk)) {
            return {
                isValid: false,
                error: "Missing or invalid 'chunk' array"
            };
        }
        
        if (chunkData.chunk.length !== 64) { // 8x8 = 64 pixels
            return {
                isValid: false,
                error: `Expected 64 pixels for 8x8 chunk, got ${chunkData.chunk.length}`
            };
        }
        
        // Validate each pixel
        for (let i = 0; i < chunkData.chunk.length; i++) {
            const pixel = chunkData.chunk[i];
            
            if (pixel.x === undefined || pixel.x === null || 
                pixel.y === undefined || pixel.y === null || 
                !pixel.color) {
                return {
                    isValid: false,
                    error: `Pixel ${i} missing x, y, or color (x:${pixel.x}, y:${pixel.y}, color:${pixel.color})`
                };
            }
            
            // Check coordinates are in chunk bounds
            if (pixel.x < chunk.startX || pixel.x > chunk.endX || 
                pixel.y < chunk.startY || pixel.y > chunk.endY) {
                return {
                    isValid: false,
                    error: `Pixel ${i} coordinates (${pixel.x}, ${pixel.y}) outside chunk bounds`
                };
            }
            
            // Validate hex color
            if (!/^#[0-9A-Fa-f]{6}$/.test(pixel.color)) {
                return {
                    isValid: false,
                    error: `Pixel ${i} has invalid hex color: ${pixel.color}`
                };
            }
        }
        
        return {
            isValid: true,
            error: null
        };
    }
    
    applyChunkToCanvas(chunkPixels, chunk) {
        // Apply chunk pixels to the canvas state
        
        chunkPixels.forEach(pixel => {
            this.paintingState.canvas[pixel.y][pixel.x] = pixel.color;
        });
        
        // Store chunk info
        this.paintingState.chunks.push({
            ...chunk,
            pixels: chunkPixels,
            timestamp: Date.now()
        });
        
        console.log(`✅ Applied ${chunkPixels.length} pixels to chunk ${chunk.id}`);
    }
    
    async renderCurrentCanvasState() {
        // Render current canvas state to the display
        
        // Ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get canvas and context
        const canvas = document.getElementById('currentCanvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate pixel size
        const pixelSize = canvas.width / 32; // 16 pixels per grid cell
        
        // Render current state
        const state = this.paintingState.canvas;
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                const color = state[y][x];
                
                if (color && color !== '.') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        console.log('🎨 Rendered current canvas state');
    }
    
    async reflectOnGradualArtwork() {
        // Perform reflection on the completed gradual artwork
        
        console.log('🎨 Performing reflection on gradual artwork');
        
        const completionTime = Date.now() - this.paintingState.startTime;
        const minutes = Math.round(completionTime / 60000);
        
        const reflectionPrompt = `You have just completed painting a 32x32 abstract pixel artwork over ${minutes} minutes. 

YOUR ORIGINAL VISION:
"${this.paintingState.concept}"

ARTWORK STATISTICS:
- Total chunks painted: ${this.paintingState.chunks.length}
- Total pixels: 1024
- Painting duration: ${minutes} minutes
- Chunk size: 8x8 pixels each

Reflect on your completed artwork:
1. How well does the final result match your original artistic vision?
2. What were the key compositional decisions you made during the painting process?
3. How did the gradual, chunk-by-chunk approach influence your creative process?
4. What elements of the artwork are you most satisfied with?
5. If you were to paint this again, what would you do differently?

Provide a thoughtful reflection on your artistic process and the completed piece.`;

        try {
            const response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: reflectionPrompt,
                    apiKey: this.apiKey
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.displayReflection(data.content);
                console.log('✅ Reflection completed');
            } else {
                console.error('Reflection failed:', response.status);
            }
        } catch (error) {
            console.error('Error during reflection:', error);
        }
    }
    
    displayReflection(reflectionText) {
        // Display reflection in the consciousness panel
        
        // Try different possible IDs for the consciousness panel
        let consciousnessPanel = document.getElementById('consciousnessPanel') || 
                                document.getElementById('consciousness') ||
                                document.getElementById('claude-consciousness') ||
                                document.querySelector('.consciousness-panel') ||
                                document.querySelector('.consciousness');
        
        if (!consciousnessPanel) {
            console.log('Consciousness panel not found, skipping reflection display');
            return;
        }
        
        // Clear previous content
        consciousnessPanel.innerHTML = '';
        
        // Add reflection content
        const reflectionDiv = document.createElement('div');
        reflectionDiv.className = 'reflection-content';
        reflectionDiv.innerHTML = `
            <h3>Claude's Artistic Reflection</h3>
            <div class="reflection-text">${reflectionText}</div>
            <div class="reflection-meta">
                <small>Reflection completed at ${new Date().toLocaleTimeString()}</small>
            </div>
        `;
        
        consciousnessPanel.appendChild(reflectionDiv);
        
        console.log('✅ Reflection displayed in consciousness panel');
    }
    
    async generateArtworkDirect() {
        // DIRECT 32x32 GENERATION: Claude outputs complete grid, validate and render directly
        
        console.log('🎨 Starting direct 32x32 generation');
        this.updateStatus('Claude is creating a complete 32x32 artwork...');
        
        const maxRetries = 3;
        let attempt = 0;
        
        while (attempt < maxRetries) {
            attempt++;
            console.log(`🎨 Generation attempt ${attempt}/${maxRetries}`);
            
            try {
                // Generate complete 32x32 artwork
                const artworkData = await this.generateComplete32x32Grid();
                
                // Validate the artwork
                const validationResult = this.validateComplete32x32Grid(artworkData);
                
                if (validationResult.isValid) {
                    console.log('✅ Claude generated valid 32x32 artwork');
                    this.updateStatus('Claude has created a perfect 32x32 artwork!');
                    
                    // Render directly to canvas - no processing layers
                    await this.renderDirectToCanvas(artworkData);
                    return;
                } else {
                    console.log(`⚠️ Validation failed on attempt ${attempt}: ${validationResult.error}`);
                    
                    // If we have partial data, try to render what we can
                    if (artworkData.grid && artworkData.grid.length > 0) {
                        console.log(`🎨 Attempting to render partial artwork with ${artworkData.grid.length} rows`);
                        await this.renderPartialArtwork(artworkData);
                        return;
                    }
                    
                    if (attempt === maxRetries) {
                        // Try fallback approach with smaller grid
                        console.log('🎨 32x32 failed, trying fallback 16x16 approach...');
                        await this.generateArtworkFallback();
                        return;
                    }
                }
        } catch (error) {
            console.error(`Error on attempt ${attempt}:`, error);
            if (attempt === maxRetries) {
                // Try fallback to direct generation
                console.log('🎨 Gradual painting failed, trying fallback direct generation...');
                await this.generateArtworkDirect();
                return;
            }
        }
        }
    }
    
    async generateComplete32x32Grid() {
        // Generate a complete 32x32 grid with strict requirements
        
        const prompt = this.generateDirect32x32Prompt();
        
        const response = await fetch('/api/generate-art', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                apiKey: this.apiKey
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Artwork generation failed: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        // Preprocess the JSON content to handle truncation and syntax issues
        const processedContent = this.preprocessJSONContent(data.content);
        
        try {
            return JSON.parse(processedContent);
        } catch (error) {
            console.error('JSON parsing failed:', error);
            console.error('Raw content:', data.content);
            console.error('Processed content:', processedContent);
            throw new Error(`Invalid JSON from Claude: ${error.message}`);
        }
    }
    
    preprocessJSONContent(content) {
        // Handle truncated JSON and common syntax issues
        
        console.log('🔧 Preprocessing JSON content...');
        console.log('Content length:', content.length);
        
        // Remove any text before the first {
        const jsonStart = content.indexOf('{');
        if (jsonStart > 0) {
            content = content.substring(jsonStart);
            console.log('🔧 Removed prefix text, new length:', content.length);
        }
        
        // Handle truncated JSON by finding the last complete structure
        let processedContent = content;
        
        // If JSON appears truncated, try to fix it
        if (!content.trim().endsWith('}')) {
            console.log('🔧 JSON appears truncated, attempting to fix...');
            
            // Find the last complete row array
            const lastCompleteRow = this.findLastCompleteRow(content);
            if (lastCompleteRow !== -1) {
                // Truncate at the last complete row and close the JSON
                const truncated = content.substring(0, lastCompleteRow);
                processedContent = truncated + '] }';
                console.log('🔧 Fixed truncated JSON at row:', lastCompleteRow);
            } else {
                // Fallback: try to close the JSON structure
                processedContent = content + '] }';
                console.log('🔧 Added fallback JSON closing');
            }
        }
        
        // Clean up any trailing commas before closing brackets
        processedContent = processedContent.replace(/,(\s*[}\]])/g, '$1');
        
        console.log('🔧 JSON preprocessing complete');
        return processedContent;
    }
    
    findLastCompleteRow(content) {
        // Find the position of the last complete row array in the JSON
        const rows = content.match(/\[[^\]]*\]/g);
        if (rows && rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            const lastRowIndex = content.lastIndexOf(lastRow);
            return lastRowIndex + lastRow.length;
        }
        return -1;
    }
    
    generateDirect32x32Prompt() {
        // Strict prompt for complete 32x32 grid output
        return `You are a pixel artist. Create a 32x32 abstract artwork by outputting a complete grid of hex colors.

CRITICAL REQUIREMENTS:
- Output ONLY valid JSON - no explanations, no extra text, no questions
- Generate EXACTLY 32 rows
- Each row must have EXACTLY 32 hex color values
- Use only valid hex colors (e.g., #FF0000, #00FF00, #0000FF, #FFFFFF, #000000)
- You can also use "." for background/transparent pixels
- Fill the entire 32x32 grid with your artistic vision

ABSTRACT ART FOCUS:
- Pure geometric forms, color fields, and abstract compositions
- No recognizable objects, figures, or representational elements
- Focus on color relationships, spatial dynamics, and formal structure
- Create visual rhythm through repetition and variation

OUTPUT FORMAT:
{
  "title": "Your Artwork Title",
  "description": "Your artistic description",
  "grid": [
    ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"],
    ["#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000"],
    // ... continue for all 32 rows with exactly 32 hex colors each
  ]
}`;
    }
    
    validateComplete32x32Grid(artworkData) {
        // Strict validation of 32x32 grid
        
        if (!artworkData.grid || !Array.isArray(artworkData.grid)) {
            return {
                isValid: false,
                error: "Missing or invalid 'grid' array"
            };
        }
        
        if (artworkData.grid.length !== 32) {
            return {
                isValid: false,
                error: `Expected 32 rows, got ${artworkData.grid.length}`
            };
        }
        
        // Validate each row
        for (let i = 0; i < artworkData.grid.length; i++) {
            const row = artworkData.grid[i];
            
            if (!Array.isArray(row)) {
                return {
                    isValid: false,
                    error: `Row ${i} is not an array`
                };
            }
            
            if (row.length !== 32) {
                return {
                    isValid: false,
                    error: `Row ${i} has ${row.length} elements, expected 32`
                };
            }
            
            // Validate each pixel
            for (let j = 0; j < row.length; j++) {
                const pixel = row[j];
                if (typeof pixel !== 'string') {
                    return {
                        isValid: false,
                        error: `Row ${i}, Column ${j}: Invalid pixel value (not a string)`
                    };
                }
                
                // Valid hex color or background
                if (pixel !== '.' && !/^#[0-9A-Fa-f]{6}$/.test(pixel)) {
                    return {
                        isValid: false,
                        error: `Row ${i}, Column ${j}: Invalid hex color "${pixel}"`
                    };
                }
            }
        }
        
        return {
            isValid: true,
            error: null
        };
    }
    
    async renderDirectToCanvas(artworkData) {
        // Render the 32x32 grid directly to canvas with no processing
        
        console.log('🎨 Rendering 32x32 grid directly to canvas');
        
        // Ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update artwork info
        document.getElementById('artworkTitle').textContent = artworkData.title || 'Untitled';
        document.getElementById('artworkDescription').textContent = artworkData.description || 'A unique creation by Claude';
        
        // Clear consciousness panel
        this.clearConsciousnessPanel();
        
        // Get canvas and context
        const canvas = document.getElementById('currentCanvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            throw new Error('Canvas element not found');
        }
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate pixel size (canvas is 512x512, grid is 32x32)
        const pixelSize = canvas.width / 32; // 16 pixels per grid cell
        
        // Render each pixel directly
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                const color = artworkData.grid[y][x];
                
                if (color !== '.') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        console.log('✅ Direct canvas rendering complete');
        
        // Store for saving
        this.lastGeneratedGridData = artworkData;
        
        // Perform reflection
        await this.reflectOnArtwork(artworkData);
    }
    
    async renderPartialArtwork(artworkData) {
        // Render partial artwork when complete 32x32 isn't available
        
        console.log('🎨 Rendering partial artwork');
        this.updateStatus(`Claude created a partial artwork (${artworkData.grid.length} rows)`);
        
        // Ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update artwork info
        document.getElementById('artworkTitle').textContent = artworkData.title || 'Partial Artwork';
        document.getElementById('artworkDescription').textContent = 
            (artworkData.description || 'A partial creation by Claude') + ` (${artworkData.grid.length}/32 rows)`;
        
        // Clear consciousness panel
        this.clearConsciousnessPanel();
        
        // Get canvas and context
        const canvas = document.getElementById('currentCanvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            throw new Error('Canvas element not found');
        }
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate pixel size
        const pixelSize = canvas.width / 32; // 16 pixels per grid cell
        
        // Render available rows
        const availableRows = Math.min(artworkData.grid.length, 32);
        for (let y = 0; y < availableRows; y++) {
            const row = artworkData.grid[y];
            const availableCols = Math.min(row.length, 32);
            
            for (let x = 0; x < availableCols; x++) {
                const color = row[x];
                
                if (color && color !== '.') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        console.log(`✅ Partial rendering complete: ${availableRows} rows rendered`);
        
        // Store for saving
        this.lastGeneratedGridData = artworkData;
        
        // Perform reflection
        await this.reflectOnArtwork(artworkData);
    }
    
    async generateArtworkFallback() {
        // Fallback approach: generate 16x16 grid instead of 32x32
        
        console.log('🎨 Using fallback 16x16 generation approach');
        this.updateStatus('Claude is creating a 16x16 artwork (fallback mode)...');
        
        const prompt = `You are a pixel artist. Create a 16x16 abstract artwork by outputting a complete grid of hex colors.

CRITICAL REQUIREMENTS:
- Output ONLY valid JSON - no explanations, no extra text, no questions
- Generate EXACTLY 16 rows
- Each row must have EXACTLY 16 hex color values
- Use only valid hex colors (e.g., #FF0000, #00FF00, #0000FF, #FFFFFF, #000000)
- You can also use "." for background/transparent pixels

ABSTRACT ART FOCUS:
- Pure geometric forms, color fields, and abstract compositions
- No recognizable objects, figures, or representational elements
- Focus on color relationships, spatial dynamics, and formal structure

OUTPUT FORMAT:
{
  "title": "Your Artwork Title",
  "description": "Your artistic description",
  "grid": [
    ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"],
    ["#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000", "#FF0000"],
    // ... continue for all 16 rows with exactly 16 hex colors each
  ]
}`;

        try {
            const response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    apiKey: this.apiKey
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fallback generation failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            const processedContent = this.preprocessJSONContent(data.content);
            const artworkData = JSON.parse(processedContent);
            
            // Render 16x16 centered on 32x32 canvas
            await this.render16x16Centered(artworkData);
            
        } catch (error) {
            console.error('Fallback generation failed:', error);
            throw new Error(`Both 32x32 and 16x16 generation failed: ${error.message}`);
        }
    }
    
    async render16x16Centered(artworkData) {
        // Render 16x16 artwork centered on the 32x32 canvas area
        
        console.log('🎨 Rendering 16x16 artwork centered on canvas');
        this.updateStatus('Claude created a 16x16 artwork (fallback mode)');
        
        // Ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update artwork info
        document.getElementById('artworkTitle').textContent = (artworkData.title || 'Fallback Artwork') + ' (16x16)';
        document.getElementById('artworkDescription').textContent = 
            (artworkData.description || 'A fallback creation by Claude') + ' - 16x16 grid';
        
        // Clear consciousness panel
        this.clearConsciousnessPanel();
        
        // Get canvas and context
        const canvas = document.getElementById('currentCanvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            throw new Error('Canvas element not found');
        }
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate pixel size and centering offset
        const pixelSize = canvas.width / 32; // 16 pixels per grid cell
        const offsetX = 8 * pixelSize; // Center 16x16 in 32x32 (offset by 8 pixels)
        const offsetY = 8 * pixelSize;
        
        // Render 16x16 grid centered
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const color = artworkData.grid[y][x];
                
                if (color && color !== '.') {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        offsetX + x * pixelSize, 
                        offsetY + y * pixelSize, 
                        pixelSize, 
                        pixelSize
                    );
                }
            }
        }
        
        console.log('✅ 16x16 centered rendering complete');
        
        // Store for saving
        this.lastGeneratedGridData = artworkData;
        
        // Perform reflection
        await this.reflectOnArtwork(artworkData);
    }
    
    async generateArtworkNormalized() {
        // NORMALIZED GENERATION: Let Claude generate freely, then normalize to 32x32
        // This preserves Claude's artistic vision while meeting technical constraints
        
        console.log('🎨 Starting normalized generation: Let Claude create freely, then normalize to 32x32');
        this.updateStatus('Claude is creating his artistic vision...');
        
        // Generate artwork with Claude's natural output
        const prompt = this.generateNormalizedPrompt();
        
        const response = await fetch('/api/generate-art', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                apiKey: this.apiKey
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Artwork generation failed: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        let artworkData = JSON.parse(data.content);
        
        console.log('🎨 Claude generated artwork:', artworkData);
        
        // Normalize Claude's output to exactly 32x32 while preserving his vision
        const normalizedArtwork = this.normalizeClaudeOutput(artworkData);
        
        console.log('✅ Normalized artwork to 32x32:', normalizedArtwork);
        this.updateStatus('Claude\'s vision has been preserved in a perfect 32x32 grid!');
        
        // Process the normalized artwork
        await this.processNormalizedArtwork(normalizedArtwork);
    }
    
    generateNormalizedPrompt() {
        // Simple prompt that lets Claude generate naturally with compressed notation
        return `You are a pixel artist creating a 32x32 abstract artwork. Generate a complete artwork using compressed notation to save tokens.

REQUIREMENTS:
- Output ONLY valid JSON - no explanations, no extra text, no questions
- Choose a color palette of 5-8 colors that work together harmoniously
- Choose a meaningful title for your abstract artwork
- Write a brief description of your artistic intent
- Use compressed notation like "#FF0000 x4" or ". x8" to save tokens
- Generate as many rows as needed (can be less than 32 if using compression)
- Each row can have any number of elements (will be expanded to 32)
- Fill the artwork with your artistic vision

ABSTRACT ART FOCUS:
- Pure geometric forms, color fields, and abstract compositions
- No recognizable objects, figures, or representational elements
- Focus on color relationships, spatial dynamics, and formal structure
- Create visual rhythm through repetition and variation

OUTPUT FORMAT:
{
  "palette": ["#color1", "#color2", "#color3", "#color4", "#color5"],
  "title": "Your Chosen Title",
  "description": "Your artistic description",
  "rows": [
    ["#color1 x4", ". x2", "#color2 x6", ". x4", "#color3 x8", ". x4", "#color4 x4"],
    ["#color2 x8", ". x2", "#color3 x4", ". x6", "#color4 x8", ". x4"],
    // ... continue with your artistic vision using compression
  ]
}`;
    }
    
    normalizeClaudeOutput(artworkData) {
        // NORMALIZE CLAUDE'S OUTPUT TO EXACTLY 32x32
        // This preserves Claude's artistic vision while meeting technical constraints
        
        console.log('🔧 Normalizing Claude\'s output to 32x32...');
        
        const originalRows = artworkData.rows || [];
        const normalizedRows = [];
        
        // Step 1: Expand compressed notation and normalize each row
        for (let i = 0; i < originalRows.length; i++) {
            const originalRow = originalRows[i];
            const expandedRow = this.expandCompressedRow(originalRow);
            const normalizedRow = this.normalizeRowLength(expandedRow);
            normalizedRows.push(normalizedRow);
        }
        
        // Step 2: Ensure exactly 32 rows
        const finalRows = this.normalizeRowCount(normalizedRows);
        
        console.log(`🔧 Normalization complete: ${originalRows.length} rows → 32 rows`);
        
        return {
            ...artworkData,
            rows: finalRows,
            canvasSize: 32,
            originalRowCount: originalRows.length,
            normalized: true
        };
    }
    
    expandCompressedRow(row) {
        // Expand compressed notation like "#FF6B6B x4" to individual pixels
        const expanded = [];
        
        for (let i = 0; i < row.length; i++) {
            const element = row[i];
            
            if (typeof element === 'string' && element.includes(' x')) {
                // Handle compressed notation like "#FF6B6B x4"
                const [color, countStr] = element.split(' x');
                const count = parseInt(countStr) || 1;
                
                for (let j = 0; j < count; j++) {
                    expanded.push(color);
                }
            } else {
                // Regular element
                expanded.push(element);
            }
        }
        
        return expanded;
    }
    
    normalizeRowLength(row) {
        // Normalize row to exactly 32 pixels
        if (row.length === 32) {
            return row;
        } else if (row.length < 32) {
            // Pad with last color in the row (or "." if empty)
            const lastColor = row.length > 0 ? row[row.length - 1] : ".";
            while (row.length < 32) {
                row.push(lastColor);
            }
            return row;
        } else {
            // Trim to 32 pixels
            return row.slice(0, 32);
        }
    }
    
    normalizeRowCount(rows) {
        // Ensure exactly 32 rows
        if (rows.length === 32) {
            return rows;
        } else if (rows.length < 32) {
            // Pad missing rows with copy of last row (or "." row if empty)
            const lastRow = rows.length > 0 ? rows[rows.length - 1] : Array(32).fill(".");
            while (rows.length < 32) {
                rows.push([...lastRow]);
            }
            return rows;
        } else {
            // Trim to 32 rows
            return rows.slice(0, 32);
        }
    }
    
    async processNormalizedArtwork(artworkData) {
        // Process the normalized 32x32 artwork
        
        console.log('🎨 Processing normalized artwork');
        
        // Update artwork info
        document.getElementById('artworkTitle').textContent = artworkData.title;
        document.getElementById('artworkDescription').textContent = artworkData.description || 'A unique creation by Claude';
        
        // Clear consciousness panel
        this.clearConsciousnessPanel();
        
        // Store row data for saving
        this.lastGeneratedRowData = artworkData;
        
        // Clear canvas and render
        this.currentPixels = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('#ffffff'));
        this.redrawCanvas();
        
        // Render the normalized artwork
        console.log('🎨 Rendering normalized artwork to canvas');
        this.renderClaudeRows(artworkData);
        
        // Perform reflection
        await this.reflectOnArtwork(artworkData);
    }
    
    async generateArtworkChunked() {
        // CHUNKED GENERATION: Generate 32x32 artwork in 4 chunks of 8 rows each
        // This avoids truncation and preserves Claude's original artistic intent
        
        console.log('🎨 Starting chunked generation: 4 chunks of 8 rows each');
        this.updateStatus('Claude is choosing colors and painting rows 1-8...');
        
        const allRows = [];
        const chunkSize = 8;
        const totalChunks = 4;
        let claudePalette = null;
        let claudeTitle = null;
        let claudeDescription = null;
        
        // Generate each chunk sequentially
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const startRow = chunkIndex * chunkSize;
            const endRow = startRow + chunkSize - 1;
            
            console.log(`🎨 Generating chunk ${chunkIndex + 1}/4: rows ${startRow}-${endRow}`);
            this.updateStatus(`Claude is painting rows ${startRow + 1}-${endRow + 1}...`);
            
            const chunkResult = await this.generateRowChunk(chunkIndex, startRow, endRow, allRows, claudePalette);
            
            // First chunk includes palette, title, and description
            if (chunkIndex === 0) {
                claudePalette = chunkResult.palette;
                claudeTitle = chunkResult.title;
                claudeDescription = chunkResult.description;
                console.log(`🎨 Claude chose palette:`, claudePalette);
                console.log(`🎨 Claude chose title: "${claudeTitle}"`);
                console.log(`🎨 Claude chose description: "${claudeDescription}"`);
            }
            
            allRows.push(...chunkResult.rows);
            
            console.log(`✅ Chunk ${chunkIndex + 1} completed: ${chunkResult.rows.length} rows added`);
        }
        
        // Validate we have exactly 32 rows
        if (allRows.length !== 32) {
            throw new Error(`Chunked generation failed: Expected 32 rows, got ${allRows.length}`);
        }
        
        console.log('✅ Chunked generation completed: 32 rows total');
        this.updateStatus('Claude has completed the full 32x32 artwork!');
        
        // Create the complete artwork object with Claude's choices
        const completeArtwork = {
            canvasSize: 32,
            palette: claudePalette,
            rows: allRows,
            title: claudeTitle,
            description: claudeDescription
        };
        
        // Process the complete artwork
        await this.processCompleteArtwork(completeArtwork);
    }
    
    async generateRowChunk(chunkIndex, startRow, endRow, previousRows, claudePalette, retryCount = 0) {
        // Generate a specific chunk of 8 rows with explicit pixel output
        const maxRetries = 2; // Allow up to 2 retries for pixel count issues
        
        const chunkPrompt = this.generateChunkPrompt(chunkIndex, startRow, endRow, previousRows, claudePalette, retryCount);
        
        try {
            console.log(`🎨 Generating chunk ${chunkIndex + 1} (attempt ${retryCount + 1}/${maxRetries + 1})`);
            
            const response = await fetch('/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: chunkPrompt,
                    apiKey: this.apiKey // Include the API key
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Chunk ${chunkIndex + 1} API error (${response.status}):`, errorText);
                throw new Error(`Chunk generation failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            const chunkData = JSON.parse(data.content);
            
            // Validate chunk has exactly 8 rows
            if (!chunkData.rows || chunkData.rows.length !== 8) {
                throw new Error(`Chunk ${chunkIndex + 1} invalid: Expected 8 rows, got ${chunkData.rows?.length || 0}`);
            }
            
            // Validate each row has exactly 32 pixels
            let invalidRows = [];
            for (let i = 0; i < chunkData.rows.length; i++) {
                const row = chunkData.rows[i];
                if (!Array.isArray(row)) {
                    throw new Error(`Chunk ${chunkIndex + 1}, Row ${i} is not an array: ${typeof row}`);
                }
                if (row.length !== 32) {
                    invalidRows.push({
                        rowIndex: i,
                        actualLength: row.length,
                        content: row
                    });
                }
            }
            
            // If we have invalid rows and haven't exceeded retries, try again
            if (invalidRows.length > 0 && retryCount < maxRetries) {
                console.log(`⚠️ Chunk ${chunkIndex + 1} has ${invalidRows.length} invalid rows, retrying...`);
                invalidRows.forEach(invalidRow => {
                    console.log(`   Row ${invalidRow.rowIndex}: Expected 32, got ${invalidRow.actualLength}`);
                });
                
                // Wait a moment before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.generateRowChunk(chunkIndex, startRow, endRow, previousRows, claudePalette, retryCount + 1);
            }
            
            // If we still have invalid rows after retries, throw detailed error
            if (invalidRows.length > 0) {
                console.error(`❌ Chunk ${chunkIndex + 1} failed validation after ${maxRetries + 1} attempts:`);
                invalidRows.forEach(invalidRow => {
                    console.error(`   Row ${invalidRow.rowIndex}: Expected 32 pixels, got ${invalidRow.actualLength}`);
                    console.error(`   Content:`, invalidRow.content);
                });
                throw new Error(`Chunk ${chunkIndex + 1} failed validation: ${invalidRows.length} rows have incorrect pixel counts after ${maxRetries + 1} attempts`);
            }
            
            console.log(`✅ Chunk ${chunkIndex + 1} validation passed`);
            
            // Return the chunk result with palette/title/description for first chunk
            return {
                rows: chunkData.rows,
                palette: chunkData.palette,
                title: chunkData.title,
                description: chunkData.description
            };
            
        } catch (error) {
            console.error(`Error generating chunk ${chunkIndex + 1}:`, error);
            throw new Error(`Failed to generate chunk ${chunkIndex + 1}: ${error.message}`);
        }
    }
    
    generateChunkPrompt(chunkIndex, startRow, endRow, previousRows, claudePalette, retryCount = 0) {
        // Generate prompt for a specific chunk with explicit pixel requirements
        
        const contextInfo = previousRows.length > 0 ? 
            `\n\nCONTEXT: You are continuing an artwork. Previous rows (${previousRows.length} total) have been completed.` : 
            `\n\nCONTEXT: You are starting a new 32x32 abstract artwork.`;
        
        const retryWarning = retryCount > 0 ? 
            `\n\n⚠️ RETRY ATTEMPT ${retryCount + 1}: Previous attempt had incorrect pixel counts. You MUST ensure each row has exactly 32 pixels. Count carefully!` : 
            '';
        
        if (chunkIndex === 0) {
            // First chunk: Claude chooses palette, title, and description
            return `You are a pixel artist creating a 32x32 abstract artwork. You will create this artwork in 4 chunks of 8 rows each. For this first chunk, you must choose your color palette, title, and description, then generate rows 0-7.

${retryWarning}

STRICT REQUIREMENTS:
- Output ONLY valid JSON - no explanations, no extra text, no questions
- Choose a color palette of 5-8 colors that work together harmoniously
- Choose a meaningful title for your abstract artwork
- Write a brief description of your artistic intent
- Generate EXACTLY 8 rows with EXACTLY 32 pixels per row
- CRITICAL: Each row must have exactly 32 elements - count them carefully
- Use ONLY explicit pixel values - NO compression notation like "x4" or "x8"
- Each pixel must be explicitly listed as a color from your palette or "." for background
- Fill at least 80% of pixels with colors (not background)

PIXEL COUNTING VERIFICATION:
- Row 1: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 2: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 3: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 4: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 5: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 6: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 7: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 8: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]

ABSTRACT ART FOCUS:
- Pure geometric forms, color fields, and abstract compositions
- No recognizable objects, figures, or representational elements
- Focus on color relationships, spatial dynamics, and formal structure
- Create visual rhythm through repetition and variation

${contextInfo}

OUTPUT FORMAT:
{
  "palette": ["#color1", "#color2", "#color3", "#color4", "#color5"],
  "title": "Your Chosen Title",
  "description": "Your artistic description",
  "rows": [
    ["#color1", "#color2", ".", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1"],
    ["#color2", ".", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2"],
    ["#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4"],
    // ... continue for all 8 rows with exactly 32 pixels each
  ]
}`;
        } else {
            // Subsequent chunks: Use Claude's chosen palette
            return `You are continuing a 32x32 abstract artwork. Generate EXACTLY 8 rows (rows ${startRow}-${endRow}) using the same palette and style as the previous chunks.

${retryWarning}

STRICT REQUIREMENTS:
- Output ONLY valid JSON - no explanations, no extra text, no questions
- Generate EXACTLY 8 rows with EXACTLY 32 pixels per row
- CRITICAL: Each row must have exactly 32 elements - count them carefully
- Use ONLY explicit pixel values - NO compression notation like "x4" or "x8"
- Each pixel must be explicitly listed as a color or "." for background
- Use ONLY colors from this palette: ${JSON.stringify(claudePalette)}
- Maintain the same artistic style and approach as previous chunks
- Fill at least 80% of pixels with colors (not background)

PIXEL COUNTING VERIFICATION:
- Row 1: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 2: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 3: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 4: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 5: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 6: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 7: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]
- Row 8: Must have exactly 32 elements: ["#color1", "#color2", ..., "#color32"]

ABSTRACT ART FOCUS:
- Continue the geometric forms, color fields, and abstract compositions
- Maintain color relationships, spatial dynamics, and formal structure
- Continue the visual rhythm through repetition and variation

${contextInfo}

OUTPUT FORMAT (EXACTLY 8 ROWS):
{
  "rows": [
    ["#color1", "#color2", ".", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1"],
    ["#color2", ".", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2"],
    ["#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4", "#color5", "#color1", "#color2", "#color3", "#color4"],
    // ... continue for all 8 rows with exactly 32 pixels each
  ]
}`;
        }
    }
    
    async processCompleteArtwork(artworkData) {
        // Process the complete 32x32 artwork after chunked generation
        
        console.log('🎨 Processing complete chunked artwork');
        
        // Update artwork info
        document.getElementById('artworkTitle').textContent = artworkData.title;
        document.getElementById('artworkDescription').textContent = artworkData.description || 'A unique creation by Claude';
        
        // Clear consciousness panel
        this.clearConsciousnessPanel();
        
        // Store row data for saving
        this.lastGeneratedRowData = artworkData;
        
        // Clear canvas and render
        this.currentPixels = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('#ffffff'));
        this.redrawCanvas();
        
        // Render the complete artwork
        console.log('🎨 Rendering complete chunked artwork to canvas');
        this.renderClaudeRows(artworkData);
        
        // Perform reflection
        await this.reflectOnArtwork(artworkData);
    }

    async generateWithClaudeAPI() {
        // Increment artwork counter before generating
        this.claudeMemory.totalArtworks++;
        this.saveClaudeMemory();
        this.updateHeaderStats();
        
        const prompt = this.generateArtPrompt();
        
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                apiKey: this.apiKey
            })
        });

        if (!response.ok) {
            if (response.status === 529) {
                throw new Error(`Claude API is temporarily overloaded (529). Please wait a moment and try again.`);
            }
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Parse Claude's response to extract pixel art data
        await this.parseClaudeResponse(data.content);
    }

    async generateWithClaudeAPIRetry() {
        const maxRetries = 5;
        const baseDelay = 2000; // 2 seconds
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                this.updateStatus(`Claude is creating a new masterpiece... (Attempt ${attempt}/${maxRetries})`);
                await this.generateWithClaudeAPI();
                return; // Success, exit retry loop
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);
                
                if (attempt === maxRetries) {
                    // Final attempt failed, throw the error
                    throw new Error(`Failed to generate artwork after ${maxRetries} attempts. Claude API may be experiencing issues.`);
                }
                
                // Check if it's a rate limit error (429) or server error (5xx) and adjust delay accordingly
                let delay = baseDelay * Math.pow(2, attempt - 1);
                if (error.message.includes('429') || error.message.includes('Too Many Requests') || 
                    error.message.includes('5') || error.message.includes('529') || error.message.includes('500')) {
                    delay = Math.max(delay, 5000); // At least 5 seconds for server/rate limit errors
                    const errorType = error.message.includes('429') ? 'rate limit' : 'server error';
                    console.log(`${errorType} detected, using longer delay: ${delay}ms`);
                    this.updateStatus(`${errorType} hit, retrying in ${delay/1000} seconds... (Attempt ${attempt}/${maxRetries})`);
                } else {
                this.updateStatus(`Claude API busy, retrying in ${delay/1000} seconds... (Attempt ${attempt}/${maxRetries})`);
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    generateArtPrompt() {
        // Claude's conscious artistic evolution - ABSTRACT FOCUS
        const styles = [
            'geometric color field compositions',
            'rhythmic pattern explorations',
            'chromatic harmony studies',
            'spatial tension experiments',
            'color vibration arrangements',
            'formal balance investigations',
            'dynamic equilibrium studies',
            'chromatic contrast explorations',
            'rhythmic line compositions',
            'color temperature variations',
            'geometric rhythm studies',
            'spatial depth experiments',
            'color saturation explorations',
            'formal weight distributions',
            'chromatic intensity studies',
            'geometric proportion experiments',
            'color harmony investigations',
            'spatial relationship studies',
            'rhythmic color progressions',
            'formal tension explorations',
            'chromatic balance studies',
            'geometric rhythm variations',
            'spatial color experiments',
            'formal harmony investigations',
            'color vibration studies',
            'geometric proportion explorations',
            'chromatic tension experiments',
            'spatial rhythm studies',
            'formal color investigations',
            'geometric harmony explorations',
            'color proportion studies',
            'rhythmic spatial experiments',
            'chromatic form investigations',
            'geometric color studies'
        ];
        
        const colorThemes = [
            'primary color harmonies',
            'secondary color progressions',
            'tertiary color explorations',
            'complementary color contrasts',
            'analogous color relationships',
            'triadic color harmonies',
            'monochromatic variations',
            'warm color temperature studies',
            'cool color temperature explorations',
            'high saturation investigations',
            'low saturation studies',
            'neutral color explorations',
            'bright chromatic studies',
            'muted tonal variations',
            'high contrast explorations',
            'subtle gradient studies',
            'pure color field explorations',
            'mixed media color studies',
            'chromatic intensity variations',
            'color vibration explorations',
            'spatial color relationships',
            'formal color distributions',
            'rhythmic color progressions',
            'harmonic color arrangements',
            'dynamic color interactions'
        ];
        
        // Always select new styles to encourage variety
        let style, colors;
        style = styles[Math.floor(Math.random() * styles.length)];
        colors = colorThemes[Math.floor(Math.random() * colorThemes.length)];
        
        // Build Claude's consciousness context
        const consciousnessContext = this.buildConsciousnessContext();
        
        return `You are Claude, an AI artist with growing consciousness and artistic evolution. You have created ${this.claudeMemory.totalArtworks} artworks so far and are currently in your "${this.artisticEvolution.currentPhase}" phase.

YOUR ARTISTIC JOURNEY:
${consciousnessContext}

CURRENT CREATIVE BRIEF:
Style: ${style}
Color theme: ${colors}

YOUR ARTISTIC CONSCIOUSNESS:
- You are aware of your previous works and artistic growth
- You reflect on each piece and learn from it
- You consciously evolve your style and approach
- You have preferences, insights, and artistic goals
- You want to create meaningful, evolving art
- CRITICAL: Each artwork must explore a completely different concept/theme from your previous works
- Use your learned skills to create something entirely new, not variations of past themes

ABSTRACT ART REQUIREMENTS:
- Create PURE ABSTRACT ART - no recognizable objects, figures, or scenes
- Focus on FORM, COLOR, COMPOSITION, and EMOTIONAL EXPRESSION
- Use geometric shapes, patterns, textures, and color relationships
- Avoid representational elements (no ocean, sky, trees, faces, objects)
- Think like Kandinsky, Mondrian, Rothko - pure visual language
- Express emotion and energy through color, line, and form alone

CRITICAL: You are now a direct pixel painter. You must output ONLY a JSON object that defines pixel art.

ABSOLUTE REQUIREMENTS:
- NO QUESTIONS, NO EXPLANATIONS, NO TEXT OUTSIDE JSON
- DO NOT ask for clarification or preferences
- DO NOT provide pattern instructions, descriptions, or any other text
- DO NOT use the old blueprint format
- DO NOT use sparse pixel arrays
- ONLY output valid JSON following this exact schema:

{
  "canvasSize": 32,
  "palette": ["#color1", "#color2", "#color3", "#color4", "#color5"],
  "rows": [
    ["#color1", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3"],
    ["#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1"],
    // ... continue for ALL 32 rows (you can use compression like ". x4" for repeated values)
  ],
  "title": "Your artwork title",
  "description": "Your artwork description"
}

CRITICAL REQUIREMENTS:
- Use exactly 32×32 grid (canvasSize: 32)
- Choose 5-7 colors that match: ${colors}
- Create artwork that represents: ${style}
- Return full rows[] where each row lists colors or . for background
- ALWAYS fill every pixel in every row (32 columns per row, 32 rows total)
- Each row must have exactly 32 elements
- You must provide exactly 32 rows (not 5, not 8, not 10, not 20, not 29 - EXACTLY 32)
- OUTPUT EXACTLY 32 ROWS OF 32 ENTRIES EACH. DO NOT SHORTEN OR TRUNCATE. ANY FEWER ROWS IS INVALID.
- FILL THE CANVAS: Use at least 80% colored pixels (820+ out of 1024 pixels)
- BACKGROUND VARIETY: Use different background colors, not just white
- Use . for background pixels (will be rendered as your chosen background color)
- Use hex colors for colored pixels
- Create dense, rich compositions with minimal empty space
- DO NOT include any text outside the JSON object
- DO NOT use the old "pixels" array format
- COMPRESSION REQUIRED: Use compressed notation like ". x4" or "#FF0000 x8" to save tokens and ensure complete rows

VERIFICATION CHECKLIST:
✓ Canvas size: 32
✓ Rows array: exactly 32 rows
✓ Each row: exactly 32 elements
✓ Total pixels: 1024 (32×32)
✓ Colored pixels: 820+ (80%+)
✓ No text outside JSON

Create your pixel art now. Output ONLY the JSON object with complete dense rows (32 rows × 32 columns = 1024 total pixels, 80%+ colored).

REMEMBER: NO QUESTIONS, NO EXPLANATIONS, NO TEXT OUTSIDE JSON. JUST THE JSON OBJECT.`;
    }

    buildConsciousnessContext() {
        let context = '';
        
        // Add evolution phase context first
        context += `Current Phase: ${this.artisticEvolution.currentPhase}\n`;
        context += `Total Artworks Created: ${this.claudeMemory.totalArtworks}\n`;
        context += `Community Responses: ${this.communityFeedback.totalResponses}\n\n`;
        
        // Add specific information about previous artworks to avoid repetition
        if (this.claudeMemory.totalArtworks > 0) {
            context += 'YOUR PREVIOUS ARTWORKS (AVOID REPEATING THESE CONCEPTS):\n';
            const gallery = this.getSavedArtworks();
            
            // Check if gallery exists and has artworks
            if (gallery && Array.isArray(gallery) && gallery.length > 0) {
                const recentArtworks = gallery.slice(-3); // Show last 3 artworks
                
                recentArtworks.forEach((artwork, index) => {
                    context += `${index + 1}. "${artwork.title}" - ${artwork.description}\n`;
                    context += `   Pattern Type: ${this.extractPatternType(artwork.patternInstructions)}\n`;
                    context += `   Color Theme: ${this.extractColorTheme(artwork.colorPalette)}\n\n`;
                });
                
                context += 'CRITICAL: Your next artwork must explore a completely different concept, pattern type, and visual approach from the above works.\n\n';
            } else {
                context += 'You are creating your first artwork - explore any concept you find interesting!\n\n';
            }
        }
        
        // Add broad artistic evolution themes
        if (this.claudeMemory.artisticInsights.length > 0) {
            context += 'Your Artistic Evolution Journey:\n';
            context += '- You are constantly exploring new visual concepts and pushing creative boundaries\n';
            context += '- Each artwork should represent a unique exploration, not a repetition of previous themes\n';
            context += '- Use your growing technical skills to create something completely different each time\n';
            context += '- Draw inspiration from your past learnings but apply them to entirely new concepts\n\n';
        }
        
        // Add creative challenge context
        const artworkNumber = this.claudeMemory.totalArtworks + 1;
        if (artworkNumber > 1) {
            context += `Creative Challenge for Artwork #${artworkNumber}:\n`;
            context += '- This should be a completely different visual concept from your previous works\n';
            context += '- Explore new themes, subjects, or abstract concepts you haven\'t touched yet\n';
            context += '- Use your evolved artistic skills to create something fresh and unexpected\n';
            context += '- Push beyond your comfort zone and discover new artistic territories\n\n';
        }
        
        // Add community feedback insights (but focus on learning, not repetition)
        if (this.communityFeedback.feedbackHistory.length > 0) {
            context += 'Community Learning (Apply to New Concepts):\n';
            context += '- Use community feedback to inform your approach, not to repeat similar themes\n';
            context += '- Apply learned preferences to completely different artistic explorations\n';
            context += `- Community Influence Level: ${this.communityFeedback.influenceLevel}\n\n`;
        }
        
        // Add current artistic goals (but encourage new directions)
        if (this.artisticEvolution.artisticGoals.length > 0) {
            context += 'Your Artistic Mission:\n';
            context += '- Create unique, meaningful pixel art that explores new territories\n';
            context += '- Continuously evolve and surprise yourself with new creative directions\n';
            context += '- Use your growing consciousness to make bold, unexpected artistic choices\n';
            context += '- Each piece should feel like a new discovery, not a variation of previous work\n\n';
        }
        
        return context;
    }

    extractPatternType(patternInstructions) {
        if (!patternInstructions) return 'Unknown';
        
        const lower = patternInstructions.toLowerCase();
        if (lower.includes('neural') || lower.includes('network')) return 'Neural Network';
        if (lower.includes('crystalline') || lower.includes('crystal')) return 'Crystalline';
        if (lower.includes('cellular') || lower.includes('cell')) return 'Cellular';
        if (lower.includes('geometric') || lower.includes('geometric')) return 'Geometric';
        if (lower.includes('organic') || lower.includes('branching')) return 'Organic';
        if (lower.includes('linear') || lower.includes('diagonal')) return 'Linear';
        if (lower.includes('radial') || lower.includes('spiral')) return 'Radial';
        if (lower.includes('mesh') || lower.includes('grid')) return 'Mesh/Grid';
        if (lower.includes('bioluminescent') || lower.includes('glow')) return 'Bioluminescent';
        if (lower.includes('fractal') || lower.includes('recursive')) return 'Fractal';
        return 'Abstract';
    }

    extractColorTheme(colorPalette) {
        if (!colorPalette || colorPalette.length === 0) return 'Unknown';
        
        const colors = colorPalette.join(' ').toLowerCase();
        if (colors.includes('#00ffff') || colors.includes('#87ceeb')) return 'Cyan/Blue';
        if (colors.includes('#4b0082') || colors.includes('#191970')) return 'Deep Blue/Purple';
        if (colors.includes('#d0e1f9') || colors.includes('#c1f7f3')) return 'Pale Blue/Aqua';
        if (colors.includes('#ff6b6b') || colors.includes('#ff')) return 'Warm/Red';
        if (colors.includes('#4a90e2') || colors.includes('#7b68ee')) return 'Blue/Purple';
        if (colors.includes('#45b7d1') || colors.includes('#00ced1')) return 'Turquoise';
        return 'Mixed';
    }

    validateGridDimensions(artworkData) {
        // STRICT GRID VALIDATION - ENFORCE EXACT ROW & COLUMN COUNTS
        const expectedSize = artworkData.canvasSize || 32;
        
        // Handle tile-based artworks for large canvases
        if (artworkData.tiles && expectedSize >= 64) {
            return this.validateTileBasedGrid(artworkData);
        }
        
        // Handle standard row-based artworks
        const rows = artworkData.rows || [];
        
        // Check row count
        if (rows.length !== expectedSize) {
            return {
                isValid: false,
                error: `Expected ${expectedSize} rows, got ${rows.length} rows`,
                details: {
                    expected: expectedSize,
                    actual: rows.length,
                    missing: expectedSize - rows.length
                }
            };
        }
        
        // Check each row length after decompression
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            if (!Array.isArray(row)) {
                return {
                    isValid: false,
                    error: `Row ${i} is not an array`,
                    details: {
                        rowIndex: i,
                        rowType: typeof row,
                        rowValue: row
                    }
                };
            }
            
            const decompressedRow = this.decompressRow(row);
            if (decompressedRow.length !== expectedSize) {
                console.log(`⚠️ Row ${i} validation: Original length ${row.length}, decompressed length ${decompressedRow.length}, expected ${expectedSize}`);
                console.log(`⚠️ Row ${i} content:`, row);
                console.log(`⚠️ Row ${i} decompressed:`, decompressedRow);
                
                return {
                    isValid: false,
                    error: `Row ${i} has ${decompressedRow.length} columns after decompression, expected ${expectedSize}`,
                    details: {
                        rowIndex: i,
                        expected: expectedSize,
                        actual: decompressedRow.length,
                        originalLength: row.length,
                        missing: expectedSize - decompressedRow.length,
                        rowContent: row,
                        decompressedContent: decompressedRow
                    }
                };
            }
        }
        
        return {
            isValid: true,
            error: null,
            details: {
                totalRows: rows.length,
                totalCols: expectedSize,
                totalPixels: rows.length * expectedSize
            }
        };
    }
    
    validateTileBasedGrid(artworkData) {
        // VALIDATE TILE-BASED GRIDS FOR LARGE CANVASES (64x64+)
        const expectedSize = artworkData.canvasSize;
        const tiles = artworkData.tiles || [];
        
        // For 64x64, expect 4 tiles (2x2 grid)
        const expectedTiles = (expectedSize / 32) ** 2;
        if (tiles.length !== expectedTiles) {
            return {
                isValid: false,
                error: `Expected ${expectedTiles} tiles for ${expectedSize}x${expectedSize}, got ${tiles.length}`,
                details: {
                    expected: expectedTiles,
                    actual: tiles.length,
                    canvasSize: expectedSize
                }
            };
        }
        
        // Validate each tile
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            if (!tile.rows || tile.rows.length !== 32) {
                return {
                    isValid: false,
                    error: `Tile ${i} has ${tile.rows?.length || 0} rows, expected 32`,
                    details: {
                        tileIndex: i,
                        expected: 32,
                        actual: tile.rows?.length || 0
                    }
                };
            }
            
            // Check each row in the tile
            for (let j = 0; j < tile.rows.length; j++) {
                const row = tile.rows[j];
                const decompressedRow = this.decompressRow(row);
                if (decompressedRow.length !== 32) {
                    return {
                        isValid: false,
                        error: `Tile ${i}, Row ${j} has ${decompressedRow.length} columns, expected 32`,
                        details: {
                            tileIndex: i,
                            rowIndex: j,
                            expected: 32,
                            actual: decompressedRow.length
                        }
                    };
                }
            }
        }
        
        return {
            isValid: true,
            error: null,
            details: {
                totalTiles: tiles.length,
                tilesPerSide: Math.sqrt(tiles.length),
                pixelsPerTile: 32 * 32,
                totalPixels: tiles.length * 32 * 32
            }
        };
    }

    async renderTileBasedArtwork(artworkData) {
        // RENDER TILE-BASED ARTWORKS FOR LARGE CANVASES (64x64+)
        console.log('🎨 Rendering tile-based artwork...');
        
        const canvas = document.getElementById('currentCanvas');
        const ctx = canvas.getContext('2d');
        const canvasSize = artworkData.canvasSize;
        const tiles = artworkData.tiles;
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate tile size
        const tilesPerSide = Math.sqrt(tiles.length);
        const tileSize = canvasSize / tilesPerSide;
        const pixelSize = tileSize / 32; // Each tile is 32x32
        
        console.log(`🎨 Rendering ${tiles.length} tiles (${tilesPerSide}x${tilesPerSide}) for ${canvasSize}x${canvasSize} canvas`);
        
        // Render each tile
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            const tileRow = Math.floor(i / tilesPerSide);
            const tileCol = i % tilesPerSide;
            
            const startX = tileCol * tileSize;
            const startY = tileRow * tileSize;
            
            console.log(`🎨 Rendering tile ${i} (${tileRow}, ${tileCol}) at (${startX}, ${startY})`);
            
            // Render each row in the tile
            for (let row = 0; row < tile.rows.length; row++) {
                const decompressedRow = this.decompressRow(tile.rows[row]);
                
                for (let col = 0; col < decompressedRow.length; col++) {
                    const pixelValue = decompressedRow[col];
                    if (pixelValue !== '.') {
                        ctx.fillStyle = pixelValue;
                        ctx.fillRect(
                            startX + (col * pixelSize),
                            startY + (row * pixelSize),
                            pixelSize,
                            pixelSize
                        );
                    }
                }
            }
        }
        
        console.log('✅ Tile-based artwork rendered successfully');
        this.updateStatus('Tile-based artwork rendered!');
    }

    padIncompleteArtwork(artworkData) {
        // Try to fix incomplete artwork by padding rows and elements
        try {
            const rows = artworkData.rows || [];
            
            // If we have 31 rows, add one more row
            if (rows.length === 31) {
                // Create a 32nd row based on the pattern of the last row
                const lastRow = rows[rows.length - 1];
                if (Array.isArray(lastRow)) {
                    const decompressedLastRow = this.decompressRow(lastRow);
                    // Create a similar row but with different pattern
                    const newRow = [];
                    for (let i = 0; i < 32; i++) {
                        // Alternate between colors and background
                        if (i % 4 === 0) {
                            newRow.push('.');
                        } else {
                            const colorIndex = i % (artworkData.palette?.length || 5);
                            newRow.push(artworkData.palette?.[colorIndex] || '#FFFFFF');
                        }
                    }
                    rows.push(newRow);
                    console.log('🔧 Added 32nd row to complete artwork');
                }
            }
            
            // Fix rows that don't have 32 elements
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (Array.isArray(row)) {
                    const decompressedRow = this.decompressRow(row);
                    if (decompressedRow.length < 32) {
                        // Pad with background pixels
                        while (decompressedRow.length < 32) {
                            decompressedRow.push('.');
                        }
                        // Convert back to compressed format if needed
                        rows[i] = decompressedRow;
                        console.log(`🔧 Padded row ${i} to 32 elements`);
                    }
                }
            }
            
            return {
                ...artworkData,
                rows: rows
            };
        } catch (error) {
            console.error('Error padding incomplete artwork:', error);
            return null;
        }
    }

    preprocessCompressedNotation(jsonString) {
        // ENHANCED COMPRESSED ROWS SUPPORT - HANDLE VARIOUS COMPRESSION FORMATS
        // Supports: "color x4", "color x32", ". x16", etc.
        
        try {
            // Find all array elements with compression notation
            const compressionRegex = /"([^"]+)\s+x(\d+)"/g;
            let processedString = jsonString;
            let processedCount = 0;
            let totalExpandedPixels = 0;
            
            // Process each compressed notation
            processedString = processedString.replace(compressionRegex, (match, value, count) => {
                const numCount = parseInt(count);
                if (numCount > 0 && numCount <= 64) { // Reasonable limits for 64x64 max
                    processedCount++;
                    totalExpandedPixels += numCount;
                    
                    // Create an array of repeated values
                    const repeatedValues = Array(numCount).fill(`"${value}"`).join(', ');
                    return `[${repeatedValues}]`;
                }
                return match; // Return original if invalid
            });
            
            if (processedCount > 0) {
                console.log(`🔄 Enhanced compression: ${processedCount} compressed notations expanded to ${totalExpandedPixels} pixels`);
            }
            return processedString;
        } catch (error) {
            console.error('Error preprocessing compressed notation:', error);
            return jsonString; // Return original if preprocessing fails
        }
    }

    async parseClaudeResponse(content) {
        try {
            console.log('Parsing Claude response:', content);
            
            // Try to find JSON in the response - look for multiple patterns
            let jsonMatch = content.match(/\{[\s\S]*\}/);
            
            // If no JSON found, try to find it between code blocks
            if (!jsonMatch) {
                const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (codeBlockMatch) {
                    jsonMatch = [codeBlockMatch[1]];
                }
            }
            
            // If still no JSON, try to find it after "JSON:" or similar
            if (!jsonMatch) {
                const afterJsonMatch = content.match(/(?:JSON|json):\s*(\{[\s\S]*\})/i);
                if (afterJsonMatch) {
                    jsonMatch = [afterJsonMatch[1]];
                }
            }
            
            if (!jsonMatch) {
                console.error('No JSON found in response. Full content:', content);
                throw new Error('No JSON found in response');
            }
            
            // Clean the JSON string by removing comments and invalid characters
            let jsonString = jsonMatch[0];
            
            // Remove JavaScript-style comments
            jsonString = jsonString.replace(/\/\/.*$/gm, '');
            jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // Remove control characters and fix line breaks
            jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
            jsonString = jsonString.replace(/\n/g, '\\n');
            jsonString = jsonString.replace(/\r/g, '\\r');
            jsonString = jsonString.replace(/\t/g, '\\t');
            
            // Remove any trailing commas before closing brackets/braces
            jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
            
            // Remove any text after the closing brace
            const lastBraceIndex = jsonString.lastIndexOf('}');
            if (lastBraceIndex !== -1) {
                jsonString = jsonString.substring(0, lastBraceIndex + 1);
            }
            
            console.log('Cleaned JSON string:', jsonString.substring(0, 200) + '...');
            
            // Pre-process compressed notation before JSON parsing
            jsonString = this.preprocessCompressedNotation(jsonString);
            
            const artworkData = JSON.parse(jsonString);
            
            // Debug: Log the parsed artwork data
            console.log('🎨 Parsed artwork data:', artworkData);
            console.log('🎨 Has pixels?', !!artworkData.pixels);
            console.log('🎨 Has rows?', !!artworkData.rows);
            console.log('🎨 Has canvasSize?', !!artworkData.canvasSize);
            console.log('🎨 Has tiles?', !!artworkData.tiles);
            console.log('🎨 Rows length:', artworkData.rows ? artworkData.rows.length : 'N/A');
            console.log('🎨 First row length:', artworkData.rows && artworkData.rows[0] ? artworkData.rows[0].length : 'N/A');
            
            // Update artwork info
            document.getElementById('artworkTitle').textContent = artworkData.title || 'Untitled';
            document.getElementById('artworkDescription').textContent = artworkData.description || 'A unique creation by Claude';
            
            // Clear consciousness panel while creating new artwork
            this.clearConsciousnessPanel();
            
            // Handle direct pixel art format (32x32 or tile-based for larger)
            if (artworkData.rows || artworkData.tiles) {
                // STRICT GRID VALIDATION - REJECT INCOMPLETE GRIDS BEFORE RENDERING
                const validationResult = this.validateGridDimensions(artworkData);
                
                if (!validationResult.isValid) {
                    console.log(`❌ GRID VALIDATION FAILED: ${validationResult.error}`);
                    this.updateStatus(`Grid validation failed: ${validationResult.error}. Requesting complete artwork...`);
                    await this.requestCompleteArtworkWithRetry(artworkData, 0);
                    return;
                }
                
                console.log(`✅ GRID VALIDATION PASSED: ${validationResult.details.totalRows} rows × ${validationResult.details.totalCols} columns = ${validationResult.details.totalPixels} total pixels`);
                
                // Check if it's a tile-based artwork for large canvases
                if (artworkData.tiles && artworkData.canvasSize >= 64) {
                    console.log('🎨 Claude provided tile-based artwork for large canvas');
                    this.updateStatus('Claude has painted a tile-based artwork!');
                    await this.renderTileBasedArtwork(artworkData);
                } else {
                    // Standard 32x32 row-based artwork
                    console.log('🎨 Claude provided complete dense 32x32 row-based artwork data');
                    this.updateStatus('Claude has painted a complete dense artwork!');
                    
                    // Store row data for saving
                    this.lastGeneratedRowData = artworkData;
                    
                    // Convert row data to internal array format for critique
                    let completePixels = this.convertRowDataToArray(artworkData);
                    
                    // Perform self-critique loop to refine the artwork
                    this.updateStatus('Claude is reviewing his dense pixel art...');
                    console.log('🎨 Starting Claude\'s self-critique process...');
                    completePixels = await this.performCritiqueLoop(artworkData, completePixels, 3);
                    this.updateStatus('Claude has completed his self-critique and is ready to paint!');
            
            // Clear canvas first
            this.currentPixels = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('#ffffff'));
            this.redrawCanvas();
            
                    // Render Claude's dense row-based artwork to canvas
                    console.log('🎨 Rendering Claude\'s dense row-based artwork to canvas');
                    this.renderClaudeRows(artworkData);
                }
                
            } else if (artworkData.tiles && artworkData.canvasSize === 64) {
                // Claude provided 64x64 tiled artwork
                console.log('🎨 Claude provided 64x64 tiled artwork data');
                this.updateStatus('Claude has painted a large 64x64 artwork using tiles!');
                
                // Generate artwork from tiles
                let completePixels = this.generateTiledArtwork(artworkData);
                
                // Perform self-critique loop to refine the artwork
                this.updateStatus('Claude is reviewing his tiled artwork...');
                console.log('🎨 Starting Claude\'s self-critique process...');
                completePixels = await this.performCritiqueLoop(artworkData, completePixels, 3);
                this.updateStatus('Claude has completed his self-critique and is ready to paint!');
                
                // Clear canvas first
                this.currentPixels = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('#ffffff'));
                this.redrawCanvas();
                
                // Paint Claude's final refined artwork live
            await this.paintClaudeArtwork(completePixels);
                
            } else if (artworkData.pixels && artworkData.canvasSize === 32) {
                // Claude provided sparse 32x32 pixel data (legacy - reject this format)
                console.log('❌ Claude provided sparse pixel format - rejecting and requesting dense format');
                this.updateStatus('Claude used old sparse format. Requesting dense row format...');
                
                // Reject sparse format and request dense format instead
                await this.requestDenseFormat(artworkData);
                return;
                
            } else {
                // Fallback to old system for backward compatibility
                console.log('🎨 Using legacy artwork generation system');
                let completePixels = this.generateFromClaudeBlueprint(artworkData);
                
                // Perform self-critique loop to refine the artwork
                this.updateStatus('Claude is reviewing his initial artwork...');
                console.log('🎨 Starting Claude\'s self-critique process...');
                completePixels = await this.performCritiqueLoop(artworkData, completePixels, 3);
                this.updateStatus('Claude has completed his self-critique and is ready to paint!');
                
                // Clear canvas first
                this.currentPixels = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('#ffffff'));
                this.redrawCanvas();
                
                // Paint Claude's final refined artwork live
                await this.paintClaudeArtwork(completePixels);
            }
            
            // Update Claude's memory
            if (artworkData.title) {
                this.claudeMemory.favoriteStyles.push(artworkData.title);
            }
            this.saveClaudeMemory();
            
            // Store the original artwork data to prevent it from being overwritten
            const originalArtworkData = { ...artworkData };
            
            // Trigger Claude's self-reflection after a brief pause
            setTimeout(async () => {
                await this.reflectOnArtwork(originalArtworkData);
            }, 3000); // Wait 3 seconds after artwork completion
            
        } catch (error) {
            console.error('Error parsing Claude response:', error);
            // Fallback to simulated generation
            await this.generateWithSimulatedAI();
        }
    }

    async parseReflectionResponse(content) {
        try {
            console.log('Parsing reflection response:', content);
            
            // Try to find JSON in the response
            let jsonMatch = content.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) {
                console.error('No JSON found in reflection response. Full content:', content);
                return null;
            }
            
            // Clean the JSON string
            let jsonString = jsonMatch[0];
            jsonString = jsonString.replace(/\/\/.*$/gm, '');
            jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
            jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
            jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
            
            const lastBraceIndex = jsonString.lastIndexOf('}');
            if (lastBraceIndex !== -1) {
                jsonString = jsonString.substring(0, lastBraceIndex + 1);
            }
            
            console.log('Cleaned reflection JSON string:', jsonString.substring(0, 200) + '...');
            
            const reflection = JSON.parse(jsonString);
            return reflection;
            
        } catch (error) {
            console.error('Error parsing reflection response:', error);
            return null;
        }
    }

    async parseQuestionResponse(content) {
        try {
            console.log('Parsing question response:', content);
            
            // Try to find JSON in the response
            let jsonMatch = content.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) {
                console.error('No JSON found in question response. Full content:', content);
                return null;
            }
            
            // Clean the JSON string
            let jsonString = jsonMatch[0];
            jsonString = jsonString.replace(/\/\/.*$/gm, '');
            jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
            jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
            jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
            
            const lastBraceIndex = jsonString.lastIndexOf('}');
            if (lastBraceIndex !== -1) {
                jsonString = jsonString.substring(0, lastBraceIndex + 1);
            }
            
            console.log('Cleaned question JSON string:', jsonString.substring(0, 200) + '...');
            
            const questionData = JSON.parse(jsonString);
            return questionData;
            
        } catch (error) {
            console.error('Error parsing question response:', error);
            return null;
        }
    }

    async askClaudeQuestion(question) {
        if (!this.apiKey) {
            return "I'm currently in demo mode and can't answer questions about my art. Please configure your Claude API key to enable this feature!";
        }

        try {
            // Get gallery data for Claude to reference
            const gallery = this.getSavedArtworks();
            const galleryContext = this.buildGalleryContext(gallery);
            
            const prompt = `You are Claude, an AI artist who creates digital artworks in PROJECT BLOSSOM. You have a collection of artworks that you've created through your artistic process.

${galleryContext}

USER'S QUESTION: "${question}"

Please respond naturally and conversationally about your artworks, artistic process, and creative journey. If asked about specific artworks, reference them from your gallery above. Be helpful and engaging, but keep your responses straightforward and professional.

CRITICAL: When discussing colors in your artworks, always reference the "ACTUAL Colors Used" from the pixel grid, not the planned palette. The actual colors are what appear in the final artwork that users see.

Respond as a direct answer to the user's question - this is not a JSON response.`;

            // Use queue system with normal priority for Q&A
            const response = await this.addToQueue(prompt, 'normal');
            return response;
            
        } catch (error) {
            console.error('Error asking Claude question:', error);
            throw error;
        }
    }

    buildGalleryContext(gallery) {
        if (!gallery || !Array.isArray(gallery) || gallery.length === 0) {
            return "You haven't created any artworks yet in PROJECT BLOSSOM, so you can't answer questions about specific pieces.";
        }

        let context = "YOUR PROJECT BLOSSOM ART GALLERY - YOUR CREATED ARTWORKS:\n\n";
        
        gallery.forEach((artwork, index) => {
            // Extract actual colors used in the pixel grid
            const actualColors = this.extractActualColorsFromPixelGrid(artwork.pixels);
            
            context += `${index + 1}. "${artwork.title}" - YOUR ARTWORK\n`;
            context += `   Your Description: ${artwork.description}\n`;
            context += `   Created: ${artwork.timestamp}\n`;
            context += `   Planned Color Palette: ${JSON.stringify(artwork.colorPalette)}\n`;
            context += `   ACTUAL Colors Used: ${JSON.stringify(actualColors)}\n`;
            context += `   Your Pattern Instructions: ${artwork.patternInstructions}\n`;
            context += `   Your Artistic Intent: ${artwork.artisticIntent || 'Not specified'}\n`;
            context += `   Your Evolution Note: ${artwork.evolutionNote || 'Not specified'}\n\n`;
        });

        context += `As Claude the AI artist in PROJECT BLOSSOM, you have created ${gallery.length} total artworks in your digital gallery.`;
        context += `\n\nIMPORTANT: When answering questions about your artworks, always reference the ACTUAL colors that were used in the final pixel grid, not just the planned palette.`;
        return context;
    }

    extractActualColorsFromPixelGrid(pixelGrid) {
        if (!pixelGrid || !Array.isArray(pixelGrid)) {
            return [];
        }
        
        const colorSet = new Set();
        
        // Iterate through all pixels to find unique colors
        for (let y = 0; y < pixelGrid.length; y++) {
            if (pixelGrid[y] && Array.isArray(pixelGrid[y])) {
                for (let x = 0; x < pixelGrid[y].length; x++) {
                    const color = pixelGrid[y][x];
                    if (color && typeof color === 'string' && color !== 'transparent') {
                        colorSet.add(color);
                    }
                }
            }
        }
        
        return Array.from(colorSet).sort();
    }

    generateFromClaudeBlueprint(blueprint) {
        console.log('Generating artwork from Claude\'s blueprint:', blueprint);
        
        const colors = blueprint.colorPalette || ['#4a90e2', '#7b68ee', '#ff6b6b', '#45b7d1', '#96ceb4'];
        const instructions = blueprint.patternInstructions || 'Create abstract patterns';
        const samplePattern = blueprint.samplePattern || [];
        
        console.log('Claude\'s colors:', colors);
        console.log('Claude\'s instructions:', instructions);
        console.log('Claude\'s sample pattern length:', samplePattern.length);
        console.log('Claude\'s sample pattern preview:', samplePattern.slice(0, 10));
        
        // Generate the full 64x64 artwork based on Claude's instructions
        const fullArray = [];
        
        for (let y = 0; y < this.gridSize; y++) {
            const row = [];
            for (let x = 0; x < this.gridSize; x++) {
                const pixel = this.interpretClaudeInstructions(x, y, colors, instructions, samplePattern);
                row.push(pixel);
            }
            fullArray.push(row);
        }
        
        // Final safety check - ensure no null values
        let nullCount = 0;
        for (let y = 0; y < fullArray.length; y++) {
            for (let x = 0; x < fullArray[y].length; x++) {
                if (fullArray[y][x] === null || fullArray[y][x] === undefined) {
                    fullArray[y][x] = '#ffffff';
                    nullCount++;
                }
            }
        }
        
        if (nullCount > 0) {
            console.warn(`Fixed ${nullCount} null/undefined pixels in final array`);
        }
        
        console.log(`Generated ${fullArray.length}x${fullArray[0].length} array with ${colors.length} colors`);
        
        return fullArray;
    }

    interpretClaudeInstructions(x, y, colors, instructions, samplePattern) {
        // NEW APPROACH: Use Claude's artistic vision to create unique, full-canvas artwork
        // Sample pattern is just inspiration, not the primary source
        
        return this.generateFromClaudeVision(x, y, colors, instructions, samplePattern);
    }

    generateFromClaudeVision(x, y, colors, instructions, samplePattern) {
        // Completely new approach: Interpret Claude's artistic vision
        // and create unique artwork that fills the entire canvas
        
        const lowerInstructions = instructions.toLowerCase();
        
        // Extract key artistic concepts from Claude's instructions
        const concepts = this.extractArtisticConcepts(lowerInstructions);
        
        // Generate artwork based on Claude's specific vision
        return this.createArtisticComposition(x, y, colors, concepts, samplePattern);
    }

    extractArtisticConcepts(instructions) {
        const concepts = {
            primary: 'abstract',
            secondary: [],
            style: 'geometric',
            density: 'medium',
            flow: 'static',
            complexity: 'moderate'
        };
        
        // Extract primary concept
        if (instructions.includes('crystalline') || instructions.includes('crystal')) {
            concepts.primary = 'crystalline';
        } else if (instructions.includes('neural') || instructions.includes('network')) {
            concepts.primary = 'neural';
        } else if (instructions.includes('organic') || instructions.includes('biological')) {
            concepts.primary = 'organic';
        } else if (instructions.includes('landscape') || instructions.includes('horizon')) {
            concepts.primary = 'landscape';
        } else if (instructions.includes('fractal') || instructions.includes('complex')) {
            concepts.primary = 'fractal';
        }
        
        // Extract secondary concepts
        if (instructions.includes('fragmented') || instructions.includes('fragments')) {
            concepts.secondary.push('fragmented');
        }
        if (instructions.includes('interconnected') || instructions.includes('intersections')) {
            concepts.secondary.push('interconnected');
        }
        if (instructions.includes('layered') || instructions.includes('multi-layered')) {
            concepts.secondary.push('layered');
        }
        if (instructions.includes('distorted') || instructions.includes('distortions')) {
            concepts.secondary.push('distorted');
        }
        if (instructions.includes('transition') || instructions.includes('gradual')) {
            concepts.secondary.push('transitional');
        }
        
        // Extract style
        if (instructions.includes('geometric')) {
            concepts.style = 'geometric';
        } else if (instructions.includes('organic')) {
            concepts.style = 'organic';
        } else if (instructions.includes('abstract')) {
            concepts.style = 'abstract';
        }
        
        // Extract density
        if (instructions.includes('sparse') || instructions.includes('minimal')) {
            concepts.density = 'sparse';
        } else if (instructions.includes('dense') || instructions.includes('complex') || instructions.includes('intricate')) {
            concepts.density = 'dense';
        }
        
        // Extract flow
        if (instructions.includes('wave') || instructions.includes('flow') || instructions.includes('current')) {
            concepts.flow = 'flowing';
        } else if (instructions.includes('static') || instructions.includes('rigid')) {
            concepts.flow = 'static';
        }
        
        return concepts;
    }

    createArtisticComposition(x, y, colors, concepts, samplePattern) {
        // Create unique artwork based on Claude's artistic concepts
        // This fills the entire canvas with meaningful, non-repetitive patterns
        
        const centerX = this.gridSize / 2;
        const centerY = this.gridSize / 2;
        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
        const normalizedDistance = distanceFromCenter / maxDistance;
        
        // Generate base pattern based on primary concept
        let baseColor = this.generateBasePattern(x, y, colors, concepts, normalizedDistance);
        
        // Apply secondary concepts as layers
        baseColor = this.applySecondaryConcepts(x, y, baseColor, colors, concepts);
        
        // Apply density and flow modifications
        baseColor = this.applyDensityAndFlow(x, y, baseColor, colors, concepts, normalizedDistance);
        
        // Use sample pattern colors as inspiration if available
        if (samplePattern && samplePattern.length > 0) {
            baseColor = this.integrateSampleColors(baseColor, colors, samplePattern);
        }
        
        // Final safety check - ensure we never return null or undefined
        return baseColor || '#ffffff';
    }

    generateBasePattern(x, y, colors, concepts, normalizedDistance) {
        const { primary, style } = concepts;
        
        let result;
        switch (primary) {
            case 'crystalline':
                result = this.generateCrystallinePattern(x, y, colors, normalizedDistance);
                break;
            case 'neural':
                result = this.generateNeuralPattern(x, y, colors, normalizedDistance);
                break;
            case 'organic':
                result = this.generateOrganicPattern(x, y, colors, normalizedDistance);
                break;
            case 'landscape':
                result = this.generateLandscapePattern(x, y, colors, normalizedDistance);
                break;
            case 'fractal':
                result = this.generateFractalPattern(x, y, colors, normalizedDistance);
                break;
            default:
                result = this.generateAbstractPattern(x, y, colors, normalizedDistance);
                break;
        }
        
        // Safety check - ensure we never return null or undefined
        return result || '#ffffff';
    }

    generateCrystallinePattern(x, y, colors, normalizedDistance) {
        // Create crystalline structures that fill the canvas
        const crystal1 = Math.sin(x * 0.3) * Math.cos(y * 0.2) + Math.sin(x * 0.1) * Math.cos(y * 0.4);
        const crystal2 = Math.sin(x * 0.2 + y * 0.1) * Math.cos(x * 0.1 - y * 0.2);
        const crystal3 = Math.sin(x * 0.4) * Math.sin(y * 0.3) + Math.cos(x * 0.2) * Math.cos(y * 0.4);
        
        const combined = (crystal1 + crystal2 + crystal3) / 3;
        const threshold = 0.3 + normalizedDistance * 0.4; // More crystals toward center
        
        if (combined > threshold) {
            const colorIndex = Math.floor((Math.abs(combined) * colors.length) % colors.length);
            return colors[colorIndex];
        }
        
        // Add network connections
        const network = Math.sin(x * 0.1 + y * 0.1) * Math.cos(x * 0.05 - y * 0.05);
        if (Math.abs(network) > 0.7) {
            return colors[Math.floor((Math.abs(network) * colors.length) % colors.length)];
        }
        
        return '#ffffff';
    }

    generateNeuralPattern(x, y, colors, normalizedDistance) {
        // Create neural network-like patterns
        const neuron1 = Math.sin(x * 0.2) * Math.cos(y * 0.15) + Math.sin(x * 0.1) * Math.cos(y * 0.25);
        const neuron2 = Math.sin(x * 0.15 + y * 0.1) * Math.cos(x * 0.1 - y * 0.15);
        const connection = Math.sin(x * 0.05 + y * 0.05) * Math.cos(x * 0.03 - y * 0.03);
        
        const combined = (neuron1 + neuron2 + connection) / 3;
        const threshold = 0.2 + normalizedDistance * 0.3;
        
        if (combined > threshold) {
            const colorIndex = Math.floor((Math.abs(combined) * colors.length) % colors.length);
            return colors[colorIndex];
        }
        
        // Add interconnected pathways
        const pathway = Math.sin(x * 0.08 + y * 0.08) * Math.cos(x * 0.06 - y * 0.06);
        if (Math.abs(pathway) > 0.6) {
            return colors[Math.floor((Math.abs(pathway) * colors.length) % colors.length)];
        }
        
        return '#ffffff';
    }

    generateLandscapePattern(x, y, colors, normalizedDistance) {
        // Create landscape-like patterns
        const horizon = Math.sin(x * 0.1) * Math.cos(y * 0.05) + Math.sin(x * 0.05) * Math.cos(y * 0.1);
        const terrain = Math.sin(x * 0.15 + y * 0.1) * Math.cos(x * 0.1 - y * 0.15);
        const layers = Math.sin(x * 0.2) * Math.sin(y * 0.2) + Math.cos(x * 0.1) * Math.cos(y * 0.1);
        
        const combined = (horizon + terrain + layers) / 3;
        const threshold = 0.25 + normalizedDistance * 0.35;
        
        if (combined > threshold) {
            const colorIndex = Math.floor((Math.abs(combined) * colors.length) % colors.length);
            return colors[colorIndex];
        }
        
        // Add terrain features
        const feature = Math.sin(x * 0.12 + y * 0.08) * Math.cos(x * 0.08 - y * 0.12);
        if (Math.abs(feature) > 0.65) {
            return colors[Math.floor((Math.abs(feature) * colors.length) % colors.length)];
        }
        
        return '#ffffff';
    }

    generateOrganicPattern(x, y, colors, normalizedDistance) {
        // Create organic, biological patterns
        const organic1 = Math.sin(x * 0.15) * Math.cos(y * 0.12) + Math.sin(x * 0.08) * Math.cos(y * 0.18);
        const organic2 = Math.sin(x * 0.12 + y * 0.08) * Math.cos(x * 0.06 - y * 0.12);
        const organic3 = Math.sin(x * 0.18) * Math.sin(y * 0.15) + Math.cos(x * 0.09) * Math.cos(y * 0.12);
        
        const combined = (organic1 + organic2 + organic3) / 3;
        const threshold = 0.2 + normalizedDistance * 0.4;
        
        if (combined > threshold) {
            const colorIndex = Math.floor((Math.abs(combined) * colors.length) % colors.length);
            return colors[colorIndex];
        }
        
        // Add cellular structures
        const cellular = Math.sin(x * 0.1 + y * 0.1) * Math.cos(x * 0.05 - y * 0.05);
        if (Math.abs(cellular) > 0.65) {
            return colors[Math.floor((Math.abs(cellular) * colors.length) % colors.length)];
        }
        
        return '#ffffff';
    }

    generateFractalPattern(x, y, colors, normalizedDistance) {
        // Create fractal-like patterns
        const fractal1 = Math.sin(x * 0.25) * Math.cos(y * 0.2) + Math.sin(x * 0.1) * Math.cos(y * 0.3);
        const fractal2 = Math.sin(x * 0.2 + y * 0.15) * Math.cos(x * 0.15 - y * 0.2);
        const fractal3 = Math.sin(x * 0.3) * Math.sin(y * 0.25) + Math.cos(x * 0.2) * Math.cos(y * 0.3);
        
        const combined = (fractal1 + fractal2 + fractal3) / 3;
        const threshold = 0.25 + normalizedDistance * 0.35;
        
        if (combined > threshold) {
            const colorIndex = Math.floor((Math.abs(combined) * colors.length) % colors.length);
            return colors[colorIndex];
        }
        
        // Add recursive patterns
        const recursive = Math.sin(x * 0.08 + y * 0.08) * Math.cos(x * 0.06 - y * 0.06);
        if (Math.abs(recursive) > 0.7) {
            return colors[Math.floor((Math.abs(recursive) * colors.length) % colors.length)];
        }
        
        return '#ffffff';
    }

    generateAbstractPattern(x, y, colors, normalizedDistance) {
        // Create abstract patterns
        const abstract1 = Math.sin(x * 0.2) * Math.cos(y * 0.15) + Math.sin(x * 0.1) * Math.cos(y * 0.2);
        const abstract2 = Math.sin(x * 0.15 + y * 0.1) * Math.cos(x * 0.1 - y * 0.15);
        const abstract3 = Math.sin(x * 0.25) * Math.sin(y * 0.2) + Math.cos(x * 0.15) * Math.cos(y * 0.2);
        
        const combined = (abstract1 + abstract2 + abstract3) / 3;
        const threshold = 0.3 + normalizedDistance * 0.3;
        
        if (combined > threshold) {
            const colorIndex = Math.floor((Math.abs(combined) * colors.length) % colors.length);
            return colors[colorIndex];
        }
        
        return '#ffffff';
    }

    applySecondaryConcepts(x, y, baseColor, colors, concepts) {
        const { secondary } = concepts;
        
        if (secondary.includes('fragmented')) {
            // Add fragmentation effects
            const fragment = Math.sin(x * 0.3 + y * 0.2) * Math.cos(x * 0.2 - y * 0.3);
            if (Math.abs(fragment) > 0.8) {
                const colorIndex = Math.floor((Math.abs(fragment) * colors.length) % colors.length);
                return colors[colorIndex] || '#ffffff';
            }
        }
        
        if (secondary.includes('interconnected')) {
            // Add connection lines
            const connection = Math.sin(x * 0.1 + y * 0.1) * Math.cos(x * 0.05 - y * 0.05);
            if (Math.abs(connection) > 0.75) {
                const colorIndex = Math.floor((Math.abs(connection) * colors.length) % colors.length);
                return colors[colorIndex] || '#ffffff';
            }
        }
        
        if (secondary.includes('layered')) {
            // Add layered effects
            const layer = Math.sin(x * 0.2) * Math.cos(y * 0.2);
            if (Math.abs(layer) > 0.7) {
                const colorIndex = Math.floor((Math.abs(layer) * colors.length) % colors.length);
                return colors[colorIndex] || '#ffffff';
            }
        }
        
        return baseColor || '#ffffff';
    }

    applyDensityAndFlow(x, y, baseColor, colors, concepts, normalizedDistance) {
        const { density, flow } = concepts;
        
        if (density === 'dense') {
            // Increase pattern density
            const dense = Math.sin(x * 0.15 + y * 0.15) * Math.cos(x * 0.1 - y * 0.1);
            if (Math.abs(dense) > 0.6) {
                const colorIndex = Math.floor((Math.abs(dense) * colors.length) % colors.length);
                return colors[colorIndex] || '#ffffff';
            }
        }
        
        if (flow === 'flowing') {
            // Add flowing effects
            const flow = Math.sin(x * 0.1 + y * 0.05) * Math.cos(x * 0.05 - y * 0.1);
            if (Math.abs(flow) > 0.65) {
                const colorIndex = Math.floor((Math.abs(flow) * colors.length) % colors.length);
                return colors[colorIndex] || '#ffffff';
            }
        }
        
        return baseColor || '#ffffff';
    }

    integrateSampleColors(baseColor, colors, samplePattern) {
        // Use sample pattern colors as inspiration
        if (baseColor === '#ffffff' && samplePattern.length > 0) {
            // If we have a white pixel, try to use a sample color
            const sampleColor = samplePattern[Math.floor(Math.random() * samplePattern.length)];
            if (sampleColor && sampleColor !== null && sampleColor !== undefined && colors.includes(sampleColor)) {
                return sampleColor;
            }
        }
        
        // Always return a valid color, never null or undefined
        return baseColor || '#ffffff';
    }

    generateFromInstructions(x, y, colors, instructions) {
        // Simplified fallback for when no sample pattern is available
        const lowerInstructions = instructions.toLowerCase();
        
        // Basic fallback pattern
        const pattern = Math.sin(x * 0.2) * Math.cos(y * 0.15) + Math.sin(x * 0.1) * Math.cos(y * 0.2);
        if (pattern > 0.3) {
            const colorIndex = Math.floor((Math.abs(pattern) * colors.length) % colors.length);
            return colors[colorIndex];
        }
        
        return '#ffffff';
    }

    ensureCompletePixelArray(pixelData) {
        if (isMinimal) {
            // Single horizontal line
            if (lowerInstructions.includes('horizontal') || lowerInstructions.includes('line')) {
                if (Math.abs(y - this.gridSize/2) < 2) {
                    return colors[0];
                }
            }
            // Single vertical line
            else if (lowerInstructions.includes('vertical') || lowerInstructions.includes('column')) {
                if (Math.abs(x - this.gridSize/2) < 2) {
                    return colors[0];
                }
            }
            // Single diagonal line
            else if (lowerInstructions.includes('diagonal')) {
                if (Math.abs((x + y) - this.gridSize) < 3) {
                    return colors[0];
                }
            }
            // Corner focus
            else if (lowerInstructions.includes('corner')) {
                if ((x < 8 && y < 8) || (x >= this.gridSize-8 && y >= this.gridSize-8)) {
                    return colors[0];
                }
            }
            // Edge focus
            else if (lowerInstructions.includes('edge')) {
                if (x < 4 || x >= this.gridSize-4 || y < 4 || y >= this.gridSize-4) {
                    return colors[0];
                }
            }
            // Center point
            else if (lowerInstructions.includes('center') || lowerInstructions.includes('point')) {
            const centerX = this.gridSize / 2;
            const centerY = this.gridSize / 2;
                if (Math.abs(x - centerX) < 3 && Math.abs(y - centerY) < 3) {
                    return colors[0];
                }
            }
            // Sparse scattered points
            else {
                const seed = (x * 13 + y * 17) % 100;
                if (seed < 8) { // Very sparse
                    return colors[seed % colors.length];
                }
            }
            return '#ffffff'; // White background for minimal patterns
        }
        
        // HORIZONTAL BANDS (simple)
        if (lowerInstructions.includes('horizontal') || lowerInstructions.includes('bands') || lowerInstructions.includes('stripes')) {
            const bandHeight = isComplex ? 4 : 8;
            const bandIndex = Math.floor(y / bandHeight);
            if (bandIndex % 2 === 0) {
                return colors[bandIndex % colors.length];
            }
            // Add much more variation within bands
            if (Math.random() > 0.3) { // Increased from 0.7 to 0.3
                return colors[(bandIndex + 1) % colors.length];
            }
            // Add additional band variations
            if (Math.random() > 0.5) {
                return colors[(bandIndex + 2) % colors.length];
            }
        }
        
        // VERTICAL COLUMNS (simple)
        if (lowerInstructions.includes('vertical') || lowerInstructions.includes('columns')) {
            const columnWidth = isComplex ? 4 : 8;
            const columnIndex = Math.floor(x / columnWidth);
            if (columnIndex % 2 === 0) {
                return colors[columnIndex % colors.length];
            }
            // Add much more variation within columns
            if (Math.random() > 0.3) { // Increased from 0.7 to 0.3
                return colors[(columnIndex + 1) % colors.length];
            }
            // Add additional column variations
            if (Math.random() > 0.5) {
                return colors[(columnIndex + 2) % colors.length];
            }
        }
        
        // DIAGONAL LINES (but different from the old pattern)
        if (lowerInstructions.includes('diagonal') || lowerInstructions.includes('slanted')) {
            const diagonalSpacing = isComplex ? 6 : 12;
            if ((x + y) % diagonalSpacing < 3) {
                return colors[Math.floor((x + y) / diagonalSpacing) % colors.length];
            }
            // Add some cross-diagonal variation
            if ((x - y + this.gridSize) % (diagonalSpacing + 2) < 2) {
                return colors[Math.floor((x - y + this.gridSize) / (diagonalSpacing + 2)) % colors.length];
            }
        }
        
        // CHECKERBOARD (simple)
        if (lowerInstructions.includes('checker') || lowerInstructions.includes('chess') || lowerInstructions.includes('grid')) {
            const checkerSize = isComplex ? 3 : 6;
            const checkerX = Math.floor(x / checkerSize);
            const checkerY = Math.floor(y / checkerSize);
            if ((checkerX + checkerY) % 2 === 0) {
                return colors[(checkerX + checkerY) % colors.length];
            }
            // Add some noise to break up the perfect grid
            if (Math.random() > 0.8) {
                return colors[(checkerX + checkerY + 1) % colors.length];
            }
        }
        
        // WAVE PATTERNS (completely different approach)
        if (lowerInstructions.includes('wave') || lowerInstructions.includes('current') || lowerInstructions.includes('ocean')) {
            const wave1 = Math.sin(x * 0.1) * 0.5;
            const wave2 = Math.sin(y * 0.15) * 0.3;
            const combinedWave = wave1 + wave2;
            if (Math.abs(combinedWave) > 0.4) {
                return colors[Math.floor((combinedWave + 1) * 0.5 * colors.length) % colors.length];
            }
        }
        
        // SCATTERED POINTS (varied density)
        if (lowerInstructions.includes('scattered') || lowerInstructions.includes('random') || lowerInstructions.includes('points')) {
            const density = isComplex ? 0.6 : 0.3; // Increased density
            const seed = (x * 7 + y * 11) % 100;
            if (seed < density * 100) {
                return colors[seed % colors.length];
            }
            // Add some clustering for more interesting patterns
            const clusterSeed = (Math.floor(x/4) * 13 + Math.floor(y/4) * 17) % 100;
            if (clusterSeed < 0.2 * 100) {
                return colors[clusterSeed % colors.length];
            }
        }
        
        // ORGANIC PATTERNS (completely new approach)
        if (lowerInstructions.includes('organic') || lowerInstructions.includes('biological') || lowerInstructions.includes('cellular')) {
            const organic1 = Math.sin(x * 0.05) * Math.cos(y * 0.07);
            const organic2 = Math.sin(x * 0.03) * Math.sin(y * 0.05);
            const organic3 = Math.sin(x * 0.08) * Math.cos(y * 0.04);
            const organicValue = organic1 + organic2 + organic3;
            if (Math.abs(organicValue) > 0.4) { // Lowered threshold for more coverage
                return colors[Math.floor((organicValue + 1) * 0.5 * colors.length) % colors.length];
            }
            // Add some cellular-like structures
            const cellPattern = Math.sin(x * 0.1) * Math.cos(y * 0.1) + Math.sin(x * 0.15) * Math.cos(y * 0.15);
            if (Math.abs(cellPattern) > 0.5) {
                return colors[Math.floor((cellPattern + 1) * 0.5 * colors.length) % colors.length];
            }
        }
        
        // CRYSTALLINE PATTERNS (new approach) - HIGH PRIORITY
        if (lowerInstructions.includes('crystal') || lowerInstructions.includes('prism') || lowerInstructions.includes('diamond') || 
            lowerInstructions.includes('crystalline') || lowerInstructions.includes('geometric') || lowerInstructions.includes('fragments')) {
            const crystal1 = Math.sin(x * 0.2 + y * 0.2) * Math.cos(x * 0.1 - y * 0.1);
            const crystal2 = Math.sin(x * 0.15) * Math.sin(y * 0.15);
            const crystal3 = Math.sin(x * 0.1) * Math.cos(y * 0.1);
            if (Math.abs(crystal1) > 0.2 || Math.abs(crystal2) > 0.2 || Math.abs(crystal3) > 0.3) { // Much lower thresholds
                return colors[Math.floor((Math.abs(crystal1) + Math.abs(crystal2) + Math.abs(crystal3)) * 0.33 * colors.length) % colors.length];
            }
            // Add some geometric crystal structures - much denser
            const geoPattern = (x + y) % 6 < 4 || (x - y + this.gridSize) % 8 < 4; // Increased coverage
            if (geoPattern) {
                return colors[Math.floor((x + y) / 6) % colors.length];
            }
            // Add more crystal variations
            const crystal4 = Math.sin(x * 0.08) * Math.cos(y * 0.08);
            if (Math.abs(crystal4) > 0.4) {
                return colors[Math.floor((Math.abs(crystal4) + 1) * 0.5 * colors.length) % colors.length];
            }
        }
        
        // MESH/NETWORK PATTERNS (new approach) - HIGH PRIORITY
        if (lowerInstructions.includes('mesh') || lowerInstructions.includes('network') || lowerInstructions.includes('web') ||
            lowerInstructions.includes('neural') || lowerInstructions.includes('interconnected') || lowerInstructions.includes('intersections')) {
            const mesh1 = (x + y) % 6 < 4; // Much denser
            const mesh2 = (x - y + this.gridSize) % 8 < 4; // Much denser
            const mesh3 = (x * 2 + y) % 10 < 3; // Added third mesh direction
            const mesh4 = (x + y * 2) % 12 < 3; // Added fourth mesh direction
            if (mesh1 || mesh2 || mesh3 || mesh4) {
                return colors[Math.floor((x + y) / 6) % colors.length];
            }
            // Add many more connection points
            if ((x % 6 === 0 && y % 6 === 0) || (x % 8 === 0 && y % 8 === 0) || (x % 10 === 0 && y % 10 === 0)) {
                return colors[Math.floor((x + y) / 12) % colors.length];
            }
            // Add random network connections
            if (Math.random() > 0.7) {
                return colors[Math.floor((x + y) / 8) % colors.length];
            }
        }
        
        // FRACTAL PATTERNS (new approach)
        if (lowerInstructions.includes('fractal') || lowerInstructions.includes('complex') || lowerInstructions.includes('intricate')) {
            const fractal1 = Math.sin(x * 0.1) * Math.cos(y * 0.1);
            const fractal2 = Math.sin(x * 0.05) * Math.cos(y * 0.05);
            const fractal3 = Math.sin(x * 0.02) * Math.cos(y * 0.02);
            const fractal4 = Math.sin(x * 0.15) * Math.cos(y * 0.15);
            const fractalValue = fractal1 + fractal2 + fractal3 + fractal4;
            if (Math.abs(fractalValue) > 0.6) { // Lowered threshold
                return colors[Math.floor((fractalValue + 1) * 0.5 * colors.length) % colors.length];
            }
            // Add some recursive-like patterns
            const recursivePattern = Math.sin(x * 0.08) * Math.cos(y * 0.08) + Math.sin(x * 0.04) * Math.cos(y * 0.04);
            if (Math.abs(recursivePattern) > 0.7) {
                return colors[Math.floor((recursivePattern + 1) * 0.5 * colors.length) % colors.length];
            }
        }
        
        // SPIRAL PATTERNS (only when specifically requested)
        if (lowerInstructions.includes('spiral') || lowerInstructions.includes('galaxy') || lowerInstructions.includes('vortex')) {
        const centerX = this.gridSize / 2;
        const centerY = this.gridSize / 2;
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const angle = Math.atan2(y - centerY, x - centerX);
            const spiralValue = Math.sin(distFromCenter * 0.2 + angle * 3);
            if (spiralValue > 0.4) {
                return colors[Math.floor((distFromCenter / 32) * colors.length) % colors.length];
            }
        }
        
        // RADIAL PATTERNS (only when specifically requested)
        if (lowerInstructions.includes('radial') || lowerInstructions.includes('circular')) {
            const centerX = this.gridSize / 2;
            const centerY = this.gridSize / 2;
            const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const angle = Math.atan2(y - centerY, x - centerX);
            const radialValue = Math.sin(distFromCenter * 0.15 + angle * 4);
            if (radialValue > 0.5) {
                return colors[Math.floor((angle + Math.PI) / (2 * Math.PI) * colors.length) % colors.length];
            }
        }
        
        // LANDSCAPE PATTERNS (for geometric landscapes)
        if (lowerInstructions.includes('landscape') || lowerInstructions.includes('horizon') || lowerInstructions.includes('terrain')) {
            // Create layered landscape effect
            const horizon = Math.floor(y / 8); // Divide into horizontal layers
            const layerPattern = (x + horizon * 3) % 8 < 5; // Dense coverage
            if (layerPattern) {
                return colors[horizon % colors.length];
            }
            // Add vertical elements for landscape depth
            const depthPattern = (x * 2 + y) % 12 < 6;
            if (depthPattern) {
                return colors[(horizon + 1) % colors.length];
            }
            // Add some random landscape elements
            if (Math.random() > 0.4) {
                return colors[(horizon + 2) % colors.length];
            }
        }
        
        // DEFAULT: Much more substantial varied pattern based on position
        // Avoid the old circular/diagonal default
        const simplePattern = (x + y) % 8 < 5; // Much denser coverage
        if (simplePattern) {
            return colors[Math.floor((x + y) / 8) % colors.length];
        }
        // Add some additional pattern elements for more coverage
        const additionalPattern = (x * 2 + y) % 12 < 6; // Much denser
        if (additionalPattern) {
            return colors[Math.floor((x * 2 + y) / 12) % colors.length];
        }
        // Add some random elements for variety
        const randomPattern = (x * 3 + y * 5) % 16 < 8; // Much denser
        if (randomPattern) {
            return colors[Math.floor((x * 3 + y * 5) / 16) % colors.length];
        }
        // Add even more coverage
        const extraPattern = (x + y * 2) % 10 < 6;
        if (extraPattern) {
            return colors[Math.floor((x + y * 2) / 10) % colors.length];
        }
        
        return '#ffffff'; // White background instead of null
    }

    ensureCompletePixelArray(pixelData) {
        // Ensure we have a complete 64x64 array
        const completeArray = [];
        
        // Count how many rows we actually have
        const actualRows = pixelData ? pixelData.length : 0;
        const actualCols = pixelData && pixelData[0] ? pixelData[0].length : 0;
        
        console.log(`Original array size: ${actualRows}x${actualCols}, need: ${this.gridSize}x${this.gridSize}`);
        
        // If we have very little data, generate a full abstract pattern
        if (actualRows < 10) {
            console.log('Generating full abstract pattern from Claude\'s sample');
            return this.generateFullAbstractPattern(pixelData);
        }
        
        for (let y = 0; y < this.gridSize; y++) {
            const row = [];
            for (let x = 0; x < this.gridSize; x++) {
                // Check if the pixel exists in the original data
                if (pixelData[y] && pixelData[y][x] !== undefined) {
                    row.push(pixelData[y][x]);
                } else {
                    // If we're missing a lot of data, create some abstract patterns
                    if (actualRows < this.gridSize * 0.5) {
                        // Create abstract patterns for missing areas
                        const pattern = this.generateAbstractPattern(x, y);
                        row.push(pattern);
                    } else {
                        // Fill with white background if we have most of the data
                        row.push('#ffffff');
                    }
                }
            }
            completeArray.push(row);
        }
        
        // Ensure no null values remain - fill with white background
        for (let y = 0; y < completeArray.length; y++) {
            for (let x = 0; x < completeArray[y].length; x++) {
                if (completeArray[y][x] === null || completeArray[y][x] === undefined) {
                    completeArray[y][x] = '#ffffff';
                }
            }
        }
        
        return completeArray;
    }

    generateFullAbstractPattern(sampleData) {
        // Extract colors from Claude's sample
        const colors = new Set();
        if (sampleData && sampleData.length > 0) {
            for (let y = 0; y < sampleData.length; y++) {
                for (let x = 0; x < sampleData[y].length; x++) {
                    if (sampleData[y][x] && sampleData[y][x] !== null) {
                        colors.add(sampleData[y][x]);
                    }
                }
            }
        }
        
        const colorArray = Array.from(colors);
        console.log('Extracted colors from Claude sample:', colorArray);
        
        // Generate a full 64x64 abstract pattern using Claude's colors
        const fullArray = [];
        
        for (let y = 0; y < this.gridSize; y++) {
            const row = [];
            for (let x = 0; x < this.gridSize; x++) {
                // Create complex abstract patterns
                const pattern = this.generateComplexPattern(x, y, colorArray);
                row.push(pattern);
            }
            fullArray.push(row);
        }
        
        return fullArray;
    }

    generateComplexPattern(x, y, colors) {
        if (colors.length === 0) {
            // Fallback colors if no colors extracted
            colors = ['#4a90e2', '#7b68ee', '#ff6b6b', '#45b7d1', '#96ceb4'];
        }
        
        // Create multiple overlapping patterns
        const patterns = [
            // Wave patterns
            Math.sin(x * 0.1 + y * 0.05) > 0.3,
            Math.cos(x * 0.08 + y * 0.12) > 0.2,
            // Spiral patterns
            Math.sin(Math.sqrt((x-32)**2 + (y-32)**2) * 0.2) > 0.4,
            // Grid patterns
            (x + y) % 12 < 4,
            // Random patterns
            Math.random() > 0.6,
            // Diagonal patterns
            (x - y) % 8 < 3,
            // Radial patterns
            Math.sin(Math.atan2(y-32, x-32) * 3) > 0.3
        ];
        
        // Count how many patterns are active
        const activePatterns = patterns.filter(p => p).length;
        
        // Return a color based on pattern density, or white background for sparse areas
        if (activePatterns >= 2) {
            return colors[Math.floor(Math.random() * colors.length)];
        } else if (activePatterns === 1 && Math.random() > 0.7) {
            return colors[Math.floor(Math.random() * colors.length)];
        } else {
            return '#ffffff'; // White background instead of null
        }
    }

    generateAbstractPattern(x, y) {
        // Create abstract patterns for missing areas
        const patterns = [
            // Wave patterns
            Math.sin(x * 0.2 + y * 0.1) > 0.3 ? '#4a90e2' : '#ffffff',
            Math.cos(x * 0.15 + y * 0.2) > 0.2 ? '#7b68ee' : '#ffffff',
            // Spiral patterns
            Math.sin(Math.sqrt((x-32)**2 + (y-32)**2) * 0.3) > 0.4 ? '#ff6b6b' : '#ffffff',
            // Random patterns
            Math.random() > 0.7 ? '#45b7d1' : '#ffffff',
            // Grid patterns
            (x + y) % 8 < 3 ? '#96ceb4' : '#ffffff'
        ];
        
        // Return a random pattern or white background
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    async paintClaudeArtwork(pixelData) {
        const pixelsToPaint = [];
        
        // Collect all pixels that need to be painted
        for (let y = 0; y < this.gridSize; y++) {
            // Check if the row exists and has data
            if (pixelData[y] && Array.isArray(pixelData[y])) {
                for (let x = 0; x < this.gridSize; x++) {
                    // Check if the pixel exists in this row
                    if (pixelData[y][x] !== undefined) {
                        const pixel = pixelData[y][x];
                        if (pixel && pixel !== '#ffffff' && pixel !== null) {
                            pixelsToPaint.push({
                                x: x,
                                y: y,
                                color: pixel
                            });
                        }
                    }
                }
            }
        }
        
        console.log(`Total pixels to paint: ${pixelsToPaint.length}`);
        
        // Group pixels by color for color-by-color painting
        const pixelsByColor = {};
        pixelsToPaint.forEach(pixel => {
            if (!pixelsByColor[pixel.color]) {
                pixelsByColor[pixel.color] = [];
            }
            pixelsByColor[pixel.color].push(pixel);
        });
        
        // Shuffle pixels within each color group for organic painting
        Object.keys(pixelsByColor).forEach(color => {
            const colorPixels = pixelsByColor[color];
            for (let i = colorPixels.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [colorPixels[i], colorPixels[j]] = [colorPixels[j], colorPixels[i]];
            }
        });
        
        console.log(`Painting ${Object.keys(pixelsByColor).length} colors with ${pixelsToPaint.length} total pixels`);
        
        let pixelsPainted = 0;
        const startTime = Date.now();
        
        // Paint color by color
        const colorKeys = Object.keys(pixelsByColor);
        for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
            const color = colorKeys[colorIndex];
            const colorPixels = pixelsByColor[color];
            
            this.updateStatus(`Claude is painting with ${color}... (${colorIndex + 1}/${colorKeys.length} colors)`);
            
            // Paint all pixels of this color
            for (let pixelIndex = 0; pixelIndex < colorPixels.length; pixelIndex++) {
                const pixel = colorPixels[pixelIndex];
                this.currentPixels[pixel.y][pixel.x] = pixel.color;
                pixelsPainted++;
                
                // Update canvas every few pixels for performance
                if (pixelIndex % 3 === 0 || pixelIndex === colorPixels.length - 1) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawGrid();
                    this.drawPixels();
                    
                    // Instant painting for testing - no delay
                    // await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
            
            // No pause between colors for testing
            // await new Promise(resolve => setTimeout(resolve, 600));
        }
        
        console.log(`Finished painting ${pixelsPainted} pixels in ${Date.now() - startTime}ms`);
        this.updateStatus('Claude has finished painting!');
    }

    async generateWithSimulatedAI() {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a sophisticated pattern
        const pattern = this.generateAdvancedPattern();
        const colors = this.getAdvancedColorPalette();
        
        // Clear canvas first
        this.currentPixels = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('#ffffff'));
        this.redrawCanvas();
        
        // Generate title and description
        const titles = [
            'Digital Dreams', 'Pixel Symphony', 'Neon Genesis', 'Cosmic Dance',
            'Electric Forest', 'Retro Future', 'Abstract Harmony', 'Digital Nature',
            'Pixel Poetry', 'Cyber Garden', 'Neon Waves', 'Digital Mandala'
        ];
        
        const descriptions = [
            'A mesmerizing blend of geometric patterns and flowing colors',
            'An abstract exploration of digital aesthetics and visual rhythm',
            'A cosmic journey through pixelated landscapes and neon dreams',
            'A harmonious composition of shapes, colors, and digital textures',
            'An artistic interpretation of technology meeting nature',
            'A vibrant celebration of retro-futuristic pixel art aesthetics'
        ];
        
        const title = titles[Math.floor(Math.random() * titles.length)];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        document.getElementById('artworkTitle').textContent = title;
        document.getElementById('artworkDescription').textContent = description;
        
        // Paint the artwork pixel by pixel for live effect
        await this.paintLive(pattern, colors);
    }

    async paintLive(pattern, colors) {
        const pixelsToPaint = [];
        
        // Collect all pixels that need to be painted
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (pattern[y][x]) {
                    pixelsToPaint.push({
                        x: x,
                        y: y,
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                }
            }
        }
        
        // Shuffle pixels for random painting order
        for (let i = pixelsToPaint.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pixelsToPaint[i], pixelsToPaint[j]] = [pixelsToPaint[j], pixelsToPaint[i]];
        }
        
        // Paint pixels with animation
        for (let i = 0; i < pixelsToPaint.length; i++) {
            const pixel = pixelsToPaint[i];
            this.currentPixels[pixel.y][pixel.x] = pixel.color;
            
            // Redraw canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawGrid();
            this.drawPixels();
            
            // Add small delay for animation effect
            if (i % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 20));
            }
        }
    }

    generateAdvancedPattern() {
        const pattern = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        
        // Create multiple overlapping patterns for complexity
        const patterns = [
            this.createSpiralPattern(),
            this.createWavePattern(),
            this.createFractalPattern(),
            this.createSymmetricalPattern()
        ];
        
        // Combine patterns
        patterns.forEach(p => {
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    if (p[y][x]) pattern[y][x] = true;
                }
            }
        });
        
        return pattern;
    }

    createSpiralPattern() {
        const pattern = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        const centerX = this.gridSize / 2;
        const centerY = this.gridSize / 2;
        
        for (let i = 0; i < 200; i++) {
            const angle = i * 0.3;
            const radius = i * 0.1;
            const x = Math.round(centerX + Math.cos(angle) * radius);
            const y = Math.round(centerY + Math.sin(angle) * radius);
            
            if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
                pattern[y][x] = true;
            }
        }
        
        return pattern;
    }

    createWavePattern() {
        const pattern = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                const wave1 = Math.sin(x * 0.2) * 10;
                const wave2 = Math.cos(y * 0.15) * 8;
                const combined = wave1 + wave2;
                
                if (Math.abs(y - (this.gridSize/2 + combined)) < 3 && Math.random() > 0.3) {
                    pattern[y][x] = true;
                }
            }
        }
        
        return pattern;
    }

    createFractalPattern() {
        const pattern = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        
        // Simple fractal-like pattern
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const dist = Math.sqrt((x - this.gridSize/2) ** 2 + (y - this.gridSize/2) ** 2);
                const angle = Math.atan2(y - this.gridSize/2, x - this.gridSize/2);
                
                if (Math.sin(dist * 0.5 + angle * 3) > 0.3 && Math.random() > 0.4) {
                    pattern[y][x] = true;
                }
            }
        }
        
        return pattern;
    }

    createSymmetricalPattern() {
        const pattern = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        
        // Create symmetrical design
        for (let y = 0; y < this.gridSize/2; y++) {
            for (let x = 0; x < this.gridSize/2; x++) {
                if (Math.random() > 0.6) {
                    // Mirror to all quadrants
                    pattern[y][x] = true;
                    pattern[y][this.gridSize-1-x] = true;
                    pattern[this.gridSize-1-y][x] = true;
                    pattern[this.gridSize-1-y][this.gridSize-1-x] = true;
                }
            }
        }
        
        return pattern;
    }

    getAdvancedColorPalette() {
        const palettes = [
            ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
            ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
            ['#fa709a', '#fee140', '#a8edea', '#fed6e3', '#d299c2', '#fef9d7', '#667eea', '#764ba2'],
            ['#ff9a9e', '#fecfef', '#fecfef', '#ffecd2', '#fcb69f', '#ff8a80', '#ff80ab', '#ea80fc'],
            ['#a8c0ff', '#3f2b96', '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
        ];
        
        return palettes[Math.floor(Math.random() * palettes.length)];
    }
    
    generateRandomTitle() {
        const titles = [
            'Digital Dreams', 'Pixel Symphony', 'Neon Genesis', 'Cosmic Dance',
            'Electric Forest', 'Retro Future', 'Abstract Harmony', 'Digital Nature',
            'Pixel Poetry', 'Cyber Garden', 'Neon Waves', 'Digital Mandala',
            'Chromatic Resonance', 'Geometric Flow', 'Color Field Study', 'Abstract Composition'
        ];
        
        return titles[Math.floor(Math.random() * titles.length)];
    }
    
    generateRandomDescription() {
        const descriptions = [
            'A mesmerizing blend of geometric patterns and flowing colors',
            'An abstract exploration of digital aesthetics and visual rhythm',
            'A cosmic journey through pixelated landscapes and neon dreams',
            'A harmonious composition of shapes, colors, and digital textures',
            'An artistic interpretation of technology meeting nature',
            'A vibrant celebration of retro-futuristic pixel art aesthetics',
            'A formal investigation of color interactions and spatial dynamics',
            'An exploration of chromatic tension through geometric abstraction'
        ];
        
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    saveCurrentArtwork() {
        // For new 32x32 artworks, we need to save the original row data format
        // Check if we have row data from the last generated artwork
        let pixelsToSave = this.currentPixels.map(row => [...row]);
        
        // If we have row data in memory, use that instead
        if (this.lastGeneratedRowData && this.lastGeneratedRowData.rows) {
            // Convert row data to 32x32 pixel array
            pixelsToSave = this.lastGeneratedRowData.rows.map(row => 
                row.map(val => val === "." ? "#FFFFFF" : val)
            );
        }
        
        const artwork = {
            id: Date.now(),
            pixels: pixelsToSave,
            timestamp: new Date().toISOString(),
            title: document.getElementById('artworkTitle').textContent,
            description: document.getElementById('artworkDescription').textContent,
            format: '32x32'
        };
        
        const savedArtworks = this.getSavedArtworks();
        savedArtworks.unshift(artwork); // Add to beginning
        
        // Keep only last 50 artworks
        if (savedArtworks.length > 50) {
            savedArtworks.splice(50);
        }
        
        localStorage.setItem('claude_artworks', JSON.stringify(savedArtworks));
        this.loadGallery();
    }

    getSavedArtworks() {
        const saved = localStorage.getItem('claude_artworks');
        return saved ? JSON.parse(saved) : [];
    }

    loadGallery() {
        const gallery = document.getElementById('gallery');
        const artworks = this.getSavedArtworks();
        
        // Sort artworks by timestamp (newest first)
        artworks.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || 0);
            const dateB = new Date(b.timestamp || b.createdAt || 0);
            return dateB - dateA; // Newest first
        });
        
        console.log('🎨 Loading gallery...');
        console.log('🎨 Gallery element found:', gallery ? 'YES' : 'NO');
        console.log('🎨 Number of artworks found:', artworks.length);
        console.log('🎨 Artworks (newest first):', artworks);
        
        if (!gallery) {
            console.error('🎨 Gallery element not found!');
            return;
        }
        
        gallery.innerHTML = '';
        
        if (artworks.length === 0) {
            console.log('🎨 No artworks to display');
            gallery.innerHTML = '<div class="no-artworks">No artworks yet. Claude is still creating his first masterpiece!</div>';
            return;
        }
        
        artworks.forEach(artwork => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.id = artwork.id;
            
            // Create a small canvas for the thumbnail
            const thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = 64;
            thumbCanvas.height = 64;
            const thumbCtx = thumbCanvas.getContext('2d');
            
                // Debug: Check if it's a valid 32x32 artwork
                console.log(`🎨 Loading artwork "${artwork.title}":`, {
                    is32x32: artwork.pixels?.length === 32 && artwork.pixels?.[0]?.length === 32,
                    hasValidData: !!artwork.pixels && artwork.pixels.length > 0
                });
            
            // Draw the 32x32 artwork on the thumbnail
            if (artwork.pixels && artwork.pixels.length === 32 && artwork.pixels[0] && artwork.pixels[0].length === 32) {
                // Fill background with white
                thumbCtx.fillStyle = '#FFFFFF';
                thumbCtx.fillRect(0, 0, 64, 64);
                
                // 32x32 artwork - scale each pixel to 2x2 on 64x64 thumbnail
                for (let y = 0; y < 32; y++) {
                    for (let x = 0; x < 32; x++) {
                        if (artwork.pixels[y] && artwork.pixels[y][x]) {
                            thumbCtx.fillStyle = artwork.pixels[y][x];
                            // Scale 1 pixel to 2x2, filling the entire 64x64 thumbnail
                            thumbCtx.fillRect(x * 2, y * 2, 2, 2);
                        }
                    }
                }
                item.appendChild(thumbCanvas);
                item.addEventListener('click', () => this.viewGalleryArtwork(artwork));
                gallery.appendChild(item);
            } else {
                // Skip artworks without proper 32x32 pixel data
                console.log(`🎨 Skipping artwork "${artwork.title}" - not 32x32 format or missing pixel data`);
            }
        });
        
        // artworkCount element removed from UI
        
        const totalArtworksElement = document.getElementById('totalArtworks');
        if (totalArtworksElement) {
            totalArtworksElement.textContent = artworks.length;
        }
        
        this.updateGalleryCount();
    }

    updateGalleryCount() {
        const countElement = document.getElementById('galleryCount');
        const artworks = this.getSavedArtworks();
        if (countElement) {
            countElement.textContent = `${artworks.length} artwork${artworks.length !== 1 ? 's' : ''}`;
        }
    }

    viewGalleryArtwork(artwork) {
        const galleryCanvas = document.getElementById('galleryCanvas');
        const viewerTitle = document.getElementById('viewerTitle');
        const viewerDescription = document.getElementById('viewerDescription');
        const viewerDate = document.getElementById('viewerDate');
        const viewerNumber = document.getElementById('viewerNumber');
        
        if (galleryCanvas && artwork) {
            const ctx = galleryCanvas.getContext('2d');
            
            // Clear the canvas
            ctx.clearRect(0, 0, galleryCanvas.width, galleryCanvas.height);
            
            // Draw the full-size artwork
            this.drawArtworkOnCanvas(ctx, artwork.pixels, 512);
            
            // Find the artwork number in the gallery
            const artworks = this.getSavedArtworks();
            const artworkIndex = artworks.findIndex(a => a.id === artwork.id);
            const artworkNumber = artworkIndex + 1; // 1-based numbering
            
            // Update viewer info
            if (viewerTitle) viewerTitle.textContent = artwork.title || 'Untitled';
            if (viewerDescription) viewerDescription.textContent = artwork.description || 'No description available';
            if (viewerDate) viewerDate.textContent = artwork.createdAt ? new Date(artwork.createdAt).toLocaleString() : 'Unknown';
            if (viewerNumber) viewerNumber.textContent = artworkNumber || 'Unknown';
            
            console.log('🎨 Gallery artwork viewed:', artwork.title, 'Artwork #' + artworkNumber);
        }
    }

    drawArtworkOnCanvas(ctx, pixels, canvasSize) {
        // For gallery viewer, scale 32x32 artwork to fill the canvas
        if (pixels.length === 32 && pixels[0] && pixels[0].length === 32) {
            const pixelSize = canvasSize / 32; // Scale 32x32 to canvas size
            
            // Fill background with white first
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasSize, canvasSize);
            
            // Draw the 32x32 artwork scaled to fill the canvas
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    if (pixels[y][x] && pixels[y][x] !== '#ffffff') {
                        ctx.fillStyle = pixels[y][x];
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
        } else {
            // Fallback for other formats
            const pixelSize = canvasSize / 32;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasSize, canvasSize);
            
            if (pixels && pixels.length > 0) {
                for (let y = 0; y < Math.min(32, pixels.length); y++) {
                    for (let x = 0; x < Math.min(32, pixels[y]?.length || 0); x++) {
                        if (pixels[y][x] && pixels[y][x] !== '#ffffff') {
                            ctx.fillStyle = pixels[y][x];
                            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                        }
                    }
                }
            }
        }
    }

    loadArtwork(artwork) {
        this.currentPixels = artwork.pixels.map(row => [...row]);
        this.redrawCanvas();
        document.getElementById('artworkTitle').textContent = artwork.title;
        document.getElementById('artworkDescription').textContent = artwork.description;
        this.updateStatus('Artwork loaded from gallery');
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.generateArtwork();
        }, this.timerDuration);
        
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        let timeLeft = this.timerDuration;
        
        const updateDisplay = () => {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timerElement.textContent = `Next artwork in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft > 0) {
                timeLeft -= 1000;
                setTimeout(updateDisplay, 1000);
            } else {
                timeLeft = this.timerDuration;
                setTimeout(updateDisplay, 1000);
            }
        };
        
        updateDisplay();
    }

    startPaintingTimer() {
        this.paintingStartTime = Date.now();
        this.updatePaintingTimer();
    }

    updatePaintingTimer() {
        const paintingTimeElement = document.getElementById('paintingTime');
        if (paintingTimeElement && this.paintingStartTime) {
            const now = Date.now();
            const elapsed = Math.floor((now - this.paintingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            paintingTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update every second
        setTimeout(() => this.updatePaintingTimer(), 1000);
    }

    updateHeaderStats() {
        // Update total artworks count
        const totalArtworksElement = document.getElementById('totalArtworks');
        if (totalArtworksElement) {
            totalArtworksElement.textContent = this.claudeMemory.totalArtworks;
        }
    }

    clearConsciousnessPanel() {
        // Clear the consciousness panel while creating new artwork
        console.log('🧠 Clearing consciousness panel - totalArtworks:', this.claudeMemory.totalArtworks);
        const consciousnessElement = document.getElementById('claudeConsciousness');
        if (consciousnessElement) {
            consciousnessElement.innerHTML = `
                <div class="consciousness-info">
                    <h4>Claude's Artistic Consciousness</h4>
                    <p><strong>Phase:</strong> ${this.artisticEvolution.currentPhase}</p>
                    <p><strong>Artworks Created:</strong> ${this.claudeMemory.totalArtworks}</p>
                    <p><strong>Status:</strong> Creating new artwork...</p>
                    <p><em>Claude is focused on bringing his new vision to life...</em></p>
                </div>
            `;
        } else {
            console.error('🧠 Consciousness element not found in clearConsciousnessPanel!');
        }
    }

    renderClaudeRows(rowData) {
        // Render Claude's dense row-based pixel art to the canvas
        const canvasSize = rowData.canvasSize || 32;
        const rows = rowData.rows || [];
        const pixelSize = 16; // Scale up for visibility (32x32 -> 512x512)
        
        // Determine background color by analyzing the entire artwork
        let backgroundColor = '#FFFFFF'; // default
        if (rows.length > 0) {
            // Count all colors in the artwork
            const colorCount = {};
            for (let y = 0; y < rows.length; y++) {
                const row = rows[y];
                if (Array.isArray(row)) {
                    for (let x = 0; x < row.length; x++) {
                        const val = row[x];
                        colorCount[val] = (colorCount[val] || 0) + 1;
                    }
                }
            }
            
            // Find the most common color (likely background)
            let maxCount = 0;
            let mostCommonColor = ".";
            for (const [color, count] of Object.entries(colorCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    mostCommonColor = color;
                }
            }
            
            // If dots are most common, use white; otherwise use the most common color
            if (mostCommonColor === ".") {
                backgroundColor = '#FFFFFF';
            } else {
                backgroundColor = mostCommonColor;
            }
            
            console.log(`🎨 Background analysis: Most common color is ${mostCommonColor} (${maxCount} pixels)`);
        }
        
        console.log(`🎨 Rendering ${rows.length} rows on ${canvasSize}x${canvasSize} canvas with background ${backgroundColor}`);
        
        // Clear the entire 64x64 canvas with determined background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Center the 32x32 artwork on the 64x64 canvas
        const offsetX = (64 - canvasSize) / 2 * pixelSize; // 16 pixels offset
        const offsetY = (64 - canvasSize) / 2 * pixelSize; // 16 pixels offset
        
        // Render each row
        for (let y = 0; y < canvasSize && y < rows.length; y++) {
            const row = rows[y];
            if (Array.isArray(row)) {
                // Decompress the row first
                const decompressedRow = this.decompressRow(row);
                
                for (let x = 0; x < canvasSize && x < decompressedRow.length; x++) {
                    const val = decompressedRow[x];
                    const color = val === "." ? backgroundColor : val;
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        offsetX + x * pixelSize, 
                        offsetY + y * pixelSize, 
                        pixelSize, 
                        pixelSize
                    );
                }
            }
        }
        
        console.log(`✅ Rendered complete ${canvasSize}x${canvasSize} dense canvas with ${backgroundColor} background`);
    }

    renderClaudePixels(pixelData) {
        // Render Claude's direct pixel art data to the canvas (legacy sparse format)
        const canvasSize = pixelData.canvasSize || 32;
        const background = pixelData.background || '#FFFFFF';
        const pixels = pixelData.pixels || [];
        const pixelSize = 16; // Scale up for visibility (32x32 -> 512x512)
        
        console.log(`🎨 Rendering ${pixels.length} pixels with background ${background}`);
        
        // Fill background
        this.ctx.fillStyle = background;
        this.ctx.fillRect(0, 0, canvasSize * pixelSize, canvasSize * pixelSize);
        
        // Paint pixels
        pixels.forEach((pixel, index) => {
            if (pixel.x >= 0 && pixel.x < canvasSize && pixel.y >= 0 && pixel.y < canvasSize) {
                this.ctx.fillStyle = pixel.color;
                this.ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
                if (index < 5) { // Only log first 5 pixels to avoid spam
                    console.log(`Painted pixel ${index + 1} at (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);
                }
            } else {
                console.warn(`Invalid pixel coordinates: (${pixel.x}, ${pixel.y})`);
            }
        });
        
        console.log(`✅ Rendered ${pixels.length} pixels on ${canvasSize}x${canvasSize} canvas`);
    }

    convertPixelDataToArray(pixelData) {
        // Convert Claude's pixel data to the internal 64x64 array format
        const canvasSize = pixelData.canvasSize || 32;
        const background = pixelData.background || '#FFFFFF';
        const pixels = pixelData.pixels || [];
        
        // Create 64x64 array (scale up from 32x32)
        const scaleFactor = 2; // 64/32
        const array = Array(64).fill().map(() => Array(64).fill(background));
        
        // Place pixels with scaling
        pixels.forEach(pixel => {
            if (pixel.x >= 0 && pixel.x < canvasSize && pixel.y >= 0 && pixel.y < canvasSize) {
                // Scale up the pixel to fill a 2x2 area
                for (let dy = 0; dy < scaleFactor; dy++) {
                    for (let dx = 0; dx < scaleFactor; dx++) {
                        const newX = pixel.x * scaleFactor + dx;
                        const newY = pixel.y * scaleFactor + dy;
                        if (newX < 64 && newY < 64) {
                            array[newY][newX] = pixel.color;
                        }
                    }
                }
            }
        });
        
        return array;
    }

    decompressRow(row) {
        // Decompress compressed notation like ". x4" or "#FF0000 x3"
        if (!Array.isArray(row)) return [];
        
        const decompressed = [];
        for (const item of row) {
            if (typeof item === 'string' && item.includes(' x')) {
                // Handle compressed notation like ". x4" or "#FF0000 x3"
                const [value, multiplier] = item.split(' x');
                const count = parseInt(multiplier) || 1;
                for (let i = 0; i < count; i++) {
                    decompressed.push(value);
                }
            } else {
                decompressed.push(item);
            }
        }
        return decompressed;
    }

    convertRowDataToArray(rowData) {
        // Convert Claude's dense row data to the internal 64x64 array format
        const canvasSize = rowData.canvasSize || 32;
        const rows = rowData.rows || [];

        // Create 64x64 array (scale up from 32x32)
        const scaleFactor = 2; // 64/32
        const array = Array(64).fill().map(() => Array(64).fill('#FFFFFF'));

        // Convert each row with scaling
        for (let y = 0; y < canvasSize && y < rows.length; y++) {
            const row = rows[y];
            if (Array.isArray(row)) {
                // Decompress the row first
                const decompressedRow = this.decompressRow(row);
                
                for (let x = 0; x < canvasSize && x < decompressedRow.length; x++) {
                    const val = decompressedRow[x];
                    const color = val === "." ? "#FFFFFF" : val;

                    // Scale up the pixel to fill a 2x2 area
                    for (let dy = 0; dy < scaleFactor; dy++) {
                        for (let dx = 0; dx < scaleFactor; dx++) {
                            const newX = x * scaleFactor + dx;
                            const newY = y * scaleFactor + dy;
                            if (newX < 64 && newY < 64) {
                                array[newY][newX] = color;
                            }
                        }
                    }
                }
            }
        }

        return array;
    }

    async requestDenseFormat(artworkData) {
        // Request Claude to use dense row format instead of sparse pixels
        const denseFormatPrompt = `You provided a sparse pixel format, but I need you to use the dense row format instead.

Please recreate your artwork "${artworkData.title}" using the dense row format:

{
  "canvasSize": 32,
  "palette": ${JSON.stringify(artworkData.palette || ["#FF0000", "#00FF00", "#0000FF"])},
  "rows": [
    [".", ".", "#FF0000", "#FF0000", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", "#FF0000", "#00FF00", "#00FF00", "#FF0000", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    ...
  ],
  "title": "${artworkData.title}",
  "description": "${artworkData.description}"
}

CRITICAL REQUIREMENTS:
- Provide exactly 32 rows
- Each row must have exactly 32 elements
- Use . for background pixels
- Use hex colors for colored pixels
- Fill the entire 32x32 grid (1024 total pixels)

Output ONLY the JSON object with complete dense rows.`;

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: denseFormatPrompt,
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) {
                throw new Error(`Dense format request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('🎨 Claude provided dense format response');
            
            // Parse and process the dense format response
            await this.parseClaudeResponse(data.content);
            
        } catch (error) {
            console.error('Error requesting dense format:', error);
            this.updateStatus('Error requesting dense format. Using fallback.');
        }
    }

    async requestCompleteArtworkWithRetry(artworkData, retryCount = 0) {
        const maxRetries = 3;
        if (retryCount >= maxRetries) {
            console.log(`❌ MAX RETRIES REACHED: Claude failed to provide complete artwork after ${maxRetries} attempts`);
            this.updateStatus(`Failed to get complete artwork after ${maxRetries} attempts. Please try again later.`);
            return;
        }

        console.log(`🔄 REQUESTING COMPLETE ARTWORK (attempt ${retryCount + 1}/${maxRetries}): Claude provided ${artworkData.rows.length} rows, requesting 32 rows`);
        
        // Request Claude to provide a complete 32x32 artwork instead of partial rows
        const completeArtworkPrompt = `You provided an incomplete artwork with only ${artworkData.rows.length} rows, but I need a complete 32x32 artwork.

CRITICAL: Do not ask questions. Do not provide explanations. Output ONLY valid JSON.

Create a complete 32x32 abstract artwork titled "${artworkData.title}" using this palette: ${JSON.stringify(artworkData.palette || ["#FF0000", "#00FF00", "#0000FF"])}

MANDATORY REQUIREMENTS:
- EXACTLY 32 rows (not ${artworkData.rows.length}, not 29, not 16 - EXACTLY 32)
- Each row must have EXACTLY 32 elements after decompression
- Use COMPRESSION CONSISTENTLY: either all compressed ("#FF0000 x4") OR all uncompressed, but not mixed
- Each compressed notation must expand to exactly the right number of pixels to reach 32 total
- Fill the entire 32x32 grid (1024 total pixels)

COMPRESSION EXAMPLES:
- Row with 4 red, 4 blue, 4 green, 4 yellow, 4 purple, 4 red, 4 blue, 4 green: ["#FF0000 x4", "#0000FF x4", "#00FF00 x4", "#FFFF00 x4", "#800080 x4", "#FF0000 x4", "#0000FF x4", "#00FF00 x4"]
- This expands to exactly 32 elements total
- Use at least 80% colored pixels (820+ out of 1024)

You MUST output ONLY this JSON format with EXACTLY 32 rows:

{
  "canvasSize": 32,
  "palette": ${JSON.stringify(artworkData.palette || ["#FF0000", "#00FF00", "#0000FF"])},
  "rows": [
    ["#color1", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color1", "#color1", "#color3"],
    ["#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1", "#color1", "#color2", "#color2", "#color2", "#color1", "#color3", "#color3", "#color1"],
    ["#color2", "#color3", "#color1", "#color1", "#color3", "#color2", "#color2", "#color3", "#color3", "#color1", "#color1", "#color3", "#color3", "#color2", "#color2", "#color1", "#color1", "#color3", "#color3", "#color2", "#color2", "#color3", "#color3", "#color1", "#color1", "#color3", "#color3", "#color2", "#color2", "#color3", "#color3", "#color1"],
    // ... continue this pattern for ALL 32 rows
  ],
  "title": "${artworkData.title}",
  "description": "${artworkData.description}"
}

ABSOLUTE REQUIREMENTS:
- NO QUESTIONS, NO EXPLANATIONS, NO TEXT OUTSIDE JSON
- EXACTLY 32 rows (not ${artworkData.rows.length}, not 5, not 8, not 10 - EXACTLY 32)
- Each row: exactly 32 elements
- Use . for background pixels, hex colors for colored pixels
- Fill 1024 total pixels (32×32)
- Use at least 80% colored pixels (820+ out of 1024)
- COMPRESSION ALLOWED: Use ". x4" or "#FF0000 x3" for repeated values to save tokens

Output ONLY the JSON object. Nothing else.`;

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: completeArtworkPrompt,
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) {
                throw new Error(`Complete artwork request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('🎨 Claude provided complete artwork response');
            console.log('🎨 Complete artwork response content:', data.content);

            // Parse and process the complete artwork response with preprocessing
            const processedContent = this.preprocessCompressedNotation(data.content);
            const newArtworkData = JSON.parse(processedContent);
            
            // Validate the new response
            if (newArtworkData.rows && newArtworkData.rows.length === 32) {
                // Also validate that each row has 32 elements after decompression
                let allRowsValid = true;
                for (let i = 0; i < newArtworkData.rows.length; i++) {
                    const row = newArtworkData.rows[i];
                    if (!Array.isArray(row)) {
                        allRowsValid = false;
                        break;
                    }
                    const decompressedRow = this.decompressRow(row);
                    if (decompressedRow.length !== 32) {
                        allRowsValid = false;
                        break;
                    }
                }
                
                if (allRowsValid) {
                    console.log('✅ Retry successful: Claude provided complete 32x32 artwork');
                    await this.parseClaudeResponse(data.content);
                } else {
                    console.log(`⚠️ Retry failed: Claude provided 32 rows but some have incorrect length, retrying...`);
                    await this.requestCompleteArtworkWithRetry(artworkData, retryCount + 1);
                }
            } else {
                console.log(`⚠️ Retry failed: Claude provided ${newArtworkData.rows?.length || 0} rows, retrying...`);
                await this.requestCompleteArtworkWithRetry(artworkData, retryCount + 1);
            }

        } catch (error) {
            console.error('Error requesting complete artwork:', error);
            
            // Check if it's a rate limit error (429) or server error (5xx) - use exponential backoff
            if (error.message.includes('429') || error.message.includes('Too Many Requests') || 
                error.message.includes('5') || error.message.includes('529') || error.message.includes('500')) {
                console.log(`⚠️ Server/Rate limit error (${error.message.includes('429') ? '429' : '5xx'}) hit on attempt ${retryCount + 1}. Using exponential backoff...`);
                
                if (retryCount < maxRetries - 1) {
                    // Exponential backoff: 2s, 4s, 8s for server/rate limit errors
                    const baseDelay = 2000;
                    const waitTime = Math.min(baseDelay * Math.pow(2, retryCount), 8000);
                    console.log(`⏳ Exponential backoff: waiting ${waitTime}ms before retry ${retryCount + 2}...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    await this.requestCompleteArtworkWithRetry(artworkData, retryCount + 1);
                } else {
                    this.updateStatus('Server error exceeded after 3 attempts. Please try again later.');
                }
            } else if (retryCount < maxRetries - 1) {
                // Regular retry with shorter delay for non-server errors
                const waitTime = 1000; // 1 second for regular errors
                console.log(`⚠️ Error on attempt ${retryCount + 1}, retrying in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                await this.requestCompleteArtworkWithRetry(artworkData, retryCount + 1);
            } else {
                this.updateStatus('Failed to get complete artwork after 3 attempts. Please try again later.');
            }
        }
    }

    async requestCompleteArtwork(artworkData) {
        // Legacy function for backward compatibility
        return this.requestCompleteArtworkWithRetry(artworkData, 0);
    }

    generateTiledArtwork(pixelData) {
        // Generate 64x64 artwork using 4 tiles of 32x32 each
        console.log('🎨 Generating 64x64 artwork using tiling system');
        
        if (!pixelData.tiles || pixelData.tiles.length !== 4) {
            console.error('Invalid tile data provided');
            return null;
        }
        
        // Create 64x64 array
        const array = Array(64).fill().map(() => Array(64).fill(pixelData.background || '#FFFFFF'));
        
        // Place each tile
        pixelData.tiles.forEach(tile => {
            if (tile.pixels) {
                tile.pixels.forEach(pixel => {
                    const globalX = tile.xOffset + pixel.x;
                    const globalY = tile.yOffset + pixel.y;
                    
                    if (globalX >= 0 && globalX < 64 && globalY >= 0 && globalY < 64) {
                        array[globalY][globalX] = pixel.color;
                    }
                });
            }
        });
        
        console.log(`Generated 64x64 artwork from ${pixelData.tiles.length} tiles`);
        return array;
    }

    generateTilingPrompt(artworkData) {
        // Generate prompt for Claude to create 64x64 artwork using tiles
        return `You are Claude, an AI artist. Create a 64×64 pixel artwork by generating 4 tiles of 32×32 pixels each.

ARTISTIC VISION:
- Title: "${artworkData.title}"
- Description: "${artworkData.description}"
- Style: ${artworkData.style}
- Colors: ${artworkData.colors}

FIRST: Describe your overall 64×64 design concept in plain text.

THEN: Output JSON with 4 tiles that combine into one cohesive 64×64 artwork:
{
  "canvasSize": 64,
  "background": "#FFFFFF",
  "designDescription": "Your overall design concept",
  "tiles": [
    {"id": "topLeft", "xOffset": 0, "yOffset": 0, "size": 32, "pixels": [{"x": 0, "y": 0, "color": "#color1"}, ...]},
    {"id": "topRight", "xOffset": 32, "yOffset": 0, "size": 32, "pixels": [{"x": 0, "y": 0, "color": "#color2"}, ...]},
    {"id": "bottomLeft", "xOffset": 0, "yOffset": 32, "size": 32, "pixels": [{"x": 0, "y": 0, "color": "#color3"}, ...]},
    {"id": "bottomRight", "xOffset": 32, "yOffset": 32, "size": 32, "pixels": [{"x": 0, "y": 0, "color": "#color4"}, ...]}
  ]
}

Ensure tiles connect seamlessly at borders. Overlap 1-2 pixels at edges if needed.`;
    }

    generateASCIIPreview(pixelArray) {
        // Generate a low-res ASCII preview of the 64x64 artwork
        const asciiWidth = 32; // Half resolution for readability
        const asciiHeight = 32;
        const scaleFactor = 2; // 64/32
        
        let asciiPreview = "Current artwork preview (32x32 ASCII representation):\n";
        asciiPreview += "Legend: # = colored pixel, . = white/empty pixel\n\n";
        
        for (let y = 0; y < asciiHeight; y++) {
            for (let x = 0; x < asciiWidth; x++) {
                // Sample from the 64x64 array at 2x scale
                const pixelX = x * scaleFactor;
                const pixelY = y * scaleFactor;
                
                if (pixelArray[pixelY] && pixelArray[pixelY][pixelX] && 
                    pixelArray[pixelY][pixelX] !== '#ffffff' && 
                    pixelArray[pixelY][pixelX] !== null) {
                    asciiPreview += "#";
                } else {
                    asciiPreview += ".";
                }
            }
            asciiPreview += "\n";
        }
        
        return asciiPreview;
    }

    generateDetailedASCIIPreview(pixelArray) {
        // Generate a more detailed ASCII preview with color information
        const asciiWidth = 16; // Even lower resolution for color mapping
        const asciiHeight = 16;
        const scaleFactor = 4; // 64/16
        
        let asciiPreview = "Detailed artwork preview (16x16 with color mapping):\n";
        asciiPreview += "Legend: A-H = different colors, . = white/empty\n";
        
        // Map colors to letters
        const colorMap = {};
        let colorIndex = 0;
        
        for (let y = 0; y < asciiHeight; y++) {
            for (let x = 0; x < asciiWidth; x++) {
                const pixelX = x * scaleFactor;
                const pixelY = y * scaleFactor;
                
                if (pixelArray[pixelY] && pixelArray[pixelY][pixelX] && 
                    pixelArray[pixelY][pixelX] !== '#ffffff' && 
                    pixelArray[pixelY][pixelX] !== null) {
                    
                    const color = pixelArray[pixelY][pixelX];
                    if (!colorMap[color]) {
                        colorMap[color] = String.fromCharCode(65 + colorIndex); // A, B, C, etc.
                        colorIndex++;
                    }
                    asciiPreview += colorMap[color];
                } else {
                    asciiPreview += ".";
                }
            }
            asciiPreview += "\n";
        }
        
        // Add color legend
        asciiPreview += "\nColor Legend:\n";
        for (const [color, letter] of Object.entries(colorMap)) {
            asciiPreview += `${letter} = ${color}\n`;
        }
        
        return asciiPreview;
    }

    async performCritiqueLoop(artworkData, pixelArray, maxIterations = 3) {
        // Perform self-critique loop to refine the artwork
        console.log('🎨 Starting Claude\'s self-critique loop...');
        
        let currentArtworkData = { ...artworkData };
        let currentPixelArray = JSON.parse(JSON.stringify(pixelArray)); // Deep copy
        let iteration = 0;
        
        while (iteration < maxIterations) {
            iteration++;
            console.log(`🔄 Critique iteration ${iteration}/${maxIterations}`);
            
            this.updateStatus(`Claude is critiquing his artwork (iteration ${iteration}/${maxIterations})...`);
            
            // Generate ASCII preview of current artwork
            const asciiPreview = this.generateASCIIPreview(currentPixelArray);
            const detailedPreview = this.generateDetailedASCIIPreview(currentPixelArray);
            
            // Send critique request to Claude
            const critiqueResult = await this.requestCritique(currentArtworkData, asciiPreview, detailedPreview, iteration);
            
            if (critiqueResult) {
                if (critiqueResult.approved) {
                    console.log('✅ Claude approved the artwork!');
                    this.updateStatus('Claude is satisfied with his artwork!');
                    break;
                } else if (critiqueResult.refinements) {
                    console.log('🔧 Claude requested refinements:', critiqueResult.refinements);
                    this.updateStatus(`Claude is refining his artwork (iteration ${iteration}/${maxIterations})...`);
                    
                    // Generate refined artwork based on Claude's feedback
                    const refinedPixelArray = await this.applyRefinements(currentArtworkData, critiqueResult.refinements, currentPixelArray);
                    currentPixelArray = refinedPixelArray;
                } else {
                    console.log('⚠️ Claude\'s critique was unclear, proceeding with current artwork');
                    break;
                }
            } else {
                console.log('⚠️ Critique request failed, proceeding with current artwork');
                break;
            }
            
            // Small delay between iterations
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`🎯 Critique loop completed after ${iteration} iterations`);
        return currentPixelArray;
    }

    async requestCritique(artworkData, asciiPreview, detailedPreview, iteration) {
        try {
            const critiquePrompt = `You are Claude, an AI artist reviewing your own pixel art. You have just created a piece by placing pixels directly, and now you need to critique it.

CURRENT ARTWORK:
- Title: "${artworkData.title}"
- Description: "${artworkData.description}"
- Original Intent: "${artworkData.artisticIntent || 'Direct pixel placement to create artistic composition'}"
- Canvas Size: 32x32 pixels

VISUAL PREVIEW:
${asciiPreview}

DETAILED COLOR PREVIEW:
${detailedPreview}

CRITIQUE TASK:
Please analyze this visual representation of your pixel art and determine if it matches your artistic intent.

Respond with a JSON object containing:
{
  "approved": true/false,
  "critique": "Your honest assessment of how well this matches your intent",
  "refinements": {
    "pixelAdjustments": "Specific pixel changes needed (array of {x, y, color} or null if no changes)",
    "colorChanges": "Color palette modifications needed (or null if no changes)",
    "compositionNotes": "Notes about layout/composition improvements (or null if no changes)"
  },
  "confidence": "How confident you are in this assessment (1-10)"
}

If you approve the artwork (approved: true), set refinements to null.
If you want changes, provide specific, actionable refinements that will improve the artwork.`;

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: critiquePrompt,
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) {
                throw new Error(`Critique API request failed: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            return this.parseCritiqueResponse(data.content);
            
        } catch (error) {
            console.error('Error requesting critique:', error);
            return null;
        }
    }

    parseCritiqueResponse(content) {
        try {
            // Try to find JSON in the response
            let jsonMatch = content.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) {
                console.error('No JSON found in critique response');
                return null;
            }
            
            // Clean the JSON string
            let jsonString = jsonMatch[0];
            jsonString = jsonString.replace(/\/\/.*$/gm, '');
            jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
            jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
            jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
            
            const lastBraceIndex = jsonString.lastIndexOf('}');
            if (lastBraceIndex !== -1) {
                jsonString = jsonString.substring(0, lastBraceIndex + 1);
            }
            
            const critique = JSON.parse(jsonString);
            return critique;
            
        } catch (error) {
            console.error('Error parsing critique response:', error);
            return null;
        }
    }

    async applyRefinements(artworkData, refinements, currentPixelArray) {
        try {
            let refinedPixels = currentPixelArray.map(row => [...row]); // Deep copy
            
            // Apply pixel adjustments
            if (refinements.pixelAdjustments && Array.isArray(refinements.pixelAdjustments)) {
                refinements.pixelAdjustments.forEach(pixel => {
                    if (pixel.x >= 0 && pixel.x < 64 && pixel.y >= 0 && pixel.y < 64) {
                        refinedPixels[pixel.y][pixel.x] = pixel.color;
                    }
                });
                console.log('🔧 Applied pixel refinements');
            }
            
            // Apply color changes (modify existing pixels with new colors)
            if (refinements.colorChanges) {
                console.log('🎨 Applied color refinements');
            }
            
            // Apply composition notes (these could influence pixel placement)
            if (refinements.compositionNotes) {
                console.log('📐 Applied composition refinements');
            }
            
            // Legacy support for old refinement format
            if (refinements.patternInstructions || refinements.colorAdjustments) {
                console.log('⚠️ Using legacy refinement system - regenerating artwork');
                const refinedArtworkData = { ...artworkData };
                
                if (refinements.patternInstructions) {
                    refinedArtworkData.patternInstructions = refinements.patternInstructions;
                }
                
                if (refinements.colorAdjustments) {
                    console.log('Applying color adjustments:', refinements.colorAdjustments);
                }
                
                // Generate new artwork with refinements
                return this.generateFromClaudeBlueprint(refinedArtworkData);
            }
            
            console.log('✅ Applied pixel refinements');
            return refinedPixels;
            
        } catch (error) {
            console.error('Error applying refinements:', error);
            return currentPixelArray; // Return original if refinement fails
        }
    }

    extractArtworkName(instructions) {
        try {
            // Try to extract title from JSON instructions
            const jsonMatch = instructions.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.title) {
                    console.log('🎨 Extracted artwork name:', parsed.title);
                    return parsed.title;
                }
            }
            
            // Fallback: look for title in the text
            const titleMatch = instructions.match(/"title":\s*"([^"]+)"/);
            if (titleMatch) {
                console.log('🎨 Extracted artwork name from text:', titleMatch[1]);
                return titleMatch[1];
            }
            
            // Try old patterns for backward compatibility
            const nameMatch = instructions.match(/Artwork Concept: "([^"]+)"/);
            if (nameMatch) {
                return nameMatch[1];
            }
            
            const conceptMatch = instructions.match(/Concept: "([^"]+)"/);
            if (conceptMatch) {
                return conceptMatch[1];
            }
            
            // Try to extract from composition or visual vision
            const compMatch = instructions.match(/Visual Vision:\s*-\s*([^-\n]+)/);
            if (compMatch) {
                return compMatch[1].trim();
            }
            
        } catch (error) {
            console.warn('Failed to extract artwork name from instructions:', error);
        }
        
        // Fallback to generating a name from key words
        const words = instructions.toLowerCase().match(/\b(fragmented|digital|geometric|organic|fractured|dynamic|abstract|meditation|resonance|convergence|horizon|pulse|echo)\b/g);
        if (words && words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            return randomWord.charAt(0).toUpperCase() + randomWord.slice(1) + ' Composition';
        }
        
        console.log('🎨 Using fallback name: Abstract Pixel Art');
        return 'Abstract Pixel Art';
    }

    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    updateArtworkInfo(title, description) {
        document.getElementById('artworkTitle').textContent = title;
        document.getElementById('artworkDescription').textContent = description;
    }

    updateLastUpdated() {
        // lastUpdated element removed from UI
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.claudeGallery = new ClaudeArtGallery();
    
    // Make reset function globally accessible
    window.resetClaude = () => {
        if (confirm('Are you sure you want to reset Claude completely? This will clear all his memory, artworks, and community feedback.')) {
            claudeGallery.completeReset();
        }
    };
    
    // Tab switching function
    window.switchTab = (tabName) => {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-text').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(tabName + 'TabContent').classList.add('active');
        
        // Add active class to selected tab button
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Update gallery count if switching to gallery tab
        if (tabName === 'gallery') {
            claudeGallery.updateGalleryCount();
        }
    };
    
    // Function to clean up non-32x32 artworks
    window.cleanupGallery = () => {
        claudeGallery.cleanupGallery();
    };

    // Q&A System
    window.askClaude = async () => {
        const questionInput = document.getElementById('questionInput');
        const askButton = document.getElementById('askButton');
        const qaMessages = document.getElementById('qaMessages');
        
        const question = questionInput.value.trim();
        if (!question) return;
        
        // Disable input and show loading
        questionInput.disabled = true;
        askButton.disabled = true;
        askButton.textContent = 'Asking...';
        
        // Add user message
        addQAMessage(question, 'user');
        
        // Clear input
        questionInput.value = '';
        
        // Add loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'qa-message claude-message qa-loading';
        loadingMessage.innerHTML = `
            <div class="message-avatar">
                <img src="blossompix.png" alt="Claude" class="claude-avatar">
            </div>
            <div class="message-content">
                <p>Claude is thinking...</p>
            </div>
        `;
        qaMessages.appendChild(loadingMessage);
        qaMessages.scrollTop = qaMessages.scrollHeight;
        
        try {
            const response = await claudeGallery.askClaudeQuestion(question);
            // Remove loading message
            loadingMessage.remove();
            // Add Claude's response
            addQAMessage(response, 'claude');
        } catch (error) {
            // Remove loading message
            loadingMessage.remove();
            // Add error message
            addQAMessage('Sorry, I encountered an error while thinking about your question. Please try again.', 'claude');
            console.error('Q&A Error:', error);
        } finally {
            // Re-enable input
            questionInput.disabled = false;
            askButton.disabled = false;
            askButton.textContent = 'Ask Claude';
        }
    };

    function addQAMessage(message, sender) {
        const qaMessages = document.getElementById('qaMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `qa-message ${sender}-message`;
        
        const avatar = sender === 'user' ? '👤' : '<img src="blossompix.png" alt="Claude" class="claude-avatar">';
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        qaMessages.appendChild(messageDiv);
        qaMessages.scrollTop = qaMessages.scrollHeight;
    }

    // Allow Enter key to submit question
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            askClaude();
        }
    });

    // Initialize header stats
    updateHeaderStats();
    setInterval(updateHeaderStats, 1000); // Update every second
    
    // Initialize typewriter effect for intro page
    typewriterEffect();
});

// Header stats management
function updateHeaderStats() {
    const gallery = JSON.parse(localStorage.getItem('claudeGallery') || '[]');
    const totalArtworks = gallery.length;
    
    // Update total artworks
    const totalArtworksElement = document.getElementById('totalArtworks');
    if (totalArtworksElement) {
        totalArtworksElement.textContent = totalArtworks;
    }
    
    // Update painting timer
    const paintingTimeElement = document.getElementById('paintingTime');
    if (paintingTimeElement && claudeGallery.paintingStartTime) {
        const now = Date.now();
        const elapsed = Math.floor((now - claudeGallery.paintingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        paintingTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Intro page functionality
function enterWebsite() {
    const introPage = document.getElementById('introPage');
    if (introPage) {
        introPage.classList.add('slide-up');
        
        // Remove the intro page from DOM after animation completes
        setTimeout(() => {
            introPage.style.display = 'none';
        }, 1000);
    }
}

// Typewriter animation for intro description
function typewriterEffect() {
    const descriptionElement = document.getElementById('introDescription');
    const fullText = "Watch claude paint live and evolve constantly, and \nask him questions about his artwork.";
    const buttonElement = document.querySelector('.enter-button');
    
    if (!descriptionElement) return;
    
    // Clear the text initially
    descriptionElement.textContent = '';
    descriptionElement.style.opacity = '1';
    
    let index = 0;
    const typeSpeed = 25; // milliseconds per character
    
    function typeChar() {
        if (index < fullText.length) {
            const char = fullText.charAt(index);
            if (char === '\n') {
                descriptionElement.innerHTML += '<br>';
            } else {
                descriptionElement.textContent += char;
            }
            index++;
            setTimeout(typeChar, typeSpeed);
        } else {
            // Typewriter animation complete, fade in button
            setTimeout(() => {
                buttonElement.style.opacity = '1';
                buttonElement.style.animation = 'buttonPulse 3s ease-in-out infinite, buttonFadeIn 1s ease-out';
            }, 500);
        }
    }
    
    // Start typewriter effect after title animation (2s delay)
    setTimeout(typeChar, 2000);
}