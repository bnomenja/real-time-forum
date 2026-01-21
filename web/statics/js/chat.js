export const currentUser = {
    nickName: "",
    socket: null,
}

let currentOffset = 0
let isLoading = false
let hasmore = true


export class Message {
    constructor(content, type, receiver) {
        this.content = content;
        this.type = type;
        this.receiver = receiver
    }

    create() {
        const message = document.createElement("div")
        message.classList.add("message")

        if (this.type === "me") message.classList.add("message-me")
        else message.classList.add("message-other")

        message.textContent = this.content
        return message
    }
}
const SwapChat = (user) => {
    const receiverEl = document.getElementById("receiver")
    const userEL = document.getElementById(user.nickname)
    if (userEL.children.length === 3) userEL.lastChild.remove()

    if (!receiverEl) {
        openChat(user)
        return
    }

    const currentReceiver = receiverEl.textContent

    if (currentReceiver === user.nickname) {
        closeChat()
        return
    }

    switchChat(user)
}

const openChat = (user) => {
    const chatCont = document.querySelector(".chat-container")

    const header = createUserElement(user, false, true)
    header.removeAttribute("id")

    chatCont.prepend(header)

    currentOffset = 0
    hasmore = true
    isLoading = false
    const cont = document.getElementById("messages")
    cont.innerHTML = `<div id="sentinel"></div>`
    observer.observe(document.getElementById("sentinel"))
}

const closeChat = () => {
    const chatCont = document.querySelector(".chat-container")
    const messages = document.getElementById("messages")

    chatCont.firstElementChild?.remove()

    messages.innerHTML = `
        <img src="statics/assets/sleep.png" alt="sleep-icon" id="sleep-icon">
    `
    observer.disconnect()
}

const switchChat = (user) => {
    const chatCont = document.querySelector(".chat-container")
    const receiverEl = document.getElementById("receiver")

    observer.disconnect()
    currentOffset = 0
    hasmore = true
    isLoading = false
    const cont = document.getElementById("messages")
    cont.innerHTML = `<div id="sentinel"></div>`
    observer.observe(document.getElementById("sentinel"))

    receiverEl.textContent = user.nickname
    updateOnlineMarker(chatCont.firstElementChild, user.online)

}


const updateOnlineMarker = (header, online) => {
    const avatar = header.querySelector(".avatar")
    if (!avatar) return

    const marker = avatar.querySelector(".online-marker")

    if (online && !marker) {
        const m = document.createElement("div")
        m.classList.add("online-marker")
        avatar.append(m)
    }

    if (!online && marker) {
        marker.remove()
    }
}

const createUserElement = (user, clickable = true, receiver = false) => {
    const container = document.createElement("div")
    container.classList.add("user-data")
    container.id = user.nickname

    const avatar = document.createElement("div")
    avatar.classList.add("avatar")

    const img = document.createElement("img")
    img.src = "statics/assets/user.png"

    const span = document.createElement("span")
    if (receiver) span.id = "receiver"
    span.textContent = user.nickname

    avatar.append(img)

    if (user.online) {
        const marker = document.createElement("div")
        marker.classList.add("online-marker")
        avatar.append(marker)
    }

    container.append(avatar, span)

    if (clickable) {
        container.addEventListener("click", () => {
            SwapChat({ nickname: user.nickname, online: user.online })
        })
    }

    return container
}

const addMessage = (msg, history = false) => {
    const type = msg.sender === currentUser.nickName ? "me" : "other"
    const message = new Message(msg.content, type)
    const messagesContainer = document.getElementById("messages")

    if (history) {
        messagesContainer.insertBefore(message.create(), messagesContainer.children[1])
    } else {
        messagesContainer.append(message.create())
        messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' })
    }
}

const observer = new IntersectionObserver((entries) => {
    const entry = entries[0]

    if (isLoading || !entry.isIntersecting) return

    if (!hasmore) {
        observer.disconnect()
        return
    }

    isLoading = true
    currentUser.socket.send(JSON.stringify({
        sender: currentUser.nickName,
        receiver: document.getElementById('receiver').textContent,
        type: "load_history",
        offset: currentOffset
    }))

})

export const handleChatFront = () => {
    if (currentUser.socket) return

    currentUser.socket = new WebSocket("ws://localhost:8080/ws/chat")

    currentUser.socket.onmessage = (e) => {
        const data = JSON.parse(e.data)

        switch (data.event) {
            case "init": {
                const list = document.querySelector(".user-list-wrapper")
                list.innerHTML = ""

                data.users.sort((a, b) => {
                    const aHasChat = a.lastChat !== "0001-01-01T00:00:00Z"
                    const bHasChat = b.lastChat !== "0001-01-01T00:00:00Z"

                    if (aHasChat && !bHasChat) return -1
                    if (!aHasChat && bHasChat) return 1

                    if (aHasChat && bHasChat) {
                        return new Date(b.lastChat) - new Date(a.lastChat)
                    }

                    return String(a.nickname).localeCompare(String(b.nickname))
                })

                data.users.forEach(u => {
                    list.append(createUserElement(u))
                })
                currentUser.nickName = data.nickname
                break
            }

            case "chat": {
                const receiver = document.getElementById("receiver")

                if (!receiver || receiver.textContent !== data.message.sender) {
                    const senderEl = document.getElementById(data.message.sender)
                    const oldNotif = senderEl.querySelector(".msg-notif")
                    const notifNumber = oldNotif ? Number(oldNotif.textContent) : 0
                    senderEl.remove()

                    const newUserEl = createUserElement({ nickname: data.message.sender, online: true }, true, false)
                    const notif = document.createElement("div")
                    notif.classList.add("msg-notif")
                    notif.textContent = notifNumber + 1
                    newUserEl.append(notif)

                    const list = document.querySelector(".user-list-wrapper")
                    list.prepend(newUserEl)
                    list.scrollTo({ top: 0, behavior: "smooth" })
                    break

                } else {
                    addMessage(data.message)
                }

                break
            }

            case "history": {
                const cont = document.getElementById("messages")

                const prevScrollHeight = cont.scrollHeight
                const prevScrollTop = cont.scrollTop

                data.messages.forEach(msg => addMessage(msg, true))

                isLoading = false
                if (data.messages.length === 0) hasmore = false
                currentOffset += data.messages.length

                const newScrollHeight = cont.scrollHeight
                cont.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight)

                if (cont.scrollHeight <= cont.clientHeight) {
                    isLoading = true

                    currentUser.socket.send(JSON.stringify({
                        type: "load_history",
                        receiver: document.getElementById("receiver").textContent,
                        offset: currentOffset
                    }))
                }
                break
            }


            case "join": {
                const m = document.createElement("div")
                m.classList.add("online-marker")

                const currentUserEl = document.getElementById(data.newcommers)
                if (!currentUserEl) {
                    const list = document.querySelector(".user-list-wrapper")
                    list.append(createUserElement({ nickname: data.newcommers, online: true }))
                    break
                }

                const oldNotif = currentUserEl.querySelector(".msg-notif")
                const newUser = createUserElement({ nickname: data.newcommers, online: true }, true, false)
                if (oldNotif) newUser.append(oldNotif)
                currentUserEl.parentElement.insertBefore(newUser, currentUserEl)
                currentUserEl.remove()

                const receiver = document.getElementById('receiver')
                if (receiver && receiver.textContent === data.newcommers) {
                    receiver.parentElement.firstChild.append(m)
                }

                break
            }

            case "leave": {
                const currentUserEl = document.getElementById(data.left)
                const oldNotif = currentUserEl.querySelector(".msg-notif")
                const newUser = createUserElement({ nickname: data.left, online: false }, true, false)
                if (oldNotif) newUser.append(oldNotif)
                currentUserEl.parentElement.insertBefore(newUser, currentUserEl)
                currentUserEl.remove()

                const receiver = document.getElementById('receiver')
                if (receiver && receiver.textContent === data.left) {
                    receiver.parentElement.querySelector(".online-marker").remove()
                }

                break
            }
        }
    }

    currentUser.socket.onclose = () => {
        currentUser.socket = null
    }
}

export const sendMessage = () => {
    const receiver = document.getElementById("receiver")?.textContent
    const input = document.getElementById("chat-textarea")
    if (!receiver || !input.value) return

    addMessage({ sender: currentUser.nickName, content: input.value })

    currentUser.socket.send(JSON.stringify({
        type: "chat",
        receiver,
        content: input.value
    }))

    input.value = ""
}