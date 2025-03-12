// Enhanced Audio Visualizer - TV Backlight Integration System
// Optimizes visualization output for camera-based LED backlight systems (Govee, etc.)

class BacklightSystem {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.isEnabled = false;
    this.backlightMode = 'adaptive'; // 'adaptive', 'direct', 'ambilight'
    this.edgeEmphasis = 0.7; // 0-1 scale for edge color emphasis
    this.colorSaturation = 1.2; // Boost saturation for better detection
    this.smoothingFactor = 0.3; // Reduces flickering for camera detection
    this.transitionSpeed = 'medium'; // 'slow', 'medium', 'fast'
    
    // Direct integration APIs
    this.supportedSystems = [
      { name: 'Govee', connected: false, apiKey: '' },
      { name: 'Philips Hue', connected: false, apiKey: '' },
      { name: 'WLED', connected: false, ipAddress: '' },
      { name: 'Hyperion', connected: false, ipAddress: '' }
    ];
    
    // Color mapping for edge zones (simulated zones that would map to LED strips)
    this.edgeZones = {
      top: [],
      right: [],
      bottom: [],
      left: []
    };
    
    // Initialize with default values
    this.initializeEdgeZones();
  }
  
  // Initialize edge zone color arrays
  initializeEdgeZones() {
    // Create arrays for each edge with zero values
    // Number of zones corresponds to LED density
    const topBottomCount = 16; // Typical for horizontal strips
    const leftRightCount = 9; // Typical for vertical strips
    
    this.edgeZones.top = Array(topBottomCount).fill([0, 0, 0]);
    this.edgeZones.bottom = Array(topBottomCount).fill([0, 0, 0]);
    this.edgeZones.left = Array(leftRightCount).fill([0, 0, 0]);
    this.edgeZones.right = Array(leftRightCount).fill([0, 0, 0]);
  }
  
  // Enable or disable backlight enhancement
  toggle(enable) {
    this.isEnabled = enable;
    
    if (this.isEnabled) {
      console.log('Backlight enhancement enabled');
      // Apply optimized visualization settings
      this.applyOptimizedSettings();
    } else {
      console.log('Backlight enhancement disabled');
      // Restore standard visualization settings
      this.restoreStandardSettings();
    }
    
    return this.isEnabled;
  }
  
  // Set backlight mode
  setMode(mode) {
    this.backlightMode = mode;
    
    // Apply different optimizations based on mode
    switch (mode) {
      case 'adaptive':
        // Balanced mode that works with most camera systems
        this.edgeEmphasis = 0.7;
        this.colorSaturation = 1.2;
        this.smoothingFactor = 0.3;
        break;
      case 'direct':
        // Direct API integration when available
        this.attemptDirectConnection();
        break;
      case 'ambilight':
        // Mimics Philips Ambilight style
        this.edgeEmphasis = 0.9;
        this.colorSaturation = 1.4;
        this.smoothingFactor = 0.2;
        break;
    }
    
    console.log(`Backlight mode set to: ${mode}`);
  }
  
  // Apply optimized settings for visualizations
  applyOptimizedSettings() {
    if (!this.visualizer) return;
    
    // Store current settings to restore later
    this.previousSettings = {
      colorIntensity: this.visualizer.options.colorIntensity,
      edgeFalloff: this.visualizer.options.edgeFalloff,
      transitionSpeed: this.visualizer.options.transitionSpeed,
      visualizationMode: this.visualizer.options.visualizationMode
    };
    
    // Apply optimized settings
    this.visualizer.options.colorIntensity = this.colorSaturation;
    this.visualizer.options.edgeFalloff = this.edgeEmphasis;
    this.visualizer.options.transitionSpeed = this.transitionSpeed;
    
    // If in automatic mode, switch to a backlight-optimized visualization
    if (this.backlightMode === 'adaptive') {
      this.enableEdgeEmphasisMode();
    }
  }
  
  // Restore standard visualization settings
  restoreStandardSettings() {
    if (!this.visualizer || !this.previousSettings) return;
    
    // Restore previous settings
    this.visualizer.options.colorIntensity = this.previousSettings.colorIntensity;
    this.visualizer.options.edgeFalloff = this.previousSettings.edgeFalloff;
    this.visualizer.options.transitionSpeed = this.previousSettings.transitionSpeed;
    
    // Restore previous visualization mode if it was changed
    if (this.previousVisualizationMode) {
      this.visualizer.options.visualizationMode = this.previousVisualizationMode;
      this.previousVisualizationMode = null;
    }
  }
  
  // Enable edge emphasis mode for better camera detection
  enableEdgeEmphasisMode() {
    if (!this.visualizer) return;
    
    // Store current visualization mode
    this.previousVisualizationMode = this.visualizer.options.visualizationMode;
    
    // Set to backlight-optimized mode
    this.visualizer.options.visualizationMode = 'backlight';
  }
  
  // Attempt direct connection to backlight systems
  attemptDirectConnection() {
    // Scan for available systems
    this.scanForBacklightSystems()
      .then(availableSystems => {
        console.log('Available backlight systems:', availableSystems);
        
        // Try to connect to available systems
        availableSystems.forEach(system => {
          this.connectToSystem(system);
        });
      })
      .catch(error => {
        console.error('Error scanning for backlight systems:', error);
      });
  }
  
  // Scan network for supported backlight systems
  scanForBacklightSystems() {
    return new Promise((resolve) => {
      console.log('Scanning for backlight systems...');
      
      // This would be implemented with actual network scanning
      // For demonstration, we'll simulate finding a system
      setTimeout(() => {
        // Simulated discovered systems
        const discovered = [
          { type: 'Govee', id: 'H6199', ipAddress: '192.168.1.100' }
        ];
        
        resolve(discovered);
      }, 1000);
    });
  }
  
  // Connect to a specific backlight system
  connectToSystem(system) {
    console.log(`Attempting to connect to ${system.type} at ${system.ipAddress}`);
    
    // This would implement the actual connection logic
    // For now, we'll simulate a connection
    
    // Find the system in our supported list
    const supportedSystem = this.supportedSystems.find(s => s.name === system.type);
    
    if (supportedSystem) {
      supportedSystem.connected = true;
      
      if (system.type === 'Govee') {
        this.setupGoveeConnection(system);
      } else if (system.type === 'Philips Hue') {
        this.setupPhilipsHueConnection(system);
      } else if (system.type === 'WLED') {
        this.setupWLEDConnection(system);
      }
      
      console.log(`Connected to ${system.type}`);
    }
  }
  
  // Setup Govee specific connection
  setupGoveeConnection(system) {
    console.log('Setting up Govee connection');
    // This would implement the Govee API
  }
  
  // Setup Philips Hue specific connection
  setupPhilipsHueConnection(system) {
    console.log('Setting up Philips Hue connection');
    // This would implement the Philips Hue API
  }
  
  // Setup WLED specific connection
  setupWLEDConnection(system) {
    console.log('Setting up WLED connection');
    // This would implement the WLED API
  }
  
  // Process frame for backlight enhancement
  processFrame(ctx, width, height) {
    if (!this.isEnabled) return;
    
    // Sample colors from the edges of the visualization
    this.sampleEdgeColors(ctx, width, height);
    
    // If in direct mode with connected systems, send the data
    if (this.backlightMode === 'direct') {
      this.sendColorDataToConnectedSystems();
    }
    
    // Apply edge emphasis if needed
    if (this.backlightMode === 'adaptive' || this.backlightMode === 'ambilight') {
      this.applyEdgeEmphasis(ctx, width, height);
    }
  }
  
  // Sample colors from the edges of the frame
  sampleEdgeColors(ctx, width, height) {
    // Sample colors from the edges of the canvas
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Sample top edge
    for (let i = 0; i < this.edgeZones.top.length; i++) {
      const x = Math.floor((i / this.edgeZones.top.length) * width);
      const pixelIndex = (x + 2 * width) * 4; // 2 pixels down from top
      this.edgeZones.top[i] = [
        data[pixelIndex],     // R
        data[pixelIndex + 1], // G
        data[pixelIndex + 2]  // B
      ];
    }
    
    // Sample bottom edge
    for (let i = 0; i < this.edgeZones.bottom.length; i++) {
      const x = Math.floor((i / this.edgeZones.bottom.length) * width);
      const pixelIndex = (x + (height - 3) * width) * 4; // 3 pixels up from bottom
      this.edgeZones.bottom[i] = [
        data[pixelIndex],     // R
        data[pixelIndex + 1], // G
        data[pixelIndex + 2]  // B
      ];
    }
    
    // Sample left edge
    for (let i = 0; i < this.edgeZones.left.length; i++) {
      const y = Math.floor((i / this.edgeZones.left.length) * height);
      const pixelIndex = (2 + y * width) * 4; // 2 pixels right from left
      this.edgeZones.left[i] = [
        data[pixelIndex],     // R
        data[pixelIndex + 1], // G
        data[pixelIndex + 2]  // B
      ];
    }
    
    // Sample right edge
    for (let i = 0; i < this.edgeZones.right.length; i++) {
      const y = Math.floor((i / this.edgeZones.right.length) * height);
      const pixelIndex = (width - 3 + y * width) * 4; // 3 pixels left from right
      this.edgeZones.right[i] = [
        data[pixelIndex],     // R
        data[pixelIndex + 1], // G
        data[pixelIndex + 2]  // B
      ];
    }
  }
  
  // Send color data to connected backlight systems
  sendColorDataToConnectedSystems() {
    // Check for connected systems
    const connectedSystems = this.supportedSystems.filter(system => system.connected);
    
    connectedSystems.forEach(system => {
      if (system.name === 'Govee') {
        this.sendToGovee(system);
      } else if (system.name === 'Philips Hue') {
        this.sendToPhilipsHue(system);
      } else if (system.name === 'WLED') {
        this.sendToWLED(system);
      }
    });
  }
  
  // Send color data to Govee device
  sendToGovee(system) {
    // This would implement the Govee API calls
    console.log('Sending color data to Govee');
    
    // Convert our edge zones to Govee's expected format
    const goveeData = this.formatDataForGovee();
    
    // This would send the actual API request
    // fetch('https://api.govee.com/v1/devices/control', {
    //   method: 'PUT',
    //   headers: {
    //     'Govee-API-Key': system.apiKey,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(goveeData)
    // });
  }
  
  // Format data for Govee API
  formatDataForGovee() {
    // Convert our edge zone data to Govee's expected format
    // This is a simplified example
    return {
      device: 'H6199',
      model: 'H6199',
      cmd: {
        name: 'color',
        value: {
          r: this.edgeZones.top[Math.floor(this.edgeZones.top.length / 2)][0],
          g: this.edgeZones.top[Math.floor(this.edgeZones.top.length / 2)][1],
          b: this.edgeZones.top[Math.floor(this.edgeZones.top.length / 2)][2]
        }
      }
    };
  }
  
  // Send to Philips Hue
  sendToPhilipsHue(system) {
    // Would implement Philips Hue API
    console.log('Sending color data to Philips Hue');
  }
  
  // Send to WLED
  sendToWLED(system) {
    // Would implement WLED API
    console.log('Sending color data to WLED');
  }
  
  // Apply edge emphasis to make colors more detectable
  applyEdgeEmphasis(ctx, width, height) {
    // Enhance the edges of the visualization to make them more prominent
    // for camera-based systems to detect
    
    // For demonstration, we'll add a subtle border glow that
    // matches the dominant colors at each edge
    
    // Top edge glow
    const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.1);
    topGradient.addColorStop(0, this.getAverageColorString(this.edgeZones.top, 0.5));
    topGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, width, height * 0.1);
    
    // Bottom edge glow
    const bottomGradient = ctx.createLinearGradient(0, height * 0.9, 0, height);
    bottomGradient.addColorStop(0, 'transparent');
    bottomGradient.addColorStop(1, this.getAverageColorString(this.edgeZones.bottom, 0.5));
    
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, height * 0.9, width, height * 0.1);
    
    // Left edge glow
    const leftGradient = ctx.createLinearGradient(0, 0, width * 0.1, 0);
    leftGradient.addColorStop(0, this.getAverageColorString(this.edgeZones.left, 0.5));
    leftGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = leftGradient;
    ctx.fillRect(0, 0, width * 0.1, height);
    
    // Right edge glow
    const rightGradient = ctx.createLinearGradient(width * 0.9, 0, width, 0);
    rightGradient.addColorStop(0, 'transparent');
    rightGradient.addColorStop(1, this.getAverageColorString(this.edgeZones.right, 0.5));
    
    ctx.fillStyle = rightGradient;
    ctx.fillRect(width * 0.9, 0, width * 0.1, height);
  }
  
  // Get average color from an array of RGB values
  getAverageColorString(colorArray, alpha = 1.0) {
    // Calculate the average R, G, B values
    let totalR = 0, totalG = 0, totalB = 0;
    
    colorArray.forEach(color => {
      totalR += color[0];
      totalG += color[1];
      totalB += color[2];
    });
    
    const avgR = Math.floor(totalR / colorArray.length);
    const avgG = Math.floor(totalG / colorArray.length);
    const avgB = Math.floor(totalB / colorArray.length);
    
    // Apply saturation boost if needed
    const satR = Math.min(255, Math.floor(avgR * this.colorSaturation));
    const satG = Math.min(255, Math.floor(avgG * this.colorSaturation));
    const satB = Math.min(255, Math.floor(avgB * this.colorSaturation));
    
    return `rgba(${satR}, ${satG}, ${satB}, ${alpha})`;
  }
  
  // Get recording recommendations for backlight compatibility
  getRecordingRecommendations() {
    return {
      resolution: '1080p or higher',
      frameRate: '30fps minimum, 60fps recommended',
      bitrate: '10Mbps minimum for good color reproduction',
      colorSpace: 'Use HDR if available',
      recommendations: [
        'Ensure visualization fills the entire screen',
        'Use high contrast colors',
        'Increase saturation slightly for better detection',
        'Enable backlight mode while recording for best results'
      ]
    };
  }
}

// Specialized visualization mode for backlight systems
class BacklightVisualizer {
  constructor(canvas, audioData, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audioData = audioData;
    this.options = {
      edgeIntensity: 1.0,
      colorSaturation: 1.2,
      useHighContrast: true,
      mirrorMode: false,
      ...options
    };
    
    // Edge emphasis points
    this.edgePoints = {
      top: [],
      right: [],
      bottom: [],
      left: []
    };
    
    // Initialize with a default color palette good for detection
    this.colorPalette = [
      [255, 0, 0],      // Red
      [0, 255, 0],      // Green
      [0, 0, 255],      // Blue
      [255, 255, 0],    // Yellow
      [255, 0, 255],    // Magenta
      [0, 255, 255],    // Cyan
      [255, 255, 255]   // White
    ];
  }
  
  // Draw the backlight-optimized visualization
  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Clear the canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw background
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, width, height);
    
    // Get audio data
    const frequencyData = this.audioData.getFrequencyData();
    const timeData = this.audioData.getTimeData();
    
    // Draw center visualization
    this.drawCenterVisualization(frequencyData, timeData, width, height);
    
    // Draw edge emphasis
    this.drawEdgeEmphasis(frequencyData, width, height);
    
    // Optional mirror mode for symmetric backlighting
    if (this.options.mirrorMode) {
      this.applyMirrorEffect(width, height);
    }
  }
  
  // Draw the main center visualization
  drawCenterVisualization(frequencyData, timeData, width, height) {
    // Simplified spectrum analyzer focused on wide color bands
    const barWidth = width / 16; // Use fewer, wider bars
    const centerHeight = height * 0.6;
    const centerY = height * 0.5;
    
    // Use high contrast colors - select colors based on frequency band
    for (let i = 0; i < 16; i++) {
      // Get average value for this frequency range
      const startBin = Math.floor((i / 16) * frequencyData.length);
      const endBin = Math.floor(((i + 1) / 16) * frequencyData.length);
      
      let sum = 0;
      for (let j = startBin; j < endBin; j++) {
        sum += frequencyData[j];
      }
      const average = sum / (endBin - startBin);
      
      // Scale to visible height
      const barHeight = (average / 255) * centerHeight;
      
      // Select color
      const colorIndex = i % this.colorPalette.length;
      const color = this.colorPalette[colorIndex];
      
      // Boost saturation for better detection
      const satColor = color.map(c => Math.min(255, Math.floor(c * this.options.colorSaturation)));
      
      // Draw the bar
      this.ctx.fillStyle = `rgb(${satColor[0]}, ${satColor[1]}, ${satColor[2]})`;
      this.ctx.fillRect(
        i * barWidth,
        centerY - barHeight / 2,
        barWidth - 4,
        barHeight
      );
      
      // Store edge points for edge emphasis
      if (i < 4) {
        this.edgePoints.left.push({
          y: centerY - barHeight / 2,
          height: barHeight,
          color: satColor
        });
      } else if (i >= 12) {
        this.edgePoints.right.push({
          y: centerY - barHeight / 2,
          height: barHeight,
          color: satColor
        });
      }
      
      if (barHeight > 0.4 * centerHeight) {
        if (i % 4 === 0) {
          this.edgePoints.top.push({
            x: i * barWidth,
            width: barWidth - 4,
            color: satColor
          });
        }
        
        if (i % 4 === 2) {
          this.edgePoints.bottom.push({
            x: i * barWidth,
            width: barWidth - 4,
            color: satColor
          });
        }
      }
    }
  }
  
  // Draw emphasis around the edges for LED detection
  drawEdgeEmphasis(frequencyData, width, height) {
    // Draw border strips that will create color bands at the edges
    // Top edge
    const topGradient = this.ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i < this.edgePoints.top.length; i++) {
      const point = this.edgePoints.top[i];
      const startPos = point.x / width;
      const endPos = (point.x + point.width) / width;
      const midPos = (startPos + endPos) / 2;
      
      const color = `rgb(${point.color[0]}, ${point.color[1]}, ${point.color[2]})`;
      
      topGradient.addColorStop(Math.max(0, midPos - 0.1), 'transparent');
      topGradient.addColorStop(midPos, color);
      topGradient.addColorStop(Math.min(1, midPos + 0.1), 'transparent');
    }
    
    this.ctx.fillStyle = topGradient;
    this.ctx.fillRect(0, 0, width, height * 0.1);
    
    // Bottom edge
    const bottomGradient = this.ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i < this.edgePoints.bottom.length; i++) {
      const point = this.edgePoints.bottom[i];
      const startPos = point.x / width;
      const endPos = (point.x + point.width) / width;
      const midPos = (startPos + endPos) / 2;
      
      const color = `rgb(${point.color[0]}, ${point.color[1]}, ${point.color[2]})`;
      
      bottomGradient.addColorStop(Math.max(0, midPos - 0.1), 'transparent');
      bottomGradient.addColorStop(midPos, color);
      bottomGradient.addColorStop(Math.min(1, midPos + 0.1), 'transparent');
    }
    
    this.ctx.fillStyle = bottomGradient;
    this.ctx.fillRect(0, height * 0.9, width, height * 0.1);
    
    // Left edge
    const leftGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    for (let i = 0; i < this.edgePoints.left.length; i++) {
      const point = this.edgePoints.left[i];
      const startPos = point.y / height;
      const endPos = (point.y + point.height) / height;
      const midPos = (startPos + endPos) / 2;
      
      const color = `rgb(${point.color[0]}, ${point.color[1]}, ${point.color[2]})`;
      
      leftGradient.addColorStop(Math.max(0, midPos - 0.1), 'transparent');
      leftGradient.addColorStop(midPos, color);
      leftGradient.addColorStop(Math.min(1, midPos + 0.1), 'transparent');
    }
    
    this.ctx.fillStyle = leftGradient;
    this.ctx.fillRect(0, 0, width * 0.1, height);
    
    // Right edge
    const rightGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    for (let i = 0; i < this.edgePoints.right.length; i++) {
      const point = this.edgePoints.right[i];
      const startPos = point.y / height;
      const endPos = (point.y + point.height) / height;
      const midPos = (startPos + endPos) / 2;
      
      const color = `rgb(${point.color[0]}, ${point.color[1]}, ${point.color[2]})`;
      
      rightGradient.addColorStop(Math.max(0, midPos - 0.1), 'transparent');
      rightGradient.addColorStop(midPos, color);
      rightGradient.addColorStop(Math.min(1, midPos + 0.1), 'transparent');
    }
    
    this.ctx.fillStyle = rightGradient;
    this.ctx.fillRect(width * 0.9, 0, width * 0.1, height);
  }
  
  // Apply mirror effect for symmetric backlighting
  applyMirrorEffect(width, height) {
    // Create a mirror effect to ensure the left and right sides
    // have similar colors for more balanced ambient lighting
    
    // Get the canvas data
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Mirror the pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width / 2; x++) {
        const leftIndex = (y * width + x) * 4;
        const rightIndex = (y * width + (width - 1 - x)) * 4;
        
        // Average the colors between left and right
        data[leftIndex] = data[rightIndex] = Math.floor((data[leftIndex] + data[rightIndex]) / 2);
        data[leftIndex + 1] = data[rightIndex + 1] = Math.floor((data[leftIndex + 1] + data[rightIndex + 1]) / 2);
        data[leftIndex + 2] = data[rightIndex + 2] = Math.floor((data[leftIndex + 2] + data[rightIndex + 2]) / 2);
      }
    }
    
    // Put the modified image data back
    this.ctx.putImageData(imageData, 0, 0);
  }
}

// A class to optimize recording for backlighting systems
class BacklightRecordingOptimizer {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.isEnabled = false;
    this.originalSettings = null;
    this.recorder = null;
    this.recordedChunks = [];
  }
  
  // Enable recording optimization
  enable() {
    if (!this.visualizer) return false;
    
    // Store original settings
    this.originalSettings = {
      colorSaturation: this.visualizer.options.colorSaturation,
      visualizationMode: this.visualizer.options.visualizationMode,
      edgeEmphasis: this.visualizer.options.edgeEmphasis
    };
    
    // Apply optimized settings for recording
    this.visualizer.options.colorSaturation = 1.3; // Increased for better detection
    this.visualizer.options.visualizationMode = 'backlight'; // Switch to backlight mode
    this.visualizer.options.edgeEmphasis = 0.9; // Stronger edge emphasis
    
    this.isEnabled = true;
    return true;
  }
  
  // Disable recording optimization
  disable() {
    if (!this.visualizer || !this.originalSettings) return false;
    
    // Restore original settings
    this.visualizer.options.colorSaturation = this.originalSettings.colorSaturation;
    this.visualizer.options.visualizationMode = this.originalSettings.visualizationMode;
    this.visualizer.options.edgeEmphasis = this.originalSettings.edgeEmphasis;
    
    this.isEnabled = false;
    return true;
  }
  
  // Start recording
  startRecording(canvas, audioContext) {
    if (!canvas) return false;
    
    // Enable optimization
    this.enable();
    
    // Create a media stream from the canvas
    const stream = canvas.captureStream(60); // 60 FPS for smooth recording
    
    // Add audio track if audio context is provided
    if (audioContext && audioContext.destination.stream) {
      const audioTracks = audioContext.destination.stream.getAudioTracks();
      audioTracks.forEach(track => {
        stream.addTrack(track);
      });
    }
    
    // Set up media recorder with high bitrate for better color reproduction
    this.recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 8000000 // 8 Mbps for good color quality
    });
    
    // Handle data
    this.recordedChunks = [];
    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };
    
    // Start recording
    this.recorder.start();
    
    return true;
  }
  
  // Stop recording
  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.recorder) {
        reject(new Error('No recording in progress'));
        return;
      }
      
      this.recorder.onstop = () => {
        // Disable optimization
        this.disable();
        
        // Create a blob from the recorded chunks
        const blob = new Blob(this.recordedChunks, {
          type: 'video/webm'
        });
        
        resolve(blob);
      };
      
      this.recorder.stop();
    });
  }
  
  // Save recording
  saveRecording(blob, filename = 'visualization.webm') {
    if (!blob) return false;
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = filename;
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  }
}

// Usage example:
/*
// Create backlight system
const backlightSystem = new BacklightSystem(visualizer);

// Toggle backlight enhancement
backlightSystem.toggle(true);

// Set backlight mode
backlightSystem.setMode('adaptive');

// In visualization rendering loop
function render() {
  // Normal visualization rendering...
  
  // Process frame for backlight enhancement
  backlightSystem.processFrame(ctx, canvas.width, canvas.height);
  
  requestAnimationFrame(render);
}

// For recording
const recordingOptimizer = new BacklightRecordingOptimizer(visualizer);
recordingOptimizer.startRecording(canvas, audioContext);

// Later
recordingOptimizer.stopRecording().then(blob => {
  recordingOptimizer.saveRecording(blob, 'backlight-optimized.webm');
});
*/
