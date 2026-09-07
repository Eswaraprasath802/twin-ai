const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const patientData = {
  amelia: { name: 'Amelia Knight', short: "Amelia's", meta: 'Knee replacement · Day 12', score: 82, milestone: 'Day 18', risk: 18, note: 'Inflammation trend needs review' },
  marcus: { name: 'Marcus Reed', short: "Marcus'", meta: 'Hip replacement · Day 8', score: 74, milestone: 'Day 16', risk: 11, note: 'All signals within expected range' },
  sophia: { name: 'Sophia Lee', short: "Sophia's", meta: 'Shoulder repair · Day 19', score: 88, milestone: 'Day 25', risk: 7, note: 'Low complication risk' }
};

let toastTimer;
function showToast(title, message) {
  $('#toastTitle').textContent = title;
  $('#toastMessage').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3400);
}

function openModal(modal) {
  $('#modalBackdrop').hidden = false;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('button, select, textarea', modal)?.focus(), 30);
}

function closeModals() {
  $('#modalBackdrop').hidden = true;
  $$('.modal').forEach(modal => modal.hidden = true);
  document.body.style.overflow = '';
}

$('#patientSwitcher').addEventListener('click', event => {
  event.stopPropagation();
  const menu = $('#patientMenu');
  const isOpen = menu.classList.toggle('open');
  $('#patientSwitcher').setAttribute('aria-expanded', String(isOpen));
});

$$('.patient-option').forEach(option => option.addEventListener('click', () => {
  const key = option.dataset.patient;
  const data = patientData[key];
  $$('.patient-option').forEach(item => item.classList.toggle('selected', item === option));
  $('#patientNameTop').textContent = data.name;
  $('#patientMetaTop').textContent = data.meta;
  $('#patientNameIntro').textContent = data.short;
  $('#recoveryScore').textContent = data.score;
  $('#scoreBar').style.width = `${data.score}%`;
  $('#milestoneDay').textContent = data.milestone;
  $('#riskScore').textContent = `${data.risk}%`;
  $('#riskNeedle').style.left = `${data.risk}%`;
  $('#riskNote').textContent = data.note;
  $('#patientMenu').classList.remove('open');
  $('#patientSwitcher').setAttribute('aria-expanded', 'false');
  showToast('Patient twin loaded', `${data.name}'s live recovery model is now in view.`);
}));

document.addEventListener('click', () => {
  $('#patientMenu').classList.remove('open');
  $('#patientSwitcher').setAttribute('aria-expanded', 'false');
});

$$('.segmented button').forEach(button => button.addEventListener('click', () => {
  $$('.segmented button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const range = button.dataset.range;
  $('#chartTitle').textContent = `${range}-day recovery trajectory`;
  showToast(`${range}-day view`, 'The trajectory window has been updated.');
}));

$('#simulationButton').addEventListener('click', () => {
  const button = $('#simulationButton');
  if (document.body.classList.contains('simulating')) return;
  document.body.classList.add('simulating');
  button.innerHTML = '<span class="live-dot"></span>Simulating twin…';
  setTimeout(() => {
    document.body.classList.remove('simulating');
    button.innerHTML = '<svg viewBox="0 0 24 24"><path d="m7 4 13 8-13 8V4Z"/></svg>Run simulation';
    showToast('Simulation complete', 'Milestone projection remains stable at Day 18.');
  }, 2400);
});

$('#reviewAlert').addEventListener('click', () => openModal($('#warningModal')));
$('#noteButton').addEventListener('click', () => openModal($('#noteModal')));
$('#modalBackdrop').addEventListener('click', closeModals);
$$('[data-close-modal]').forEach(button => button.addEventListener('click', closeModals));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModals(); });

$('#saveAction').addEventListener('click', () => {
  const action = $('#clinicalAction').selectedOptions[0].textContent;
  closeModals();
  showToast('Clinical action saved', action);
});

$('#saveNote').addEventListener('click', () => {
  const text = $('#noteText').value.trim();
  if (!text) { $('#noteText').focus(); return; }
  $('#noteText').value = '';
  closeModals();
  showToast('Note added', 'The clinical note was added to Amelia’s timeline.');
});

$('#dismissAlert').addEventListener('click', () => {
  const panel = $('.alert-panel');
  panel.classList.add('dismissed');
  setTimeout(() => { panel.style.display = 'none'; }, 310);
  showToast('Warning dismissed', 'The signal will continue to be monitored.');
});

$$('.plan-item').forEach(item => item.addEventListener('click', () => {
  const completed = !item.classList.contains('complete');
  item.classList.toggle('complete', completed);
  item.setAttribute('aria-pressed', String(completed));
  const count = $$('.plan-item.complete').length;
  $('#completionText').textContent = `${count} of 4 complete`;
  if (completed) showToast('Exercise completed', $('strong', item).textContent);
}));

$('#menuButton').addEventListener('click', () => {
  const sidebar = $('#sidebar');
  const isOpen = sidebar.classList.toggle('open');
  $('#menuButton').setAttribute('aria-expanded', String(isOpen));
});

$$('.nav-item[href]').forEach(item => item.addEventListener('click', event => {
  const target = $(item.getAttribute('href'));
  if (!target) {
    event.preventDefault();
    showToast('Coming soon', `${item.textContent.trim()} is ready for the next product phase.`);
  }
  if (window.innerWidth <= 800) $('#sidebar').classList.remove('open');
}));

$('#insightButton').addEventListener('click', () => showToast('Top prediction factors', 'Range of motion, step count, and falling pain score.'));
$('#openTwinButton').addEventListener('click', () => showToast('Twin workspace', 'The full 3D twin viewer is opening in the next product view.'));
$('#editPlanButton').addEventListener('click', () => showToast('Adaptive plan', 'Plan editor is ready for clinician adjustments.'));
$('#helpButton').addEventListener('click', () => showToast('Help center', 'Clinical support is available around the clock.'));
$('#privacyButton').addEventListener('click', () => showToast('Privacy & safety', 'Patient data is protected with role-based clinical access.'));
