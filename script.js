// Gestion de la sidebar responsive
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Fonction pour ouvrir la sidebar
function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêche le scroll du body
}

// Fonction pour fermer la sidebar
function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Réactive le scroll
}

// Toggle sidebar au clic sur le bouton menu
menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

// Fermer la sidebar au clic sur l'overlay
sidebarOverlay.addEventListener('click', closeSidebar);

// Fermer la sidebar lors du redimensionnement vers desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});
