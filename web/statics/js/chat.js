export const currentUser = {
    nickName: "",
    socket: null,
}

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
export const SwapChat = (user) => {
    const chatCont = document.querySelector(".chat-container")
    const receiver = document.getElementById("receiver")

    if (!receiver) {
        chatCont.prepend(createUserElement(user, true))
        return
    }

    if (receiver.textContent === user.nickname) {
        chatCont.firstElementChild.remove()

        return
    }

    receiver.textContent = user.nickname

    const avatar = chatCont.firstElementChild.querySelector(".avatar")
    if (!avatar) return

    const marker = avatar.querySelector(".online-marker")

    if (user.online && !marker) {
        const newMarker = document.createElement("div")
        newMarker.classList.add("online-marker")
        avatar.append(newMarker)
    }

    if (!user.online && marker) {
        marker.remove()
    }
}

const createUserElement = (user, receiver = false) => {
    const container = document.createElement("div")
    container.classList.add("user-data")
    const avatar = document.createElement("div")
    avatar.classList.add("avatar")
    const img = document.createElement("img")
    img.src = "statics/assets/user.png"
    img.alt = "profile-img"
    const span = document.createElement("span")
    if (receiver) span.id = "receiver"
    else span.classList.add("nickname")

    span.textContent = user.nickname
    avatar.append(img)
    if (user.online) {
        const marker = document.createElement("div")
        marker.classList.add("online-marker")
        avatar.append(marker)
    }

    container.append(avatar, span)
    container.addEventListener("click", () => {
        const nickname = container.children[1].textContent
        const online = container.children[0].children.length === 2

        SwapChat({ nickname, online })

        currentUser.socket.send(JSON.stringify({ sender: currentUser.nickName, receiver: nickname, type: "load_first" }))
    })

    return container
}

const addMessage = (msg) => {
    const type = msg.sender === currentUser.nickName ? "me" : "other"
    const message = new Message(msg.content, type)
    document.getElementById("messages").append(message.create())
}

export const handleChatFront = () => {
    if (currentUser.socket) return

    currentUser.socket = new WebSocket("ws://localhost:8080/ws/chat")

    currentUser.socket.onmessage = (e) => {
        const data = JSON.parse(e.data)

        switch (data.event) {
            case "init":
                const list = document.querySelector(".user-list-wrapper")
                list.innerHTML = ""
                data.users.forEach(u => list.append(createUserElement(u)))
                break

            case "chat":
                addMessage(data.message)
                break

            case "load_message":
                const cont = document.getElementById("messages")
                cont.innerHTML = ""
                data.messages.reverse().forEach(addMessage)
                break
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