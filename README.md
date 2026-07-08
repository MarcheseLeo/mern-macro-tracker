# Macro 🍏

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node-dot-js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

**MacroMuse** è un'applicazione web Full Stack progettata per rendere il tracciamento dei macronutrienti e delle calorie semplice, veloce e intuitivo. 

## ✨ Funzionalità Principali

* **Autenticazione Sicura:** Login tradizionale con Email/Password (criptata con bcrypt e protetta da JWT) o tramite **Google OAuth2.0**.
* **Dashboard Interattiva:** Riepilogo giornaliero di calorie e macro, con calcolo automatico dei progressi rispetto agli obiettivi personali.
* **Diario Alimentare:** Ricerca, aggiunta e rimozione di cibi organizzati per tipologia di pasto (Colazione, Pranzo, Cena, Snack).
* **Scanner Barcode:** Integrazione con *OpenFoodFacts* per importare automaticamente i valori nutrizionali tramite la scansione del codice a barre.
* **Calendario Storico:** Visualizzazione rapida delle giornate a target, parziali o mancate, con percentuale settimanale di successo.
* **Profilo Utente:** Gestione obiettivi, dati personali e upload di Avatar tramite *Cloudinary*.

## 🛠️ Tech Stack

**Frontend:**
* React (con React Router DOM)
* Bootstrap & React-Bootstrap
* Lucide React (Icone)
* Axios
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

```text
mern-macro-tracker
├─ backend/
│  ├─ config/         # Configurazione DB
│  ├─ exceptions/     # Gestione errori personalizzati (Auth, Meals, Users)
│  ├─ middlewares/    # Validatori, Upload Multer, JWT Verification
│  ├─ modules/        # Controller, Route, Service e Schema divisi per dominio
│  └─ main.js         # Entry point server
├─ frontend/
│  ├─ public/         # Assets statici
│  ├─ src/
│  │  ├─ components/  # Componenti UI (Auth, Dashboard, Layout, Form)
│  │  ├─ context/     # React Context (AuthContext, DashboardContext)
│  │  ├─ pages/       # Pagine principali (Home, Calendar, Profile, Login)
│  │  ├─ services/    # Integrazioni API con Axios
│  │  └─ App.jsx      # Router principale
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

