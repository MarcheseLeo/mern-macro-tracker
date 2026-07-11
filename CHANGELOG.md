
# Changelog
Tutte le modifiche di rilievo a questo progetto saranno documentate in questo file.

## [1.2.0] - 2026-07-11

### ✨ Features
- **Daily Metrics Tracking (Acqua e Peso):** 
    -  Implementata la nuova UI (DailyMetricsCards) per l'aggiornamento rapido dei litri d'acqua e del peso corporeo direttamente dalla Dashboard.
    -  Sincronizzate le informazioni sull'assunzione di acqua all'interno della vista mensile del Calendario.
- **Gestione Avanzata Pasti:** 
    -  Aggiunta la funzionalità di modifica (Update) per variare le quantità di un alimento già registrato all'interno di un pasto, completando le operazioni CRUD sulla singola riga.

### 🎨 UX/UI Improvements
- **Ottimizzazione Skeleton Loading:** 
    - Implementato un sistema di "debounced loading" (caricamento ritardato) per lo skeleton della Dashboard: ora appare solo se le chiamate API richiedono tempo, prevenendo sfarfallii (flickering) fastidiosi sulle connessioni veloci.
    - Aggiornata la griglia dello skeleton per riflettere le nuove metriche giornaliere.
- **Interattività e Layout:** 
    - Reso "draggabile" lo scorrimento delle Category Pills della ricerca alimenti su schermi desktop, nascondendo la scrollbar di sistema.
    - Migliorato il layout responsive dell'Header e del Calendario per una resa ottimale su dispositivi mobile.
    - Rinnovato lo stile della tabella dei dettagli nutrizionali (FoodDetailsView) per una maggiore gerarchia visiva e leggibilità.

### 🛠️ Backend & Architecture
- **Refactoring Architetturale (Modulo Dashboard):** 
    - Creato un modulo Dashboard dedicato. Spostata e ottimizzata la logica della funzione getDailySummary per agire come aggregatore di dati (Pasti, Metriche, Utente), separando le responsabilità.
- **Gestione Sicura delle Sessioni (Axios):** 
    - Configurato un Response Interceptor globale in Axios. Se una richiesta API restituisce un errore 401 Unauthorized (es. token scaduto), l'app forza automaticamente il logout e reindirizza al login, migliorando la sicurezza.
- **Integrità dei Dati:** 
    - Aggiornata la logica di eliminazione dell'utente per includere la cancellazione a cascata (cascade delete) dei documenti DailyMetrics associati.

### 🐛 Bug Fixes
- **Disallineamento Fuso Orario (Timezone):** 
    - Risolto un bug critico che sfalsava la data della Dashboard di alcune ore. La logica utilizza ora l'ora locale del client (getFullYear(), getDate()) invece dello standard globale UTC (toISOString()).
- **Conflitti di Layout Flexbox:** 
    - Corretta la sovrapposizione visiva (z-index/overflow) tra la lista dei risultati di ricerca e le Category Pills nell'AddFoodSheet, applicando le corrette proprietà

## [1.1.0] - 2026-07-08

### ✨ Features
- **Sezione Scan Barcode:** 
    -  Ricerca veloce alimento con Barcode.
    -  Importazione automatica  da *OpenFoodFacts*.

## [1.0.0] - 2026-07-07

### ✨ Features
- **Autenticazione completa:** 
    -  Login/registrazione nativa con verifica email tramite SendGrid.
    -  Accesso rapido con Google OAuth2.
- **Dashboard Nutrizionale:**
    - View principale per tracciare calorie e macro (Proteine, Carboidrati, Grassi) suddivisi in 4 pasti.
- **Calendario Progressi:** 
    - Visualizzazione mensile con indicazione a colori (verde, giallo, rosso) dello stato di raggiungimento dell'obiettivo calorico giornaliero.
    - Percentuale settimanale progesso.
- **Sistema di Streak:** Meccanismo di gamification per contare i giorni consecutivi di tracking attivo.
- **Gestione Profilo:** Upload dell'immagine del profilo tramite Cloudinary e aggiornamento del peso, obiettivi macro e password.
- **Skeleton Loaders:** Inseriti caricamenti asincroni animati per migliorare l'esperienza utente nelle chiamate API lente.
