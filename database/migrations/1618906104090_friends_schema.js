"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FriendsSchema extends Schema {
  up() {
    this.create("friends", (table) => {
      table.increments();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.integer("friend_id").unsigned().references("id").inTable("users");
      table.boolean("status").default(false);
    });
  }

  down() {
    this.drop("friends");
  }
}

module.exports = FriendsSchema;
