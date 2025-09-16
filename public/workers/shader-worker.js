// Web Worker untuk heavy shader computation
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'COMPUTE_GRADIENT':
      computeGradient(data);
      break;
    case 'COMPUTE_ANIMATION_FRAME':
      computeAnimationFrame(data);
      break;
    case 'COMPUTE_COLOR_TRANSITION':
      computeColorTransition(data);
      break;
    default:
      console.warn('Unknown worker message type:', type);
  }
};

function computeGradient(data) {
  const { colors, width, height, time } = data;
  const result = [];
  
  // Simulasi heavy computation untuk gradient
  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    // Complex gradient calculation
    const noise = Math.sin(normalizedX * Math.PI * 2 + time * 0.001) * 
                  Math.cos(normalizedY * Math.PI * 2 + time * 0.001);
    
    const colorIndex = Math.floor((noise + 1) * 0.5 * (colors.length - 1));
    const color = colors[colorIndex];
    
    result.push({
      x,
      y,
      color,
      intensity: Math.abs(noise)
    });
  }
  
  self.postMessage({ 
    type: 'GRADIENT_COMPUTED', 
    result,
    timestamp: performance.now()
  });
}

function computeAnimationFrame(data) {
  const { frame, duration, easing } = data;
  const progress = Math.min(frame / duration, 1);
  
  let easedProgress;
  switch (easing) {
    case 'easeInOut':
      easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      break;
    case 'easeOut':
      easedProgress = 1 - Math.pow(1 - progress, 3);
      break;
    default:
      easedProgress = progress;
  }
  
  self.postMessage({
    type: 'ANIMATION_FRAME_COMPUTED',
    result: {
      progress: easedProgress,
      frame,
      isComplete: progress >= 1
    }
  });
}

function computeColorTransition(data) {
  const { fromColor, toColor, progress } = data;
  
  // Parse hex colors
  const from = hexToRgb(fromColor);
  const to = hexToRgb(toColor);
  
  const result = {
    r: Math.round(from.r + (to.r - from.r) * progress),
    g: Math.round(from.g + (to.g - from.g) * progress),
    b: Math.round(from.b + (to.b - from.b) * progress)
  };
  
  self.postMessage({
    type: 'COLOR_TRANSITION_COMPUTED',
    result: rgbToHex(result)
  });
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(rgb) {
  return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}
