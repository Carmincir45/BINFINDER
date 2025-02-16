// Gestione menu
const navManager = (() => {
    const nav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.nav-overlay');
    const toggle = document.querySelector('.menu-toggle');

    const init = () => {
        toggle.addEventListener('click', () => {
            nav.classList.add('nav-visible');
            overlay.classList.add('nav-overlay-visible');
        });

        overlay.addEventListener('click', closeMenu);
        document.querySelector('.close-nav').addEventListener('click', closeMenu);

        // Gestione servizi
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const service = e.target.getAttribute('href').substring(1);
                openService(service);
                closeMenu();
            });
        });
    };

    const closeMenu = () => {
        nav.classList.remove('nav-visible');
        overlay.classList.remove('nav-overlay-visible');
    };

    const openService = (service) => {
        // Logica per aprire i servizi
        console.log('Apertura servizio:', service);
    };

    return { init };
})();

// Gestione mappa
const mapManager = (() => {
    let map;
    const initMap = () => {
        map = L.map('map').setView([40.8522, 14.2681], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    };

    return {
        init: () => {
            initMap();
            // Altri init mappa...
        }
    };
})();

// Inizializzazione generale
document.addEventListener('DOMContentLoaded', () => {
    navManager.init();
    mapManager.init();

    // Geolocalizzazione
    navigator.geolocation.getCurrentPosition(pos => {
        L.marker([pos.coords.latitude, pos.coords.longitude])
            .addTo(mapManager.map)
            .bindPopup('La tua posizione');
    }, err => {
        console.error('Errore geolocalizzazione:', err);
    });
});