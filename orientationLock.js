(async function () {
  if (!("orientation" in screen) || !screen.orientation.lock) {
    console.warn("Screen Orientation API not supported on this device or browser.");
    return;
  }

  try {
    await screen.orientation.lock("portrait");
    console.log("Screen orientation successfully locked to portrait.");
  } catch (err) {
    console.warn("Failed to lock screen orientation:", err);
  }
})();
