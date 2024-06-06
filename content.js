console.log('Content script loaded');

function pauseVideo() {
    const video = document.querySelector('video');
    if (video && !video.paused) {
        video.pause();
        console.log('Video paused');
    }
}

function resumeVideo() {
    const video = document.querySelector('video');
    if (video && video.paused) {
        video.play();
        console.log('Video resumed');
    }
}

// Handle messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    if (message.action === 'pauseVideo') {
        pauseVideo();
    } else if (message.action === 'resumeVideo') {
        resumeVideo();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        pauseVideo();
    } else if (document.visibilityState === 'visible') {
        resumeVideo();
    }
});

// Ensure video state is checked when the content script is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.visibilityState === 'visible') {
        resumeVideo();
    }
});
