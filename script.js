document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.getElementById("uploadModButton");
    const modal = document.getElementById("uploadModal");
    const closeModal = document.querySelector(".close");
    const submitButton = document.getElementById("submitMod");
    const modNameInput = document.getElementById("modName");
    const modGitHubInput = document.getElementById("modGitHub");
    const modsContainer = document.getElementById("modsContainer");

    uploadButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    submitButton.addEventListener("click", async () => {
        const modName = modNameInput.value.trim();
        const modGitHub = modGitHubInput.value.trim();

        if (modName && modGitHub) {
            try {
                const response = await fetch('https://api.github.com/repos/YourUsername/YourRepo/actions/workflows/update-mods.yml/dispatches', {
                    method: 'POST',
                    headers: {
                        'Authorization': `token YOUR_PERSONAL_GITHUB_TOKEN`,  // Your token is used server-side, not here.
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ref: 'main',  // or the default branch of your repository
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
                }
            } catch (error) {
                console.error('Error triggering GitHub action:', error);
            }
        } else {
            alert("Please fill in all fields.");
        }
    });

    loadMods();

    function loadMods() {
        fetch('https://raw.githubusercontent.com/YourUsername/YourRepo/main/mods.txt')
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
});
