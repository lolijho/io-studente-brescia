# Io Studente Brescia

Portale dei servizi per gli studenti di Brescia. Sito web sviluppato con **Astro**.

## 🚀 Struttura del progetto

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro       # Header con navigazione responsive
│   │   ├── Footer.astro       # Footer con link e social
│   │   ├── Hero.astro         # Sezione hero homepage
│   │   ├── ServiceGrid.astro  # Griglia servizi
│   │   ├── EventList.astro    # Lista eventi
│   │   └── NewsGrid.astro     # Griglia notizie
│   ├── layouts/
│   │   └── BaseLayout.astro   # Layout di base
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── servizi.astro       # Pagina servizi
│   │   ├── eventi.astro        # Pagina eventi
│   │   ├── news.astro          # Pagina news
│   │   ├── orientamento.astro  # Pagina orientamento
│   │   ├── contatti.astro      # Pagina contatti con form
│   │   ├── login.astro         # Pagina di accesso
│   │   └── registrati.astro    # Pagina di registrazione
│   └── styles/
│       └── global.css          # Stili globali
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🛠️ Tecnologie

- **[Astro](https://astro.build/)** - Framework web moderno e veloce
- **TypeScript** - Tipizzazione statica
- **CSS** - Stili custom con variabili CSS e design responsive

## 🎨 Design

- Palette colori: blu (#0066CC) come colore primario, con accenti dorati e rossi
- Layout responsive con mobile menu
- Componenti riutilizzabili in Astro
- Design moderno e pulito

## 📦 Installazione

```bash
npm install
npm run dev
```

Il sito sarà disponibile su `http://localhost:4321`.

## 🏗️ Build

```bash
npm run build
```

I file statici verranno generati nella cartella `dist/`.

## 📄 Pagine

| Pagina | Descrizione |
|--------|-------------|
| `/` | Homepage con hero, servizi, eventi, news e CTA |
| `/servizi` | Elenco dettagliato dei servizi per studenti |
| `/eventi` | Prossimi eventi dedicati agli studenti |
| `/news` | Ultime notizie e aggiornamenti |
| `/orientamento` | Servizi di orientamento universitario e lavorativo |
| `/contatti` | Form di contatto e informazioni |
| `/login` | Pagina di accesso |
| `/registrati` | Pagina di registrazione |
