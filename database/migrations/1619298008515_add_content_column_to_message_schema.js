"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddContentColumnToMessageSchema extends Schema {
  up() {
    this.alter("messages", (table) => {
      table.text("content").notNullable();
    });
  }

  down() {
    this.alter("messages", (table) => {
      // reverse alternations
      table.dropColumn("content");
    });
  }
}

module.exports = AddContentColumnToMessageSchema;
