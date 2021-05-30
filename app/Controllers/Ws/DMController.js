"use strict";

const Message = use("App/Models/Message");
const Friend = use("App/Models/Friend");

class DMController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  async onMessage(message) {
    const savedMessage = await this.__saveMessage(message);
    this.socket.broadcastToAll("message", savedMessage);
  }

  __getFriendshipIdFromTopic() {
    const topic = this.socket.topic;
    const friendshipId = topic.substring(topic.indexOf(":") + 1);
    return parseInt(friendshipId, 10);
  }

  __getFriendshipIfExists() {
    return Friend.findOrFail(this.__getFriendshipIdFromTopic());
  }

  async __saveMessage(receivedMessage) {
    const message = new Message();
    const friendship = await this.__getFriendshipIfExists();

    message.fill({
      content: receivedMessage.message,
      sender_id: parseInt(receivedMessage.senderId, 10),
      receiver_id: this.__getFriendshipIdFromTopic(),
      receiver_type: "App/Models/Friend",
    });

    await friendship.messages().save(message);

    await message.load("sender");

    console.log(message);

    return message;
  }
}

module.exports = DMController;
