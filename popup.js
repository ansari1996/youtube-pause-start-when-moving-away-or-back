document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggle-switch');

    // Load the saved state from chrome.storage.sync
    chrome.storage.sync.get('isEnabled', (data) => {
        toggleSwitch.checked = data.isEnabled || false;
    });

    // Save the state to chrome.storage.sync when the toggle switch is changed
    toggleSwitch.addEventListener('change', () => {
        const isEnabled = toggleSwitch.checked;
        chrome.storage.sync.set({ isEnabled });
    });
});
