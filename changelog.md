
# Changelog
Tutte le modifiche di rilievo a questo progetto saranno documentate in questo file.


## [1.1.0] - 2026-07-08

### ✨ Funzioni aggiunte
- **Sezione Scan Barcode :** 
    -  Ricerca veloce alimento con Barcode.
    -  Importazione automatica  da *OpenFoodFacts*.

## [1.0.0] - 2026-07-07

### ✨ Funzioni aggiunte
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