// Importations nécessaires pour Firebase 9.x
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import {
  getAuth,
  signInAnonymously,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js'

// Configuration Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBJUAigc-66F84lQ7w17quuOhmA2wk02OM',
  authDomain: 'my-synth-chat.firebaseapp.com',
  databaseURL: 'https://my-synth-chat-default-rtdb.firebaseio.com',
  projectId: 'my-synth-chat',
  storageBucket: 'my-synth-chat.firebasestorage.app',
  messagingSenderId: '781020576232',
  appId: '1:781020576232:web:db20124a68bbca8b0bcc5d',
  measurementId: 'G-L57VH7Z69F',
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)

// Authentification anonyme
signInAnonymously(auth).catch((error) => {
  console.error("Erreur d'authentification:", error)
})

// Éléments DOM
const messagesDiv = document.getElementById('messages')
const messageInput = document.getElementById('message-input')
const sendButton = document.getElementById('send-button')

// Écouter les nouveaux messages
const messagesRef = ref(database, 'messages')
onChildAdded(messagesRef, (snapshot) => {
  const message = snapshot.val()
  const messageElement = document.createElement('div')
  messageElement.classList.add('message')
  messageElement.classList.add(
    message.uid === auth.currentUser?.uid ? 'sent' : 'received'
  )
  messageElement.textContent = message.text
  messagesDiv.appendChild(messageElement)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
})

// Envoyer un message
function sendMessage() {
  const text = messageInput.value.trim()
  if (text) {
    const messagesRef = ref(database, 'messages')
    push(messagesRef, {
      uid: auth.currentUser?.uid,
      text: text,
      timestamp: Date.now(),
    })
    messageInput.value = ''
  }
}

// Événements
sendButton.addEventListener('click', sendMessage)
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage()
})
