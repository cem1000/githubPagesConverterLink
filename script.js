function setRandomBackground() {
    // Array of background images in your assets folder
    const backgrounds = [
        'assets/background1.png',
        'assets/background2.png',
        'assets/background3.png',
        'assets/background4.png',
        'assets/background5.png'
    ];

    // Get random index
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    
    // Set the background image
    document.body.style.backgroundImage = `url('${backgrounds[randomIndex]}')`;
}

document.addEventListener('DOMContentLoaded', setRandomBackground);

// Analytics tracking functions
function trackEvent(category, action, label = null) {
    if (typeof gtag !== 'undefined') {
        const eventParams = {
            event_category: category,
            event_action: action
        };
        if (label) eventParams.event_label = label;
        gtag('event', action, eventParams);
    }
}

function convertToGitHubPagesLink(repoUrl) {
    if (!repoUrl.startsWith("https://github.com/")) {
        return { success: false, message: "Invalid GitHub repository URL" };
    }

    const parts = repoUrl.replace("https://github.com/", "").split("/");
    
    if (parts.length < 2) {
        return { success: false, message: "Invalid GitHub repository URL format" };
    }

    const username = parts[0];
    const repoName = parts[1];

    return { 
        success: true, 
        message: `https://${username}.github.io/${repoName}/`
    };
}

function convertUrl() {
    const repoUrl = document.getElementById('repoUrl').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!repoUrl) {
        resultDiv.innerHTML = '<span class="error">Please enter a GitHub repository URL</span>';
        trackEvent('Conversion', 'attempt_failed', 'empty_input');
        return;
    }

    const result = convertToGitHubPagesLink(repoUrl);
    
    if (result.success) {
        resultDiv.innerHTML = `
            <span class="success">GitHub Pages URL:</span><br>
            <a href="${result.message}" 
               target="_blank" 
               onclick="trackEvent('Navigation', 'visit_converted_url', '${result.message}')"
               class="converted-link">${result.message}</a>
            <button onclick="copyToClipboard('${result.message}')" class="copy-button">
                Copy URL
            </button>
        `;
        trackEvent('Conversion', 'success', repoUrl);
    } else {
        resultDiv.innerHTML = `<span class="error">${result.message}</span>`;
        trackEvent('Conversion', 'attempt_failed', 'invalid_format');
    }
}

// Add copy to clipboard functionality with tracking
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        trackEvent('Interaction', 'copy_url', text);
        alert('URL copied to clipboard!');
    }).catch(err => {
        trackEvent('Error', 'copy_failed', err.message);
    });
}

// Track FAQ interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track random background
    setRandomBackground();
    trackEvent('Page', 'background_loaded');

    // Track FAQ interactions
    document.querySelectorAll('details').forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                const question = this.querySelector('summary').textContent;
                trackEvent('FAQ', 'open', question);
            }
        });
    });

    // Track URL input focus
    document.getElementById('repoUrl').addEventListener('focus', function() {
        trackEvent('Interaction', 'input_focus');
    });

    // Track form submissions
    document.querySelector('button[onclick="convertUrl()"]').addEventListener('click', function() {
        trackEvent('Interaction', 'convert_button_click');
    });
});
