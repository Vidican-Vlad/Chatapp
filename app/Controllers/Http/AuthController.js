"use strict";
const User = use("App/Models/User");

class AuthController {
  async login({ auth, request }) {
    const { username, password } = request.all();

    return await auth.withRefreshToken().attempt(username, password);
  }

  async logout({ auth, request }) {
    return auth.logout();
  }

  async refresh({ auth, request }) {
    const { refresh_token } = request;

    return auth.newRefreshToken().generateForRefreshToken(refresh_token);
  }

  async user({ auth }) {
    return auth.getUser();
  }

  async register({ request }) {
    const { username, email, password } = request.all();

    await User.create({
      username,
      email,
      password,
    });

    return {
      message: "You have successfully created your account",
    };
  }
}

module.exports = AuthController;
