"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Room extends Model {
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

  members() {
    return this.hasMany("App/Models/User");
  }

  owner() {
    return this.belongsTo("App/Models/User", "owner_id", "id");
  }
}

module.exports = Room;
