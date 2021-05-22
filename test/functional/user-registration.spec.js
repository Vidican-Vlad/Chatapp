'use strict'

const {test, trait} = use('Test/Suite')('User Registration')

const Factory = use('Factory')

trait('Test/ApiClient')
trait('DatabaseTransactions')


test('fails with error message if selected question id is not found in database', async ({client}) => {

  const response = await client.post('/auth/register')
    .header('accept', 'application/json')
    .send({
      username: 'Test',
      email: 'test@test.com',
      password: 'password',
      password_confirmation: 'password',
      question_id: 2090,
    }).end()

  response.assertStatus(400);
  response.assertError([
    {
      message: 'exists validation failed on question_id',
      field: 'question_id',
      validation: 'exists'
    }
  ])
})

test('fails with error message if username is not present in request body', async ({client}) => {

  const response = await client.post('/auth/register')
    .header('accept', 'application/json')
    .send({
      email: 'test@test.com',
      password: 'password',
      password_confirmation: 'password',
      question_id: 2090,
    }).end()

  response.assertStatus(400);
  response.assertError([
    {
      message: 'required validation failed on username',
      field: 'username',
      validation: 'required'
    }
  ])
})

test('fails with error message if email from request body already exists in db', async ({client}) => {
  const user = await Factory.model('App/Models/User').make({
    email: 'test@test.com'
  })

  const question = await Factory.model('App/Models/Question').create()

  question.users().save(user)

  const response = await client.post('/auth/register')
    .header('accept', 'application/json')
    .send({
      username: 'test',
      email: 'test@test.com',
      password: 'password',
      password_confirmation: 'password',
      question_id: 2090,
    }).end()

  response.assertStatus(400);
  response.assertError([
    {
      message: 'unique validation failed on email',
      field: 'email',
      validation: 'unique'
    }
  ])
})

test('fails with error message if username from request body already exists in db', async ({client}) => {
  const user = await Factory.model('App/Models/User').make({
    username: 'test'
  })

  const question = await Factory.model('App/Models/Question').create()

  question.users().save(user)

  const response = await client.post('/auth/register')
    .header('accept', 'application/json')
    .send({
      username: 'test',
      email: 'test@test.com',
      password: 'password',
      password_confirmation: 'password',
      question_id: 2090,
    }).end()

  response.assertStatus(400);
  response.assertError([
    {
      message: 'unique validation failed on username',
      field: 'username',
      validation: 'unique'
    }
  ])
})


test('it register the user if all data is correct', async ({client}) =>  {

  const question = await Factory.model('App/Models/Question').create()

  const response = await client.post('/auth/register')
    .header('accept', 'application/json')
    .send({
      username: 'Test',
      email: 'test@test.com',
      password: 'password',
      password_confirmation: 'password',
      answer: 'some shit',
      question_id: question.id
    }).end()

  response.assertStatus(200);
  response.assertJSONSubset({
    message: 'You have successfully created your account'
  })
})
