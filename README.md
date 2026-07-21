# Macro 🍏

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node-dot-js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

**MacroMuse** è un'applicazione web Full Stack progettata per rendere il tracciamento dei macronutrienti, delle calorie e delle abitudini giornaliere semplice, veloce e intuitivo.

## ✨ Funzionalità Principali

* **Autenticazione Sicura:** Login tradizionale con Email/Password (criptata con bcrypt e protetta da JWT) o tramite **Google OAuth2.0**.
* **Dashboard Interattiva (BFF):** Riepilogo giornaliero intelligente con caricamento asincrono (debounced skeleton loaders). Traccia calorie, macronutrienti, e sincronizza i dati da molteplici moduli.
* **Diario Alimentare Completo (CRUD):** Ricerca, aggiunta, rimozione e **modifica rapida delle quantità** di cibi, organizzati per tipologia di pasto (Colazione, Pranzo, Cena, Snack).
* **Daily Metrics Tracker:** Monitoraggio rapido dell'idratazione (Acqua) tramite UI "click & fill" intuitiva e aggiornamento giornaliero del peso corporeo, tutto in tempo reale.
* **Scanner Barcode:** Integrazione con *OpenFoodFacts* per importare automaticamente i valori nutrizionali tramite la scansione della fotocamera.
* **Calendario Storico:** Visualizzazione mensile rapida delle giornate a target, parziali o mancate, con percentuale settimanale di successo e storico dell'acqua bevuta.
* **Profilo Utente:** Gestione obiettivi, dati personali e upload di Avatar tramite *Cloudinary*.
## 🛠️ Tech Stack

**Frontend:**
* React (con React Router DOM)
* Bootstrap & CSS Personalizzato 
* Lucide React (Icone)
* Axios (con Request/Response Interceptors)
* FormKit Auto-Animate
* HTML5-QRCode (Scanner)

**Backend:**
* Node.js & Express
* MongoDB & Mongoose
* Passport.js (Google Strategy) & JSON Web Tokens
* Express Validator
* Cloudinary & Multer (Gestione immagini)
* SendGrid (Invio Email)

## 📂 Struttura del Progetto

## 📂 Struttura del Progetto

```text
mern-macro-tracker
├─ backend/
│  ├─ config/         # Configurazione DB e variabili d'ambiente
│  ├─ exceptions/     # Gestione centralizzata degli errori custom
│  ├─ middlewares/    # Validatori, Upload Multer, JWT Verification
│  ├─ modules/        # Architettura a Domini (Feature-based):
│  │  ├─ auth/        # Autenticazione (JWT, Login, Registrazione)
│  │  ├─ daily-metrics/# Tracking metriche giornaliere (Peso, Acqua)
│  │  ├─ dashboard/   # Aggregatore dati (BFF Pattern)
│  │  ├─ email/       # Servizio invio comunicazioni (SendGrid)
│  │  ├─ foods/       # Gestione e ricerca database alimenti
│  │  ├─ meals/       # Logica di tracking e calcolo pasti
│  │  ├─ notifications/# Sistema di notifiche interne
│  │  ├─ oauth/       # Autenticazione di terze parti (Google OAuth)
│  │  ├─ open-food-facts/# Integrazione scanner e API esterna
│  │  └─ users/       # Gestione profilo e preferenze utente
│  └─ main.js         # Entry point del server (Express)
├─ frontend/
│  ├─ public/         # Assets statici
│  ├─ src/
│  │  ├─ assets/      # Immagini, icone e stylesheet globali
│  │  ├─ components/  # Componenti UI isolati e riutilizzabili
│  │  ├─ context/     # State management globale (Auth, Dashboard, Notifiche)
│  │  ├─ hooks/       # Custom Hooks React per logica riutilizzabile
│  │  ├─ lib/         # Utility e configurazioni (es. istanza Axios)
│  │  ├─ pages/       # Viste principali (Home, Calendar, Profile, Login)
│  │  ├─ services/    # Chiamate API (strutturate per modulo backend)
│  │  └─ App.jsx      # Router principale (Protected/Guest Routes)
└── README.md
```

## 🚀 Installazione Locale
### 1. Setup del Backend
```bash
cd backend
npm install
```

Crea un file `.env` nella cartella `backend` con le seguenti variabili:

```env
PORT=9000
MONGO_URL=la_tua_stringa_mongodb
JWT_SECRET=il_tuo_segreto_jwt
JWT_EXPIRES_IN=durata_scadenza_token
CLOUDINARY_URL=il_tuo_url_cloudinary
FRONTEND_URL = link_al_tuo_frontend

# Google OAuth
GOOGLE_CLIENT_ID=il_tuo_client_id
GOOGLE_CLIENT_SECRET=il_tuo_client_secret
GOOGLE_CALLBACK_URL=link_al_tuo_frontend/oauth/google/callback

# Sendgrid
SENDGRID_API_KEY=la_tua_api_key_sendgrid
```

Avvia il server:
```bash
npm run dev
```

### 2. Setup del Frontend
In un nuovo terminale:
```bash
cd frontend
npm install
```

Crea un file `.env` nella cartella `frontend` con le seguente variabile:

```env
VITE_SERVER_BASE_URL=http://localhost:9000
```

Avvia l'app React:
```bash
npm run dev
```

## 📄 License
Distributed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.txt).

---

