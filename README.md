# ioStudente — Recupero Anni Scolastici Brescia

Sito statico (HTML/CSS puro) della landing page **ioStudente**, pensato per il
plugin WordPress **"WcodeAi - Frontend GitHub"**.

Il plugin legge il sito statico dalla cartella `dist/` e sostituisce i
segnaposto `{{chiave}}` presenti nell'HTML con i valori dei campi
personalizzati impostati in WordPress.

## Caratteristiche

- **Output statico** in `dist/` con un vero `index.html` (nessuna SPA, nessun runtime).
- **Percorsi relativi** per tutti gli asset (`./style.css`, `./favicon.svg`).
- **Nessuna dipendenza a runtime**: basta servire i file di `dist/`.
- **Struttura semantica** (`header` / `section` / `footer`) e **mobile-first**.
- **Contenuti come segnaposto** `{{chiave}}`: ogni testo/immagine modificabile dal
  cliente è un token che WordPress rimpiazza. I punti non modificabili (menu,
  micro-copy strutturale) hanno testo di esempio fisso.

## Struttura

```
/
├── src/                 # sorgente
│   ├── index.html       # HTML con i segnaposto {{chiave}}
│   ├── style.css        # CSS mobile-first
│   └── favicon.svg
├── dist/                # output di build (committato: lo legge il plugin)
│   ├── index.html
│   ├── style.css
│   └── favicon.svg
├── build.mjs            # copia src/ -> dist/ (+ commit opzionale)
└── package.json
```

## Build

```bash
npm run build          # genera dist/ da src/
npm run build:commit   # genera dist/ e la committa nella repo
npm run preview        # anteprima locale su http://localhost:3000
```

Modifica sempre i file in `src/` e poi lancia `npm run build`: `dist/` viene
rigenerata da `src/`.

## Segnaposto

L'elenco completo dei segnaposto (con il tipo per il plugin) è nel file
[`SEGNAPOSTO.txt`](./SEGNAPOSTO.txt), pronto da incollare nella sezione Deploy
del plugin. Sintassi dei tipi:

| Notazione            | Tipo campo   |
| -------------------- | ------------ |
| `chiave`             | testo breve  |
| `chiave:testo-lungo` | paragrafi    |
| `chiave:immagine`    | URL immagine |
