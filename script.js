let chats = {}
let openTabs = []
let activeChat = null
let chatCounter = 1

const chatList    = document.getElementById("chatList")
const tabsEl      = document.getElementById("tabs")
const messagesEl  = document.getElementById("messages")
const input       = document.getElementById("messageInput")
const sendBtn     = document.getElementById("sendBtn")

document.getElementById("addChat").onclick = createChat
sendBtn.onclick = sendMessage

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) sendMessage()
})

updateSendState()

function updateSendState() {
  sendBtn.disabled = activeChat === null
}

function createChat() {
  const id   = "chat" + chatCounter
  const name = "Inquiry " + chatCounter
  chatCounter++

  chats[id] = []

  addChatToSidebar(id, name)
  openTab(id, name)
}

function addChatToSidebar(id, name) {
  const div = document.createElement("div")
  div.className = "chatItem"
  div.id = "sidebar_" + id
  div.textContent = name
  div.onclick = () => openTab(id, name)
  chatList.appendChild(div)
}

function openTab(id, name) {
  if (!openTabs.includes(id)) {
    openTabs.push(id)

    const tab = document.createElement("div")
    tab.className = "tab"
    tab.id = "tab_" + id

    const label = document.createElement("span")
    label.textContent = name

    const close = document.createElement("span")
    close.className = "closeTab"
    close.innerHTML = "✕"
    close.onclick = function(e) {
      e.stopPropagation()
      closeTab(id)
    }

    tab.appendChild(label)
    tab.appendChild(close)
    tab.onclick = () => switchChat(id)
    tabsEl.appendChild(tab)
  }

  switchChat(id)
}

function switchChat(id) {
  activeChat = id

  // Update tabs
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"))
  document.getElementById("tab_" + id)?.classList.add("active")

  // Update sidebar
  document.querySelectorAll(".chatItem").forEach(t => t.classList.remove("active"))
  document.getElementById("sidebar_" + id)?.classList.add("active")

  renderMessages()
  updateSendState()
}

function closeTab(id) {
  document.getElementById("tab_" + id)?.remove()
  openTabs = openTabs.filter(t => t !== id)

  if (activeChat === id) {
    activeChat = openTabs[0] || null
    if (activeChat) switchChat(activeChat)
    else {
      renderMessages()
      document.querySelectorAll(".chatItem").forEach(t => t.classList.remove("active"))
    }
  }

  updateSendState()
}

function sendMessage() {
  const text = input.value.trim()
  if (!text || !activeChat) return

  chats[activeChat].push({ role: "user", text })
  input.value = ""
  renderMessages()
}

function renderMessages() {
  messagesEl.innerHTML = ""

  if (!activeChat || chats[activeChat].length === 0) {
    const empty = document.createElement("div")
    empty.className = "empty-state"
    empty.innerHTML = `
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 8a4 4 0 014-4h16a4 4 0 014 4v12a4 4 0 01-4 4H10l-6 4V8z"
            stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      </div>
      <p>${activeChat ? "Send a message to get started" : "Select or create an inquiry to begin"}</p>
    `
    messagesEl.appendChild(empty)
    return
  }

  chats[activeChat].forEach(msg => {
    const div = document.createElement("div")
    div.className = "message " + (msg.role || "user")
    div.textContent = msg.text
    messagesEl.appendChild(div)
  })

  messagesEl.scrollTop = messagesEl.scrollHeight
}
