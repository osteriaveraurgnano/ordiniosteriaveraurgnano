// ==========================================
// 1. SISTEMA DI SICUREZZA (WHITELIST + OTP)
// ==========================================
const emailAutorizzate = [
   "matteopalmie06@gmail.com",
    "moni.palmi22@gmail.com"
];

let otpAttuale = ""; // Variabile per salvare il codice generato
let utenteInAttesa = ""; // Salva chi sta cercando di entrare

async function tentaLogin() {
    const inputEmail = document.getElementById('email-input').value.toLowerCase().trim();
    const errorMsg = document.getElementById('login-error');

    if (emailAutorizzate.includes(inputEmail)) {
        errorMsg.style.display = "none";
        utenteInAttesa = inputEmail.split('@')[0]; 
        
        // Genera codice OTP
        otpAttuale = Math.floor(100000 + Math.random() * 900000).toString();
        
        try {
            // Invio email reale tramite EmailJS
            await emailjs.send("service_f1fl51h", "template_tnfs2ga", {
                otp_code: otpAttuale,
                to_email: "osteriaveraurgnano@gmail.com"
            });
            
            alert("Codice inviato all'email dell'osteria!");
        } catch (error) {
            console.error("Errore invio email (controlla la Public Key EmailJS in index.html e il Service/Template ID qui sopra):", error);
            alert("Errore invio email. Codice di emergenza: " + otpAttuale);
        }
        
        document.getElementById('login-screen').style.display = "none";
        document.getElementById('otp-screen').style.display = "flex";
        document.getElementById('otp-input').value = "";
    } else {
        errorMsg.style.display = "block";
    }
}

function verificaOTP() {
    const inputOtp = document.getElementById('otp-input').value.trim();
    const errorOtp = document.getElementById('otp-error');

    if (inputOtp === otpAttuale) {
        // --- NUOVO: Salva il dispositivo come autorizzato ---
        localStorage.setItem("dispositivoAutorizzato", "si");
        
        errorOtp.style.display = "none";
        document.getElementById('otp-screen').style.display = "none";
        document.getElementById('app-screen').style.display = "flex";
        
        document.getElementById('logged-user').innerText = utenteInAttesa;
        caricaCategoria('Panuozzi');
    } else {
        errorOtp.style.display = "block";
    }
}

function tornaAlLogin() {
    document.getElementById('otp-screen').style.display = "none";
    document.getElementById('login-screen').style.display = "flex";
    otpAttuale = "";
    utenteInAttesa = "";
}

function logout() {
    localStorage.removeItem("dispositivoAutorizzato");
    document.getElementById('email-input').value = "";
    document.getElementById('table-select').value = "0";
    carrello = [];
    aggiornaUI();
    document.getElementById('app-screen').style.display = "none";
    document.getElementById('login-screen').style.display = "flex";
    otpAttuale = "";
}

// ==========================================
// 2. DATABASE DEL MENU 
// ==========================================
// Il database locale dei piatti per l'app dei camerieri
const menuOsteria = {
    'Drink': [
        "Formula Aperitivo", // Questa aggiungerà 4€ in cassa
        "Spritz (Aperol / Campari / Select)",
        "Hugo",
        "Afragòla",
        "Passoa Aperol",
        "Enzoni",
        "Negroni",
        "Negroni Sbagliato",
        "Limoncello Tonic",
        "Mirto Tonic",
        "Basilicolo",
        "Gin Tonic",
        "Turista - Alcool free",
        "Whitley Neill Violet",
        "Malfy Gin Collection",
        "Roku Gin",
        "Nordés Gin",
        "Gin Mare"
    ],
    'Antipasti': [
        "Antipasto della casa",
        "Provola in Purgatorio",
        "Tagliere di Formaggi",
        "Tagliere di Salumi",
        "Frittelle",
        "Patatine Fritte"
    ],
    'Panuozzi': [
        "Vico",
        "Arola",
        "Fornacelle",
        "Moiano",
        "Montechiaro",
        "Seiano",
        "Ticciano",
        "Massaquano"
    ],
    'Cucina': [
        "Gnocchi alla Sorrentina",
        "fusilli alla Genovese",
        "Trofie tricolore",
        "Polpette al Sugo",
        "Parmigiana di Melanzane",
        "Caprese"
    ],
    'ViniCalice': [
        "Sauvignon Collio DOC - Villa Folini (Calice)",
        "Garda Classico Chiaretto - Cà Maiol (Calice)",
        "Chianti Superiore DOCG - Banfi (Calice)"
    ],
    'ViniBottiglia': [
        "Sauvignon Collio DOC - Villa Folini (Bottiglia)",
        "Garda Classico Chiaretto - Cà Maiol (Bottiglia)",
        "Chianti Superiore DOCG - Banfi (Bottiglia)",
        "Lugana DOC - BERTANI",
        "Ribolla Gialla COF DOC - Sirch",
        "Fiano di Avellino - Mastroberardino",
        "Montepulciano d'Abruzzo Riserva DOC - Terre degli Eremi",
        "Primitivo di Manduria DOC - Soloperto",
        "Barolo DOCG - Il Pozzo",
        "Prosecco Valdobbiadene Superiore - Val D'Oca"
    ],
    'BirreSpina': [
        "Ama Pils (Piccola)",
        "Ama Pils (Media)",
        "Diabolici Red (Piccola)",
        "Diabolici Red (Media)",
        "Adnams Innovation (Piccola)",
        "Adnams Innovation (Media)"
    ],
    'BirreBottiglia': [
        "Lupulus Blonde (33cl)",
        "Rochefort 8º (33cl)",
        "William's Joker I.P.A (50cl)",
        "William's Joker I.P.A Alcol Free (44cl)",
        "William's Talking Head A.P.ALE (50cl)"
    ],
    'Dolci': [
        "Pastiera",
        "Cremoso alla nocciola",
        "sorbetto al limone"
    ],
    'Caffetteria': [
        "Acqua Naturale / Frizzante (0,5L)",
        "Coca Cola / Coca Cola Zero",
        "Sprite",
        "Estathé (Limone / Pesca)",
        "crodino",
        "campari soda",
        "Caffè Espresso",
        "Caffè Macchiato",
        "Caffè Corretto",
        "Caffè Decaffeinato",
        "Caffè al Ginseng",
        "Limoncello",
        "Mirto",
        "Meloncello",
        "Amari",
        "Acquavite Nardini Bianca",
        "Grappa Sibona Moscato",
        "Grappa Diciotto Lune",
        "Grappa Monpra"
    ]
};

// ==========================================
// 3. LOGICA DI INTERFACCIA E CARRELLO
// ==========================================
let carrello = [];

// Inizializza l'interfaccia all'avvio
window.onload = () => {
    if (localStorage.getItem("dispositivoAutorizzato") === "si") {
        document.getElementById('login-screen').style.display = "none";
        document.getElementById('app-screen').style.display = "flex";
    }
    generaCategorieLaterali();
    caricaCategoria('Panuozzi'); // Carica subito i panuozzi di default
};

// Funzione 1: Costruisce SOLO i bottoni colorati a sinistra
function generaCategorieLaterali() {
    const catContainer = document.getElementById('cat-container');
    catContainer.innerHTML = ''; 

    const nomiEstetici = {
        'Drink': '🍹 Drink & Aperitivi',
        'Antipasti': '🧀 Antipasti',
        'Panuozzi': '🥪 Panuozzi',
        'Cucina': '🍝 Cucina',
        'ViniCalice': '🍷 Vini (Calice)',
        'ViniBottiglia': '🍾 Vini (Bottiglia)',
        'BirreSpina': '🍺 Birre (Spina)',
        'BirreBottiglia': '🍻 Birre (Bottiglia)',
        'Dolci': '🍰 Dolci',
        'Caffetteria': '☕ Bar & Liquori'
    };

    for (let nomeCategoria in menuOsteria) {
        let btn = document.createElement('button');
        btn.className = 'category-btn'; 
        btn.innerText = nomiEstetici[nomeCategoria] || nomeCategoria; 
        
        btn.onclick = () => caricaCategoria(nomeCategoria);
        catContainer.appendChild(btn);
    }
}

function caricaCategoria(nomeCategoria) {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = ''; 

    let piattiDaMostrare = menuOsteria[nomeCategoria];

    piattiDaMostrare.forEach(piatto => {
        let itemRow = document.createElement('div');
        itemRow.style.display = "flex";
        itemRow.style.justifyContent = "space-between";
        itemRow.style.alignItems = "center";
        itemRow.style.background = "white";
        itemRow.style.padding = "15px";
        itemRow.style.marginBottom = "8px";
        itemRow.style.borderRadius = "8px";
        itemRow.style.border = "1px solid #ddd";

        // Nome del piatto che clicchi
        let nomePiatto = document.createElement('div');
        nomePiatto.innerText = piatto;
        nomePiatto.style.fontWeight = "bold";
        nomePiatto.style.flex = "1";
        nomePiatto.onclick = () => aggiungiAlCarrello(piatto, nomePiatto);
        
        itemRow.appendChild(nomePiatto);

        // Bottone Aperitivo (solo se è una bevanda)
        if (['Drink', 'ViniCalice', 'ViniBottiglia', 'BirreSpina', 'BirreBottiglia'].includes(nomeCategoria)) {
            let chk = document.createElement('button');
            chk.innerText = "+4€";
            chk.style.background = "#f0ad4e";
            chk.style.color = "white";
            chk.style.border = "none";
            chk.style.padding = "10px 15px";
            chk.style.borderRadius = "5px";
            chk.style.fontWeight = "bold";
            chk.style.marginLeft = "10px";
            
            chk.onclick = (e) => {
                e.stopPropagation(); 
                aggiungiAlCarrello("Formula Aperitivo", chk);
            };
            itemRow.appendChild(chk);
        }
        
        itemsContainer.appendChild(itemRow);
    });
}

function aggiungiAlCarrello(piatto, elementoHtml) {
    // 1. Calcoliamo la capacità massima di aperitivi attuale
    let capienzaMassima = 0;
    
    // Contiamo le bevande già presenti nel carrello
    carrello.forEach(p => {
        if (menuOsteria['Drink'].includes(p) || 
            menuOsteria['ViniCalice'].includes(p) || 
            menuOsteria['BirreSpina'].includes(p) || 
            menuOsteria['BirreBottiglia'].includes(p)) {
            capienzaMassima += 1; // 1 drink = 1 aperitivo
        } 
        else if (menuOsteria['ViniBottiglia'].includes(p)) {
            capienzaMassima += 6; // 1 bottiglia = 6 aperitivi
        }
    });

    // 2. Controllo stringente per la Formula Aperitivo
    if (piatto === "Formula Aperitivo") {
        let conteggioAperitiviPresenti = carrello.filter(p => p === "Formula Aperitivo").length;

        if (conteggioAperitiviPresenti >= capienzaMassima) {
            alert("⚠️ Capacità raggiunta: aggiungi una bottiglia o un altro drink per altre formule aperitivo!");
            return; // Blocca l'aggiunta se non c'è capienza
        }
    }

    // 3. Se il controllo passa, procedi con l'aggiunta
    carrello.push(piatto);
    aggiornaUI();
    
    // Feedback visivo
    if (elementoHtml) { // Controlliamo che l'elemento esista
        let coloreOriginale = elementoHtml.style.backgroundColor;
        let testoOriginale = elementoHtml.style.color;
        elementoHtml.style.backgroundColor = "var(--success)";
        elementoHtml.style.color = "white";
        setTimeout(() => { 
            elementoHtml.style.backgroundColor = coloreOriginale; 
            elementoHtml.style.color = testoOriginale; 
        }, 150);
    }
}

function aggiornaUI() {
    document.getElementById('cart-count').innerText = carrello.length;
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = "";
    
    let conteggi = {};
    carrello.forEach(piatto => {
        conteggi[piatto] = (conteggi[piatto] || 0) + 1;
    });

    Object.keys(conteggi).forEach(piatto => {
        let div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span><b style="color:var(--blu-elegante);">${conteggi[piatto]}x</b> ${piatto}</span>`;
        cartList.appendChild(div);
    });
}

function apriCarrello() { document.getElementById('cart-modal').style.display = "flex"; }
function chiudiCarrello() { document.getElementById('cart-modal').style.display = "none"; }

async function inviaOrdine() {
    let sala = document.getElementById('sala-select').value;
    let tavolo = document.getElementById('table-select').value;
    
    if(sala === "0" || tavolo === "0") {
        alert("ATTENZIONE: Seleziona SALA e TAVOLO!");
        return;
    }
    if(carrello.length === 0) return alert("Comanda vuota.");

    try {
        let conteggiNuovi = {}; // Totale per lo scontrino in cassa
        let nuoviCucina = {};   // Coda per il monitor cucina
        let nuoviBar = {};      // Coda per il monitor bar

        // SMISTAMENTO INTELLIGENTE
        carrello.forEach(piatto => {
            conteggiNuovi[piatto] = (conteggiNuovi[piatto] || 0) + 1;
            
            let vaInCucina = false;
            let vaAlBar = false;

            if (piatto === "Formula Aperitivo") {
                // Eccezione: L'aperitivo (il cibo) va solo in cucina
                vaInCucina = true; 
            } 
            else if (menuOsteria['Dolci'].includes(piatto)) {
                // I dolci stampano il ticket su entrambi i monitor
                vaInCucina = true;
                vaAlBar = true; 
            } 
            else if (
                menuOsteria['Antipasti'].includes(piatto) ||
                menuOsteria['Panuozzi'].includes(piatto) ||
                menuOsteria['Cucina'].includes(piatto)
            ) {
                // Il cibo classico va solo in cucina
                vaInCucina = true; 
            } 
            else {
                // Tutto il resto del menu (Vini, Birre, Drink, Caffetteria) va al bar
                vaAlBar = true; 
            }

            // Aggiungiamo i piatti nelle rispettive liste in base a dove devono andare
            if (vaInCucina) nuoviCucina[piatto] = (nuoviCucina[piatto] || 0) + 1;
            if (vaAlBar) nuoviBar[piatto] = (nuoviBar[piatto] || 0) + 1;
        });

        // 1. Cerca se esiste un ordine non pagato per questa Sala e questo Tavolo
        const q = window.query(
            window.collezione(window.dbOsteria, "comande"),
            window.where("sala", "==", sala),
            window.where("tavolo", "==", parseInt(tavolo)),
            window.where("pagato", "==", false)
        );
        const querySnapshot = await window.ottieniDocumenti(q);

        if (!querySnapshot.empty) {
            // ORDINE TROVATO: Aggreghiamo i nuovi piatti a quelli vecchi
            const docEsistente = querySnapshot.docs[0];
            const dati = docEsistente.data();
            
            let piattiAggiornati = { ...dati.piatti };
            let cucinaAggiornata = dati.da_fare_cucina || {};
            let barAggiornato = dati.da_fare_bar || {};

            // Aggiorniamo il totale scontrino per la Cassa
            for (let [piatto, qty] of Object.entries(conteggiNuovi)) {
                piattiAggiornati[piatto] = (piattiAggiornati[piatto] || 0) + qty; 
            }
            // Aggiorniamo i monitor aggiungendo solo i piatti corretti
            for (let [piatto, qty] of Object.entries(nuoviCucina)) {
                cucinaAggiornata[piatto] = (cucinaAggiornata[piatto] || 0) + qty;
            }
            for (let [piatto, qty] of Object.entries(nuoviBar)) {
                barAggiornato[piatto] = (barAggiornato[piatto] || 0) + qty;
            }

            await window.aggiornaDocumento(window.riferimentoDocumento(window.dbOsteria, "comande", docEsistente.id), {
                piatti: piattiAggiornati,
                da_fare_cucina: cucinaAggiornata,
                da_fare_bar: barAggiornato
            });
            alert("🔄 Aggiunta al Tavolo " + tavolo + " inviata ai monitor!");
        } else {
            // NESSUN ORDINE: Ne creiamo uno nuovo, con le tre liste già smistate
            await window.aggiungiDocumento(window.collezione(window.dbOsteria, "comande"), {
                sala: sala,
                tavolo: parseInt(tavolo),
                cameriere: document.getElementById('logged-user').innerText,
                piatti: conteggiNuovi,
                da_fare_cucina: nuoviCucina,
                da_fare_bar: nuoviBar,
                pagato: false,
                orario: new Date().toISOString()
            });
            alert("✅ Nuovo ordine: Tavolo " + tavolo);
        }
        
        // Reset interfaccia
        carrello = []; aggiornaUI(); chiudiCarrello();
        document.getElementById('table-select').value = "0";

    } catch (errore) {
        console.error(errore);
        alert("Errore di connessione. Ordine NON inviato.");
    }
}
