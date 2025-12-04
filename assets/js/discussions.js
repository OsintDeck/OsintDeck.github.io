// GitHub API configuration
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'OsintDeck';
const REPO_NAME = 'OsintDeck';

let currentPage = 1;
let allDiscussions = [];
let filteredDiscussions = [];

// Fetch discussions from GitHub REST API (no auth required for public repos)
async function fetchDiscussions() {
    try {
        // Note: GitHub Discussions API is still in beta, so we'll show a helpful message
        // and redirect to GitHub for now
        showGitHubRedirect();
    } catch (error) {
        console.error('Error fetching discussions:', error);
        showError('Error al conectar con GitHub. Por favor, intenta más tarde.');
    }
}

// Show redirect message for discussions
function showGitHubRedirect() {
    const container = document.getElementById('discussionsList');
    container.innerHTML = `
        <div style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid var(--primary-color); border-radius: 12px; padding: 40px; text-align: center;">
            <i data-feather="message-circle" style="width: 64px; height: 64px; color: var(--primary-color); margin-bottom: 20px;"></i>
            <h2 style="color: white; margin-bottom: 15px;">Discusiones de la Comunidad</h2>
            <p style="color: #94a3b8; margin-bottom: 25px; max-width: 600px; margin-left: auto; margin-right: auto;">
                Las discusiones de GitHub son el espacio perfecto para compartir ideas, hacer preguntas y colaborar con la comunidad de OSINT Deck.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 30px;">
                <a href="https://github.com/OsintDeck/OsintDeck/discussions" target="_blank" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background-color: var(--primary-color); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;"
                   onmouseover="this.style.backgroundColor='#2563eb'; this.style.transform='translateY(-2px)'"
                   onmouseout="this.style.backgroundColor='var(--primary-color)'; this.style.transform='translateY(0)'">
                    <i data-feather="external-link"></i>
                    Ver Discusiones en GitHub
                </a>
                <a href="https://github.com/OsintDeck/OsintDeck/discussions/new/choose" target="_blank"
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background-color: var(--secondary-color); color: white; border: 1px solid var(--border-color); border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;"
                   onmouseover="this.style.borderColor='var(--primary-color)'; this.style.transform='translateY(-2px)'"
                   onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='translateY(0)'">
                    <i data-feather="plus"></i>
                    Nueva Discusión
                </a>
            </div>
            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid var(--border-color);">
                <h3 style="color: white; font-size: 1.1rem; margin-bottom: 15px;">¿Qué puedes hacer en Discusiones?</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; text-align: left;">
                    <div>
                        <div style="color: var(--primary-color); font-weight: 600; margin-bottom: 5px;">💡 Compartir Ideas</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">Propón nuevas funcionalidades o mejoras</div>
                    </div>
                    <div>
                        <div style="color: var(--primary-color); font-weight: 600; margin-bottom: 5px;">❓ Hacer Preguntas</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">Obtén ayuda de la comunidad</div>
                    </div>
                    <div>
                        <div style="color: var(--primary-color); font-weight: 600; margin-bottom: 5px;">🤝 Colaborar</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">Participa en conversaciones técnicas</div>
                    </div>
                    <div>
                        <div style="color: var(--primary-color); font-weight: 600; margin-bottom: 5px;">📢 Mantenerte Informado</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">Sigue anuncios y actualizaciones</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    feather.replace();
}

// Show error message
function showError(message) {
    const container = document.getElementById('discussionsList');
    container.innerHTML = `
        <div class="error-message">
            <i data-feather="alert-triangle"></i>
            <p>${message}</p>
            <a href="https://github.com/OsintDeck/OsintDeck/discussions" target="_blank" style="color: var(--primary-color); text-decoration: underline; margin-top: 10px; display: inline-block;">
                Ver discusiones en GitHub
            </a>
        </div>
    `;
    feather.replace();
}

// Initialize
fetchDiscussions();
