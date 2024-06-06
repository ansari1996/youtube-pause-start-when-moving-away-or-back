// Log the loading of the background script
console.log("Background script loaded");

// Listener for tab activation
chrome.tabs.onActivated.addListener(activeInfo => {
    console.log('Tab activated:', activeInfo);
    chrome.storage.sync.get('isEnabled', (data) => {
        if (data.isEnabled) {
            chrome.tabs.get(activeInfo.tabId, tab => {
                if (tab.url && tab.url.includes("youtube.com")) {
                    console.log('Sending resume message to tab:', activeInfo.tabId);
                    chrome.tabs.sendMessage(activeInfo.tabId, { action: "resumeVideo" });
                } else {
                    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                        if (tabs.length > 0 && tabs[0].url && tabs[0].url.includes("youtube.com")) {
                            console.log('Sending pause message to tab:', tabs[0].id);
                            chrome.tabs.sendMessage(tabs[0].id, { action: "pauseVideo" });
                        }
                    });
                }
            });
        }
    });
});

// Listener for window focus change
chrome.windows.onFocusChanged.addListener(windowId => {
    console.log('Window focus changed:', windowId);
    chrome.storage.sync.get('isEnabled', (data) => {
        if (data.isEnabled) {
            if (windowId === chrome.windows.WINDOW_ID_NONE) {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                    if (tabs.length > 0 && tabs[0].url && tabs[0].url.includes("youtube.com")) {
                        console.log('Sending pause message to tab:', tabs[0].id);
                        chrome.tabs.sendMessage(tabs[0].id, { action: "pauseVideo" });
                    }
                });
            } else {
                chrome.tabs.query({ active: true, windowId: windowId }, tabs => {
                    if (tabs.length > 0 && tabs[0].url && tabs[0].url.includes("youtube.com")) {
                        console.log('Sending resume message to tab:', tabs[0].id);
                        chrome.tabs.sendMessage(tabs[0].id, { action: "resumeVideo" });
                    }
                });
            }
        }
    });
});

// Listener for tab updates (e.g., switching to an already open YouTube tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('Tab updated:', tabId, changeInfo, tab);
    if (changeInfo.status === 'complete' && tab.url.includes('youtube.com')) {
        chrome.storage.sync.get('isEnabled', (data) => {
            if (data.isEnabled) {
                console.log('Sending resume message to tab:', tabId);
                chrome.tabs.sendMessage(tabId, { action: 'resumeVideo' });
            }
        });
    }
});
