'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessagesSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.increments()
      table.string('receiver_type', 30).notNullable()
      table.integer('sender_id').unsigned().references('id').inTable('users')
      table.integer('receiver_id').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessagesSchema
