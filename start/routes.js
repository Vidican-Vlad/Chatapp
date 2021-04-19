'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route
  .post('auth/login', 'AuthController.login')
  .middleware('guest');

Route
  .post('auth/logout', 'AuthController.logout')
  .middleware('auth');

Route
  .post('auth/refresh', 'AuthController.refresh')
  .middleware('auth')

Route.post('auth/register', 'AuthController.register')
  .middleware('guest')
  .validator('StoreUser')

Route.get('auth/user', 'AuthController.user').middleware('auth')


