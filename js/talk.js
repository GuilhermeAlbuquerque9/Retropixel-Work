import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyAXFaUSKl3xvxhMl84CYxv_Z6JwPltvKyk",

    authDomain: "retropixel-work.firebaseapp.com",

    projectId: "retropixel-work",

    storageBucket: "retropixel-work.firebasestorage.app",

    messagingSenderId: "215448676055",

    appId: "1:215448676055:web:88a00c5776a35eb604f292"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

let currentUser = null;
let selectedUser = null;

window.registerUser = async function(){

    const username =
    document.getElementById("username").value.trim();

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value;

    if(!username || !email || !password){

        alert("Preencha todos os campos.");
        return;
    }

    try{

        const usersSnapshot =
        await getDocs(collection(db,"users"));

        let exists = false;

        usersSnapshot.forEach(doc=>{

            if(
                doc.data().username.toLowerCase() ===
                username.toLowerCase()
            ){
                exists = true;
            }

        });

        if(exists){

            alert("Esse nome já existe.");
            return;
        }

        const credential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await setDoc(
            doc(db,"users",credential.user.uid),
            {
                username,
                email,
                status:"online",
                createdAt:serverTimestamp()
            }
        );

        alert("Conta criada!");

    }catch(error){

        alert(error.message);
    }

};

window.login = async function(){

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value;

    try{

        const credential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        currentUser = credential.user;

        document
        .getElementById("loginScreen")
        .style.display = "none";

        document
        .getElementById("talkApp")
        .classList.remove("hidden");

        loadUsers();

    }catch(error){

        alert("Login inválido.");
    }

};

window.logout = async function(){

    await signOut(auth);

    location.reload();
};

async function loadUsers(){

    const usersDiv =
    document.getElementById("usersList");

    usersDiv.innerHTML = "";

    const snapshot =
    await getDocs(
        collection(db,"users")
    );

    snapshot.forEach(userDoc=>{

        if(userDoc.id === currentUser.uid)
            return;

        const user =
        userDoc.data();

        const card =
        document.createElement("div");

        card.className = "user-card";

        card.innerHTML = `
        <div>
            <div class="user-name">
                ${user.username}
            </div>
            <div class="user-status">
                ${statusEmoji(user.status)}
            </div>
        </div>
        `;

        card.onclick = ()=>{

            selectedUser = {

                uid:userDoc.id,

                username:user.username
            };

            document.getElementById(
                "chatHeader"
            ).textContent =
            user.username;

            loadMessages();
        };

        usersDiv.appendChild(card);

    });

}

function statusEmoji(status){

    switch(status){

        case "online":
            return "🟢 Online";

        case "ocupado":
            return "🔴 Ocupado";

        case "curtindo":
            return "🟠 Curtindo";

        default:
            return "⚫ Offline";
    }

}

function conversationId(a,b){

    return [a,b].sort().join("_");
}

window.sendMessage = async function(){

    if(!selectedUser)
        return;

    const input =
    document.getElementById(
        "messageInput"
    );

    const text =
    input.value.trim();

    if(!text)
        return;

    const conversation =
    conversationId(
        currentUser.uid,
        selectedUser.uid
    );

    await addDoc(

        collection(
            db,
            "conversations",
            conversation,
            "messages"
        ),

        {
            sender:currentUser.uid,
            text,
            createdAt:serverTimestamp()
        }

    );

    input.value = "";

};

function loadMessages(){

    const conversation =
    conversationId(
        currentUser.uid,
        selectedUser.uid
    );

    const messagesDiv =
    document.getElementById(
        "messages"
    );

    const q = query(

        collection(
            db,
            "conversations",
            conversation,
            "messages"
        ),

        orderBy("createdAt")

    );

    onSnapshot(q,(snapshot)=>{

        messagesDiv.innerHTML = "";

        snapshot.forEach(doc=>{

            const msg =
            doc.data();

            const div =
            document.createElement("div");

            div.className =
            msg.sender === currentUser.uid
            ? "message sent"
            : "message received";

            div.textContent =
            msg.text;

            messagesDiv.appendChild(div);

        });

        messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

    });

}

document
.getElementById("statusSelect")
.addEventListener(
"change",
async function(){

    if(!currentUser)
        return;

    await setDoc(

        doc(
            db,
            "users",
            currentUser.uid
        ),

        {
            status:this.value
        },

        {
            merge:true
        }

    );

    document
    .getElementById("myStatus")
    .textContent =
    statusEmoji(this.value);

});