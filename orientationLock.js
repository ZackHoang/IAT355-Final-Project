// orientationLock.js

function updateOrientation() {
  const angle = window.orientation || screen.orientation?.angle || 0;

  // Rotate content opposite to device rotation
  const rotation = angle * -1;

  document.documentElement.style.transform = `rotate(${rotation}deg)`;
  document.documentElement.style.transformOrigin = "center center";
  document.documentElement.style.width = "100%";
  document.documentElement.style.height = "100%";
  document.documentElement.style.position = "fixed";
  document.documentElement.style.top = "0";
  document.documentElement.style.left = "0";
}

// Run once now
updateOrientation();

// Update whenever orientation changes
window.addEventListener("orientationchange", updateOrientation);
window.addEventListener("resize", updateOrientation);
