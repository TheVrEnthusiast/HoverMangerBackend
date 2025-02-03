document.addEventListener("DOMContentLoaded", () => {
    const uploadModBtnHeader = document.getElementById('uploadModBtnHeader');
    const closeUploadFormBtn = document.getElementById('closeUploadFormBtn');
    const uploadModBtn = document.getElementById('uploadModBtn');
    const modNameInput = document.getElementById('modName');
    const modGithubLinkInput = document.getElementById('modGithubLink');
    const modListContainer = document.getElementById('modList');
    const modListContainerElem = document.getElementById('modListContainer');
    const modDetailContainer = document.getElementById('modDetailContainer');
    const modDetailElem = document.getElementById('modDetail');
    const backToModListBtn = document.getElementById('backToModListBtn');
    const uploadForm = document.getElementById('uploadModContainer');

    // Toggle the Upload Form
    uploadModBtnHeader.addEventListener('click', toggleUploadForm);
    closeUploadFormBtn.addEventListener('click', toggleUploadForm);

    // Upload Mod Logic
    uploadModBtn.addEventListener('click', async () => {
        const modName = modNameInput.value;
        const modGithubLink = modGithubLinkInput.value;

        if (!modName || !modGithubLink) {
            alert("Please fill in both fields!");
            return;
        }

        const modData = `${modName} | ${modGithubLink}\n`;
        await updateGitHubFile(modData);
        fetchModList(); // Refresh mod list

        modNameInput.value = '';
        modGithubLinkInput.value = '';
        toggleUploadForm(); // Hide the upload form after successful upload
    });

    // Go back to the mod list
    backToModListBtn.addEventListener('click', () => {
        modListContainerElem.style.display = 'block';
        modDetailContainer.style.display = 'none';
    });

    // Fetch Mod List when page loads
    fetchModList();
});

// Toggle the visibility of the upload form
function toggleUploadForm() {
    const uploadForm = document.getElementById('uploadModContainer');
    if (uploadForm.style.display === 'none' || uploadForm.style.display === '') {
        uploadForm.style.display = 'flex';
    } else {
        uploadForm.style.display = 'none';
    }
}

// Fetch the mod list from GitHub and display it
async function fetchModList() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/TheVrEnthusiast/HoverMangerBackend/main/mods.txt');
        const text = await response.text();
        const modList = text.split("\n").map(line => {
            const [name, link] = line.split(" | ");
            return { name, link };
        });

        modListContainer.innerHTML = '';
        modList.forEach(mod => {
            const modItem = document.createElement('li');
            modItem.innerHTML = `
                <h3>${mod.name}</h3>
                <a href="${mod.link}" target="_blank">View Mod</a>
                <button onclick="viewModDetail('${mod.name}', '${mod.link}')">View Details</button>
            `;
            modListContainer.appendChild(modItem);
        });
    } catch (error) {
        console.error("Error fetching mod list:", error);
    }
}

// Show mod details when clicked
async function viewModDetail(modName, modLink) {
    modListContainerElem.style.display = 'none';
    modDetailContainer.style.display = 'block';

    modDetailElem.innerHTML = `
        <h3>${modName}</h3>
        <p><a href="${modLink}" target="_blank">View Mod on GitHub</a></p>
        <button id="downloadModBtn" onclick="downloadMod('${modLink}')">Download</button>
    `;

    // Fetch readme file for description and image (optional)
    const readmeLink = `${modLink}/blob/main/README.md`; // Modify if necessary
    modDetailElem.innerHTML += `<p>Description from <a href="${readmeLink}" target="_blank">README</a></p>`;
}

// Download mod logic
async function downloadMod(modLink) {
    const releasesApiUrl = `${modLink}/releases/latest`;
    try {
        const response = await fetch(releasesApiUrl);
        const releaseData = await response.json();
        const downloadUrl = releaseData.assets[0].browser_download_url; // Assuming the first asset is the download file
        window.location.href = downloadUrl;
    } catch (error) {
        console.error("Error fetching mod release:", error);
    }
}

// Update the mods.txt file in GitHub
async function updateGitHubFile(newModData) {
    try {
        const response = await fetch('https://api.github.com/repos/TheVrEnthusiast/HoverMangerBackend/contents/mods.txt');
        const data = await response.json();
        const sha = data.sha;

        const commitMessage = 'Add new mod to the list';
        const updatedContent = btoa(newModData);  // Convert newModData to base64

        const updateResponse = await fetch('https://api.github.com/repos/TheVrEnthusiast/HoverMangerBackend/contents/mods.txt', {
            method: 'PUT',
            headers: {
                'Authorization': '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',  // Replace with your actual GitHub token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: commitMessage,
                content: updatedContent,
                sha: sha
            })
        });

        const result = await updateResponse.json();
        console.log(result);  // Log the response from GitHub to ensure the file was updated
    } catch (error) {
        console.error("Error updating GitHub file:", error);
    }
}
