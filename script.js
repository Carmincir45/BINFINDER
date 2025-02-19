// Gestione menu
const navManager = (() => {
    const nav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.nav-overlay');
    const toggle = document.querySelector('.menu-toggle');
    const closeNavButton = document.querySelector('.close-nav');

    const init = () => {
        toggle.addEventListener('click', openMenu);
        closeNavButton.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

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

    const openMenu = () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        toggle.classList.add('hidden'); // Nascondi il bottone menu-toggle
    };

    const closeMenu = () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('hidden');
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
        },
         getMap: () => map
    };
})();

// Inizializzazione generale
document.addEventListener('DOMContentLoaded', () => {
    navManager.init();
    mapManager.init();

     const map = mapManager.getMap(); // Otteniamo la mappa
       if (map) {
        navigator.geolocation.getCurrentPosition(pos => {
            L.marker([pos.coords.latitude, pos.coords.longitude])
                .addTo(map)
                .bindPopup('La tua posizione');
        }, err => {
            console.error('Errore geolocalizzazione:', err);
        });
    } else {
        console.error('La mappa non è stata inizializzata.');
       }
)};
