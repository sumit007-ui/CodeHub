import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js';
import { auth, } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

const contactForm = document.getElementById('contact-form');
const statusEl = document.getElementById('contact-status');
const phoneEl = document.getElementById('phone');
let currentUser = null;

onAuthStateChanged(auth, (u) => { currentUser = u; });

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    statusEl.className = 'status-error';
    statusEl.textContent = 'Please complete name, email and message.';
    return;
  }

  statusEl.className = '';
  statusEl.textContent = 'Sending...';

  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      name,
      email,
      phone: phone || null,
      message,
      fromUid: currentUser ? currentUser.uid : null,
      fromEmail: currentUser ? currentUser.email : null,
      discountApplied: currentUser ? 5 : 0,
      createdAt: serverTimestamp()
    });
    statusEl.className = 'status-ok';
    statusEl.textContent = 'Message sent — thank you!';

    // If user is registered/logged-in, show discount note briefly
    if (currentUser) {
      const badge = document.createElement('div');
      badge.className = 'discount-badge';
      badge.textContent = 'You get 5% OFF on all projects — applied!';
      statusEl.parentElement.appendChild(badge);
      setTimeout(()=> badge.classList.add('show'), 50);
      setTimeout(()=> badge.remove(), 6000);
    }
    contactForm.reset();
  } catch (err) {
    console.error(err);
    statusEl.className = 'status-error';
    statusEl.textContent = 'Error sending message: ' + err.message;
  }
});
