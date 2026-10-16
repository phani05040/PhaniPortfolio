/* ---------- Project data: edit live/code links here ---------- */
const projects = [
  { name: 'AI Calling Agent', icon: '☎', tags: ['AI', 'Voice', 'Automation'],
    desc: 'An AI agent that can place and handle phone calls, holding a spoken conversation and acting on what it hears.',
    points: ['Speech-to-text and text-to-speech conversation loop', 'AI model decides replies and next actions', 'Built to automate repetitive calling tasks'],
    live: '', code: '' },
  { name: 'Portfolio', icon: '✦', tags: ['HTML', 'CSS', 'JavaScript'],
    desc: 'This personal brand site showcasing my skills, projects, education and certificates, with one-tap call, WhatsApp, email and resume download.',
    points: ['Responsive layout with automatic light and dark mode', 'Direct contact actions for recruiters', 'Plain HTML, CSS and JS, no build step'],
    live: '', code: '' },
  { name: 'Organic Farm E-Commerce Store', icon: '❋', tags: ['Community Service', 'HTML', 'CSS', 'JavaScript'],
    desc: 'A community service project: an online store connecting organic farmers directly with consumers.',
    points: ['Product catalogue for organic produce', 'Cart and ordering flow', 'Aimed at giving small farmers a direct sales channel'],
    live: '', code: '' },
  { name: 'EcoTrack — AI Carbon Footprint Tracker', icon: '🌍', tags: ['AI', 'Sustainability', 'Web'],
    desc: 'A tracker that helps users measure their carbon footprint and suggests ways to reduce it using AI.',
    points: ['Logs daily activities that affect emissions', 'AI-generated suggestions to lower impact', 'Focused on making sustainability measurable'],
    live: '', code: '' },
  { name: 'Vehicle Rental System', icon: '🚗', tags: ['Web', 'Database'],
    desc: 'A system for browsing vehicles and managing rental bookings and records.',
    points: ['Vehicle listing and availability', 'Booking and rental record management', 'Database-backed data handling'],
    live: '', code: '' },
  { name: 'AI Doctor (IBM)', icon: '✚', tags: ['Python', 'Machine Learning', 'IBM'],
    desc: 'A healthcare assistance project built with IBM tooling that gives preliminary symptom analysis and wellness guidance.',
    points: ['Symptom-based preliminary analysis', 'Built using IBM AI platform services', 'Guidance only, not a substitute for a doctor'],
    live: '', code: '' },
  { name: 'Backend Result Server', icon: '▤', tags: ['Java', 'Spring Boot', 'SQL'],
    desc: 'Backend for a results application: handles student result data, business logic and APIs.',
    points: ['REST APIs for results retrieval and management', 'Layered flow: controller, service, database', 'SQL-backed storage'],
    live: '', code: '' },
  { name: 'Personal Messenger & Private Space', icon: '💬', tags: ['Mobile', 'Real-time', 'Chat'],
    desc: 'A private two-person app for real-time chat, calls and shared media in one personal space.',
    points: ['Real-time messaging', 'Calling and media sharing', 'Private, invite-only by design'],
    live: '', code: '' },
  { name: 'Truth or Dare Mobile App', icon: '🎲', tags: ['Mobile', 'Game'],
    desc: 'A mobile party game app that serves up truth and dare challenges for groups of friends.',
    points: ['Quick-start rounds with random prompts', 'Simple, social game flow', 'Built for mobile screens'],
    live: '', code: '' }
];

const $ = id => document.getElementById(id);
const grid = $('project-grid'), notice = $('notice'), modal = $('modal');
let noticeTimer;

function showNotice(msg) {
  notice.textContent = msg;
  notice.classList.add('show');
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => notice.classList.remove('show'), 2800);
}

/* ---------- Render project cards ---------- */
projects.forEach((p, i) => {
  const card = document.createElement('article');
  card.className = 'project';
  card.innerHTML = `
    <div class="project-top"><div class="project-icon">${p.icon}</div><span class="project-num">${String(i + 1).padStart(2, '0')}</span></div>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="project-actions">
      <button class="btn primary" data-kind="live" data-i="${i}">View Live ↗</button>
      <button class="btn secondary" data-kind="code" data-i="${i}">View Code</button>
      <button class="btn about-project" data-kind="about" data-i="${i}">About This Project</button>
    </div>`;
  grid.appendChild(card);
});

grid.addEventListener('click', e => {
  const b = e.target.closest('button[data-kind]');
  if (!b) return;
  const p = projects[+b.dataset.i], kind = b.dataset.kind;
  if (kind === 'about') return openModal(p);
  if (!p[kind]) return showNotice(`${kind === 'live' ? 'Live demo' : 'Source code'} link for "${p.name}" is coming soon.`);
  window.open(p[kind], '_blank', 'noopener,noreferrer');
});

/* ---------- Modal ---------- */
function openModal(p) {
  $('modal-icon').textContent = p.icon;
  $('modal-title').textContent = p.name;
  $('modal-desc').textContent = p.desc;
  $('modal-points').innerHTML = p.points.map(x => `<li>${x}</li>`).join('');
  $('modal-tags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');
  modal.hidden = false;
}
const closeModal = () => { modal.hidden = true; };
$('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- Mobile menu ---------- */
const menu = $('menu'), links = $('navlinks');
menu.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '✕' : '☰';
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = '☰';
}));

/* ---------- Resume: friendly message if the file isn't there yet ---------- */
document.querySelectorAll('.resume-link').forEach(a => {
  a.addEventListener('click', async e => {
    try {
      const r = await fetch(a.getAttribute('href'), { method: 'HEAD' });
      if (!r.ok) throw new Error('missing');
    } catch (err) {
      if (location.protocol !== 'file:') { e.preventDefault(); showNotice('Resume will be available here shortly.'); }
    }
  });
});

/* ---------- Active nav link on scroll ---------- */
const sections = [...document.querySelectorAll('main section[id]')];
const navA = [...links.querySelectorAll('a')];
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => io.observe(s));

$('year').textContent = new Date().getFullYear();

/* To use your photo: put it in assets/ (e.g. assets/me.jpg) then uncomment:
$('avatar').innerHTML = '<img src="assets/me.jpg" alt="Phanindra">'; */
