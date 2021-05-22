'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Factory = use('Factory')

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    email: faker.email(),
    username: faker.username(),
    password: 'password',
    answer: faker.sentence({words: 3}),
    ...data
  }
})

Factory.blueprint('App/Models/Room', async (faker, i, data) => {
  return {
    name:  faker.word(),
    ...data
  }
})

Factory.blueprint('App/Models/Question', async (faker, i, data) => {

  return {
    text: faker.sentence({words: 3}),
    ...data
  }
})
