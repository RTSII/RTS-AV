/**
 * Enhanced Audio Visualizer - Final Integration
 * 
 * This script combines all features into a single, cohesive application.
 */

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create main container if not already present
  let container = document.getElementById('audio-visualizer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'audio-visualizer-container';
    container.className = 'visualizer-container';
    document.body.appendChild(container);
  }
  
  // Create the visualizer instance
  window.visualizer = new AudioVisualizer(container, {
    theme: 'cyberpunk',
    accentColor: '#00EEFF',
    accentSecondary: '#FFD700',
    visualizationMode: 'spectrum',
    performanceProfile: 'high'
  });
  
  // Initialize all enhanced features
  initializeEnhancements(window.visualizer);
});

/**
 * Initialize all enhanced features
 */
function initializeEnhancements(visualizer) {
  if (!visualizer) {
    console.error('Visualizer not initialized');
    return;
  }
  
  console.log('Initializing enhanced features...');
  
  // Create necessary dialog containers if they don't exist
  createDialogContainers();
  
  // Step 1: Initialize audio effects processing
  initializeAudioEffects(visualizer);
  
  // Step 2: Initialize microphone with device selection
  initializeMicrophone(visualizer);
  
  // Step 3: Initialize microphone recording
  initializeMicrophoneRecording(visualizer);
  
  // Step 4: Initialize beat detection
  initializeBeatDetection(visualizer);
  
  // Add menu options for new features
  addFeatureMenuOptions(visualizer);
  
  // Add keyboard shortcuts
  addKeyboardShortcuts(visualizer);
  
  // Set up performance monitoring
  setupPerformanceMonitoring(visualizer);
  
  console.log('All enhancements initialized successfully');
}

/**
 * Create dialog containers
 */
function createDialogContainers() {
  // Create effects settings container if it doesn't exist
  if (!document.getElementById('effects-settings-container')) {
    const effectsContainer = document.createElement('div');
    effectsContainer.id = 'effects-settings-container';
    effectsContainer.className = 'dialog-container';
    document.body.appendChild(effectsContainer);
  }
  
  // Create backlight settings container if it doesn't exist
  if (!document.getElementById('backlight-settings-container')) {
    const backlightContainer = document.createElement('div');
    backlightContainer.id = 'backlight-settings-container';
    backlightContainer.className = 'dialog-container';
    document.body.appendChild(backlightContainer);
  }
}

/**
 * Initialize audio effects processing
 */
function initializeAudioEffects(visualizer) {
  if (!visualizer || !visualizer.audioContext || !visualizer.analyzer) {
    console.warn('Audio context or analyzer not available for effects processing');
    return;
  }
  
  try {
    // Create audio effects processor
    const sourceNode = visualizer.sourceNode || visualizer.gainNode;
    
    const effectsProcessor = new AudioEffectsProcessor(
      visualizer.audioContext,
      sourceNode,
      visualizer.analyzer
    );
    
    // Store reference on visualizer
    visualizer.effectsProcessor = effectsProcessor;
    
    // Create effects UI
