export const currentUser = {
    nickName: "",
    socket: null,
}

export class Message {
    constructor(content, type, receiver = null) {
        this.content = content;
        this.sender = currentUser.nickName;
        this.type = type;
        this.receiver = receiver;
        this.time = Date.now()
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

export const SwapChat = (nickName) => {
    const receiver = document.getElementById("receiver")
    receiver.textContent = nickName
}

const createUserElement = (user) => {
    const container = document.createElement("div")
    container.classList.add("user-data")
    const avatar = document.createElement("div")
    avatar.classList.add("avatar")
    const img = document.createElement("img")
    img.src = "statics/assets/user.png"
    img.alt = "profile-img"
    const span = document.createElement("span")
    span.classList.add("nickname")
    span.textContent = user.nickname

    avatar.append(img)
    if (user.online) {
        const marker = document.createElement("div")
        marker.classList.add("online-marker")
        avatar.append(marker)
    }

    container.append(avatar, span)

    return container
}

const addMessage = (msg) => {
    const receiver = document.getElementById("receiver")

    const Mymsg = new Message(msg.content, "other", msg.sender)

    receiver.textContent = msg.sender

    document.getElementById("messages").append(Mymsg.create())

}

export const handleChatFront = async () => {
    if (currentUser.socket) return

    currentUser.socket = new WebSocket('ws://localhost:8080/ws/chat')

    currentUser.socket.onopen = () => {
        console.log("connection started");

    }

    currentUser.socket.onclose = () => { }

    currentUser.socket.onmessage = (e) => {
        const msg = JSON.parse(e.data)

        switch (msg.event) {
            case "init":
                const frag = document.createDocumentFragment()

                msg.users.sort((a, b) => a.nickname.localeCompare(b.nickname))
                for (const user of msg.users) {
                    const userELement = createUserElement(user)

                    frag.append(userELement)
                }

                const userList = document.querySelector(".user-list-wrapper")

                userList.append(frag)

                break

            case "chat":
                addMessage(msg.message)
                break

            case "join":
                renderUsers()
                break

            case "leave":
                renderUsers()
                break
        }
    }

    currentUser.socket.onerror = () => { }
}

export const sendMessage = () => {
    const receiver = document.getElementById("receiver").textContent
    const chatInput = document.getElementById("chat-textarea")
    const Mymsg = new Message(chatInput.value, "me", receiver)

    currentUser.socket.send(JSON.stringify(Mymsg))


    document.getElementById("messages").append(Mymsg.create())

    chatInput.value = ""
}