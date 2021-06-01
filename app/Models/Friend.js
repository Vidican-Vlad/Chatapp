"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Friend extends Model {
  static get traits() {
    return ["@provider:Morphable"];
  }

  messages() {
    return this.morphMany(
      "App/Models/Message",
      "id",
      "receiver_id",
      "receiver_type"
    );
  }
  userOne() {
    return this.belongsTo("App/Models/User", "user_id", "id");
  }

  userTwo() {
    return this.belongsTo("App/Models/User", "friend_id", "id");
  }
}

module.exports = Friend;
