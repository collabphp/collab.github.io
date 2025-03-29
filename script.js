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
        const repoOwner = 'collabphp'; // Replace with your GitHub username
        const repoName = 'collab.github.io'; // Replace with your repository name
        const branch = 'root'; // Replace with your branch name
        const token = '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'; // Replace with your GitHub Personal Access Token

        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/uploads/${fileName}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
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
