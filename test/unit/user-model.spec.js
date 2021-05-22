'use strict'

const { test } = use('Test/Suite')('User Model')

const Factory = use('Factory')


test('user can be part of multiple rooms', async ({ assert }) => {
  const question = await Factory.model('App/Models/Question').create();
  const user = await Factory.model('App/Models/User').make()
  await question.users().save(user);

  const room = await Factory.model('App/Models/Room').make()

  await room.owner().associate(user);

  await user.rooms().save(room);

  const userOwnRooms = await user.rooms().fetch();

  assert.deepStrictEqual(userOwnRooms.toJSON(), [room.toJSON()], 'same')

})
