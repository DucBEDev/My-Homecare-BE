class Chat {
    constructor(roomChatId, userId, content, imgPath) {
        this.roomChatId = roomChatId;
        this.userId = userId;
        this.content = content;
        this.imgPath = imgPath;
    }
}

module.exports = Chat;