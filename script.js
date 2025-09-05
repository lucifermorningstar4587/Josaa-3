// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfxnWYVKjjrbRedApuwGFf8pN7Fk-2o4w",
    authDomain: "josaa3-3e4ef.firebaseapp.com",
    projectId: "josaa3-3e4ef",
    storageBucket: "josaa3-3e4ef.firebasestorage.app",
    messagingSenderId: "927380135936",
    appId: "1:927380135936:web:0c8ef2ecf3c7d1982df8e5",
    measurementId: "G-PDDEBBENYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Custom message box functions
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');

function showMessageBox(message) {
    messageText.innerText = message;
    messageBox.classList.remove('hidden');
    setTimeout(() => {
        messageBox.classList.add('is-visible');
    }, 10);
}

function closeMessageBox() {
    messageBox.classList.remove('is-visible');
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 300); // Wait for transition to finish
}
// Make the function globally accessible for the onclick attribute
window.closeMessageBox = closeMessageBox;

// Modal functionality
const signupModal = document.getElementById('signup-modal');
const signinModal = document.getElementById('signin-modal');
const signupBtn = document.getElementById('signup-btn');
const ctaSignupBtn = document.getElementById('cta-signup-btn');
const signinBtn = document.getElementById('signin-btn');
const closeSignupModal = document.getElementById('close-signup-modal');
const closeSigninModal = document.getElementById('close-signin-modal');

signupBtn.onclick = () => signupModal.classList.add('is-visible');
ctaSignupBtn.onclick = () => signupModal.classList.add('is-visible');
signinBtn.onclick = () => signinModal.classList.add('is-visible');

closeSignupModal.onclick = () => signupModal.classList.remove('is-visible');
closeSigninModal.onclick = () => signinModal.classList.remove('is-visible');

window.onclick = function(event) {
    if (event.target == signupModal) {
        signupModal.classList.remove('is-visible');
    }
    if (event.target == signinModal) {
        signinModal.classList.remove('is-visible');
    }
}

// Form Submission Logic (Real Firebase)
document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        // Sign up user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Save additional user info to Firestore
        await setDoc(doc(db, "users", user.uid), {
            firstName: data['first-name'],
            lastName: data['last-name'],
            username: data.username,
            email: data.email,
            dob: data.dob,
            role: data.role
        });

        showMessageBox('Account created successfully!');
        this.reset();
        signupModal.classList.remove('is-visible');

    } catch (error) {
        console.error("Sign up failed:", error);
        showMessageBox(`Sign up failed: ${error.message}`);
    }
});

document.getElementById('signin-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        // Sign in user with email and password
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'student'; // Default to student

        showMessageBox('Logged in successfully!');
        this.reset();
        signinModal.classList.remove('is-visible');

        // Redirect based on role
        if (role === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else if (role === 'mentor') {
            window.location.href = 'mentor_dashboard.html';
        } else {
            window.location.href = 'student_dashboard.html';
        }

    } catch (error) {
        console.error("Sign in failed:", error);
        showMessageBox(`Sign in failed: ${error.message}`);
    }
});

// Dynamic Counters with Intersection Observer
const counters = document.querySelectorAll('.count-up-stat');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            let current = 0;
            const increment = Math.ceil(target / 200);
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = current;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
            observer.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    observer.observe(counter);
});

// Hero Text/Button Animations
document.addEventListener('DOMContentLoaded', () => {
    const heroElements = document.querySelectorAll('.hero-section .fade-in-up');
    heroElements.forEach(el => el.classList.add('active'));
});

// Background Animation: Flowing Waves
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let waves = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    waves = [];
    for (let i = 0; i < 5; i++) {
        waves.push({
            x: 0,
            y: Math.random() * canvas.height,
            speed: Math.random() * 0.2 + 0.1,
            amplitude: Math.random() * 50 + 50,
            color: `hsla(${Math.random() * 360}, 70%, 50%, 0.1)`,
            frequency: Math.random() * 0.005 + 0.005
        });
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    waves.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 15;

        ctx.moveTo(0, wave.y);
        for (let x = 0; x < canvas.width; x++) {
            const y = wave.y + Math.sin((x + wave.x) * wave.frequency) * wave.amplitude;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        wave.x += wave.speed;
        if (wave.x > canvas.width) {
            wave.x = 0;
            wave.y = Math.random() * canvas.height;
            wave.speed = Math.random() * 0.2 + 0.1;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    drawWaves();
}

window.onload = function() {
    animate();
};
