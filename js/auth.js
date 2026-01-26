import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

const authAreas = document.querySelectorAll('.auth-area');
const btnShowLoginEls = document.querySelectorAll('.btn-show-login, .btn-show-login');
const btnShowRegisterEls = document.querySelectorAll('.btn-show-register, .btn-show-register');

const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const btnGoogleLogin = document.getElementById('btn-google-login');
const btnGoogleRegister = document.getElementById('btn-google-register');

let currentUser = null;

// Signup popup helpers
const signupPopup = document.getElementById('signup-popup');
const signupClose = document.getElementById('signup-close');
const confettiLayer = document.getElementById('confetti-layer');
const signupTitle = document.getElementById('signup-title');
const signupMessage = document.getElementById('signup-message');
const signupCta = document.getElementById('signup-cta');

function clearConfetti() { if (confettiLayer) confettiLayer.innerHTML = ''; }
function launchConfetti(count = 18) {
  if (!confettiLayer) return;
  clearConfetti();
  const colors = ['#ff3b30','#ffcc00','#4cd964','#007aff','#ff2d55','#7f42a7'];
  for (let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.background = colors[i % colors.length];
    el.style.left = (10 + Math.random()*80) + '%';
    el.style.top = (Math.random()*20) + 'px';
    el.style.width = (6 + Math.random()*10) + 'px';
    el.style.height = (10 + Math.random()*12) + 'px';
    el.style.animationDelay = (Math.random()*300) + 'ms';
    el.style.transform = `translateY(-60px) rotate(${Math.random()*180}deg)`;
    confettiLayer.appendChild(el);
  }
}

function showSignupPopup(userEmail){
  if (!signupPopup) return;
  signupTitle.textContent = 'Welcome!';
  signupMessage.innerHTML = `Hi <strong>${userEmail}</strong> — you got <strong>5% OFF</strong> on all projects 🎉`;
  signupPopup.style.display = 'flex';
  signupPopup.setAttribute('aria-hidden','false');
  launchConfetti(20);
  setTimeout(()=>{ if (signupPopup) signupPopup.classList.add('show'); }, 10);
  // auto-close after 6s
  setTimeout(()=>{ hideSignupPopup(); }, 6000);
}

function hideSignupPopup(){
  if (!signupPopup) return;
  signupPopup.classList.remove('show');
  signupPopup.setAttribute('aria-hidden','true');
  clearConfetti();
  signupPopup.style.display = 'none';
}

signupClose?.addEventListener('click', hideSignupPopup);
signupCta?.addEventListener('click', ()=>{ hideSignupPopup(); document.querySelector('a[href="#projects"]').scrollIntoView({behavior:'smooth'}); });

function show(el) { if (!el) return; el.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
function hide(el) { if (!el) return; el.style.display = 'none'; document.body.style.overflow = ''; }

btnShowLoginEls.forEach(el => el?.addEventListener('click', () => show(loginModal)));
btnShowRegisterEls.forEach(el => el?.addEventListener('click', () => show(registerModal)));
closeLogin?.addEventListener('click', () => hide(loginModal));
closeRegister?.addEventListener('click', () => hide(registerModal));

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    hide(registerModal);
    // show celebratory popup for new signups
    try { showSignupPopup(userCred.user.email); } catch(e){ console.warn(e); }
  } catch (err) {
    alert(err.message);
  }
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    hide(loginModal);
    alert('Logged in successfully');
  } catch (err) {
    alert(err.message);
  }
});

// Google sign-in (popup)
async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    hide(loginModal);
    hide(registerModal);
    // If this is a new user, show signup popup
    if (result?.additionalUserInfo?.isNewUser) {
      try { showSignupPopup(result.user.email); } catch(e){ console.warn(e); }
    }
  } catch (err) {
    alert(err.message);
  }
}

btnGoogleLogin?.addEventListener('click', googleSignIn);
btnGoogleRegister?.addEventListener('click', googleSignIn);

function renderAuth(user) {
  currentUser = user;
  authAreas.forEach(area => {
    if (user) {
      area.innerHTML = `
        <span style="color:#fff;margin-right:10px;">Hi, ${user.email}</span>
        <span class="user-discount">5% OFF</span>
        <button id="btn-logout" class="btn-auth">Logout</button>
      `;
      const logoutBtn = area.querySelector('#btn-logout');
      logoutBtn?.addEventListener('click', async () => { await signOut(auth); });
    } else {
      area.innerHTML = `
        <button class="btn-show-login btn-auth">Login</button>
        <button class="btn-show-register btn-auth">Register</button>
      `;
      area.querySelectorAll('.btn-show-login').forEach(el => el.addEventListener('click', () => show(loginModal)));
      area.querySelectorAll('.btn-show-register').forEach(el => el.addEventListener('click', () => show(registerModal)));
    }
  });
}

onAuthStateChanged(auth, (user) => {
  renderAuth(user);
});

export { currentUser };
