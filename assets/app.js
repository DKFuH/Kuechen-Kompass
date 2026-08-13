(() => {
  'use strict';

  const sections = [
    { id: 'inspiration', label: 'Wohngefühl' },
    { id: 'style', label: 'Stil' },
    { id: 'materials', label: 'Material' },
    { id: 'space', label: 'Raum' },
    { id: 'everyday', label: 'Alltag' },
    { id: 'technik', label: 'Technik' },
    { id: 'framework', label: 'Rahmen' },
    { id: 'result', label: 'Ergebnis' }
  ];

  const questions = [
    {
      id: 'feeling', section: 'inspiration', title: 'Wie soll sich Ihre neue Küche anfühlen?',
      help: 'Wählen Sie spontan. Mehrere Antworten sind möglich.', multiple: true, required: true,
      options: [
        option('calm', 'Ruhig und klar', 'Weniger Reize, harmonische Flächen', '#c6beb0', { minimal: 3, japandi: 2 }),
        option('warm', 'Warm und wohnlich', 'Holz, Textur und weiche Kontraste', '#a77d5b', { natural: 3, classic: 1 }),
        option('bold', 'Markant und charaktervoll', 'Kontraste und starke Materialien', '#56504c', { urban: 3, minimal: 1 }),
        option('elegant', 'Elegant und zeitlos', 'Ruhige Wertigkeit ohne Modedruck', '#b3a48f', { classic: 3, minimal: 1 })
      ]
    },
    {
      id: 'visual_language', section: 'style', title: 'Welche Formensprache zieht Sie an?',
      help: 'Nicht darüber nachdenken, was praktisch ist – nur was Ihnen gefällt.', multiple: false, required: true,
      options: [
        option('flat', 'Geradlinig', 'Flächenbündig, reduziert, präzise', '#c9c4ba', { minimal: 3, urban: 1 }),
        option('soft', 'Weich und natürlich', 'Rundungen, Holz und sanfte Übergänge', '#b89976', { natural: 3, japandi: 2 }),
        option('framed', 'Rahmen und Details', 'Klassische Gliederung modern interpretiert', '#d6c7b1', { classic: 3 }),
        option('architectural', 'Architektonisch', 'Monolithisch, dunkel und konsequent', '#4f4b48', { urban: 3, minimal: 2 })
      ]
    },
    {
      id: 'palette', section: 'style', title: 'In welcher Farbwelt fühlen Sie sich zuhause?',
      help: 'Sie können zwei Farbwelten kombinieren.', multiple: true, max: 2, required: true,
      options: [
        option('sand', 'Sand und Greige', 'Warm, ruhig und wandelbar', '#c9b79f', { natural: 2, japandi: 2, minimal: 1 }),
        option('light', 'Hell und klar', 'Cremeweiß bis helles Grau', '#e6e2d8', { minimal: 3 }),
        option('earth', 'Erdig und satt', 'Ton, Olive und warmes Braun', '#89715d', { natural: 3, classic: 1 }),
        option('dark', 'Dunkel und kontrastreich', 'Graphit, Schwarz und Rauchglas', '#4a4846', { urban: 3, classic: 1 })
      ]
    },
    {
      id: 'materials', section: 'materials', title: 'Welche Materialien möchten Sie täglich berühren?',
      help: 'Bis zu drei Favoriten auswählen.', multiple: true, max: 3, required: true,
      options: [
        option('wood', 'Echtes Holzgefühl', 'Lebendige Maserung und Wärme', 'repeating-linear-gradient(95deg,#967152 0 9px,#815f46 10px 17px)', { natural: 3, japandi: 2 }),
        option('stone', 'Stein und Mineralik', 'Ruhig, massiv und dauerhaft', 'linear-gradient(145deg,#c8c2b8,#8f8b85)', { minimal: 2, urban: 2 }),
        option('lacquer', 'Samtmatte Flächen', 'Weiche Haptik, homogene Farbe', '#8e887f', { minimal: 3, classic: 1 }),
        option('metal', 'Metallische Akzente', 'Dunkler Stahl, Messing oder Bronze', 'linear-gradient(135deg,#9a8465,#4f4942)', { urban: 3, classic: 1 }),
        option('glass', 'Glas und Transparenz', 'Leichtigkeit und inszenierte Details', 'linear-gradient(145deg,#bdc6c5,#6f7776)', { classic: 2, urban: 1 })
      ]
    },
    {
      id: 'handles', section: 'materials', title: 'Wie möchten Sie Schränke öffnen?',
      help: 'Diese Entscheidung prägt die Wirkung stärker, als man zunächst denkt.', multiple: false, required: true,
      options: [
        option('handleless', 'Grifflos', 'Ruhige, durchgängige Flächen', '#b8ada0', { minimal: 3, japandi: 1 }),
        option('edge', 'Dezente Griffkante', 'Reduziert, aber direkt greifbar', '#8f8175', { minimal: 2, urban: 1 }),
        option('handle', 'Charaktervolle Griffe', 'Ein bewusstes Detail in der Fläche', '#716355', { classic: 3, natural: 1 })
      ]
    },
    {
      id: 'room_concept', section: 'space', title: 'Offene Wohnküche oder eigener Küchenraum?',
      help: 'Diese Entscheidung prägt Grundriss und Materialwahl stärker als jedes Detail.', multiple: false,
      options: [
        option('open', 'Offene Wohnküche', 'Küche, Ess- und Wohnbereich gehen ineinander über', '#c9a17c', {}),
        option('separate', 'Küche im separaten Raum', 'Ein eigener, klar abgegrenzter Raum', '#8c6a4f', {}),
        option('unsure', 'Noch offen', 'Abhängig von der weiteren Planung', '#e3d5c3', {})
      ]
    },
    {
      id: 'kitchen_shape', section: 'space', title: 'Welche Küchenform passt am ehesten zu Ihrem Grundriss?',
      help: 'Wählen Sie die Form, die Ihrem Raum heute am nächsten kommt. Wenn noch nichts feststeht, nehmen Sie „Noch unsicher“.', multiple: false,
      options: [
        option('single_row', 'Einzeilige Küche', 'Eine durchgehende Zeile an einer Wand', '#c9a17c', {}),
        option('double_row', 'Zweizeilige Küche', 'Zwei parallele Zeilen mit Mittelgang', '#b9a48c', {}),
        option('u_shape', 'U-Form', 'Drei Seiten, viel Stauraum und Arbeitsfläche', '#a98a67', {}),
        option('l_shape', 'L-Form', 'Zwei Seiten im rechten Winkel', '#8c6a4f', {}),
        option('island', 'Kücheninsel', 'Freistehendes Element als Mittelpunkt', '#d8c3a5', {}),
        option('unknown', 'Noch unsicher', 'Die Form soll sich aus der Planung ergeben', '#e3d5c3', {})
      ]
    },
    {
      id: 'room_dimensions', section: 'space', type: 'dimensions',
      title: 'Wie groß ist der Raum für Ihre neue Küche?',
      help: 'Angaben in Zentimetern. Für eine belastbare Ersteinschätzung sind Länge, Breite und Höhe am hilfreichsten.',
      multiple: false, options: [],
      fields: [
        { id: 'length', label: 'Länge (cm)' },
        { id: 'width', label: 'Breite (cm)' },
        { id: 'height', label: 'Höhe (cm)' }
      ]
    },
    {
      id: 'household', section: 'everyday', title: 'Wer nutzt die Küche im Alltag?',
      help: 'Wählen Sie die Personen aus, für die die Küche im Alltag wirklich funktionieren muss.', multiple: true,
      options: [
        option('solo', 'Meist eine Person', 'Klare persönliche Abläufe', '#c7b9a5', {}),
        option('couple', 'Gemeinsam zu zweit', 'Zwei Arbeitsbereiche mit Bewegungsfreiheit', '#b8a081', {}),
        option('family', 'Familie', 'Robust, zugänglich und stauraumstark', '#a98a67', {}),
        option('guests', 'Oft mit Gästen', 'Kommunikation und gemeinsames Zubereiten', '#836d5a', {})
      ]
    },
    {
      id: 'cooking', section: 'everyday', title: 'Was passiert in Ihrer Küche wirklich?',
      help: 'Wählen Sie alles, was häufig vorkommt.', multiple: true,
      options: [
        option('fresh', 'Täglich frisch kochen', 'Viel Vorbereitung und gut erreichbare Vorräte', '#a48a6d', {}),
        option('quick', 'Schnell und unkompliziert', 'Kurze Wege und pflegeleichte Flächen', '#c4b7a7', {}),
        option('baking', 'Backen und Teig', 'Freie Arbeitsfläche und passende Aufbewahrung', '#d1b990', {}),
        option('hosting', 'Bewirten und genießen', 'Die Küche als kommunikativer Mittelpunkt', '#806957', {})
      ]
    },
    {
      id: 'storage', section: 'everyday', title: 'Was wäre im Alltag die größte Verbesserung?',
      help: 'Bitte einen Schwerpunkt auswählen.', multiple: false,
      options: [
        option('order', 'Mehr Ordnung', 'Jedes Teil bekommt seinen festen Platz', '#b9aa96', {}),
        option('workspace', 'Mehr Arbeitsfläche', 'Freie Zonen statt zugestellter Fläche', '#9f8e7b', {}),
        option('ergonomics', 'Bessere Ergonomie', 'Höhen und Wege passend zu Ihnen', '#807568', {}),
        option('together', 'Mehr Gemeinsamkeit', 'Kochen, reden und leben verbinden', '#a47d5f', {})
      ]
    },
    {
      id: 'appliances', section: 'technik', title: 'Welche Elektrogeräte sind für Sie wichtig?',
      help: 'Wählen Sie nur Geräte, die für Ihre Planung wirklich gesetzt oder besonders wichtig sind.', multiple: true,
      options: [
        option('oven', 'Heißluftbackofen', 'Gleichmäßige Hitze für Braten und Backen', '#c9a17c', {}),
        option('steamer', 'Dampfgarer', 'Schonendes Garen mit Feuchtigkeit', '#b9a48c', {}),
        option('hob', 'Kochfeld', 'Induktion, Ceran oder Gas nach Wahl', '#a98a67', {}),
        option('fridge', 'Kühlschrank', 'Einzelgerät für kompakte Grundrisse', '#8c6a4f', {}),
        option('fridge_freezer', 'Kühl-Gefrierkombination', 'Kühlen und Gefrieren in einem Gerät', '#d8c3a5', {}),
        option('dishwasher', 'Geschirrspüler', 'Vollintegriert oder teilintegriert', '#e3d5c3', {}),
        option('design_hood', 'Designhaube', 'Dunstabzug als sichtbares Element', '#76533d', {}),
        option('microwave', 'Mikrowelle', 'Kombigerät oder separate Einheit', '#c49a7a', {})
      ]
    },
    {
      id: 'extractor_type', section: 'technik', title: 'Welche Betriebsart soll der Dunstabzug haben?',
      help: 'Entscheidend für den späteren Anschluss.', multiple: false,
      options: [
        option('exhaust', 'Abluft', 'Führt Dunst direkt nach außen ab', '#a98a67', {}),
        option('recirculation', 'Umluft', 'Reinigt die Luft über einen Filter', '#c9a17c', {})
      ]
    },
    {
      id: 'extractor_style', section: 'technik', title: 'Wie soll der Dunstabzug eingebaut werden?',
      help: 'Diese Wahl beeinflusst die Planung des Oberschranks oder des Kochfelds.', multiple: false,
      options: [
        option('cabinet', 'Integriert im Oberschrank', 'Unauffällig im Hängeschrank verbaut', '#b9a48c', {}),
        option('hood', 'Designhaube', 'Sichtbares Element über dem Kochfeld', '#8c6a4f', {}),
        option('hob_integrated', 'Integriert im Kochfeld', 'Absaugung direkt aus der Arbeitsfläche', '#76533d', {}),
        option('unsure', 'Noch offen', 'Klärt sich in der Fachberatung', '#e3d5c3', {})
      ]
    },
    {
      id: 'waste_separation', section: 'technik', title: 'Wie soll die Mülltrennung gelöst werden?',
      help: '', multiple: false,
      options: [
        option('integrated', 'Integriert im Spülenschrank', 'Fest eingeplant unter der Spüle', '#c9a17c', {}),
        option('separate', 'Wird separat gelöst', 'Trennung außerhalb der Küchenmöbel', '#a98a67', {}),
        option('open', 'Noch offen', 'Lösung wird in der Planung festgelegt', '#e3d5c3', {})
      ]
    },
    {
      id: 'lighting', section: 'technik', title: 'Welche Beleuchtung wünschen Sie sich?',
      help: 'Wählen Sie die Lichtideen, die den Alltag oder die Atmosphäre Ihrer Küche wirklich verbessern würden.', multiple: true,
      options: [
        option('niche', 'Nischenbeleuchtung', 'Licht entlang der Arbeitsfläche', '#c9a17c', {}),
        option('cabinet_light', 'Vitrinenbeleuchtung', 'Effektlicht in Glasfronten', '#b9a48c', {}),
        option('drawer_light', 'Auszugsbeleuchtung', 'Geht beim Öffnen automatisch an', '#a98a67', {}),
        option('plinth_light', 'Sockelspotlights', 'Indirektes Licht am Boden der Küche', '#8c6a4f', {}),
        option('ceiling_spots', 'Deckenspots vorhanden', 'Bestehende Deckenbeleuchtung einplanen', '#e3d5c3', {})
      ]
    },
    {
      id: 'project_time', section: 'framework', title: 'Wann soll Ihre neue Küche Wirklichkeit werden?',
      help: 'Eine grobe Einordnung reicht.', multiple: false,
      options: [
        option('0_3', 'In den nächsten 3 Monaten', 'Das Projekt ist bereits konkret', '#876d59', {}),
        option('3_6', 'In 3 bis 6 Monaten', 'Genug Zeit für eine fundierte Planung', '#a68d75', {}),
        option('6_12', 'In 6 bis 12 Monaten', 'Orientierung und Vorbereitung stehen an', '#c0ad98', {}),
        option('ideas', 'Erst einmal inspirieren', 'Noch ohne festen Termin', '#d4cabd', {})
      ]
    },
    {
      id: 'budget', section: 'framework', title: 'Welcher Rahmen fühlt sich realistisch an?',
      help: 'Die Angabe hilft, Material- und Ausstattungsoptionen passend zu priorisieren. Wenn Sie noch offen sind, wählen Sie den letzten Punkt.', multiple: false,
      options: [
        option('under_15', 'Bis 15.000 €', 'Klar priorisiert und effizient geplant', '#d3c6b7', {}),
        option('15_25', '15.000 bis 25.000 €', 'Solide Ausstattung mit individuellen Akzenten', '#bea98f', {}),
        option('25_40', '25.000 bis 40.000 €', 'Hohe Individualität bei Material und Funktion', '#a28a71', {}),
        option('over_40', 'Über 40.000 €', 'Konsequentes Raum- und Materialkonzept', '#765f4d', {}),
        option('unknown', 'Noch nicht festgelegt', 'Der passende Rahmen soll sich aus der Planung ergeben', '#ded7cc', {})
      ]
    },
    {
      id: 'special_wishes', section: 'framework', type: 'text',
      title: 'Gibt es besondere Wünsche für Ihre Küche?',
      help: 'Zum Beispiel eine bevorzugte Marke der Hausgeräte, ein Apothekerschrank oder ein hoch eingebauter Backofen. Optional.',
      multiple: false, options: [], placeholder: 'Ihre Notiz an uns …'
    }
  ];

  function option(id, label, description, swatch, scores) {
    return { id, label, description, swatch, scores };
  }

  const styleCopy = {
    minimal: { label: 'Warm Minimal', description: 'Klare Linien, ruhige Flächen und eine warme Grundstimmung bilden Ihre ideale Küchenwelt.', image: 'assets/images/style-warm-minimal.webp' },
    natural: { label: 'Natürlich Wohnlich', description: 'Authentische Materialien und eine wohnliche Atmosphäre stehen bei Ihnen im Mittelpunkt.', image: 'assets/images/style-natural-living.webp' },
    japandi: { label: 'Soft Japandi', description: 'Reduktion, handwerkliche Details und natürliche Ruhe prägen Ihre persönliche Stilwelt.', image: 'assets/images/style-soft-japandi.webp' },
    urban: { label: 'Urban Architecture', description: 'Starke Materialien, klare Architektur und bewusste Kontraste geben Ihrer Küche Charakter.', image: 'assets/images/style-urban-architecture.webp' },
    classic: { label: 'Modern Classic', description: 'Zeitlose Eleganz trifft bei Ihnen auf feine Details und moderne Funktion.', image: 'assets/images/style-modern-classic.webp' }
  };

  const state = {
    started: false,
    current: 0,
    answers: {},
    details: {},
    skipped: [],
    submitted: false,
    deliveryPending: false
  };

  const views = [...document.querySelectorAll('[data-view]')];
  const journey = document.getElementById('journey');
  const answersEl = document.getElementById('answers');
  const nextButton = document.getElementById('nextButton');
  const selectionMessage = document.getElementById('selectionMessage');

  restore();
  bind();
  bindEmbedResize();
  renderJourney();
  showView(state.started ? (state.submitted ? 'success' : 'quiz') : 'intro');
  if (state.submitted) renderSuccess(state.deliveryPending);
  if (state.started && !state.submitted) renderQuestion();

  function bind() {
    document.getElementById('startButton').addEventListener('click', start);
    document.getElementById('restartButton').addEventListener('click', restart);
    document.getElementById('backButton').addEventListener('click', back);
    document.getElementById('skipButton').addEventListener('click', skip);
    nextButton.addEventListener('click', next);
    document.getElementById('continuePlanningButton').addEventListener('click', continuePlanning);
    document.getElementById('openContactButton').addEventListener('click', openContact);
    document.getElementById('successResultButton').addEventListener('click', showResult);
    document.getElementById('leadForm').addEventListener('submit', submitLead);
  }

  function bindEmbedResize() {
    if (!document.body.classList.contains('embed-mode') || window.parent === window) return;
    let parentOrigin = '*';
    try {
      if (document.referrer) parentOrigin = new URL(document.referrer).origin;
    } catch (_) {
      parentOrigin = '*';
    }
    let lastHeight = 0;
    const reportHeight = () => {
      const height = Math.ceil(document.documentElement.scrollHeight);
      if (height === lastHeight) return;
      lastHeight = height;
      window.parent.postMessage({ type: 'kuechen-kompass:resize', height }, parentOrigin);
    };
    new ResizeObserver(reportHeight).observe(document.body);
    window.addEventListener('load', reportHeight, { once: true });
    reportHeight();
  }

  function start() {
    state.started = true;
    state.current = 0;
    save();
    showView('quiz');
    renderQuestion();
  }

  function restart() {
    if (!confirm('Möchten Sie alle bisherigen Antworten löschen und neu beginnen?')) return;
    localStorage.removeItem('kuechenKompassV1');
    Object.assign(state, { started: false, current: 0, answers: {}, details: {}, skipped: [], submitted: false, deliveryPending: false });
    renderJourney();
    showView('intro');
  }

  function renderQuestion(focusOptionId = '') {
    const q = questions[state.current];
    if (!q) return showResult();
    showView('quiz');
    document.getElementById('sectionLabel').textContent = sectionLabel(q.section);
    document.getElementById('questionCounter').textContent = `${state.current + 1} von ${questions.length}`;
    document.getElementById('questionTitle').textContent = q.title;
    document.getElementById('questionHelp').textContent = q.help || '';
    selectionMessage.textContent = '';
    answersEl.innerHTML = '';
    answersEl.className = q.type === 'dimensions' ? 'dimension-grid' : q.type === 'text' ? 'text-grid' : 'answer-grid';
    if (q.type === 'dimensions') {
      renderDimensionFields(q);
    } else if (q.type === 'text') {
      renderTextField(q);
    } else {
      const selected = state.answers[q.id] || [];
      q.options.forEach(opt => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `answer-card${selected.includes(opt.id) ? ' is-selected' : ''}`;
        button.dataset.optionId = opt.id;
        button.setAttribute('aria-pressed', selected.includes(opt.id) ? 'true' : 'false');
        button.innerHTML = `<span class="answer-swatch"></span><strong>${escapeHtml(opt.label)}</strong><small>${escapeHtml(opt.description)}</small>`;
        const swatch = button.querySelector('.answer-swatch');
        const image = optionImage(q.id, opt.id);
        swatch.style.setProperty('--swatch', image ? `url("${image}") center / cover` : opt.swatch);
        button.addEventListener('click', () => choose(q, opt.id));
        answersEl.appendChild(button);
      });
    }
    document.getElementById('backButton').disabled = state.current === 0;
    document.getElementById('skipButton').hidden = Boolean(q.required);
    updateNext(q);
    renderJourney();
    if (focusOptionId) {
      answersEl.querySelector(`[data-option-id="${CSS.escape(focusOptionId)}"]`)?.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function renderDimensionFields(q) {
    const details = state.details[q.id] || {};
    q.fields.forEach(field => {
      const wrap = document.createElement('label');
      wrap.className = 'dimension-field';
      const caption = document.createElement('span');
      caption.textContent = field.label;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.step = '1';
      input.inputMode = 'numeric';
      input.placeholder = 'z. B. 320';
      input.value = details[field.id] || '';
      input.addEventListener('input', () => updateDimension(q, field.id, input.value));
      wrap.appendChild(caption);
      wrap.appendChild(input);
      answersEl.appendChild(wrap);
    });
  }

  function updateDimension(q, fieldId, value) {
    if (!state.details[q.id]) state.details[q.id] = {};
    const cleaned = value.trim().replace(/[^\d]/g, '').slice(0, 4);
    state.details[q.id][fieldId] = cleaned;
    const filledCount = q.fields.filter(field => (state.details[q.id]?.[field.id] || '').trim()).length;
    state.answers[q.id] = filledCount === q.fields.length ? ['filled'] : [];
    state.skipped = state.skipped.filter(id => id !== q.id);
    save();
    updateNext(q);
  }

  function renderTextField(q) {
    const wrap = document.createElement('label');
    wrap.className = 'text-field';
    const caption = document.createElement('span');
    caption.textContent = 'Besondere Wünsche (optional)';
    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.placeholder = q.placeholder || '';
    textarea.value = state.details[q.id] || '';
    textarea.addEventListener('input', () => updateText(q, textarea.value));
    wrap.appendChild(caption);
    wrap.appendChild(textarea);
    answersEl.appendChild(wrap);
  }

  function updateText(q, value) {
    state.details[q.id] = value;
    state.answers[q.id] = value.trim() ? ['filled'] : [];
    state.skipped = state.skipped.filter(id => id !== q.id);
    save();
  }

  function choose(q, optionId) {
    let selected = state.answers[q.id] || [];
    if (q.multiple) {
      if (selected.includes(optionId)) {
        selected = selected.filter(id => id !== optionId);
      } else if (q.max && selected.length >= q.max) {
        selectionMessage.textContent = `Sie können höchstens ${q.max} Antworten auswählen. Entfernen Sie zuerst eine Auswahl.`;
        return;
      } else {
        selected = [...selected, optionId];
      }
    } else {
      selected = [optionId];
    }
    state.answers[q.id] = selected;
    state.skipped = state.skipped.filter(id => id !== q.id);
    save();
    renderQuestion(optionId);
  }

  function updateNext(q) {
    const hasAnswer = (state.answers[q.id] || []).length > 0;
    nextButton.disabled = Boolean(q.required && !hasAnswer);
    nextButton.textContent = state.current === questions.length - 1 ? 'Ergebnis aktualisieren' : 'Weiter';
  }

  function next() {
    const currentQuestion = questions[state.current];
    const nextQuestion = questions[state.current + 1];
    if (currentQuestion?.section === 'materials' && nextQuestion?.section === 'space') {
      save();
      return showResult();
    }
    if (state.current >= questions.length - 1) return showResult();
    state.current += 1;
    save();
    renderQuestion();
  }

  function back() {
    if (state.current <= 0) return;
    state.current -= 1;
    save();
    renderQuestion();
  }

  function skip() {
    const q = questions[state.current];
    if (!state.skipped.includes(q.id)) state.skipped.push(q.id);
    next();
  }

  function continuePlanning() {
    const firstPlanning = questions.findIndex(q => q.section === 'space');
    state.current = firstPlanning;
    save();
    renderQuestion();
  }

  function showResult() {
    const result = calculateResult();
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultDescription').textContent = result.description;
    document.getElementById('profileProgress').textContent = `${completion()}%`;
    document.getElementById('resultInsight').textContent = insight(result);
    const resultImage = document.getElementById('resultImage');
    resultImage.style.backgroundImage = `url("${new URL(styleCopy[result.primary].image, document.baseURI).href}")`;
    resultImage.setAttribute('aria-label', `Beispielküche für den Stil ${result.title}`);
    document.getElementById('continuePlanningButton').hidden = planningComplete();
    renderBars(result);
    renderMoodboard();
    renderPlanningSummary();
    renderJourney('result');
    showView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function calculateResult() {
    const scores = Object.fromEntries(Object.keys(styleCopy).map(id => [id, 0]));
    questions.forEach(q => (state.answers[q.id] || []).forEach(id => {
      const opt = q.options.find(item => item.id === id);
      Object.entries(opt?.scores || {}).forEach(([style, points]) => { scores[style] += points; });
    }));
    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const ranked = Object.entries(scores)
      .map(([id, score]) => ({ id, score, percent: Math.round((score / total) * 100), ...styleCopy[id] }))
      .sort((a, b) => b.score - a.score);
    return { title: ranked[0].label, description: ranked[0].description, ranked, primary: ranked[0].id };
  }

  function svgDataUrl(svg) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
  }

  function plannerCard(theme, artwork) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${theme.top}" />
            <stop offset="100%" stop-color="${theme.bottom}" />
          </linearGradient>
          <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${theme.glow}" stop-opacity=".95" />
            <stop offset="100%" stop-color="${theme.glow}" stop-opacity=".2" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" rx="30" fill="url(#bg)" />
        <rect x="20" y="20" width="560" height="360" rx="26" fill="${theme.panel}" />
        <rect x="20" y="20" width="560" height="360" rx="26" stroke="${theme.line}" stroke-opacity=".65" />
        <circle cx="506" cy="78" r="102" fill="url(#glow)" />
        ${artwork}
      </svg>`;
    return svgDataUrl(svg);
  }

  function plannerThemes(name) {
    return {
      sand: { top: '#efe4d7', bottom: '#d7c1ab', panel: '#f7f1ea', line: '#b89c7f', glow: '#fff5e8', ink: '#6a5543', accent: '#b2865f', strong: '#8a6a51' },
      warm: { top: '#d8b896', bottom: '#a6764f', panel: '#f5ede4', line: '#b68b66', glow: '#ffefdc', ink: '#67452f', accent: '#a96e44', strong: '#8b593a' },
      earth: { top: '#b89a7e', bottom: '#6e5748', panel: '#f3ece3', line: '#9e7d66', glow: '#f5e4cf', ink: '#564235', accent: '#7c624f', strong: '#5e493c' },
      dark: { top: '#5e5858', bottom: '#252223', panel: '#f1ece8', line: '#7e746f', glow: '#f7d9b7', ink: '#433936', accent: '#6f665f', strong: '#262223' },
      sage: { top: '#c8d0c4', bottom: '#8f9c89', panel: '#f4f5f1', line: '#95a18d', glow: '#eef5de', ink: '#4f5c4d', accent: '#78856f', strong: '#66725e' },
      stone: { top: '#dad3ca', bottom: '#b3a89b', panel: '#f7f4f0', line: '#aaa093', glow: '#fffaf4', ink: '#5c554f', accent: '#95897a', strong: '#81766b' },
      cloud: { top: '#e9ecef', bottom: '#c1c7cd', panel: '#fbfcfc', line: '#a8afb6', glow: '#ffffff', ink: '#58626a', accent: '#8c98a2', strong: '#6a767e' }
    }[name];
  }

  function roomFrame(theme) {
    return `
      <rect x="58" y="78" width="484" height="244" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
      <rect x="78" y="96" width="444" height="208" rx="22" fill="none" stroke="${theme.line}" stroke-opacity=".18" stroke-width="4" />
    `;
  }

  function kitchenShapeArt(theme, shape) {
    const base = roomFrame(theme);
    const common = `stroke="${theme.strong}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"`;
    const island = `<rect x="240" y="160" width="120" height="80" rx="24" fill="${theme.accent}" opacity=".88" />`;
    const row = `<path d="M130 200h340" ${common} />`;
    const double = `<path d="M130 162h340M130 238h340" ${common} />`;
    const u = `<path d="M158 132v136h284V132" ${common} />`;
    const l = `<path d="M158 132v136h230" ${common} />`;
    const unknown = `
      <path d="M158 132v68M158 268v0M158 268h92M402 132h38M440 132v136M220 268h74" ${common} stroke-dasharray="1 54" />
      <circle cx="300" cy="200" r="30" fill="${theme.accent}" opacity=".9" />
      <path d="M288 184c3-11 12-17 24-17 15 0 26 9 26 22 0 9-5 15-16 23-9 7-11 10-11 18" stroke="${theme.panel}" stroke-width="10" stroke-linecap="round" />
      <circle cx="311" cy="248" r="6" fill="${theme.panel}" />
    `;
    return plannerCard(theme, `${base}${{
      single_row: row,
      double_row: double,
      u_shape: `${u}`,
      l_shape: `${l}`,
      island: `${row}${island}`,
      unknown
    }[shape] || row}`);
  }

  function handleArt(theme, mode) {
    const doors = `
      <rect x="92" y="92" width="126" height="236" rx="18" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
      <rect x="237" y="92" width="126" height="236" rx="18" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
      <rect x="382" y="92" width="126" height="236" rx="18" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
    `;
    const accents = {
      handleless: `
        <path d="M208 128h-70M353 128h-70M498 128h-70" stroke="${theme.strong}" stroke-width="10" stroke-linecap="round" opacity=".8" />
        <path d="M208 182h-70M353 182h-70M498 182h-70" stroke="${theme.line}" stroke-width="4" stroke-linecap="round" opacity=".35" />
      `,
      edge: `
        <path d="M208 140h-40M353 140h-40M498 140h-40" stroke="${theme.accent}" stroke-width="12" stroke-linecap="round" />
        <path d="M168 140v140M313 140v140M458 140v140" stroke="${theme.line}" stroke-width="4" opacity=".25" />
      `,
      handle: `
        <rect x="174" y="176" width="28" height="76" rx="14" stroke="${theme.accent}" stroke-width="10" />
        <rect x="319" y="176" width="28" height="76" rx="14" stroke="${theme.accent}" stroke-width="10" />
        <rect x="464" y="176" width="28" height="76" rx="14" stroke="${theme.accent}" stroke-width="10" />
      `
    };
    return plannerCard(theme, `${doors}${accents[mode] || accents.handleless}`);
  }

  function roomConceptArt(theme, mode) {
    const shell = roomFrame(theme);
    const open = `
      <rect x="96" y="120" width="160" height="72" rx="18" fill="${theme.accent}" opacity=".88" />
      <rect x="302" y="120" width="186" height="72" rx="20" fill="${theme.panel}" stroke="${theme.strong}" stroke-width="10" />
      <circle cx="192" cy="246" r="20" fill="${theme.strong}" opacity=".85" />
      <circle cx="244" cy="246" r="20" fill="${theme.strong}" opacity=".6" />
      <path d="M286 214h126" stroke="${theme.line}" stroke-width="8" stroke-linecap="round" />
      <path d="M286 246h92" stroke="${theme.line}" stroke-width="8" stroke-linecap="round" />
    `;
    const separate = `
      <path d="M300 96v208" stroke="${theme.strong}" stroke-width="16" stroke-linecap="round" />
      <path d="M300 174h54" stroke="${theme.strong}" stroke-width="16" stroke-linecap="round" />
      <rect x="110" y="126" width="122" height="64" rx="18" fill="${theme.accent}" opacity=".88" />
      <rect x="372" y="118" width="82" height="86" rx="20" fill="${theme.panel}" stroke="${theme.line}" stroke-width="8" />
      <rect x="364" y="238" width="98" height="30" rx="15" fill="${theme.strong}" opacity=".84" />
    `;
    const unsure = `
      <path d="M300 96v208" stroke="${theme.line}" stroke-width="14" stroke-linecap="round" stroke-dasharray="18 18" />
      <path d="M96 212h392" stroke="${theme.line}" stroke-width="14" stroke-linecap="round" stroke-dasharray="18 18" />
      <circle cx="300" cy="200" r="42" fill="${theme.accent}" opacity=".92" />
      <path d="M284 185c5-16 17-24 34-24 20 0 34 12 34 29 0 11-6 20-20 29-11 7-14 12-14 23" stroke="${theme.panel}" stroke-width="10" stroke-linecap="round" />
      <circle cx="320" cy="257" r="6" fill="${theme.panel}" />
    `;
    return plannerCard(theme, `${shell}${{ open, separate, unsure }[mode] || open}`);
  }

  function householdArt(theme, mode) {
    const table = `<rect x="130" y="144" width="340" height="112" rx="34" fill="${theme.accent}" opacity=".92" />`;
    const seat = (x, y) => `<circle cx="${x}" cy="${y}" r="20" fill="${theme.strong}" opacity=".82" />`;
    const layouts = {
      solo: `${seat(300, 290)}`,
      couple: `${seat(250, 290)}${seat(350, 290)}`,
      family: `${seat(215, 290)}${seat(300, 290)}${seat(385, 290)}${seat(170, 130)}${seat(430, 130)}`,
      guests: `${seat(190, 130)}${seat(300, 118)}${seat(410, 130)}${seat(215, 290)}${seat(300, 302)}${seat(385, 290)}`
    };
    return plannerCard(theme, `${table}${layouts[mode] || layouts.solo}`);
  }

  function cookingArt(theme, mode) {
    const island = `<rect x="96" y="208" width="408" height="88" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="8" />`;
    const graphics = {
      fresh: `
        <rect x="144" y="118" width="128" height="60" rx="18" fill="${theme.accent}" opacity=".92" />
        <path d="M184 132l48 34M232 132l-48 34" stroke="${theme.panel}" stroke-width="8" stroke-linecap="round" />
        <path d="M334 118c10 4 16 10 18 19M354 118c10 4 16 10 18 19M374 118c10 4 16 10 18 19" stroke="${theme.strong}" stroke-width="7" stroke-linecap="round" />
        ${island}
      `,
      quick: `
        <circle cx="192" cy="146" r="42" fill="${theme.panel}" stroke="${theme.accent}" stroke-width="10" />
        <path d="M192 118v30l20 12" stroke="${theme.strong}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="304" y="126" width="110" height="44" rx="22" fill="${theme.strong}" opacity=".82" />
        <path d="M414 148h30" stroke="${theme.strong}" stroke-width="9" stroke-linecap="round" />
        ${island}
      `,
      baking: `
        <ellipse cx="214" cy="154" rx="56" ry="34" fill="${theme.panel}" stroke="${theme.accent}" stroke-width="8" />
        <circle cx="214" cy="154" r="20" fill="${theme.accent}" opacity=".72" />
        <rect x="314" y="138" width="112" height="20" rx="10" fill="${theme.strong}" opacity=".86" />
        <circle cx="314" cy="148" r="16" fill="${theme.strong}" opacity=".86" />
        <circle cx="426" cy="148" r="16" fill="${theme.strong}" opacity=".86" />
        ${island}
      `,
      hosting: `
        ${island}
        <path d="M178 126v32M230 126v32M282 126v32M334 126v32" stroke="${theme.accent}" stroke-width="8" stroke-linecap="round" />
        <path d="M168 126h20l8 12v20c0 8-6 14-14 14s-14-6-14-14v-20z" fill="${theme.panel}" stroke="${theme.accent}" stroke-width="5" />
        <path d="M220 126h20l8 12v20c0 8-6 14-14 14s-14-6-14-14v-20z" fill="${theme.panel}" stroke="${theme.accent}" stroke-width="5" />
        <path d="M272 126h20l8 12v20c0 8-6 14-14 14s-14-6-14-14v-20z" fill="${theme.panel}" stroke="${theme.accent}" stroke-width="5" />
        <path d="M324 126h20l8 12v20c0 8-6 14-14 14s-14-6-14-14v-20z" fill="${theme.panel}" stroke="${theme.accent}" stroke-width="5" />
      `
    };
    return plannerCard(theme, graphics[mode] || graphics.fresh);
  }

  function storageArt(theme, mode) {
    const graphics = {
      order: `
        <rect x="108" y="112" width="384" height="184" rx="26" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
        <path d="M236 112v184M364 112v184M108 174h384M108 236h384" stroke="${theme.line}" stroke-width="8" />
        <rect x="142" y="144" width="60" height="30" rx="8" fill="${theme.accent}" opacity=".86" />
        <rect x="270" y="208" width="80" height="28" rx="8" fill="${theme.strong}" opacity=".7" />
        <circle cx="420" cy="250" r="18" fill="${theme.accent}" opacity=".8" />
      `,
      workspace: `
        <rect x="92" y="146" width="416" height="124" rx="34" fill="${theme.accent}" opacity=".9" />
        <rect x="150" y="184" width="300" height="48" rx="24" fill="${theme.panel}" opacity=".92" />
      `,
      ergonomics: `
        <rect x="120" y="104" width="134" height="192" rx="20" fill="${theme.panel}" stroke="${theme.line}" stroke-width="8" />
        <rect x="144" y="136" width="86" height="66" rx="12" fill="${theme.accent}" opacity=".88" />
        <rect x="324" y="168" width="170" height="108" rx="24" fill="${theme.panel}" stroke="${theme.line}" stroke-width="8" />
        <path d="M324 198h170" stroke="${theme.line}" stroke-width="6" />
        <circle cx="358" cy="146" r="10" fill="${theme.strong}" />
        <circle cx="390" cy="132" r="10" fill="${theme.strong}" opacity=".7" />
      `,
      together: `
        <rect x="118" y="152" width="364" height="104" rx="30" fill="${theme.accent}" opacity=".9" />
        <circle cx="194" cy="294" r="18" fill="${theme.strong}" opacity=".82" />
        <circle cx="406" cy="294" r="18" fill="${theme.strong}" opacity=".82" />
        <circle cx="262" cy="118" r="18" fill="${theme.strong}" opacity=".6" />
        <circle cx="338" cy="118" r="18" fill="${theme.strong}" opacity=".6" />
        <path d="M226 204h148" stroke="${theme.panel}" stroke-width="12" stroke-linecap="round" opacity=".85" />
      `
    };
    return plannerCard(theme, graphics[mode] || graphics.order);
  }

  function applianceArt(theme, mode) {
    const shell = `<rect x="178" y="86" width="244" height="228" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />`;
    const icons = {
      oven: `${shell}<rect x="220" y="130" width="160" height="120" rx="18" fill="${theme.accent}" opacity=".25" stroke="${theme.strong}" stroke-width="8" /><path d="M238 116h124" stroke="${theme.line}" stroke-width="8" stroke-linecap="round" /><circle cx="252" cy="116" r="8" fill="${theme.strong}" /><circle cx="288" cy="116" r="8" fill="${theme.strong}" />`,
      steamer: `${shell}<rect x="224" y="206" width="152" height="44" rx="22" fill="${theme.accent}" opacity=".86" /><path d="M248 120c0 20 12 20 12 40M286 120c0 20 12 20 12 40M324 120c0 20 12 20 12 40" stroke="${theme.strong}" stroke-width="9" stroke-linecap="round" />`,
      hob: `<rect x="128" y="104" width="344" height="192" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" /><circle cx="220" cy="164" r="34" stroke="${theme.strong}" stroke-width="8" /><circle cx="380" cy="164" r="34" stroke="${theme.strong}" stroke-width="8" /><circle cx="220" cy="240" r="26" stroke="${theme.accent}" stroke-width="8" /><circle cx="380" cy="240" r="26" stroke="${theme.accent}" stroke-width="8" />`,
      fridge: `${shell}<path d="M300 86v228" stroke="${theme.line}" stroke-width="8" /><path d="M340 154v40M340 218v40" stroke="${theme.strong}" stroke-width="8" stroke-linecap="round" />`,
      fridge_freezer: `${shell}<path d="M178 198h244" stroke="${theme.line}" stroke-width="8" /><path d="M338 134v42M338 228v42" stroke="${theme.strong}" stroke-width="8" stroke-linecap="round" /><path d="M218 120h88" stroke="${theme.accent}" stroke-width="6" stroke-linecap="round" opacity=".7" />`,
      dishwasher: `${shell}<rect x="218" y="144" width="164" height="96" rx="18" fill="${theme.accent}" opacity=".18" stroke="${theme.strong}" stroke-width="8" /><circle cx="264" cy="192" r="18" stroke="${theme.accent}" stroke-width="8" /><circle cx="336" cy="192" r="18" stroke="${theme.accent}" stroke-width="8" /><path d="M228 118h144" stroke="${theme.line}" stroke-width="8" stroke-linecap="round" />`,
      design_hood: `<path d="M194 120h212l-34 88H228z" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" /><path d="M298 78v40" stroke="${theme.strong}" stroke-width="12" stroke-linecap="round" /><rect x="210" y="242" width="176" height="18" rx="9" fill="${theme.accent}" opacity=".84" />`,
      microwave: `${shell}<rect x="220" y="140" width="140" height="92" rx="18" fill="${theme.accent}" opacity=".18" stroke="${theme.strong}" stroke-width="8" /><circle cx="386" cy="170" r="10" fill="${theme.strong}" /><circle cx="386" cy="204" r="10" fill="${theme.strong}" />`
    };
    return plannerCard(theme, icons[mode] || icons.oven);
  }

  function extractorTypeArt(theme, mode) {
    const base = `<rect x="132" y="136" width="336" height="120" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" /><rect x="250" y="92" width="100" height="52" rx="18" fill="${theme.accent}" opacity=".86" />`;
    const airflow = {
      exhaust: `${base}<path d="M208 194h172" stroke="${theme.strong}" stroke-width="12" stroke-linecap="round" /><path d="M352 170l40 24-40 24" fill="none" stroke="${theme.strong}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" /><path d="M470 144v104" stroke="${theme.accent}" stroke-width="12" stroke-linecap="round" />`,
      recirculation: `${base}<path d="M220 198c18-34 50-52 82-52 42 0 74 22 92 60" fill="none" stroke="${theme.strong}" stroke-width="12" stroke-linecap="round" /><path d="M380 182l12 24-28 8" fill="none" stroke="${theme.strong}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" /><path d="M378 228c-18 24-42 36-72 36-34 0-64-16-88-48" fill="none" stroke="${theme.accent}" stroke-width="10" stroke-linecap="round" />`
    };
    return plannerCard(theme, airflow[mode] || airflow.exhaust);
  }

  function extractorStyleArt(theme, mode) {
    const graphics = {
      cabinet: `
        <rect x="116" y="98" width="368" height="82" rx="24" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
        <rect x="242" y="180" width="116" height="38" rx="14" fill="${theme.accent}" opacity=".84" />
        <rect x="156" y="224" width="288" height="54" rx="18" fill="${theme.panel}" stroke="${theme.line}" stroke-width="8" />
      `,
      hood: `
        <path d="M226 116h148l-28 90H254z" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
        <path d="M300 76v40" stroke="${theme.strong}" stroke-width="12" stroke-linecap="round" />
        <rect x="152" y="234" width="296" height="36" rx="18" fill="${theme.accent}" opacity=".84" />
      `,
      hob_integrated: `
        <rect x="120" y="146" width="360" height="96" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
        <circle cx="222" cy="194" r="22" stroke="${theme.strong}" stroke-width="8" />
        <circle cx="378" cy="194" r="22" stroke="${theme.strong}" stroke-width="8" />
        <rect x="284" y="170" width="32" height="48" rx="12" fill="${theme.accent}" opacity=".86" />
      `,
      unsure: `
        <rect x="120" y="110" width="360" height="160" rx="30" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" stroke-dasharray="16 14" />
        <circle cx="300" cy="190" r="42" fill="${theme.accent}" opacity=".92" />
        <path d="M284 176c5-15 16-23 33-23 19 0 33 12 33 28 0 11-6 19-19 28-10 6-13 11-13 21" stroke="${theme.panel}" stroke-width="10" stroke-linecap="round" />
        <circle cx="319" cy="244" r="6" fill="${theme.panel}" />
      `
    };
    return plannerCard(theme, graphics[mode] || graphics.cabinet);
  }

  function wasteArt(theme, mode) {
    const graphics = {
      integrated: `
        <rect x="140" y="100" width="320" height="206" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
        <path d="M300 100v206" stroke="${theme.line}" stroke-width="8" />
        <rect x="176" y="156" width="88" height="104" rx="18" fill="${theme.accent}" opacity=".82" />
        <rect x="336" y="156" width="88" height="104" rx="18" fill="${theme.strong}" opacity=".72" />
        <path d="M184 132h232" stroke="${theme.line}" stroke-width="8" stroke-linecap="round" />
      `,
      separate: `
        <rect x="142" y="146" width="112" height="144" rx="22" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
        <rect x="346" y="146" width="112" height="144" rx="22" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
        <path d="M164 136h68M368 136h68" stroke="${theme.accent}" stroke-width="10" stroke-linecap="round" />
      `,
      open: `
        <rect x="132" y="110" width="336" height="176" rx="28" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" stroke-dasharray="14 12" />
        <circle cx="300" cy="198" r="42" fill="${theme.accent}" opacity=".9" />
        <path d="M284 182c5-15 16-23 33-23 19 0 33 12 33 28 0 11-6 19-19 28-10 6-13 11-13 21" stroke="${theme.panel}" stroke-width="10" stroke-linecap="round" />
        <circle cx="319" cy="250" r="6" fill="${theme.panel}" />
      `
    };
    return plannerCard(theme, graphics[mode] || graphics.integrated);
  }

  function lightingArt(theme, mode) {
    const shell = `
      <rect x="112" y="104" width="376" height="188" rx="26" fill="${theme.panel}" stroke="${theme.line}" stroke-width="10" />
      <rect x="112" y="104" width="376" height="58" rx="20" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
    `;
    const graphics = {
      niche: `${shell}<rect x="132" y="178" width="336" height="16" rx="8" fill="${theme.accent}" opacity=".88" /><rect x="132" y="206" width="336" height="52" rx="16" fill="${theme.panel}" />`,
      cabinet_light: `${shell}<rect x="150" y="132" width="112" height="132" rx="18" fill="none" stroke="${theme.strong}" stroke-width="8" /><rect x="338" y="132" width="112" height="132" rx="18" fill="none" stroke="${theme.strong}" stroke-width="8" /><rect x="158" y="140" width="96" height="16" rx="8" fill="${theme.accent}" opacity=".9" /><rect x="346" y="140" width="96" height="16" rx="8" fill="${theme.accent}" opacity=".9" />`,
      drawer_light: `${shell}<rect x="150" y="180" width="140" height="68" rx="18" fill="${theme.panel}" stroke="${theme.strong}" stroke-width="8" /><rect x="150" y="180" width="82" height="68" rx="18" fill="${theme.accent}" opacity=".84" /><rect x="330" y="170" width="120" height="18" rx="9" fill="${theme.line}" opacity=".45" />`,
      plinth_light: `${shell}<rect x="120" y="286" width="360" height="20" rx="10" fill="${theme.accent}" opacity=".86" /><rect x="120" y="306" width="360" height="16" rx="8" fill="${theme.accent}" opacity=".32" />`,
      ceiling_spots: `${shell}<circle cx="190" cy="86" r="18" fill="${theme.accent}" opacity=".82" /><circle cx="300" cy="86" r="18" fill="${theme.accent}" opacity=".82" /><circle cx="410" cy="86" r="18" fill="${theme.accent}" opacity=".82" /><path d="M190 104v32M300 104v32M410 104v32" stroke="${theme.line}" stroke-width="6" stroke-linecap="round" />`
    };
    return plannerCard(theme, graphics[mode] || graphics.niche);
  }

  function timeArt(theme, mode) {
    const points = {
      '0_3': 160,
      '3_6': 240,
      '6_12': 340,
      ideas: 438
    };
    const x = points[mode] || 160;
    return plannerCard(theme, `
      <path d="M128 210h344" stroke="${theme.line}" stroke-width="10" stroke-linecap="round" />
      <circle cx="160" cy="210" r="18" fill="${mode === '0_3' ? theme.accent : theme.panel}" stroke="${theme.strong}" stroke-width="7" />
      <circle cx="240" cy="210" r="18" fill="${mode === '3_6' ? theme.accent : theme.panel}" stroke="${theme.strong}" stroke-width="7" />
      <circle cx="340" cy="210" r="18" fill="${mode === '6_12' ? theme.accent : theme.panel}" stroke="${theme.strong}" stroke-width="7" />
      <circle cx="438" cy="210" r="18" fill="${mode === 'ideas' ? theme.accent : theme.panel}" stroke="${theme.strong}" stroke-width="7" />
      <rect x="${x - 34}" y="110" width="68" height="54" rx="14" fill="${theme.accent}" opacity=".92" />
      <path d="M${x} 164v32" stroke="${theme.accent}" stroke-width="8" stroke-linecap="round" />
      <rect x="208" y="258" width="184" height="20" rx="10" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
    `);
  }

  function budgetArt(theme, mode) {
    const heights = {
      under_15: [84, 44, 24, 12],
      '15_25': [84, 70, 34, 14],
      '25_40': [84, 70, 56, 22],
      over_40: [84, 70, 56, 44],
      unknown: [50, 50, 50, 50]
    }[mode] || [84, 44, 24, 12];
    const dash = mode === 'unknown' ? 'stroke-dasharray="12 10"' : '';
    return plannerCard(theme, `
      <path d="M142 286h316" stroke="${theme.line}" stroke-width="8" stroke-linecap="round" />
      <rect x="174" y="${286 - heights[0]}" width="48" height="${heights[0]}" rx="14" fill="${theme.accent}" opacity=".9" ${dash} />
      <rect x="246" y="${286 - heights[1]}" width="48" height="${heights[1]}" rx="14" fill="${theme.strong}" opacity=".78" ${dash} />
      <rect x="318" y="${286 - heights[2]}" width="48" height="${heights[2]}" rx="14" fill="${theme.accent}" opacity=".65" ${dash} />
      <rect x="390" y="${286 - heights[3]}" width="48" height="${heights[3]}" rx="14" fill="${theme.strong}" opacity=".55" ${dash} />
      <circle cx="196" cy="120" r="16" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
      <circle cx="268" cy="120" r="16" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
      <circle cx="340" cy="120" r="16" fill="${theme.panel}" stroke="${theme.line}" stroke-width="6" />
    `);
  }

  function generatedOptionImage(questionId, optionId) {
    const themeByQuestion = {
      handles: plannerThemes('sand'),
      room_concept: plannerThemes('warm'),
      kitchen_shape: plannerThemes('stone'),
      household: plannerThemes('earth'),
      cooking: plannerThemes('warm'),
      storage: plannerThemes('sand'),
      appliances: plannerThemes('stone'),
      extractor_type: plannerThemes('dark'),
      extractor_style: plannerThemes('dark'),
      waste_separation: plannerThemes('sage'),
      lighting: plannerThemes('cloud'),
      project_time: plannerThemes('warm'),
      budget: plannerThemes('earth')
    };

    const generators = {
      handles: () => handleArt(themeByQuestion.handles, optionId),
      room_concept: () => roomConceptArt(themeByQuestion.room_concept, optionId),
      kitchen_shape: () => kitchenShapeArt(themeByQuestion.kitchen_shape, optionId),
      household: () => householdArt(themeByQuestion.household, optionId),
      cooking: () => cookingArt(themeByQuestion.cooking, optionId),
      storage: () => storageArt(themeByQuestion.storage, optionId),
      appliances: () => applianceArt(themeByQuestion.appliances, optionId),
      extractor_type: () => extractorTypeArt(themeByQuestion.extractor_type, optionId),
      extractor_style: () => extractorStyleArt(themeByQuestion.extractor_style, optionId),
      waste_separation: () => wasteArt(themeByQuestion.waste_separation, optionId),
      lighting: () => lightingArt(themeByQuestion.lighting, optionId),
      project_time: () => timeArt(themeByQuestion.project_time, optionId),
      budget: () => budgetArt(themeByQuestion.budget, optionId)
    };

    return generators[questionId] ? generators[questionId]() : '';
  }

  function optionImage(questionId, optionId) {
    const path = {
      feeling: {
        calm: 'assets/images/feeling-calm-clear.webp',
        warm: 'assets/images/feeling-warm-homely.webp',
        bold: 'assets/images/feeling-bold-character.webp',
        elegant: 'assets/images/feeling-elegant-timeless.webp'
      },
      visual_language: {
        flat: 'assets/images/form-straight-lined.webp',
        soft: 'assets/images/form-soft-natural.webp',
        framed: 'assets/images/form-framed-details.webp',
        architectural: 'assets/images/form-architectural.webp'
      },
      palette: {
        sand: 'assets/images/palette-sand-greige.webp',
        light: 'assets/images/palette-light-clear.webp',
        earth: 'assets/images/palette-earth-rich.webp',
        dark: 'assets/images/palette-dark-contrast.webp'
      },
      materials: {
        wood: 'assets/images/material-wood-feel.webp',
        stone: 'assets/images/material-stone-mineral.webp',
        lacquer: 'assets/images/material-matte-lacquer.webp',
        metal: 'assets/images/material-metal-accents.webp',
        glass: 'assets/images/material-glass-transparency.webp'
      },
      handles: {
        handleless: 'assets/images/handle-handleless.webp',
        edge: 'assets/images/handle-edge-pull.webp',
        handle: 'assets/images/handle-character-handles.webp'
      },
      room_concept: {
        open: 'assets/images/room-open-plan.webp',
        separate: 'assets/images/room-separate-kitchen.webp',
        unsure: 'assets/images/room-concept-unsure.webp'
      },
      kitchen_shape: {
        single_row: 'assets/images/shape-single-row.webp',
        double_row: 'assets/images/shape-double-row.webp',
        u_shape: 'assets/images/shape-u-form.webp',
        l_shape: 'assets/images/shape-l-form.webp',
        island: 'assets/images/shape-island.webp',
        unknown: 'assets/images/shape-unknown.webp'
      },
      household: {
        solo: 'assets/images/household-solo.webp',
        couple: 'assets/images/household-couple.webp',
        family: 'assets/images/household-family.webp',
        guests: 'assets/images/household-guests.webp'
      },
      cooking: {
        fresh: 'assets/images/cooking-fresh-daily.webp',
        quick: 'assets/images/cooking-quick-easy.webp',
        baking: 'assets/images/cooking-baking-dough.webp',
        hosting: 'assets/images/cooking-hosting-enjoying.webp'
      },
      storage: {
        order: 'assets/images/storage-order.webp',
        workspace: 'assets/images/storage-workspace.webp',
        ergonomics: 'assets/images/storage-ergonomics.webp',
        together: 'assets/images/storage-together.webp'
      },
      appliances: {
        oven: 'assets/images/appliance-oven.webp',
        steamer: 'assets/images/appliance-steamer.webp',
        hob: 'assets/images/appliance-hob.webp',
        fridge: 'assets/images/appliance-fridge.webp',
        fridge_freezer: 'assets/images/appliance-fridge-freezer.webp',
        dishwasher: 'assets/images/appliance-dishwasher.webp',
        design_hood: 'assets/images/appliance-design-hood.webp',
        microwave: 'assets/images/appliance-microwave.webp'
      },
      extractor_type: {
        exhaust: 'assets/images/extractor-exhaust.webp',
        recirculation: 'assets/images/extractor-recirculation.webp'
      },
      extractor_style: {
        cabinet: 'assets/images/extractor-cabinet.webp',
        hood: 'assets/images/extractor-hood.webp',
        hob_integrated: 'assets/images/extractor-hob-integrated.webp',
        unsure: 'assets/images/extractor-unsure.webp'
      },
      waste_separation: {
        integrated: 'assets/images/waste-integrated.webp',
        separate: 'assets/images/waste-separate.webp',
        open: 'assets/images/waste-open.webp'
      },
      lighting: {
        niche: 'assets/images/lighting-niche.webp',
        cabinet_light: 'assets/images/lighting-cabinet-light.webp',
        drawer_light: 'assets/images/lighting-drawer-light.webp',
        plinth_light: 'assets/images/lighting-plinth-light.webp',
        ceiling_spots: 'assets/images/lighting-ceiling-spots.webp'
      },
      project_time: {
        '0_3': 'assets/images/timeframe-0-3.webp',
        '3_6': 'assets/images/timeframe-3-6.webp',
        '6_12': 'assets/images/timeframe-6-12.webp',
        ideas: 'assets/images/timeframe-ideas.webp'
      },
      budget: {
        under_15: 'assets/images/budget-under-15.webp',
        '15_25': 'assets/images/budget-15-25.webp',
        '25_40': 'assets/images/budget-25-40.webp',
        over_40: 'assets/images/budget-over-40.webp',
        unknown: 'assets/images/budget-unknown.webp'
      }
    }[questionId]?.[optionId] || '';
    return path ? new URL(path, document.baseURI).href : generatedOptionImage(questionId, optionId);
  }

  function renderBars(result) {
    const top = result.ranked.slice(0, 3);
    document.getElementById('styleBars').innerHTML = top.map(item => {
      return `<div class="style-bar"><span>${escapeHtml(item.label)}</span><div class="style-bar-track" role="meter" aria-label="${escapeHtml(item.label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${item.percent}"><div class="style-bar-fill" style="width:${item.percent}%"></div></div><strong>${item.percent}%</strong></div>`;
    }).join('');
  }

  function renderMoodboard() {
    const ids = [...(state.answers.palette || []), ...(state.answers.materials || [])];
    const options = questions.flatMap(q => q.options).filter((opt, idx, all) => ids.includes(opt.id) && all.findIndex(x => x.id === opt.id) === idx);
    document.getElementById('moodboard').innerHTML = (options.length ? options : [option('base', 'Ihre Auswahl', '', '#c9b79f', {})])
      .map(opt => `<div class="mood-chip" style="--chip:${opt.swatch}"><span>${escapeHtml(opt.label)}</span></div>`).join('');
  }

  function renderPlanningSummary() {
    const ids = ['room_concept', 'kitchen_shape', 'room_dimensions', 'household', 'appliances', 'extractor_type', 'extractor_style', 'waste_separation', 'lighting', 'project_time', 'budget', 'special_wishes'];
    const rows = [];
    ids.forEach(id => {
      const q = questions.find(item => item.id === id);
      if (!q) return;
      if (q.type === 'dimensions') {
        const details = state.details[id];
        const parts = details ? [details.length, details.width, details.height].filter(Boolean) : [];
        if (parts.length) rows.push([q.title, parts.join(' × ') + ' cm']);
        return;
      }
      if (q.type === 'text') {
        const value = (state.details[id] || '').trim();
        if (value) rows.push([q.title, value]);
        return;
      }
      const selected = state.answers[id] || [];
      if (!selected.length) return;
      const labels = selected.map(optId => q.options.find(o => o.id === optId)?.label).filter(Boolean);
      if (labels.length) rows.push([q.title, labels.join(', ')]);
    });
    const wrapper = document.getElementById('planningSummary');
    const grid = document.getElementById('planningGrid');
    if (!rows.length) {
      wrapper.classList.add('hidden');
      return;
    }
    wrapper.classList.remove('hidden');
    grid.innerHTML = rows.map(([label, value]) => `<div class="planning-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`).join('');
  }

  function insight(result) {
    const needs = state.answers.storage || [];
    if (needs.includes('order')) return 'Ihre ruhige Stilwelt gewinnt, wenn Stauraum konsequent hinter geschlossenen Fronten organisiert wird.';
    if (needs.includes('workspace')) return 'Die Materialwirkung sollte sich auf wenige starke Flächen konzentrieren, damit möglichst viel freie Arbeitsfläche bleibt.';
    if (needs.includes('together')) return 'Eine Insel oder Halbinsel kann Ihre Stilwelt mit dem Wohnraum verbinden, ohne dass die Küche ihre klare Wirkung verliert.';
    if (result.primary === 'natural') return 'Echte Materialwirkung entsteht nicht durch möglichst viele Holzflächen, sondern durch wenige gut platzierte, fühlbare Akzente.';
    return 'Ihr Stil lebt von Konsequenz. Wiederkehrende Farben und Materialien schaffen mehr Ruhe als viele einzelne Designideen.';
  }

  function openContact() {
    const result = calculateResult();
    document.getElementById('contactSummary').innerHTML = `<strong>${escapeHtml(result.title)}</strong><p>${completion()} % Ihres Küchenprofils sind bereits ausgefüllt.</p>`;
    renderJourney('result');
    showView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitLead(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const error = document.getElementById('formError');
    error.textContent = '';
    if (!form.reportValidity()) return;
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Wird übermittelt …';
    const data = Object.fromEntries(new FormData(form).entries());
    const result = calculateResult();
    const payload = {
      ...data,
      callback: Boolean(form.elements.callback.checked),
      consent: Boolean(form.elements.consent.checked),
      answers: state.answers,
      details: state.details,
      skipped: state.skipped,
      result,
      completion: completion(),
      source: 'kuechen-kompass'
    };
    try {
      const response = await fetch('api/submit.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'same-origin', body: JSON.stringify(payload)
      });
      const contentType = response.headers.get('content-type') || '';
      const body = contentType.includes('application/json')
        ? await response.json()
        : { ok: false, message: 'Der Server hat unerwartet geantwortet. Bitte versuchen Sie es später erneut.' };
      if (!response.ok || !body.ok) throw new Error(body.message || 'Übermittlung fehlgeschlagen.');
      state.submitted = true;
      state.deliveryPending = body.delivery_pending === true;
      save();
      renderJourney('result');
      renderSuccess(state.deliveryPending);
      showView('success');
    } catch (e) {
      error.textContent = e.message || 'Bitte versuchen Sie es später erneut.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Küchenprofil übermitteln';
    }
  }

  function renderSuccess(deliveryPending) {
    const eyebrow = document.getElementById('successEyebrow');
    const title = document.getElementById('successTitle');
    const message = document.getElementById('successMessage');
    if (deliveryPending) {
      eyebrow.textContent = 'Sicher gespeichert';
      title.textContent = 'Ihr Küchenprofil ist gespeichert.';
      message.textContent = 'Die interne Benachrichtigung ist noch nicht bestätigt. Ihre Angaben sind gesichert; bitte senden Sie das Formular nicht erneut.';
      return;
    }
    eyebrow.textContent = 'Sicher übermittelt';
    title.textContent = 'Ihr Küchenprofil ist angekommen.';
    message.textContent = 'Sie können Ihr Ergebnis weiterhin ansehen oder Ihre Antworten noch einmal durchgehen.';
  }

  function renderJourney(forceSection) {
    if (!state.started) { journey.innerHTML = ''; return; }
    const currentSection = forceSection || questions[state.current]?.section || 'result';
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    journey.innerHTML = '';
    sections.forEach((section, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const answered = sectionAnswered(section.id);
      const addressed = sectionAddressed(section.id);
      btn.className = `journey-step${section.id === currentSection ? ' is-current' : ''}${answered ? ' is-complete' : ''}${addressed && !answered ? ' is-skipped' : ''}`;
      btn.textContent = section.label;
      btn.disabled = index > furthestUnlockedSection();
      btn.addEventListener('click', () => jumpTo(section.id));
      journey.appendChild(btn);
    });
  }

  function jumpTo(sectionId) {
    if (sectionId === 'result') return showResult();
    const index = questions.findIndex(q => q.section === sectionId);
    if (index < 0) return;
    state.current = index;
    save();
    renderQuestion();
  }

  function sectionAnswered(sectionId) {
    if (sectionId === 'result') return false;
    const qs = questions.filter(q => q.section === sectionId);
    return qs.length > 0 && qs.every(q => (state.answers[q.id] || []).length > 0);
  }

  function sectionAddressed(sectionId) {
    if (sectionId === 'result') return false;
    const qs = questions.filter(q => q.section === sectionId);
    return qs.length > 0 && qs.every(q => (state.answers[q.id] || []).length > 0 || state.skipped.includes(q.id));
  }

  function furthestUnlockedSection() {
    const currentSection = sections.findIndex(s => s.id === questions[state.current]?.section);
    let unlocked = Math.max(1, currentSection);
    for (let i = 0; i < sections.length - 1; i += 1) {
      if (sectionAddressed(sections[i].id)) unlocked = Math.max(unlocked, i + 1);
    }
    if (sectionAnswered('inspiration') && sectionAnswered('style') && sectionAnswered('materials')) {
      unlocked = sections.length - 1;
    }
    return Math.min(unlocked, sections.length - 1);
  }

  function planningComplete() {
    return ['space', 'everyday', 'technik', 'framework'].every(sectionAnswered);
  }

  function completion() {
    const done = questions.filter(q => (state.answers[q.id] || []).length > 0).length;
    return Math.round(done / questions.length * 100);
  }

  function sectionLabel(id) { return sections.find(s => s.id === id)?.label || ''; }
  function showView(name) { views.forEach(view => view.classList.toggle('hidden', view.dataset.view !== name)); }
  function save() { localStorage.setItem('kuechenKompassV1', JSON.stringify(state)); }
  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem('kuechenKompassV1'));
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
      const questionIds = new Set(questions.map(q => q.id));
      const answers = {};
      if (saved.answers && typeof saved.answers === 'object' && !Array.isArray(saved.answers)) {
        questions.forEach(q => {
          const allowed = new Set(q.options.map(answer => answer.id).concat(q.type ? ['filled'] : []));
          const values = Array.isArray(saved.answers[q.id])
            ? [...new Set(saved.answers[q.id].filter(value => typeof value === 'string' && allowed.has(value)))]
            : [];
          answers[q.id] = q.max ? values.slice(0, q.max) : q.multiple ? values : values.slice(0, 1);
        });
      }
      const details = {};
      if (saved.details && typeof saved.details === 'object' && !Array.isArray(saved.details)) {
        const dimensions = saved.details.room_dimensions;
        if (dimensions && typeof dimensions === 'object' && !Array.isArray(dimensions)) {
          details.room_dimensions = {};
          ['length', 'width', 'height'].forEach(field => {
            if (typeof dimensions[field] === 'string' || typeof dimensions[field] === 'number') {
              details.room_dimensions[field] = String(dimensions[field]).slice(0, 12);
            }
          });
        }
        if (typeof saved.details.special_wishes === 'string') {
          details.special_wishes = saved.details.special_wishes.slice(0, 1000);
        }
      }
      answers.room_dimensions = details.room_dimensions && Object.values(details.room_dimensions).some(Boolean) ? ['filled'] : [];
      answers.special_wishes = details.special_wishes?.trim() ? ['filled'] : [];
      Object.assign(state, {
        started: saved.started === true,
        submitted: saved.submitted === true,
        deliveryPending: saved.deliveryPending === true,
        current: Number.isInteger(saved.current) ? Math.max(0, Math.min(questions.length - 1, saved.current)) : 0,
        answers,
        details,
        skipped: Array.isArray(saved.skipped)
          ? [...new Set(saved.skipped.filter(id => typeof id === 'string' && questionIds.has(id)))]
          : []
      });
    } catch (_) { localStorage.removeItem('kuechenKompassV1'); }
  }
  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
  }
})();
