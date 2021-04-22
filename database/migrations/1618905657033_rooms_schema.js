'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomsSchema extends Schema {
  up () {
    this.create('rooms', (table) => {
      table.increments()
      table.integer("owner_id").unsigned().references('id').inTable('users')
      table.string("name", 50)
      table.timestamps()
    })
  }

  down () {
    this.drop('rooms')
  }
}

module.exports = RoomsSchema
