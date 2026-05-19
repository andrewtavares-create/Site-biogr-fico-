// ===== MODAL SYSTEM =====
let currentModal = null;

function openModal(title, fields, onSave) {
  document.getElementById('modal-title').textContent = title;
  const container = document.getElementById('modal-fields');
  container.innerHTML = '';
  container.className = 'modal-fields';

  fields.forEach(f => {
    const label = document.createElement('label');
    label.textContent = f.label;
    container.appendChild(label);

    let el;
    if (f.type === 'textarea') {
      el = document.createElement('textarea');
      el.placeholder = f.placeholder || '';
    } else {
      el = document.createElement('input');
      el.type = f.type || 'text';
      el.placeholder = f.placeholder || '';
    }
    el.id = 'field_' + f.id;
    container.appendChild(el);
  });

  currentModal = { fields, onSave };
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  currentModal = null;
}

function saveModal() {
  if (!currentModal) return;
  const values = {};
  currentModal.fields.forEach(f => {
    const el = document.getElementById('field_' + f.id);
    values[f.id] = el ? el.value.trim() : '';
  });
  if (currentModal.onSave(values)) closeModal();
}

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ===== FRIEND =====
function addFriend() {
  openModal('Adicionar Amigo', [
    { id: 'name', label: 'Nome', placeholder: 'Nome do amigo' },
    { id: 'since', label: 'Amigos desde', placeholder: 'Ex: 2018' },
    { id: 'desc', label: 'Descrição', type: 'textarea', placeholder: 'Como se conheceram...' },
    { id: 'tag', label: 'Rótulo', placeholder: 'Ex: Da escola, Melhor amigo...' },
  ], values => {
    if (!values.name) { alert('Digite o nome do amigo.'); return false; }
    const grid = document.querySelector('.cards-grid');
    const seed = encodeURIComponent(values.name + Date.now());
    const card = document.createElement('div');
    card.className = 'friend-card';
    card.innerHTML = `
      <img src="https://api.dicebear.com/7.x/personas/svg?seed=${seed}" alt="${esc(values.name)}" class="friend-avatar" />
      <h3>${esc(values.name)}</h3>
      <p class="friend-since">Amigos desde ${esc(values.since) || '—'}</p>
      <p class="friend-desc">${esc(values.desc) || ''}</p>
      ${values.tag ? `<span class="tag">${esc(values.tag)}</span>` : ''}
    `;
    grid.appendChild(card);
    return true;
  });
}

// ===== BOOK =====
const bookColors = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

function addBook() {
  openModal('Adicionar Livro', [
    { id: 'title', label: 'Título', placeholder: 'Nome do livro' },
    { id: 'author', label: 'Autor', placeholder: 'Nome do autor' },
    { id: 'stars', label: 'Avaliação (1-5)', placeholder: '5' },
    { id: 'review', label: 'Opinião', type: 'textarea', placeholder: 'O que achou do livro?' },
  ], values => {
    if (!values.title) { alert('Digite o título do livro.'); return false; }
    const list = document.querySelector('.books-list');
    const stars = Math.min(5, Math.max(1, parseInt(values.stars) || 5));
    const starStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    const color = bookColors[Math.floor(Math.random() * bookColors.length)];
    const initial = values.title.charAt(0).toUpperCase();
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-cover" style="background:${color}">
        <span class="book-initial">${esc(initial)}</span>
      </div>
      <div class="book-info">
        <h3>${esc(values.title)}</h3>
        <p class="book-author">${esc(values.author) || ''}</p>
        <div class="stars">${starStr}</div>
        <p class="book-review">${esc(values.review) || ''}</p>
      </div>
    `;
    list.appendChild(card);
    return true;
  });
}

// ===== HOBBY =====
const hobbyEmojis = ['🎸','🖼️','🧩','🌿','🏊','📸','🧘','🎭','🛹','🎲','📝','🌌'];

function addHobby() {
  openModal('Adicionar Hobby', [
    { id: 'emoji', label: 'Emoji', placeholder: 'Ex: 🎸 (deixe em branco para aleatório)' },
    { id: 'name', label: 'Nome do Hobby', placeholder: 'Ex: Fotografia' },
    { id: 'desc', label: 'Descrição', type: 'textarea', placeholder: 'Conte um pouco sobre esse hobby...' },
  ], values => {
    if (!values.name) { alert('Digite o nome do hobby.'); return false; }
    const grid = document.querySelector('.hobbies-grid');
    const emoji = values.emoji || hobbyEmojis[Math.floor(Math.random() * hobbyEmojis.length)];
    const card = document.createElement('div');
    card.className = 'hobby-card';
    card.innerHTML = `
      <span class="hobby-icon">${esc(emoji)}</span>
      <h3>${esc(values.name)}</h3>
      <p>${esc(values.desc) || ''}</p>
    `;
    grid.appendChild(card);
    return true;
  });
}

// ===== UTIL =====
function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== NAV ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sticky-nav a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.background = '';
        a.style.color = '';
      });
      const active = document.querySelector(`.sticky-nav a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.background = 'var(--primary)';
        active.style.color = '#fff';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));
