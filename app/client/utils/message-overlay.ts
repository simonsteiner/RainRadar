let messageTimeout: number;

export function showMessageOverlay(message: string): void {
  const overlay = document.getElementById("messageOverlay");
  if (overlay) {
    clearTimeout(messageTimeout);
    overlay.textContent = message;
    overlay.classList.remove("hidden");
    
    // Reset animation by removing and re-adding flash class
    overlay.classList.remove("flash");
    void overlay.offsetWidth; // Force reflow
    overlay.classList.add("flash");
    
    messageTimeout = window.setTimeout(() => {
      overlay.classList.add("hidden");
    }, 5000);
  }
}