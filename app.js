/**
 * DATABASE PREDEFINITO (Puoi inserire o modificare i dati direttamente qui)
 */
const DATABASE_INIZIALE = [
    { id: 1, nome: "Marco", cognome: "Rossi", classe: "4A INFO", azienda: "Tech Solutions Srl", tutor: "Ing. Bianchi", oreSvolte: 45, oreTotali: 90, stato: "In corso" },
    { id: 2, nome: "Giulia", cognome: "Verdi", classe: "4A INFO", azienda: "Web Design Lab", tutor: "Sara Neri", oreSvolte: 90, oreTotali: 90, stato: "Completato" },
    { id: 3, nome: "Luca", cognome: "Ferrari", classe: "5B MEC", azienda: "Meccanica Avanzata SpA", tutor: "Roberto Romano", oreSvolte: 120, oreTotali: 150, stato: "In corso" },
    { id: 4, nome: "Sofia", cognome: "Esposito", classe: "4B CAT", azienda: "Studio Tecnico Geometri", tutor: "Geom. Viola", oreSvolte: 0, oreTotali: 80, stato: "In attesa" },
    { id: 5, nome: "Alessandro", cognome: "Romano", classe: "5A INFO", azienda: "Cloud Systems", tutor: "Marco Gialli", oreSvolte: 60, oreTotali: 90, stato: "In corso" }
];

// Carica il database da LocalStorage o usa quello iniziale
let database = JSON.parse(localStorage.getItem('pcto_students_db')) || DATABASE_INIZIALE;

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    salvaNelStorage();
    popolaFiltroClassi();
    renderizzatable();
    aggiornaStatistiche();
});

// Salvataggio nel LocalStorage
function salvaNelStorage() {
    localStorage.setItem('pcto_students_db', JSON.stringify(database));
}

// Popola il menu a tendina delle classi dinamicamente
function popolaFiltroClassi() {
    const filterClasse = document.getElementById('filterClasse');
    const valoreSelezionato = filterClasse.value;
    const classi = [...new Set(database.map(s => s.classe))].sort();

    filterClasse.innerHTML = '<option value="all">Tutte le classi</option>';
    classi.forEach(cls => {
        filterClasse.innerHTML += `<option value="${cls}">${cls}</option>`;
    });
    filterClasse.value = valoreSelezionato;
}

// Renderizza la tabella degli studenti
function renderizzatable() {
    const tbody = document.getElementById('studentiTableBody');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const classeVal = document.getElementById('filterClasse').value;
    const statoVal = document.getElementById('filterStato').value;
    const nessunRisultato = document.getElementById('nessunRisultato');

    tbody.innerHTML = '';

    const filtrati = database.filter(s => {
        const matchesSearch = s.nome.toLowerCase().includes(searchVal) || 
                              s.cognome.toLowerCase().includes(searchVal) || 
                              s.azienda.toLowerCase().includes(searchVal);
        const matchesClasse = classeVal === 'all' || s.classe === classeVal;
        const matchesStato = statoVal === 'all' || s.stato === statoVal;
        return matchesSearch && matchesClasse && matchesStato;
    });

    if (filtrati.length === 0) {
        nessunRisultato.classList.remove('hidden');
    } else {
        nessunRisultato.classList.add('hidden');
    }

    filtrati.forEach(s => {
        const perc = Math.min(100, Math.round((s.oreSvolte / s.oreTotali) * 100)) || 0;
        
        let statusBadge = '';
        if(s.stato === 'Completato') {
            statusBadge = `<span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200"><i class="fa-solid fa-check text-xs mr-1"></i>Completato</span>`;
        } else if(s.stato === 'In corso') {
            statusBadge = `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200"><i class="fa-solid fa-spinner text-xs mr-1 animate-spin"></i>In corso</span>`;
        } else {
            statusBadge = `<span class="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200"><i class="fa-solid fa-clock text-xs mr-1"></i>In attesa</span>`;
        }

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
        tr.innerHTML = `
            <td class="p-4 font-semibold text-slate-800">
                ${s.cognome} ${s.nome}
            </td>
            <td class="p-4 text-slate-600">
                <span class="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded border border-slate-200">${s.classe}</span>
            </td>
            <td class="p-4">
                <div class="font-medium text-slate-800">${s.azienda}</div>
                <div class="text-xs text-slate-500">${s.tutor ? 'Tutor: ' + s.tutor : '-'}</div>
            </td>
            <td class="p-4 w-64">
                <div class="flex justify-between items-center mb-1 text-xs">
                    <span class="font-semibold text-slate-700">${s.oreSvolte} / ${s.oreTotali} ore</span>
                    <span class="text-slate-500">${perc}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                    <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" style="width: ${perc}%"></div>
                </div>
                <!-- Pulsanti Aggiunta Rapida Ore -->
                <div class="flex space-x-1">
                    <button onclick="modificaOreRapide(${s.id}, 1)" class="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border">+1h</button>
                    <button onclick="modificaOreRapide(${s.id}, 5)" class="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border">+5h</button>
                    <button onclick="modificaOreRapide(${s.id}, -1)" class="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border">-1h</button>
                </div>
            </td>
            <td class="p-4 text-center">
                ${statusBadge}
            </td>
            <td class="p-4 text-center">
                <div class="flex justify-center space-x-2">
                    <button onclick="apriModaleStudente(${s.id})" class="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded transition" title="Modifica">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="eliminaStudente(${s.id})" class="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition" title="Elimina">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Aggiorna le carte con le statistiche
function aggiornaStatistiche() {
    document.getElementById('statTotale').innerText = database.length;
    document.getElementById('statInCorso').innerText = database.filter(s => s.stato === 'In corso').length;
    document.getElementById('statCompletati').innerText = database.filter(s => s.stato === 'Completato').length;
    
    const oreTotaliSvolte = database.reduce((sum, s) => sum + Number(s.oreSvolte), 0);
    document.getElementById('statOre').innerText = oreTotaliSvolte;
}

// Filtri di ricerca
function applicaFiltri() {
    renderizzatable();
}

// Gestione Form & Modale
function apriModaleStudente(id = null) {
    const modal = document.getElementById('modalStudente');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('formStudente');
    
    form.reset();
    
    if(id) {
        title.innerText = "Modifica Studente";
        const studente = database.find(s => s.id === id);
        if(studente) {
            document.getElementById('studenteId').value = studente.id;
            document.getElementById('nome').value = studente.nome;
            document.getElementById('cognome').value = studente.cognome;
            document.getElementById('classe').value = studente.classe;
            document.getElementById('azienda').value = studente.azienda;
            document.getElementById('tutor').value = studente.tutor || '';
            document.getElementById('oreSvolte').value = studente.oreSvolte;
            document.getElementById('oreTotali').value = studente.oreTotali;
            document.getElementById('stato').value = studente.stato;
        }
    } else {
        title.innerText = "Aggiungi Nuovo Studente";
        document.getElementById('studenteId').value = '';
        document.getElementById('oreSvolte').value = 0;
        document.getElementById('oreTotali').value = 90;
    }
    
    modal.classList.remove('hidden');
}

function chiudiModale() {
    document.getElementById('modalStudente').classList.add('hidden');
}

function salvaStudente(e) {
    e.preventDefault();
    
    const id = document.getElementById('studenteId').value;
    const nome = document.getElementById('nome').value.trim();
    const cognome = document.getElementById('cognome').value.trim();
    const classe = document.getElementById('classe').value.trim().toUpperCase();
    const azienda = document.getElementById('azienda').value.trim();
    const tutor = document.getElementById('tutor').value.trim();
    const oreSvolte = parseInt(document.getElementById('oreSvolte').value) || 0;
    const oreTotali = parseInt(document.getElementById('oreTotali').value) || 1;
    let stato = document.getElementById('stato').value;

    // Aggiornamento automatico dello stato se completato
    if (oreSvolte >= oreTotali && stato !== 'Completato') {
        stato = 'Completato';
    }

    if(id) {
        // Modifica esistente
        const index = database.findIndex(s => s.id == id);
        if(index !== -1) {
            database[index] = { id: parseInt(id), nome, cognome, classe, azienda, tutor, oreSvolte, oreTotali, stato };
        }
    } else {
        // Nuovo inserimento
        const nuovoId = database.length > 0 ? Math.max(...database.map(s => s.id)) + 1 : 1;
        database.push({ id: nuovoId, nome, cognome, classe, azienda, tutor, oreSvolte, oreTotali, stato });
    }

    salvaNelStorage();
    popolaFiltroClassi();
    renderizzatable();
    aggiornaStatistiche();
    chiudiModale();
}

// Azione rapida aumento/diminuzione ore
function modificaOreRapide(id, delta) {
    const studente = database.find(s => s.id === id);
    if(studente) {
        studente.oreSvolte = Math.max(0, studente.oreSvolte + delta);
        if(studente.oreSvolte >= studente.oreTotali) {
            studente.stato = 'Completato';
        }
        salvaNelStorage();
        renderizzatable();
        aggiornaStatistiche();
    }
}

// Eliminazione studente
function eliminaStudente(id) {
    if(confirm("Sei sicuro di voler eliminare questo studente dal registro?")) {
        database = database.filter(s => s.id !== id);
        salvaNelStorage();
        popolaFiltroClassi();
        renderizzatable();
        aggiornaStatistiche();
    }
}

// Importazione & Esportazione JSON
function esportaDati() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(database, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pcto_database_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importaDati(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                database = importedData;
                salvaNelStorage();
                popolaFiltroClassi();
                renderizzatable();
                aggiornaStatistiche();
                alert("Database importato con successo!");
            } else {
                alert("Il file selezionato non contiene un formato database valido.");
            }
        } catch (err) {
            alert("Errore nella lettura del file JSON.");
        }
    };
    reader.readAsText(file);
}

// Reset al database iniziale
function ripristinaDefault() {
    if(confirm("Attenzione: questo ripristinerà il database con i dati di prova originali. Continuare?")) {
        database = [...DATABASE_INIZIALE];
        salvaNelStorage();
        popolaFiltroClassi();
        renderizzatable();
        aggiornaStatistiche();
    }
}