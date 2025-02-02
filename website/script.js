// Show Mod Upload Form
document.getElementById("uploadModButton").onclick = function() {
    document.getElementById("uploadModForm").style.display = "block";
};

// Initialize the mod list from localStorage (if it exists)
let modList = JSON.parse(localStorage.getItem("modList")) || [];

// Display all mods when the page is loaded
window.onload = function() {
    displayAllMods();
};

// Upload Mod Functionality (updated to store data in localStorage)
// Upload Mod Functionality (updated to store data in localStorage and get the first PNG image)
function uploadMod() {
    const modName = document.getElementById("modName").value;
    const githubLink = document.getElementById("githubLink").value;

    // Validate inputs
    if (!modName || !githubLink) {
        alert("Please provide both a mod name and a GitHub link.");
        return;
    }

    // Extract the GitHub repo owner and repo name from the URL (assuming format: github.com/user/repo)
    const repoParts = githubLink.split('/');
    const owner = repoParts[3];
    const repo = repoParts[4];

    // Fetch the README.md file from GitHub
    fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`)
        .then(response => response.text())
        .then(readmeContent => {
            // Extract image URL from README content (only PNG images)
            const imageUrls = extractImageUrls(readmeContent);
            const modData = {
                name: modName,
                description: "Description from README.md",
                images: imageUrls,
                creator: owner,
                downloadUrl: `${githubLink}/releases/latest/download/mod.zip`,
                githubLink: githubLink
            };

            // Store the mod data in the list and update localStorage
            modList.push(modData);
            localStorage.setItem("modList", JSON.stringify(modList));

            // Display the updated mod list
            displayMod(modData);

            // Hide upload form after submission
            document.getElementById("uploadModForm").style.display = "none";
            document.getElementById("modName").value = "";
            document.getElementById("githubLink").value = "";
        })
        .catch(error => {
            console.error('Error fetching README:', error);
        });
}

// Extract PNG image URLs from README content (Markdown image format)
function extractImageUrls(readmeContent) {
    const regex = /!\[.*?\]\((https:\/\/.*?\.png)\)/g;  // Look specifically for PNG images
    let imageUrls = [];
    let match;
    while ((match = regex.exec(readmeContent)) !== null) {
        imageUrls.push(match[1]);
    }
    return imageUrls;
}


// Display Mod in Mod List (same as before)
function displayMod(mod) {
    const modContainer = document.getElementById("modContainer");
    const modElement = document.createElement("div");
    modElement.classList.add("modItem");
    modElement.innerHTML = `
        <img src="${mod.images[0]}" alt="Mod Icon" style="width:100%;">
        <h3>${mod.name}</h3>
        <p>${mod.description.slice(0, 50)}...</p>
    `;
    modElement.onclick = function() {
        openModDetails(mod);
    };
    modContainer.appendChild(modElement);
}

// Display all mods stored in localStorage
function displayAllMods() {
    const modContainer = document.getElementById("modContainer");
    modContainer.innerHTML = ""; // Clear existing mods before displaying
    modList.forEach(mod => {
        displayMod(mod);
    });
}

// Open Mod Details Modal (same as before)
function openModDetails(mod) {
    document.getElementById("modNameDisplay").innerText = mod.name;
    document.getElementById("modDescription").innerText = mod.description;
    document.getElementById("creatorName").innerText = mod.creator;
    document.getElementById("downloadButton").onclick = () => window.location.href = mod.downloadUrl;
    document.getElementById("goToGitHubButton").onclick = () => window.open(mod.githubLink, '_blank');

    let imagesHtml = '';
    mod.images.forEach(image => {
        imagesHtml += `<img src="${image}" alt="Mod Image" style="width: 100px; margin: 5px;">`;
    });
    document.getElementById("modImages").innerHTML = imagesHtml;

    document.getElementById("modDetailsModal").style.display = "block";
}

// Close Modal (same as before)
document.getElementById("closeModal").onclick = function() {
    document.getElementById("modDetailsModal").style.display = "none";
};

// Home Button Clicked (same as before)
document.getElementById("homeButton").onclick = function() {
    window.location.reload();
};
