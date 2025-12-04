// Acknowledgments Data
const AUTHORITIES = [
    { name: "Adriana López", role: "Rectora", linkedin: "https://www.linkedin.com/in/adriana-l%C3%B3pez-0a2b3c4d/" },
    {
        name: "Alejandro Agustín De Angelis",
        role: "Director del Departamento de Ciencias Ambientales y Aplicadas",
        linkedin: "https://www.linkedin.com/in/alejandro-agust%C3%ADn-de-angelis-5e6f7g8h/"
    },
    {
        name: "Pablo Lázaro",
        role: "Director de la Licenciatura en Ciberseguridad",
        linkedin: "https://www.linkedin.com/in/pablo-l%C3%A1zaro-9i0j1k2l/"
    }
];

const PROFESSORS = [
    { name: "Rubén Darío Aybar", role: "Seguimiento del proyecto", linkedin: "https://www.linkedin.com/in/rub%C3%A9n-dar%C3%ADo-aybar-3m4n5o6p/" },
    { name: "Ernesto Ludovisi", linkedin: "https://www.linkedin.com/in/ernesto-ludovisi-7q8r9s0t/" },
    { name: "Maximiliano Scarimbolo", linkedin: "https://www.linkedin.com/in/maximiliano-scarimbolo-1u2v3w4x/" },
    { name: "Maximiliano Méndez", linkedin: "https://www.linkedin.com/in/maximiliano-m%C3%A9ndez-5y6z7a8b/" },
    { name: "Verónica Lourdes Tomich", linkedin: "https://www.linkedin.com/in/ver%C3%B3nica-lourdes-tomich-9c0d1e2f/" },
    { name: "Nahuel Leandro Sagardoy Bornetto", linkedin: "https://www.linkedin.com/in/nahuel-leandro-sagardoy-bornetto-3g4h5i6j/" },
    { name: "Jorge Martín Vila", linkedin: "https://www.linkedin.com/in/jorge-mart%C3%ADn-vila-7k8l9m0n/" },
    { name: "Pablo Gris Muniagurria", linkedin: "https://www.linkedin.com/in/pablo-gris-muniagurria-1o2p3q4r/" },
    { name: "Williams Alfaro", linkedin: "https://www.linkedin.com/in/williams-alfaro-5s6t7u8v/" },
    { name: "Adrian Eduardo Acosta", linkedin: "https://www.linkedin.com/in/adrian-eduardo-acosta-9w0x1y2z/" },
    { name: "Rodrigo Cárdenas Holik", linkedin: "https://www.linkedin.com/in/rodrigo-c%C3%A1rdenas-holik-3a4b5c6d/" },
    { name: "Leila Anais Nan", linkedin: "https://www.linkedin.com/in/leila-anais-nan-7e8f9g0h/" },
    { name: "Gustavo Adrián Calvache", linkedin: "https://www.linkedin.com/in/gustavo-adri%C3%A1n-calvache-1i2j3k4l/" },
    { name: "Daniel Calvache", linkedin: "https://www.linkedin.com/in/daniel-calvache-5m6n7o8p/" },
    { name: "Eduardo Winkler", linkedin: "https://www.linkedin.com/in/eduardo-winkler-9q0r1s2t/" },
    { name: "Mariano Jacquet", linkedin: "https://www.linkedin.com/in/mariano-jacquet-3u4v5w6x/" },
    { name: "Rodrigo López Lio", linkedin: "https://www.linkedin.com/in/rodrigo-l%C3%B3pez-lio-7y8z9a0b/" },
    { name: "Santiago González Bellengeri", linkedin: "https://www.linkedin.com/in/santiago-gonz%C3%A1lez-bellengeri-1c2d3e4f/" },
    { name: "Antonio Javier Maza", linkedin: "https://www.linkedin.com/in/antonio-javier-maza-5g6h7i8j/" },
    { name: "Mara Misto Macias", linkedin: "https://www.linkedin.com/in/mara-misto-macias-9k0l1m2n/" },
    { name: "Sergio Arribá", linkedin: "https://www.linkedin.com/in/sergio-arrib%C3%A1-0532ba274/" },
    { name: "Fabián Alejandro Muñoz", linkedin: "https://www.linkedin.com/in/fabimu%C3%B1oz/" },
    { name: "Marco Antonio Villan", linkedin: "https://www.linkedin.com/in/marcoavillan/" },
    { name: "Olga Cavalli", linkedin: "https://www.linkedin.com/in/olgacavalli/" },
    { name: "Juan José Benítez", linkedin: "https://www.linkedin.com/in/juan-jose-benitez-203a1b23/" }
];

// Genera URL de avatar
function createAvatarUrl(name, size = 80) {
    const encodedName = encodeURIComponent(name);
    return `https://avatar.vercel.sh/${encodedName}?size=${size}`;
}

// Crea una card
function createCard(person, isAuthority = false) {
    const card = document.createElement("div");
    card.className = "acknowledgment-card";

    const avatar = document.createElement("img");
    avatar.src = createAvatarUrl(person.name, isAuthority ? 96 : 80);
    avatar.alt = person.name;
    avatar.loading = "lazy";
    avatar.className = "acknowledgment-avatar";
    card.appendChild(avatar);

    const meta = document.createElement("div");
    meta.className = "acknowledgment-meta";

    const header = document.createElement("div");
    header.className = "acknowledgment-header";

    const name = document.createElement("h4");
    name.className = "acknowledgment-name";
    name.textContent = person.name;
    header.appendChild(name);

    if (person.linkedin) {
        const linkedinLink = document.createElement("a");
        linkedinLink.href = person.linkedin;
        linkedinLink.target = "_blank";
        linkedinLink.rel = "noopener noreferrer";
        linkedinLink.className = "linkedin-icon";
        linkedinLink.title = "Ver perfil en LinkedIn";
        linkedinLink.innerHTML = '<i data-feather="linkedin"></i>';
        header.appendChild(linkedinLink);
    }

    meta.appendChild(header);

    if (person.role) {
        const role = document.createElement("p");
        role.className = "acknowledgment-role";
        role.textContent = person.role;
        meta.appendChild(role);
    }

    card.appendChild(meta);
    return card;
}

// Render
function renderAcknowledgments() {
    const authoritiesGrid = document.getElementById("authorities-grid");
    const professorsGrid = document.getElementById("professors-grid");

    if (!authoritiesGrid || !professorsGrid) return;

    authoritiesGrid.innerHTML = "";
    professorsGrid.innerHTML = "";

    // Autoridades (sin ordenar, o podés ordenarlas igual si querés)
    AUTHORITIES.forEach(person => {
        authoritiesGrid.appendChild(createCard(person, true));
    });

    // Profesores ordenados alfabéticamente por nombre
    const sortedProfessors = [...PROFESSORS].sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    sortedProfessors.forEach(person => {
        professorsGrid.appendChild(createCard(person, false));
    });

    setTimeout(() => {
        if (window.feather) {
            feather.replace();
        }
    }, 50);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAcknowledgments);
} else {
    renderAcknowledgments();
}
