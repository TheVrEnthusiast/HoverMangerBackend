// Handle opening the upload form modal
document.getElementById('open-upload-form').addEventListener('click', () => {
    const modal = document.getElementById('upload-modal');
    modal.classList.remove('hidden');
});

// Handle closing the upload form modal
document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('upload-modal');
    modal.classList.add('hidden');
});

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const modName = document.getElementById('modName').value;
    const modLink = document.getElementById('modLink').value;

    if (modName && modLink) {
        try {
            const response = await fetch('https://api.github.com/repos/TheVrEnthusiast/HoverMangerBackend/actions/workflows/update-mods.yml/dispatches', {
                method: 'POST',
                headers: {
                    'Authorization': `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`,  // Replace with your GitHub personal token
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ref: 'main',
                    inputs: {
                        MOD_NAME: modName,
                        MOD_LINK: modLink
                    }
                })
            });

            if (response.ok) {
                alert('Mod uploaded successfully!');
                loadMods();  // Reload the list of mods
                document.getElementById('upload-modal').classList.add('hidden');  // Close the modal after success
            } else {
                alert('Failed to upload mod.');
            }
        } catch (error) {
            console.error('Error triggering GitHub action:', error);
            alert('Error uploading mod.');
        }
    } else {
        alert('Please provide both mod name and mod link!');
    }
});

// Function to load and display the list of mods
async function loadMods() {
    const modsList = document.getElementById('mods');
    modsList.innerHTML = '';  // Clear existing mods

    try {
        const response = await fetch('mods/mods.txt');
        const mods = await response.text();
        const modsArray = mods.split('\n').map(mod => mod.trim()).filter(mod => mod);

        modsArray.forEach(mod => {
            const li = document.createElement('li');
            li.textContent = mod;
            modsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading mods:', error);
    }
}

// Load the mods when the page loads
loadMods();
