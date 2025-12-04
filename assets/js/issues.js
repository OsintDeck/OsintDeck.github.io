// GitHub API configuration
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'OsintDeck';
const REPO_NAME = 'OsintDeck';

let currentPage = 1;
let allIssues = [];
let filteredIssues = [];
let allLabels = [];

// Fetch issues from GitHub REST API
async function fetchIssues(state = 'open') {
    try {
        const response = await fetch(
            `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=${state}&per_page=100&sort=updated&direction=desc`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch issues');
        }

        const data = await response.json();
        allIssues = data.filter(issue => !issue.pull_request); // Filter out pull requests
        filteredIssues = [...allIssues];

        // Extract unique labels
        const labelsSet = new Set();
        allIssues.forEach(issue => {
            issue.labels.forEach(label => labelsSet.add(label.name));
        });
        allLabels = Array.from(labelsSet).sort();

        populateLabelFilter();
        renderIssues();
    } catch (error) {
        console.error('Error fetching issues:', error);
        showError('Error al conectar con GitHub. Por favor, intenta más tarde.');
    }
}

// Populate label filter dropdown
function populateLabelFilter() {
    const labelFilter = document.getElementById('labelFilter');
    labelFilter.innerHTML = '<option value="">Todas las etiquetas</option>';

    allLabels.forEach(label => {
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        labelFilter.appendChild(option);
    });
}

// Render issues
function renderIssues() {
    const container = document.getElementById('issuesList');
    const pagination = document.getElementById('pagination');

    if (filteredIssues.length === 0) {
        container.innerHTML = `
            <div class="error-message">
                <i data-feather="info"></i>
                <p>No se encontraron issues que coincidan con los filtros.</p>
            </div>
        `;
        feather.replace();
        pagination.style.display = 'none';
        return;
    }

    const itemsPerPage = 15;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageIssues = filteredIssues.slice(startIndex, endIndex);

    container.innerHTML = pageIssues.map(issue => {
        const date = new Date(issue.updated_at);
        const formattedDate = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const stateClass = issue.state === 'open' ? 'open' : 'closed';
        const stateIcon = issue.state === 'open' ? 'alert-circle' : 'check-circle';
        const stateText = issue.state === 'open' ? 'Abierto' : 'Cerrado';

        const labelsHTML = issue.labels.map(label => {
            return `<span class="issue-label" style="background-color: #${label.color}20; color: #${label.color};">
                ${label.name}
            </span>`;
        }).join('');

        return `
            <div class="issue-item" onclick="window.open('${issue.html_url}', '_blank')">
                <div class="issue-title">
                    <span class="issue-state ${stateClass}">
                        <i data-feather="${stateIcon}"></i>
                        ${stateText}
                    </span>
                    <span class="issue-number">#${issue.number}</span>
                    ${issue.title}
                </div>
                <div class="issue-meta">
                    ${labelsHTML}
                    <span>
                        <i data-feather="user"></i>
                        ${issue.user.login}
                    </span>
                    <span>
                        <i data-feather="message-square"></i>
                        ${issue.comments} comentarios
                    </span>
                    <span>
                        <i data-feather="clock"></i>
                        ${formattedDate}
                    </span>
                </div>
            </div>
        `;
    }).join('');

    // Update pagination
    const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    pagination.style.display = totalPages > 1 ? 'flex' : 'none';

    feather.replace();
}

// Show error message
function showError(message) {
    const container = document.getElementById('issuesList');
    container.innerHTML = `
        <div class="error-message">
            <i data-feather="alert-triangle"></i>
            <p>${message}</p>
            <a href="https://github.com/OsintDeck/OsintDeck/issues" target="_blank" style="color: #ef4444; text-decoration: underline; margin-top: 10px; display: inline-block;">
                Ver issues en GitHub
            </a>
        </div>
    `;
    feather.replace();
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const labelFilter = document.getElementById('labelFilter').value;

    filteredIssues = allIssues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm) ||
            issue.body?.toLowerCase().includes(searchTerm);
        const matchesLabel = !labelFilter ||
            issue.labels.some(label => label.name === labelFilter);

        return matchesSearch && matchesLabel;
    });

    currentPage = 1;
    renderIssues();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('labelFilter').addEventListener('change', applyFilters);

document.getElementById('stateFilter').addEventListener('change', (e) => {
    fetchIssues(e.target.value);
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderIssues();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredIssues.length / 15);
    if (currentPage < totalPages) {
        currentPage++;
        renderIssues();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Initialize
fetchIssues();
