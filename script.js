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
    let mapInstance = null;  // Rinominiamo per chiarezza
    
    const initMap = () => {
        mapInstance = L.map('map').setView([40.8522, 14.2681], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    };

    return { // <-- Questo è l'oggetto restituito
        init: initMap,
        map: () => mapInstance // Esponi tramite funzione
    };
})();
const chatManager = (() => {
    let botuiInstance;
    const FAQ = {
        'orari': 'Gli orari di raccolta sono dalle 6:00 alle 22:00 tutti i giorni.',
        'riciclo': 'Puoi conferire plastica, vetro, carta e umido nei rispettivi contenitori',
        'segnalazione': 'Per segnalare un cestino pieno, invia la posizione tramite la mappa',
        'pass': 'Il Pass Riciclo si richiede online su napoliricicla.it o presso gli uffici comunali'
    };

    const initChat = () => {
        botuiInstance = new BotUI('botui-app');
        showWelcomeMessage();
    };

    const showWelcomeMessage = async () => {
        await botuiInstance.message.add({
            content: '👋 Ciao! Sono EcoBot, l\'assistente virtuale per la raccolta rifiuti.',
            delay: 800
        });

        await showMainOptions();
    };

    const showMainOptions = async () => {
        await botuiInstance.action.button({
            action: [
                { text: 'Orari raccolta', value: 'orari' },
                { text: 'Dove conferire', value: 'riciclo' },
                { text: 'Segnalazioni', value: 'segnalazione' },
                { text: 'Pass Riciclo', value: 'pass' }
            ]
        }).then(handleMainChoice);
    };

    const handleMainChoice = async (res) => {
        await botuiInstance.message.add({
            content: FAQ[res.value],
            delay: 600
        });

        await botuiInstance.action.button({
            action: [
                { text: 'Altra domanda', value: 'continue' },
                { text: 'Chiudi chat', value: 'exit' }
            ]
        }).then(handleFollowUp);
    };

    const handleFollowUp = async (res) => {
        if (res.value === 'continue') {
            await showMainOptions();
        } else {
            await botuiInstance.message.add({
                content: 'Arrivederci! 😊',
                delay: 300
            });
            document.querySelector('.main-nav').classList.remove('chat-active');
        }
    };

    const handleFreeText = async (text) => {
        const match = Object.keys(FAQ).find(key => 
            text.toLowerCase().includes(key)
        );

        if (match) {
            await botuiInstance.message.add({
                content: FAQ[match],
                delay: 600
            });
        } else {
            await botuiInstance.message.add({
                content: 'Mi dispiace, posso aiutarti con:',
                delay: 400
            });
            await showMainOptions();
        }
    };

    return {
        start: () => {
            document.querySelector('.main-nav').classList.add('chat-active');
            initChat();
        },
        handleFreeText
    };
})();

//chat with user
const startChat = () => {
    chatManager.start();
    
    // Abilita input testuale alternativo
    const inputField = document.querySelector('.botui-actions-text-input');
    inputField.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const text = e.target.value;
            await chatManager.handleFreeText(text);
            e.target.value = '';
        }
    });
};
// Inizializzazione generale
document.addEventListener('DOMContentLoaded', () => {
    navManager.init();
    mapManager.init();

    // Geolocalizzazione
    navigator.geolocation.getCurrentPosition(pos => {
        L.marker([pos.coords.latitude, pos.coords.longitude])
            .addTo(mapManager.getMap())
            .bindPopup('La tua posizione')
            .openPopup();
    }, err => {
        console.error('Errore geolocalizzazione:', err);
         iziToast.warning({ 
            title: 'Attenzione',
            message: 'Abilita la geolocalizzazione per vedere la tua posizione' 
        });
    });
});
