document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
        const content = btoa(reader.result); // Convert file content to Base64

        const fileName = file.name;
        const repoOwner = 'collabphp'; // Your GitHub username
        const repoName = 'collab.github.io'; // Your repository name
        const branch = 'root'; // Your branch name (ensure this is correct)
        const token = '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'; // Your GitHub Personal Access Token

        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/uploads/${fileName}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Updated to use Bearer
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload ${fileName}`,
                content: content,
                branch: branch,
            }),
        });

        const status = document.getElementById('status');
        if (response.ok) {
            status.textContent = `File "${fileName}" uploaded successfully!`;
        } else {
            const error = await response.json();
            status.textContent = `Error: ${error.message}`;
        }
    };

    reader.readAsBinaryString(file);
});
