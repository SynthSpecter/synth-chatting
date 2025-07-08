// Configuration pour le stockage local
// Configuration for local storage
const messagesKey = 'chatMessages'
let currentUser = ''

// Éléments DOM
// DOM elements
const userSetupDiv = document.getElementById('user-setup')
const usernameInput = document.getElementById('username-input')
const startChatButton = document.getElementById('start-chat')
const chatContainer = document.getElementById('chat-container')
const messagesDiv = document.getElementById('messages')
const messageInput = document.getElementById('message-input')
const sendButton = document.getElementById('send-button')
const messageSound = document.getElementById('message-sound')
const sendSound = document.getElementById('send-sound')

/**
 * Joue un effet sonore
 * Plays a sound effect
 * @param {string} soundId - L'ID de l'élément audio à jouer
 * @param {string} soundId - The ID of the audio element to play
 */
function playSound(soundId) {
  const sound = document.getElementById(soundId)
  if (sound) {
    sound.currentTime = 0 // Réinitialiser le son au début
    sound.play().catch((e) => console.log('Erreur de lecture du son:', e))
    // Reset sound to beginning
    // Error playing sound:
  }
}

/**
 * Charge les messages depuis le stockage local et les affiche
 * Loads messages from local storage and displays them
 */
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem(messagesKey)) || []
  messagesDiv.innerHTML = '' // Effacer les messages actuels
  // Clear current messages
  messages.forEach((message) => {
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    messageElement.classList.add(
      message.uid === currentUser ? 'sent' : 'received'
    )
    messageElement.innerHTML = `<span class="username">${message.uid}: </span>${message.text}`
    messagesDiv.appendChild(messageElement)

    // Jouer un son pour chaque message reçu (sauf si c'est l'utilisateur actuel qui l'a envoyé)
    // Play a sound for each received message (except if it was sent by the current user)
    if (message.uid !== currentUser) {
      setTimeout(() => playSound('message-sound'), 100)
    }
  })
  messagesDiv.scrollTop = messagesDiv.scrollHeight
  // Faire défiler vers le bas pour voir les nouveaux messages
  // Scroll to bottom to see new messages
}

/**
 * Envoie un message
 * Sends a message
 */
function sendMessage() {
  const text = messageInput.value.trim()
  if (text) {
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || []
    const newMessage = {
      uid: currentUser,
      text: text,
      timestamp: Date.now(),
    }
    messages.push(newMessage)
    localStorage.setItem(messagesKey, JSON.stringify(messages))

    // Ajouter le message à l'affichage
    // Add the message to the display
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    messageElement.classList.add('sent')
    messageElement.innerHTML = `<span class="username">${currentUser}: </span>${text}`
    messagesDiv.appendChild(messageElement)
    messagesDiv.scrollTop = messagesDiv.scrollHeight

    messageInput.value = ''

    // Jouer le son d'envoi
    // Play the send sound
    playSound('send-sound')
  }
}

/**
 * Démarre le chat après que l'utilisateur ait entré son pseudo
 * Starts the chat after the user has entered their username
 */
function startChat() {
  const username = usernameInput.value.trim()
  if (username) {
    currentUser = username
    userSetupDiv.style.display = 'none'
    chatContainer.style.display = 'flex'
    loadMessages()
  } else {
    alert('Veuillez entrer un pseudo')
    // Please enter a username
  }
}

// Écouter les changements dans le stockage local
// Listen for changes in local storage
window.addEventListener('storage', (event) => {
  if (event.key === messagesKey) {
    // Recharger les messages si le stockage local a changé
    // Reload messages if local storage has changed
    loadMessages()
  }
})

// Événements
// Events
startChatButton.addEventListener('click', startChat)
sendButton.addEventListener('click', sendMessage)
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage()
})

// Charger les messages au démarrage (utile si on recharge la page)
// Load messages on startup (useful if page is reloaded)
loadMessages()
