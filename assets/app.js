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
      help: 'Wenn Sie noch unsicher sind, können Sie diese Frage überspringen.', multiple: false,
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
      help: 'Angaben in Zentimetern. Auch grobe Schätzwerte helfen bei der ersten Einschätzung.',
      multiple: false, options: [],
      fields: [
        { id: 'length', label: 'Länge (cm)' },
        { id: 'width', label: 'Breite (cm)' },
        { id: 'height', label: 'Höhe (cm)' }
      ]
    },
    {
      id: 'household', section: 'everyday', title: 'Wer nutzt die Küche im Alltag?',
      help: 'Mehrfachauswahl möglich.', multiple: true,
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
      help: 'Mehrfachauswahl möglich.', multiple: true,
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
      help: 'Mehrfachauswahl möglich.', multiple: true,
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
      help: 'Die Angabe hilft, Empfehlungen passend zu priorisieren.', multiple: false,
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
    minimal: { label: 'Warm Minimal', description: 'Klare Linien, ruhige Flächen und eine warme Grundstimmung bilden Ihre ideale Küchenwelt.' },
    natural: { label: 'Natürlich Wohnlich', description: 'Authentische Materialien und eine wohnliche Atmosphäre stehen bei Ihnen im Mittelpunkt.' },
    japandi: { label: 'Soft Japandi', description: 'Reduktion, handwerkliche Details und natürliche Ruhe prägen Ihre persönliche Stilwelt.' },
    urban: { label: 'Urban Architecture', description: 'Starke Materialien, klare Architektur und bewusste Kontraste geben Ihrer Küche Charakter.' },
    classic: { label: 'Modern Classic', description: 'Zeitlose Eleganz trifft bei Ihnen auf feine Details und moderne Funktion.' }
  };

  const state = {
    started: false,
    current: 0,
    answers: {},
    details: {},
    skipped: [],
    submitted: false
  };

  const views = [...document.querySelectorAll('[data-view]')];
  const journey = document.getElementById('journey');
  const answersEl = document.getElementById('answers');
  const nextButton = document.getElementById('nextButton');

  restore();
  bind();
  renderJourney();
  showView(state.started ? (state.submitted ? 'success' : 'quiz') : 'intro');
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
    Object.assign(state, { started: false, current: 0, answers: {}, details: {}, skipped: [], submitted: false });
    renderJourney();
    showView('intro');
  }

  function renderQuestion() {
    const q = questions[state.current];
    if (!q) return showResult();
    showView('quiz');
    document.getElementById('sectionLabel').textContent = sectionLabel(q.section);
    document.getElementById('questionCounter').textContent = `${state.current + 1} von ${questions.length}`;
    document.getElementById('questionTitle').textContent = q.title;
    document.getElementById('questionHelp').textContent = q.help || '';
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
        button.innerHTML = `<span class="answer-swatch"></span><strong>${escapeHtml(opt.label)}</strong><small>${escapeHtml(opt.description)}</small>`;
        button.querySelector('.answer-swatch').style.setProperty('--swatch', opt.swatch);
        button.addEventListener('click', () => choose(q, opt.id));
        answersEl.appendChild(button);
      });
    }
    document.getElementById('backButton').disabled = state.current === 0;
    document.getElementById('skipButton').hidden = Boolean(q.required);
    updateNext(q);
    renderJourney();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    state.details[q.id][fieldId] = value.trim();
    const hasAny = Object.values(state.details[q.id]).some(v => v);
    state.answers[q.id] = hasAny ? ['filled'] : [];
    state.skipped = state.skipped.filter(id => id !== q.id);
    save();
  }

  function renderTextField(q) {
    const wrap = document.createElement('label');
    wrap.className = 'text-field';
    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.placeholder = q.placeholder || '';
    textarea.value = state.details[q.id] || '';
    textarea.addEventListener('input', () => updateText(q, textarea.value));
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
      selected = selected.includes(optionId) ? selected.filter(id => id !== optionId) : [...selected, optionId];
      if (q.max && selected.length > q.max) selected = selected.slice(1);
    } else {
      selected = [optionId];
    }
    state.answers[q.id] = selected;
    state.skipped = state.skipped.filter(id => id !== q.id);
    save();
    renderQuestion();
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

  function renderBars(result) {
    const top = result.ranked.slice(0, 3);
    const normalizedTotal = top.reduce((sum, item) => sum + item.percent, 0) || 1;
    document.getElementById('styleBars').innerHTML = top.map(item => {
      const percent = Math.round(item.percent / normalizedTotal * 100);
      return `<div class="style-bar"><span>${escapeHtml(item.label)}</span><div class="style-bar-track"><div class="style-bar-fill" style="width:${percent}%"></div></div><strong>${percent}%</strong></div>`;
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
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.message || 'Übermittlung fehlgeschlagen.');
      state.submitted = true;
      save();
      renderJourney('result');
      showView('success');
    } catch (e) {
      error.textContent = e.message || 'Bitte versuchen Sie es später erneut.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Küchenprofil übermitteln';
    }
  }

  function renderJourney(forceSection) {
    if (!state.started) { journey.innerHTML = ''; return; }
    const currentSection = forceSection || questions[state.current]?.section || 'result';
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    journey.innerHTML = '';
    sections.forEach((section, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `journey-step${section.id === currentSection ? ' is-current' : ''}${sectionComplete(section.id) ? ' is-complete' : ''}`;
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

  function sectionComplete(sectionId) {
    if (sectionId === 'result') return false;
    const qs = questions.filter(q => q.section === sectionId);
    return qs.length > 0 && qs.every(q => (state.answers[q.id] || []).length > 0 || state.skipped.includes(q.id));
  }

  function furthestUnlockedSection() {
    const currentSection = sections.findIndex(s => s.id === questions[state.current]?.section);
    let unlocked = Math.max(1, currentSection);
    for (let i = 0; i < sections.length - 1; i += 1) {
      if (sectionComplete(sections[i].id)) unlocked = Math.max(unlocked, i + 1);
    }
    if (sectionComplete('inspiration') && sectionComplete('style') && sectionComplete('materials')) {
      unlocked = sections.length - 1;
    }
    return Math.min(unlocked, sections.length - 1);
  }

  function planningComplete() {
    return ['space', 'everyday', 'technik', 'framework'].every(sectionComplete);
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
      if (saved && typeof saved === 'object') Object.assign(state, saved);
      if (!state.details || typeof state.details !== 'object') state.details = {};
    } catch (_) { localStorage.removeItem('kuechenKompassV1'); }
  }
  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
  }
})();
