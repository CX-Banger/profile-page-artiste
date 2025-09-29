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

// Gestion du lecteur audio
const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = playPauseBtn.querySelector('.play-icon');
const pauseIcon = playPauseBtn.querySelector('.pause-icon');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const currentTrackCover = document.getElementById('currentTrackCover');
const progressFill = document.getElementById('progressFill');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');

let isPlaying = false;
let currentProgress = 0;
let progressInterval;

// Données des playlists (simulation)
const playlistData = {
    'YHWH': {
        title: 'YHWH',
        artist: 'Synaï',
        cover: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg',
        duration: '4:32'
    },
    'Freestyle Pour Dieu': {
        title: 'Freestyle Pour Dieu',
        artist: 'Synaï',
        cover: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg',
        duration: '3:45'
    },
    'Zinzin': {
        title: 'Zinzin',
        artist: 'Synaï',
        cover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAAXNSR0IArs4c6QAABVlJREFUeAHtnNdu60gQREfOOcABsN/8/59lwA8OcM7p4hCXCy5h0WytKHJqqwFCpjwz7K6amkyNTk5OvpNNFoE52cgcWIGACRavCCbYBIsjIB6eFWyCxREQD88KNsHiCIiHZwWbYHEExMOzgk2wOALi4VnBJlgcAfHwrGATLI6AeHhWsAkWR0A8PCvYBIsjIB6eFWyCxREQD88KNsHiCIiHZwWbYHEExMOzgk2wOALi4VnBJlgcAfHwrGATLI6AeHhWsAkWR0A8PCvYBIsjIB6eFWyCxREQD88KFid4QTW+hYWFtLa2lpaXl9P8/Hzink/s8/MzfXx8FJ+vr6/p6empuFfEYqT0Q2hzc3Npa2srra+vp6WlpRBfb29v6fHxMd3d3aWvr69Q3iEnllDwaDRK29vbxQXJkxgVgotybm9vi+v7O/8fAcyeYJrhvb29ogmehNh6HirI7u5u2tzcTFdXV0XzXU+T0/1k1X0gEe7s7KTDw8OpkVsNiz6bsnlGzpalgmmS9/f308bGRqfY8xzUvLi4mC4vL1OOTXaWCj44OOic3GrNoSJRoXK07AimyWSUPGuD5Byb66wIZkDVJ8g8Gx9ysmwIpj9ktMxnXzYEH6KxZ0Mw81NGtn0bPuBLLtY/Yi2QYm46KajPz8/FCtXLy8s/y5GQtLKyUvTlq6urLTz4dxJ8yWXFKwuCWX6MrlC9v78XUxuIrRv/47q/vy+IZoTMVait4Qs+3dzctM3SW7osmujoqBnVnp2dpZ/IrSNNGtKSJ2JRnyJlTzPt4AmmOY1sHKDM8/Pz0IYBmwvkIW9bw6chjAl+83fwBEenJaw4TbIbRB7yRizqW6TsaaUdPMHs57Y1mtk2zfK48sgbaaojvo17ZtffD57gcpO+DRAPDw9tkjWmiZQR8a3xoR3+c/Cj6Eg/x+mMccZ0qFxPpikep9SmMuplR3yr553VvZSCOYYzziAXQrhKon9K21RGPX0OCh48wXVQfR9DYPAEc0CurTU1mTTLqJOrabTcVEbdj4hv9byzuh98HwwhbVeZGNWOm8vS556env6KK0uYbS3SnLctc9rppBQ8jRMekRWqHBQ8eIIjo1pGyhEF1tVC3sjmQ8S3+rNmdT94gjmUHjFGyNGNCsonT9Po+icfor79VEbX3w2eYPo5DqW3NfprTkNGSCYtedr29fiCT+6D27LySzreOIgYzezx8XGr5ppmmbSRphlfoj5F/J9m2sGPogmWzXU22SOqRI1HR0fFihXLj/SXpeKYCjHiZlAWJRZ/2JjApxwsC4IBlNdJOKMcNQichMSm5+DLJDtWTWV29b/B98Fl4IBaKrD8ro9PfMCXXCwbgnmrgHeF+ny7YAg+RCtWNgQTGNOSPs9B8ewcpkbVSpAVwTgOyH2MYBmo9Vm5qqRF/s6OYIK7uLiYKclUqKYNigjgs06bJcH0hRySu76+7rRP5jk8g2f12ff/l0qRxTRpXIA0mawoTfMF8PJZjJYVXgDPmmDIYNDDViALIdHFkJLM6mc552YqlKtqq/FkTzDBQARqZnXJP8JSpTclqV/ZqYbGciTnllmS5OwU9+UZqv/TzyhJKLhKbPk3fWgu68Wlz118ZjmK7gII1TJNsCqzf+MywSZYHAHx8KxgEyyOgHh4VrAJFkdAPDwr2ASLIyAenhVsgsUREA/PCjbB4giIh2cFm2BxBMTDs4JNsDgC4uFZwSZYHAHx8KxgEyyOgHh4VrAJFkdAPDwr2ASLIyAenhVsgsUREA/PCjbB4giIh2cFm2BxBMTDs4JNsDgC4uFZwSZYHAHx8KxgEyyOgHh4VrA4wX8AfRTBIQvxo90AAAAASUVORK5CYII=',
        duration: '2:18'
    }
};

// Fonction pour afficher le lecteur
function showPlayer(playlistName) {
    const playlist = playlistData[playlistName];
    if (playlist) {
        currentTrackTitle.textContent = playlist.title;
        currentTrackArtist.textContent = playlist.artist;
        currentTrackCover.src = playlist.cover;
        totalTime.textContent = playlist.duration;
        
        musicPlayer.classList.add('active');
        
        // Ajouter du padding au main-content pour éviter que le lecteur le cache
        document.querySelector('.main-content').style.paddingBottom = '96px';
    }
}

// Fonction pour basculer play/pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        startProgress();
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        stopProgress();
    }
}

// Fonction pour démarrer la progression
function startProgress() {
    progressInterval = setInterval(() => {
        currentProgress += 0.5;
        if (currentProgress >= 100) {
            currentProgress = 0;
            togglePlayPause();
        }
        progressFill.style.width = currentProgress + '%';
        
        // Mise à jour du temps (simulation)
        const minutes = Math.floor((currentProgress * 3.75) / 60);
        const seconds = Math.floor((currentProgress * 3.75) % 60);
        currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 100);
}

// Fonction pour arrêter la progression
function stopProgress() {
    clearInterval(progressInterval);
}

// Event listeners pour les contrôles
playPauseBtn.addEventListener('click', togglePlayPause);

// Event listeners pour les playlists
document.querySelectorAll('.playlist-item').forEach(item => {
    const playOverlay = item.querySelector('.play-overlay');
    const playlistName = item.querySelector('.playlist-info h4').textContent;
    
    playOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        showPlayer(playlistName);
        togglePlayPause();
    });
});

// Gestion de la barre de progression
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    currentProgress = (clickX / width) * 100;
    progressFill.style.width = currentProgress + '%';
    
    // Mise à jour du temps
    const minutes = Math.floor((currentProgress * 3.75) / 60);
    const seconds = Math.floor((currentProgress * 3.75) % 60);
    currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Gestion du volume
document.querySelector('.volume-bar').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const volume = (clickX / width) * 100;
    document.querySelector('.volume-fill').style.width = volume + '%';
});
