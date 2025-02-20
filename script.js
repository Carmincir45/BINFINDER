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
          if (service === 'assistenza') {
            startChat();
        }
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
//Start chat with user
const startChat = () => {
    var botui = new BotUI('botui-app');

    const getResponse = () => {
        botui.message.add({
            content: 'Ciao! Come posso aiutarti oggi?'
        }).then(function () {
            return botui.action.text({
                action: {
                    placeholder: 'Scrivi il tuo messaggio qui...'
                }
            });
        }).then(function (res) {
            // Logica per risposte predefinite
            var risposta;
            switch (res.value.toLowerCase()) {
                case 'ciao':
                    risposta = 'Ciao! Come posso aiutarti?';
                    break;
                case 'problema':
                    risposta = 'Mi dispiace che tu stia riscontrando un problema. Potresti descriverlo in dettaglio?';
                    break;
                case 'grazie':
                    risposta = 'Prego! Se hai altre domande, chiedi pure.';
                    break;
                default:
                    risposta = 'Mi dispiace, non ho capito. Puoi ripetere?';
            }

            return botui.message.add({
                content: risposta
            });
        }).then(getResponse);
    };

    getResponse();
};
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
