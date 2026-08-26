(() => {
  const API_BASE = 'https://agenda.laxacube.ch';

  const dateInput = document.getElementById('event-date');
  const dateDisplay = document.getElementById('date-display');
  const calendarPopup = document.getElementById('calendar-popup');
  const calendarMonthYear = document.getElementById('calendar-month-year');
  const calendarDays = document.getElementById('calendar-days');
  const calPrev = document.getElementById('cal-prev');
  const calNext = document.getElementById('cal-next');

  if (!dateInput || !dateDisplay || !calendarPopup) {
    console.error('[calendar] Éléments manquants dans le DOM');
    return;
  }

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let busyDates = [];
  let reservationDates = [];
  let selectedDate = null;

  const MONTH_NAMES = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  function formatDateISO(y, m, d) {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }

  function formatDisplay(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  function openCalendar() {
    calendarPopup.classList.add('open');
    renderCalendar();
    loadAvailability();
  }

  function closeCalendar() {
    calendarPopup.classList.remove('open');
  }

  async function loadAvailability() {
    const from = formatDateISO(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const to = formatDateISO(currentYear, currentMonth, lastDay);

    try {
      const res = await fetch(`${API_BASE}/api/availability?from=${from}&to=${to}`, {
        mode: 'cors'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      busyDates = data.busyDates || [];
      reservationDates = data.reservationDates || [];
    } catch (e) {
      console.warn('[calendar] Pas de données dispo:', e.message);
      busyDates = [];
      reservationDates = [];
    }
    renderCalendar();
  }

  function renderCalendar() {
    calendarMonthYear.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    calendarDays.innerHTML = '';

    DAY_NAMES.forEach(day => {
      const el = document.createElement('div');
      el.className = 'cal-day-name';
      el.textContent = day;
      calendarDays.appendChild(el);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calendarDays.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      el.textContent = d;

      const dateStr = formatDateISO(currentYear, currentMonth, d);
      const dateObj = new Date(currentYear, currentMonth, d);
      dateObj.setHours(0, 0, 0, 0);

      if (dateObj < today) {
        el.classList.add('past');
      } else if (busyDates.includes(dateStr)) {
        el.classList.add('busy');
      } else if (reservationDates.includes(dateStr)) {
        el.classList.add('reserved');
      } else {
        el.classList.add('available');
        el.addEventListener('click', () => selectDate(dateStr));
      }

      if (dateStr === selectedDate) {
        el.classList.add('selected');
      }

      calendarDays.appendChild(el);
    }
  }

  function selectDate(dateStr) {
    selectedDate = dateStr;
    dateInput.value = dateStr;
    dateDisplay.textContent = formatDisplay(dateStr);
    dateDisplay.classList.add('has-value');
    closeCalendar();
  }

  calPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
    loadAvailability();
  });

  calNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
    loadAvailability();
  });

  dateDisplay.addEventListener('click', (e) => {
    e.stopPropagation();
    if (calendarPopup.classList.contains('open')) {
      closeCalendar();
    } else {
      openCalendar();
    }
  });

  calendarPopup.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (calendarPopup.classList.contains('open') &&
        !calendarPopup.contains(e.target) &&
        !dateDisplay.contains(e.target)) {
      closeCalendar();
    }
  });

  dateDisplay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCalendar();
    }
  });

  /* ─── Form submission → POST reservation + formsubmit ─── */
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const dateVal = dateInput.value;
      const nameVal = document.getElementById('name').value.trim();

      if (!dateVal) {
        dateDisplay.focus();
        return;
      }

      try {
        await fetch(`${API_BASE}/api/reservations`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateVal, name: nameVal || undefined })
        });
      } catch (_) {}

      form.submit();
    });
  }
})();
