// Enhanced Audio Visualizer - TV Backlight Configuration Dialog
// Allows users to configure how the visualizer interacts with TV LED backlighting systems

class BacklightConfigDialog {
  constructor(backlightSystem) {
    this.backlightSystem = backlightSystem;
    this.container = null;
    this.isVisible = false;
    
    // Default config values
    this.config = {
      enabled: true,
      mode: 'adaptive', // 'adaptive', 'direct', 'ambilight'
      edgeEmphasis: 0.7,
      colorSaturation: 1.2,
      smoothingFactor: 0.3,
      transitionSpeed: 'medium',
      detectDevices: true,
      mirrorMode: false,
      optimizeRecording: true
    };
  }
  
  // Initialize the dialog
  init(container) {
    this.container = container;
    
    // Load any saved config
    this.loadConfig();
    
    // Initial render
    this.render();
    
    // Set up event handlers
    this.setupEventListeners();
    
    // Initially hidden
    this.hide();
  }
  
  // Show the dialog
  show() {
    if (!this.container) return;
    this.container.style.display = 'flex';
    this.isVisible = true;
    
    // Scan for devices when opened
    if (this.config.detectDevices) {
      this.scanForDevices();
    }
  }
  
  // Hide the dialog
  hide() {
    if (!this.container) return;
    this.container.style.display = 'none';
    this.isVisible = false;
  }
  
  // Toggle visibility
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  // Load saved configuration
  loadConfig() {
    const savedConfig = localStorage.getItem('backlightConfig');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (e) {
        console.error('Error loading backlight config:', e);
      }
    }
  }
  
  // Save configuration
  saveConfig() {
    try {
      localStorage.setItem('backlightConfig', JSON.stringify(this.config));
    } catch (e) {
      console.error('Error saving backlight config:', e);
    }
  }
  
  // Render the dialog
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="backlight-config-dialog">
        <div class="dialog-header">
          <h2>TV Backlight Configuration</h2>
          <button class="close-btn" id="backlight-close">&times;</button>
        </div>
        
        <div class="dialog-content">
          <div class="config-section">
            <h3>Basic Settings</h3>
            
            <div class="setting-row">
              <label class="setting-label">
                <input type="checkbox" id="backlight-enabled" ${this.config.enabled ? 'checked' : ''}>
                Enable TV Backlight Enhancement
              </label>
            </div>
            
            <div class="setting-row">
              <label class="setting-label">Backlight Mode:</label>
              <select id="backlight-mode" class="setting-select">
                <option value="adaptive" ${this.config.mode === 'adaptive' ? 'selected' : ''}>Adaptive (Camera-based)</option>
                <option value="direct" ${this.config.mode === 'direct' ? 'selected' : ''}>Direct API Connection</option>
                <option value="ambilight" ${this.config.mode === 'ambilight' ? 'selected' : ''}>Ambilight Style</option>
              </select>
            </div>
            
            <div class="setting-row">
              <label class="setting-label">
                <input type="checkbox" id="backlight-mirror" ${this.config.mirrorMode ? 'checked' : ''}>
                Mirror Mode (symmetrical left/right colors)
              </label>
            </div>
          </div>
          
          <div class="config-section">
            <h3>Color & Performance Settings</h3>
            
            <div class="setting-row">
              <label class="setting-label">Edge Emphasis:</label>
              <div class="slider-container">
                <input type="range" id="edge-emphasis" min="0" max="100" value="${this.config.edgeEmphasis * 100}">
                <span class="slider-value">${Math.round(this.config.edgeEmphasis * 100)}%</span>
              </div>
            </div>
            
            <div class="setting-row">
              <label class="setting-label">Color Saturation:</label>
              <div class="slider-container">
                <input type="range" id="color-saturation" min="50" max="150" value="${this.config.colorSaturation * 100}">
                <span class="slider-value">${Math.round(this.config.colorSaturation * 100)}%</span>
              </div>
            </div>
            
            <div class="setting-row">
              <label class="setting-label">Smoothing:</label>
              <div class="slider-container">
                <input type="range" id="smoothing-factor" min="0" max="100" value="${this.config.smoothingFactor * 100}">
                <span class="slider-value">${Math.round(this.config.smoothingFactor * 100)}%</span>
              </div>
            </div>
            
            <div class="setting-row">
              <label class="setting-label">Transition Speed:</label>
              <select id="transition-speed" class="setting-select">
                <option value="slow" ${this.config.transitionSpeed === 'slow' ? 'selected' : ''}>Slow</option>
                <option value="medium" ${this.config.transitionSpeed === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="fast" ${this.config.transitionSpeed === 'fast' ? 'selected' : ''}>Fast</option>
              </select>
            </div>
          </div>
          
          <div class="config-section">
            <h3>Device Connection</h3>
            
            <div class="setting-row">
              <label class="setting-label">
                <input type="checkbox" id="detect-devices" ${this.config.detectDevices ? 'checked' : ''}>
                Automatically detect backlight devices
              </label>
            </div>
            
            <div class="setting-row">
              <button id="scan-devices" class="action-btn">Scan for Devices</button>
            </div>
            
            <div class="devices-list" id="devices-list">
              <div class="device-item">
                <span class="device-status not-connected"></span>
                <span class="device-name">Govee TV Backlight</span>
                <button class="device-action">Connect</button>
              </div>
              <div class="device-item">
                <span class="device-status not-connected"></span>
                <span class="device-name">Philips Hue Play Bars</span>
                <button class="device-action">Connect</button>
              </div>
              <div class="device-item">
                <span class="device-status not-connected"></span>
                <span class="device-name">WLED Strip</span>
                <button class="device-action">Connect</button>
              </div>
            </div>
          </div>
          
          <div class="config-section">
            <h3>Recording Optimization</h3>
            
            <div class="setting-row">
              <label class="setting-label">
                <input type="checkbox" id="optimize-recording" ${this.config.optimizeRecording ? 'checked' : ''}>
                Optimize visualization for recording with backlights
              </label>
            </div>
            
            <div class="help-text">
              <p>When enabled, recordings will be optimized for better color detection by TV backlight systems. This will enhance edge colors and increase saturation slightly during recording.</p>
            </div>
            
            <div class="setting-row recording-tips">
              <h4>Tips for Best Results:</h4>
              <ul>
                <li>Record at 1080p or higher resolution</li>
                <li>Use high bitrate (10+ Mbps) for better color reproduction</li>
                <li>Keep video at full screen when playing back</li>
                <li>Position camera directly facing the screen for best detection</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="dialog-footer">
          <button id="backlight-save" class="primary-btn">Save</button>
          <button id="backlight-cancel" class="secondary-btn">Cancel</button>
          <button id="backlight-apply" class="secondary-btn">Apply</button>
        </div>
      </div>
    `;
  }
  
  // Set up event listeners
  setupEventListeners() {
    if (!this.container) return;
    
    // Close button
    const closeBtn = this.container.querySelector('#backlight-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }
    
    // Save button
    const saveBtn = this.container.querySelector('#backlight-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.updateConfig();
        this.applyConfig();
        this.saveConfig();
        this.hide();
      });
    }
    
    // Cancel button
    const cancelBtn = this.container.querySelector('#backlight-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.hide());
    }
    
    // Apply button
    const applyBtn = this.container.querySelector('#backlight-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.updateConfig();
        this.applyConfig();
      });
    }
    
    // Scan devices button
    const scanBtn = this.container.querySelector('#scan-devices');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => this.scanForDevices());
    }
    
    // Slider value updates
    const edgeEmphasisSlider = this.container.querySelector('#edge-emphasis');
    const edgeEmphasisValue = this.container.querySelector('#edge-emphasis + .slider-value');
    if (edgeEmphasisSlider && edgeEmphasisValue) {
      edgeEmphasisSlider.addEventListener('input', (e) => {
        edgeEmphasisValue.textContent = `${e.target.value}%`;
      });
    }
    
    const colorSaturationSlider = this.container.querySelector('#color-saturation');
    const colorSaturationValue = this.container.querySelector('#color-saturation + .slider-value');
    if (colorSaturationSlider && colorSaturationValue) {
      colorSaturationSlider.addEventListener('input', (e) => {
        colorSaturationValue.textContent = `${e.target.value}%`;
      });
    }
    
    const smoothingFactorSlider = this.container.querySelector('#smoothing-factor');
    const smoothingFactorValue = this.container.querySelector('#smoothing-factor + .slider-value');
    if (smoothingFactorSlider && smoothingFactorValue) {
      smoothingFactorSlider.addEventListener('input', (e) => {
        smoothingFactorValue.textContent = `${e.target.value}%`;
      });
    }
  }
  
  // Update config from form values
  updateConfig() {
    if (!this.container) return;
    
    // Get form values
    this.config.enabled = this.container.querySelector('#backlight-enabled').checked;
    this.config.mode = this.container.querySelector('#backlight-mode').value;
    this.config.mirrorMode = this.container.querySelector('#backlight-mirror').checked;
    this.config.edgeEmphasis = parseInt(this.container.querySelector('#edge-emphasis').value) / 100;
    this.config.colorSaturation = parseInt(this.container.querySelector('#color-saturation').value) / 100;
    this.config.smoothingFactor = parseInt(this.container.querySelector('#smoothing-factor').value) / 100;
    this.config.transitionSpeed = this.container.querySelector('#transition-speed').value;
    this.config.detectDevices = this.container.querySelector('#detect-devices').checked;
    this.config.optimizeRecording = this.container.querySelector('#optimize-recording').checked;
  }
  
  // Apply config to backlight system
  applyConfig() {
    if (!this.backlightSystem) return;
    
    // Toggle backlight system
    this.backlightSystem.toggle(this.config.enabled);
    
    // Set mode
    this.backlightSystem.setMode(this.config.mode);
    
    // Apply other settings
    this.backlightSystem.edgeEmphasis = this.config.edgeEmphasis;
    this.backlightSystem.colorSaturation = this.config.colorSaturation;
    this.backlightSystem.smoothingFactor = this.config.smoothingFactor;
    this.backlightSystem.transitionSpeed = this.config.transitionSpeed;
    
    // Mirror mode requires special handling in visualization
    if (this.backlightSystem.visualization) {
      this.backlightSystem.visualization.options.mirrorMode = this.config.mirrorMode;
    }
  }
  
  // Scan for available backlight devices
  scanForDevices() {
    if (!this.container) return;
    
    const devicesList = this.container.querySelector('#devices-list');
    if (!devicesList) return;
    
    // Show scanning state
    devicesList.innerHTML = '<div class="scanning-message">Scanning for devices...</div>';
    
    // Simulate scanning (would be replaced with actual device discovery)
    setTimeout(() => {
      // Get discovered devices (simulated)
      const discoveredDevices = this.simulateDeviceDiscovery();
      
      // Update device list
      this.updateDevicesList(discoveredDevices);
    }, 2000);
  }
  
  // Simulate device discovery (would be replaced with actual implementation)
  simulateDeviceDiscovery() {
    return [
      { id: 'govee1', name: 'Govee TV Backlight', type: 'Govee', connected: false, ipAddress: '192.168.1.100' },
      { id: 'hue1', name: 'Philips Hue Play Bars', type: 'Philips Hue', connected: false, bridgeIp: '192.168.1.150' },
      { id: 'wled1', name: 'WLED Strip', type: 'WLED', connected: false, ipAddress: '192.168.1.200' }
    ];
  }
  
  // Update devices list in UI
  updateDevicesList(devices) {
    if (!this.container) return;
    
    const devicesList = this.container.querySelector('#devices-list');
    if (!devicesList) return;
    
    // Clear list
    devicesList.innerHTML = '';
    
    // Add devices
    devices.forEach(device => {
      const deviceItem = document.createElement('div');
      deviceItem.className = 'device-item';
      
      deviceItem.innerHTML = `
        <span class="device-status ${device.connected ? 'connected' : 'not-connected'}"></span>
        <span class="device-name">${device.name}</span>
        <button class="device-action" data-id="${device.id}">${device.connected ? 'Disconnect' : 'Connect'}</button>
      `;
      
      devicesList.appendChild(deviceItem);
      
      // Add event listener to connect button
      const connectButton = deviceItem.querySelector('.device-action');
      connectButton.addEventListener('click', () => {
        if (device.connected) {
          this.disconnectDevice(device);
        } else {
          this.connectDevice(device);
        }
      });
    });
    
    // No devices found
    if (devices.length === 0) {
      devicesList.innerHTML = '<div class="no-devices-message">No backlight devices found</div>';
    }
  }
  
  // Connect to a device
  connectDevice(device) {
    if (!this.backlightSystem) return;
    
    // Update button state
    const connectButton = this.container.querySelector(`.device-action[data-id="${device.id}"]`);
    if (connectButton) {
      connectButton.textContent = 'Connecting...';
      connectButton.disabled = true;
    }
    
    // Simulate connection (would be replaced with actual API connection)
    setTimeout(() => {
      // Update device status
      device.connected = true;
      
      // Update UI
      const deviceStatus = this.container.querySelector(`.device-action[data-id="${device.id}"]`).parentNode.querySelector('.device-status');
      deviceStatus.className = 'device-status connected';
      
      // Update button
      if (connectButton) {
        connectButton.textContent = 'Disconnect';
        connectButton.disabled = false;
      }
      
      // Notify backlight system of connected device
      this.backlightSystem.connectToSystem(device);
    }, 1500);
  }
  
  // Disconnect from a device
  disconnectDevice(device) {
    if (!this.backlightSystem) return;
    
    // Update button state
    const connectButton = this.container.querySelector(`.device-action[data-id="${device.id}"]`);
    if (connectButton) {
      connectButton.textContent = 'Disconnecting...';
      connectButton.disabled = true;
    }
    
    // Simulate disconnection (would be replaced with actual API disconnection)
    setTimeout(() => {
      // Update device status
      device.connected = false;
      
      // Update UI
      const deviceStatus = this.container.querySelector(`.device-action[data-id="${device.id}"]`).parentNode.querySelector('.device-status');
      deviceStatus.className = 'device-status not-connected';
      
      // Update button
      if (connectButton) {
        connectButton.textContent = 'Connect';
        connectButton.disabled = false;
      }
      
      // Notify backlight system of disconnected device
      // This implementation would depend on the actual backlight system API
    }, 500);
  }
}

// CSS for the dialog would be in a separate stylesheet
// but is included here for reference

/*
.backlight-config-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  max-width: 90vw;
  max-height: 90vh;
  background-color: var(--surface-color);
  border: 1px solid var(--accent-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border-radius: 4px;
  overflow: hidden;
}

.dialog-header {
  padding: 15px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h2 {
  margin: 0;
  color: var(--accent-color);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-color);
}

.dialog-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.config-section {
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 4px;
}

.config-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--accent-color);
}

.setting-row {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.setting-label {
  flex: 1;
  margin-right: 10px;
}

.setting-select {
  background-color: var(--surface-color);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  color: var(--text-color);
  min-width: 150px;
}

.slider-container {
  display: flex;
  align-items: center;
  min-width: 250px;
}

.slider-container input[type="range"] {
  flex: 1;
  margin-right: 10px;
  -webkit-appearance: none;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
}

.slider-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  background-color: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 5px var(--accent-color);
}

.slider-value {
  min-width: 40px;
  text-align: right;
  color: var(--accent-color);
}

.action-btn {
  background-color: var(--surface-color-alt);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--accent-color);
  color: var(--surface-color);
}

.devices-list {
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.device-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.device-item:last-child {
  border-bottom: none;
}

.device-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.device-status.connected {
  background-color: var(--success-color);
  box-shadow: 0 0 5px var(--success-color);
}

.device-status.not-connected {
  background-color: var(--text-secondary);
}

.device-name {
  flex: 1;
}

.device-action {
  background-color: transparent;
  border: 1px solid var(--text-secondary);
  color: var(--text-secondary);
  padding: 3px 8px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 3px;
}

.device-action:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.scanning-message, .no-devices-message {
  padding: 15px;
  text-align: center;
  color: var(--text-secondary);
}

.dialog-footer {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(0, 238, 255, 0.3);
}

.dialog-footer button {
  margin-left: 10px;
}

.primary-btn {
  background-color: var(--accent-color);
  color: var(--background-color);
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 3px;
}

.primary-btn:hover {
  background-color: var(--accent-secondary);
}

.secondary-btn {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 3px;
}

.secondary-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.help-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding: 0 10px;
}

.recording-tips {
  display: block;
}

.recording-tips h4 {
  margin: 0 0 10px 0;
  color: var(--text-color);
}

.recording-tips ul {
  margin: 0;
  padding-left: 20px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.recording-tips li {
  margin-bottom: 5px;
}
*/
