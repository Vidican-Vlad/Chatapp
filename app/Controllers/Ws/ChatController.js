"use strict";
const Message = use("App/Models/Message");
const Room = use("App/Models/Room");

class ChatController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  async onMessage(message) {
    const savedMessage = await this.__saveMessage(message);
    this.socket.broadcastToAll("message", savedMessage);
  }

  __getRoomIdFromTopic() {
    const topic = this.socket.topic;
    const roomId = topic.substring(topic.indexOf(":") + 1);
    return parseInt(roomId, 10);
  }

  __getRoomIfExists() {
    return Room.findOrFail(this.__getRoomIdFromTopic());
  }

  async __saveMessage(receivedMessage) {
    const message = new Message();
    const room = await this.__getRoomIfExists();

    message.fill({
      content: receivedMessage.message,
      sender_id: parseInt(receivedMessage.senderId, 10),
      receiver_id: this.__getRoomIdFromTopic(),
      receiver_type: "App/Models/Room",
    });

    await room.messages().save(message);

    await message.load('sender')

    return message;
  }
}

module.exports = ChatController;
