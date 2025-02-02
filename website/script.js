// GitHub repository information
const githubRepoURL = 'https://raw.githubusercontent.com/TheVrEnthusiast/HoverMangerBackend/main/mods.txt'; // URL to raw mods.txt file
const token = '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';  // Your GitHub token for authentication
const repoOwner = 'TheVrEnthusiast';  // Your GitHub username
const repoName = 'HoverMangerBackend';  // Your GitHub repository name
const filePath = 'mods.txt';  // Path to the mods.txt file in the repo
const branch = 'main';  // The branch (usually 'main')

// Fetch the mod list from GitHub
async function fetchModList() {
    const response = await fetch(githubRepoURL);
    const text = await response.text();
    const modList = text.split("\n").map(line => {
        const [name, link] = line.split(" | ");
        return { name, link };
    });

    // Display mods on the page
    const modListContainer = document.getElementById('modList');
    modListContainer.innerHTML = '';  // Clear existing list
    modList.forEach(mod => {
        const modItem = document.createElement('li');
        modItem.innerHTML = `
            <h3>${mod.name}</h3>
            <a href="${mod.link}" target="_blank">View Mod</a>
            <button onclick="downloadMod('${mod.link}')">Download</button>
        `;
        modListContainer.appendChild(modItem);
    });
}

// Handle uploading a new mod
async function uploadMod() {
    const modName = document.getElementById('modName').value;
    const modGithubLink = document.getElementById('modGithubLink').value;

    if (!modName || !modGithubLink) {
        alert("Please fill in both fields!");
        return;
    }

    // Create the new mod data in the format "mod name | github link"
    const modData = `${modName} | ${modGithubLink}\n`;

    // Update the GitHub file with the new mod data
    await updateGitHubFile(modData);

    // Clear the input fields
    document.getElementById('modName').value = '';
    document.getElementById('modGithubLink').value = '';

    // Re-fetch the mod list and display it again
    fetchModList();
    
    // Close the upload form after successful upload
    toggleUploadForm();
}

// Function to update the mods.txt file on GitHub using GitHub API
async function updateGitHubFile(newModData) {
    // Fetch the current file contents from GitHub to get the SHA
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`);
    const data = await response.json();
    const sha = data.sha;  // SHA hash of the file, needed to update it

    // Prepare the new mod data (base64 encode the content)
    const commitMessage = 'Add new mod to the list';
    const updatedContent = btoa(newModData);  // Base64 encode the new mod data

    // Send the PUT request to update the file
    const updateResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: commitMessage,
            content: updatedContent,
            sha: sha,
            branch: branch
        })
    });

    const result = await updateResponse.json();
    console.log(result);
}

// Trigger the upload function when the user clicks "Upload Mod"
document.getElementById('uploadModBtn').addEventListener('click', uploadMod);

// Toggle upload mod form visibility
document.getElementById('uploadModBtnHeader').addEventListener('click', toggleUploadForm);
document.getElementById('closeUploadFormBtn').addEventListener('click', toggleUploadForm);

// Function to toggle the visibility of the upload form
function toggleUploadForm() {
    const uploadForm = document.getElementById('uploadModContainer');
    if (uploadForm.style.display === 'none') {
        uploadForm.style.display = 'block';
    } else {
        uploadForm.style.display = 'none';
    }
}

// Fetch and display mod list when the page loads
window.onload = fetchModList;

// Download mod (this is a placeholder, you would implement this with GitHub links)
function downloadMod(githubLink) {
    alert(`Downloading from: ${githubLink}`);
    // In a real scenario, you'd want to fetch the release file from the GitHub API
}
