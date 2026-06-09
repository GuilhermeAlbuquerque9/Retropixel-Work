import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import { getDatabase }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {

  apiKey: "AIzaSyAXFaUSKl3xvxhMl84CYxv_Z6JwPltvKyk",

  authDomain: "retropixel-work.firebaseapp.com",

  projectId: "retropixel-work",

  storageBucket: "retropixel-work.firebasestorage.app",

  messagingSenderId: "215448676055",

  appId: "1:215448676055:web:88a00c5776a35eb604f292"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const rtdb = getDatabase(app);