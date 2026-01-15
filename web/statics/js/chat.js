export const chatState = {
    socket: null,
    nickName: null,
}

class Message {
    constructor(content, sender) {
        this.content = content;
        this.sender = sender;
        this.time = Date.now()
    }

    create() {
        const message = document.createElement("div")
        message.classList.add("message")

        if (this.sender === "me") message.classList.add("message-me")
        else message.classList.add("message-other")

        message.textContent = this.content

        return message
    }

}

export const SendMessage = () => {
    const textarea = document.getElementById('chat-textarea')
    const messages = document.getElementById('messages')

    const myMsg = new Message(textarea.value, "me")

    messages.append(myMsg.create())
    textarea.value = ""
}