function setRandomBackground() {
    // Array of background images in your assets folder
    const backgrounds = [
        'assets/background1.png',
        'assets/background2.png'
    ];

    // Get random index
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    
    // Set the background image
    document.body.style.backgroundImage = `url('${backgrounds[randomIndex]}')`;
}

document.addEventListener('DOMContentLoaded', setRandomBackground);

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
        return;
    }

    const result = convertToGitHubPagesLink(repoUrl);
    
    if (result.success) {
        resultDiv.innerHTML = `
            <span class="success">GitHub Pages URL:</span><br>
            <a href="${result.message}" target="_blank">${result.message}</a>
        `;
    } else {
        resultDiv.innerHTML = `<span class="error">${result.message}</span>`;
    }
}