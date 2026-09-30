/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'panino-del-laghetto',
    /* nessun WhatsApp pubblicato: il telefono della scheda Google */
    whatsapp: { number: '', message: '', ids: [] },
    /* loro annuncio del 14/9/2026 (Google ha ancora il venerdì fino alle 16, l'orario di aprile): lunedì e sabato 11–16,
       martedì–venerdì 11–21, domenica chiuso */
    hours: {
      0: [], 1: [['11:00', '16:00']], 2: [['11:00', '21:00']], 3: [['11:00', '21:00']],
      4: [['11:00', '21:00']], 5: [['11:00', '21:00']], 6: [['11:00', '16:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Il Panino del Laghetto: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.special": "The Specials",
      "n.panini": "The sandwiches",
      "n.locale": "The new place",
      "n.laghetto": "Via Laghetto",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Sandwich bar · Via Laghetto 7, between the Duomo and the Statale",
      "h.titolo": "Everything strictly made to order.",
      "h.testo": "The sandwiches at the Laghetto are made on the spot, on the wooden board: cured meats, cheeses, fish, fresh vegetables, and the Special that keeps changing. A short walk from the Duomo and the Statale university, in the newly renovated place, with aperitivo from Tuesday to Friday.",
      "h.chi": "Andre87, in a review on Google (in Italian: «Probably the best sandwich in Milan»)",
      "h.google": "on Google, 730 reviews",
      "p.titolo": "The Special, made to order",
      "p.desc": "On the oval board with a paper napkin, in front of the brick wall of the new room: the bottom half of the bread drops in, then the layers one at a time, and each layer draws a line to its name; the top half closes it, then the toothpick with the little green flag. At the top, the yellow panel with the Duomo. Three Specials from their page: Tonnato, Fish, Pastrami.",
      "p.d0": "The Special Tonnato, «back by popular demand» in their post of 22 May 2026.",
      "p.d1": "The Special Fish, from their post of 4 December 2025.",
      "p.d2": "The Special Pastrami, from their post of 16 March 2026.",
      "p.modi": "Which Special",
      "p.nota": "The board, the brick wall and the green lamp come from their photos; the ingredients are the ones in their posts.",
      "s.riga": "Generosity in the ingredients",
      "s.titolo": "The Specials, as they write them",
      "s.sotto": "They post the off-menu sandwich on their page with its ingredients, one by one. These are four of the latest.",
      "s.d1": "22 May 2026 · «back by popular demand»",
      "s.d2": "4 December 2025",
      "s.d3": "16 March 2026",
      "s.d4": "2 May 2024",
      "s.i11": "Roast veal",
      "s.i12": "Rocket",
      "s.i13": "Red and yellow datterini tomatoes",
      "s.i14": "Cantabrian Sea anchovies",
      "s.i21": "Norwegian smoked salmon",
      "s.i22": "Hard-boiled eggs",
      "s.i23": "Guacamole",
      "s.i31": "Salmon pastrami",
      "s.i32": "Greek yogurt marinated with extra virgin olive oil, salt and lemon",
      "s.i33": "thinly sliced apple",
      "s.pane": "The bread",
      "s.i41": "with turmeric and poppy seeds",
      "s.i42": "Chianina beef tartare",
      "s.i43": "Parmigiano Reggiano aged 30 months",
      "s.i44": "grilled artichokes and rocket",
      "a.tonnato": "The Special Tonnato on the board: roast veal, anchovies, red and yellow datterini tomatoes and rocket in the open bread.",
      "a.fish": "The Special Fish on the board: smoked salmon, sliced hard-boiled egg, guacamole and rocket.",
      "a.pastramiS": "The Special Pastrami: salmon pastrami, yogurt and apple slices in the bread, on the board with a napkin.",
      "a.tartaruga": "The seeded Tartaruga on the board, with tartare, shavings of parmigiano and rocket.",
      "s.nota": "The Specials change: ask at the counter for today's.",
      "b.riga": "Goodness in simple things",
      "b.titolo": "On the board, cut side up",
      "b.sotto": "The bread split open, the layers on show, the paper napkin: that is how they all arrive. Six sandwiches from their photos.",
      "a.mortadella": "Mortadella and burrata in the bread, on the board with a napkin.",
      "k.mortadella": "Mortadella and burrata.",
      "a.crudo": "Prosciutto crudo, rocket and glaze in white bread, on the oval board.",
      "k.crudo": "Prosciutto crudo, rocket and glaze.",
      "a.pastrami": "Sliced cured meat with gherkins, datterini tomatoes and a stringy filling in the bread, on the board.",
      "k.pastrami": "Sliced meat with gherkins.",
      "a.bresaola": "Air-dried beef, burrata, red and yellow datterini tomatoes and rocket on the board.",
      "k.bresaola": "Air-dried beef, burrata and datterini.",
      "a.lamponi": "Prosciutto crudo, raspberries and rocket in white bread.",
      "k.lamponi": "Prosciutto crudo, raspberries and rocket.",
      "a.composta": "Prosciutto crudo, rocket and cheese with an orange compote, on the board.",
      "k.composta": "Prosciutto crudo and cheese with compote.",
      "b.nomi": "The names that keep coming back in the reviews",
      "b.lavagna": "Their old chalkboard in the window said «CREA IL TUO PANINO» (build your own sandwich): people who have been there say you can also ask for simpler ones.",
      "l.riga": "Warmth and passion",
      "l.titolo": "The new place",
      "l.d1": "28 April 2026",
      "l.t1": "Renovation and extension works begin: «We are working for you!»",
      "l.d2": "10 July 2026",
      "l.t2": "The last day of the Panino del Laghetto «as you have always known it».",
      "l.d3": "14 September 2026",
      "l.t3": "Reopening in the new room: exposed brick, green and amber glass lamps, patterned cement tiles. And the aperitivo is back, Tuesday to Friday.",
      "l.loro": "«Making you feel at home is our priority.»",
      "l.loroChi": "From their page, June 2025",
      "l.chi": "Behind the counter are Gianni, Giuliana and Riccardo, as they introduce themselves. In 2023 they celebrated their fourth TripAdvisor Travellers' Choice in a row.",
      "a.sala": "The new room: exposed brick wall, ribbed green and amber glass lamps, plants in baskets, dark wooden tables and patterned cement tiles.",
      "k.sala": "The room after the works, in one of their photos of 14 September 2026.",
      "a.facciata": "The corner façade with its two arches: the green sign «Street food, Il Panino, del laghetto» with the little Duomo, the green scalloped awnings, the string lights.",
      "k.facciata": "The two arches on Via Laghetto, in one of their 2025 photos.",
      "v.etichetta": "For those coming from the Duomo",
      "v.titolo": "Why it is called Via Laghetto",
      "v.sotto": "Where the Panino stands today, for almost five centuries there was a harbour: the Laghetto di Santo Stefano, where the marble for the Duomo arrived on barges.",
      "v.t1": "The little lake is dug next to the Ca' Granda, today the Statale university: it is the harbour of the Duomo building site. Hundreds of thousands of blocks of Candoglia marble pass through here.",
      "v.t2": "The falcone arrives: the wooden crane that unloads the blocks from the barges.",
      "v.t3": "The Duomo boats are marked AUF, <i>ad usum fabricae</i>: no duty to pay. Hence, they say, the Milanese phrase <i>a ufo</i>, for free.",
      "v.t4": "The little lake is filled in. What remains is the name of the street and, on the corner with the alley, the fresco of the Madonna dei Tencitt.",
      "v.nota": "From the Wikipedia entry on the Laghetto di Santo Stefano. The Duomo is about 600 metres away.",
      "d.etichetta": "Reviews",
      "d.titolo": "Those who keep coming back, and those who pass by chance",
      "d.google": "on Google, 730 reviews",
      "d.g3m": "Google, 3 months ago",
      "d.g5m": "Google, 5 months ago",
      "d.g8m": "Google, 8 months ago",
      "d.g11m": "Google, 11 months ago",
      "d.g2a": "Google, 2 years ago",
      "d.nota": "From the reviews on Google, in Italian, as they were written; cuts are marked […]. The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Aperitivo, Tuesday to Friday",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.aperitivo": "with aperitivo",
      "o.chiuso": "Closed",
      "o.nota": "Hours from their announcement of 14 September 2026. In August and on holidays they close for a few days: it is best to call.",
      "o.mappa": "Map: Il Panino del Laghetto, Via Laghetto 7, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Laghetto 7, 20122 Milan, on the corner, between the Statale university and Piazza Santo Stefano",
      "o.metro": "By metro",
      "o.metrov": "M4 Sforza-Policlinico, about 350 metres away; M1 and M4 San Babila, M3 Missori, M1 and M3 Duomo, 520–600",
      "o.tram": "By tram",
      "o.tramv": "12, 19 and 24, Via Larga stop, about 180 metres away",
      "o.bus": "By bus",
      "o.busv": "96, Via Francesco Sforza stop, about 100 metres away; 60 and 61 on Via Larga",
      "o.tel": "Phone",
      "o.social": "Social",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come to Via Laghetto",
      "q.1": "Can I eat there?",
      "q.1r": "Yes: at the counter, at the tables in the new room and outside, or to take away.",
      "q.2": "Is there an aperitivo?",
      "q.2r": "Yes, Tuesday to Friday until 9 pm, with wine and beer: it started again in September 2026, after the works.",
      "q.3": "What is the Special?",
      "q.3r": "The off-menu sandwich they post on their Facebook page with its ingredients: the Tonnato, the Fish, the Pastrami. It changes: ask at the counter for today's.",
      "q.4": "Are there vegetarian sandwiches?",
      "q.4r": "People who have been there say yes, and that you can also ask for simpler sandwiches. Ask at the counter.",
      "q.5": "Are you open on Sunday?",
      "q.5r": "No. Monday and Saturday from 11 am to 4 pm, Tuesday to Friday from 11 am to 9 pm.",
      "f2.orario": "Monday and Saturday 11 am–4 pm · Tuesday–Friday 11 am–9 pm · closed on Sunday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos and the Specials come from their Facebook page; hours from their announcement of 14 September 2026, rating and reviews from their Google listing (September 2026). We drew the sandwich on the board ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ IL PANINO DEL LAGHETTO — Via Laghetto 7 ══════════
     la FIRMA — «lo Special, espresso»: sul loro tagliere ovale col tovagliolo, davanti al muro di mattoni della sala nuova. Cade il pane
     di sotto, poi gli strati uno alla volta e ognuno tira un filo verso il suo nome; chiude il pane di sopra, poi lo stecchino con la
     bandierina. Lo stato è M (lo Special), T (0…1) e V (0 al suo posto; fino a 1 il tagliere esce a destra e i nomi sfumano; da −1 a 0
     arriva da destra il tagliere vuoto). Senza JS e alla fine: il Tonnato, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): il
     tagliere vuoto. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto
     durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[640,470],"via":480,"cade":{"pane":130,"strato":190,"sopra":170,"stecco":80},"fasi":[{"pane":{"t":0,"d":0.1},"strati":[{"t":0.1,"d":0.093},{"t":0.25,"d":0.093},{"t":0.4,"d":0.093},{"t":0.55,"d":0.093}],"fili":[{"t":0.193,"d":0.057},{"t":0.343,"d":0.057},{"t":0.493,"d":0.057},{"t":0.643,"d":0.057}],"sopra":{"t":0.72,"d":0.12},"stecco":{"t":0.86,"d":0.14}},{"pane":{"t":0,"d":0.1},"strati":[{"t":0.1,"d":0.093},{"t":0.25,"d":0.093},{"t":0.4,"d":0.093},{"t":0.55,"d":0.093}],"fili":[{"t":0.193,"d":0.057},{"t":0.343,"d":0.057},{"t":0.493,"d":0.057},{"t":0.643,"d":0.057}],"sopra":{"t":0.72,"d":0.12},"stecco":{"t":0.86,"d":0.14}},{"pane":{"t":0,"d":0.1},"strati":[{"t":0.1,"d":0.124},{"t":0.3,"d":0.124},{"t":0.5,"d":0.124}],"fili":[{"t":0.224,"d":0.076},{"t":0.424,"d":0.076},{"t":0.624,"d":0.076}],"sopra":{"t":0.72,"d":0.12},"stecco":{"t":0.86,"d":0.14}}],"tempi":{"inizio":300,"special":4800,"servi":420,"arriva":460,"specialV":4000},"special":[{"nome":"Tonnato","strati":4},{"nome":"Fish","strati":4},{"nome":"Pastrami","strati":3}]};
  /* lo Special, espresso a (M, T, V) — una sola fonte: la usa main.js (via pnl_main.cjs) e la prova (firma-prova.mjs).
     T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS .firma-attesa). */
  function creaSpecial(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var servito = svg.querySelector('.servito'), cartelli = svg.querySelector('.cartelli');
    var sotto = svg.querySelector('.pane--sotto'), sopra = svg.querySelector('.pane--sopra'), stecco = svg.querySelector('.stecco');
    var P = D.special.map(function (S, m) {
      var q = function (s, k) { return svg.querySelector(s + '[data-m="' + m + '"][data-k="' + k + '"]'); };
      var tutti = function (s) { return Array.from({ length: S.strati }, function (_, k) { return q(s, k); }); };
      return { strati: tutti('.strato'), fili: tutti('.filo'), cartelli: tutti('.cartello') };
    });
    /* cade dall'alto e si posa: accelera come un oggetto che cade, compare nel primo quarto */
    function cade(el, u, alto) {
      el.setAttribute('opacity', String(r3(Math.min(1, u * 4))));
      el.setAttribute('transform', 'translate(0 ' + r2(-alto * (1 - u * u)) + ')');
    }
    function disegna(m, t, v) {
      var F = D.fasi[m], q = P[m];
      /* il pane di sotto, gli strati uno alla volta; ogni strato posato tira il filo verso il suo nome */
      cade(sotto, fase(t, F.pane), D.cade.pane);
      q.strati.forEach(function (el, k) { cade(el, fase(t, F.strati[k]), D.cade.strato); });
      q.fili.forEach(function (el, k) {
        var f = fase(t, F.fili[k]);
        el.setAttribute('stroke-dashoffset', String(r3(1 - f)));
        q.cartelli[k].setAttribute('opacity', String(r3(f)));
      });
      /* chiude il pane di sopra, poi lo stecchino con la bandierina */
      cade(sopra, fase(t, F.sopra), D.cade.sopra);
      var s = fase(t, F.stecco);
      stecco.setAttribute('opacity', String(r3(Math.min(1, s * 4))));
      stecco.setAttribute('transform', 'translate(0 ' + r2(-D.cade.stecco * Math.pow(1 - dolce(s), 2)) + ')');
      /* col V il tagliere esce a destra e i nomi sfumano; quello nuovo arriva vuoto da destra */
      servito.setAttribute('transform', 'translate(' + r2(D.via * Math.abs(v)) + ' 0)');
      cartelli.setAttribute('opacity', String(v > 0 ? r3(1 - v) : 1));
    }
    var completo = !!servito && !!cartelli && !!sotto && !!sopra && !!stecco && P.every(function (q) { return q.strati.concat(q.fili, q.cartelli).every(function (e) { return !!e; }); });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('espresso-firma'), svgF = prendi('specialSvg'), leggiF = prendi('specialLeggi');
  var SPEC = svgF ? creaSpecial(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.espresso__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.espresso__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    SPEC.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli Special nascosti tornano come nell'HTML (#257) */
    DATI.special.forEach(function (_, k) { if (k !== destinazioneF.m) SPEC.disegna(k, 1, 0); });
    SPEC.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta il tagliere vuoto */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il tagliere vuoto */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.special, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.special });
  }
  /* il gesto: scegliere lo Special. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è, il tagliere esce
     a destra e i nomi sfumano, arriva il tagliere vuoto e il panino si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.specialV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && SPEC && SPEC.completo && BOTTONI.length === DATI.special.length) {
    try { clearTimeout(window.__attesaSpecial); } catch (e) {}
    window.__special = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__special.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta il tagliere vuoto */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__special.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
