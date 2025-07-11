// This script helps prevent users from accessing DevTools
// Note: This is not a bulletproof solution, but adds an extra layer of prevention

document.addEventListener("DOMContentLoaded", () => {
  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // Disable common keyboard shortcuts for DevTools
  document.addEventListener("keydown", (e) => {
    // F12 key
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I or Command+Option+I (Mac)
    if ((e.ctrlKey && e.shiftKey && e.key === "I") || (e.metaKey && e.altKey && e.key === "i")) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+J or Command+Option+J (Mac)
    if ((e.ctrlKey && e.shiftKey && e.key === "J") || (e.metaKey && e.altKey && e.key === "j")) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+C or Command+Option+C (Mac)
    if ((e.ctrlKey && e.shiftKey && e.key === "C") || (e.metaKey && e.altKey && e.key === "c")) {
      e.preventDefault();
      return false;
    }
  });
});
