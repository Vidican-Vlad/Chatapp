"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Message extends Model {
  sender() {
    return this.belongsTo("App/Models/User", "sender_id", "id");
  }

  room() {
    return this.belongsTo("App/Models/Room");
  }

  receiver() {
    return this.morphTo(
      ["App/Models/Room", "App/Models/Friend"],
      "id",
      "id",
      "receiver_id",
      "receiver_type"
    );
  }
}

module.exports = Message;
