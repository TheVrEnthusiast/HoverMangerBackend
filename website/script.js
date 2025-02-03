document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.getElementById("uploadModButton");
    const modal = document.getElementById("uploadModal");
    const closeModal = document.querySelector(".close");
    const submitButton = document.getElementById("submitMod");
    const modNameInput = document.getElementById("modName");
    const modGitHubInput = document.getElementById("modGitHub");
    const modsContainer = document.getElementById("modsContainer");

    // GitHub API settings
    const GITHUB_USERNAME = "TheVrEnthusiast";
    const GITHUB_REPO = "HoverMangerBackend";
    const FILE_PATH = "mods.txt";
    const GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"; // Replace with the correct GitHub token (use environment variable or fetch it securely)

    // Open Upload Mod Menu
    uploadButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close Upload Mod Menu
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Upload Mod Function (Updates mods.txt)
    async function updateModsFile(newMod) {
        const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`;

        try {
            // Get current file SHA (needed for updating a file)
            const response = await fetch(url, {
                headers: { Authorization: `token ${GITHUB_TOKEN}` }
            });
            const fileData = await response.json();
            const currentContent = atob(fileData.content); // Decode Base64 content

            // Append new mod
            const updatedContent = currentContent + `\n${newMod.name} | ${newMod.link}`;
            const encodedContent = btoa(updatedContent); // Encode to Base64

            // Update file on GitHub
            await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Added new mod",
                    content: encodedContent,
                    sha: fileData.sha // Required to overwrite file
                })
            });

            alert("Mod uploaded successfully!");
            loadMods(); // Reload mods
        } catch (error) {
            console.error("Error uploading mod:", error);
        }
    }

    // Handle Upload Button Click
    submitButton.addEventListener("click", () => {
        const modName = modNameInput.value.trim();
        const modGitHub = modGitHubInput.value.trim();
        
        if (modName && modGitHub) {
            updateModsFile({ name: modName, link: modGitHub });
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Load Mods from mods.txt
    function loadMods() {
        fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/${FILE_PATH}`)
            .then(response => response.text())
            .then(data => {
                modsContainer.innerHTML = "";
                const mods = data.split("\n").filter(line => line.trim() !== "");
                mods.forEach(modEntry => {
                    const [modName, modLink] = modEntry.split(" | ");
                    const modElement = document.createElement("div");
                    modElement.classList.add("mod-item");
                    modElement.innerHTML = `<h3>${modName}</h3><a href="${modLink}" target="_blank">GitHub</a>`;
                    modsContainer.appendChild(modElement);
                });
            })
            .catch(error => console.error("Error loading mods:", error));
    }

    loadMods(); // Load mods when page loads
});
