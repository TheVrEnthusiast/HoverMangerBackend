document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.getElementById("uploadModButton");
    const modal = document.getElementById("uploadModal");
    const closeModal = document.querySelector(".close");
    const submitButton = document.getElementById("submitMod");
    const modNameInput = document.getElementById("modName");
    const modGitHubInput = document.getElementById("modGitHub");
    const modsContainer = document.getElementById("modsContainer");

    // Open the modal when the "Upload Mod" button is clicked
    uploadButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close the modal when the close button or background is clicked
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle the mod submission (trigger GitHub Action)
    submitButton.addEventListener("click", () => {
        const modName = modNameInput.value.trim();
        const modGitHub = modGitHubInput.value.trim();

        if (modName && modGitHub) {
            triggerGitHubAction(modName, modGitHub);
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Function to trigger GitHub Action to update the mods.txt file
    async function triggerGitHubAction(modName, modGitHub) {
        const response = await fetch('https://api.github.com/repos/TheVrEnthusiast/HoverMangerBackend/actions/workflows/update-mods.yml/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: 'main',  // Ensure this is the correct branch (usually 'main')
                inputs: {
                    MOD_NAME: modName,
                    MOD_LINK: modGitHub
                }
            })
        });

        if (response.ok) {
            alert('Mod uploaded successfully!');
        } else {
            console.error('Failed to trigger GitHub action');
            console.error(await response.text());
        }
    }

    // Load the list of mods from the mods.txt file
    function loadMods() {
        fetch('https://raw.githubusercontent.com/TheVrEnthusiast/HoverMangerBackend/mods/mods.txt')
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

    loadMods();  // Load mods on page load
});
