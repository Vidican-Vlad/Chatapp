"use strict";
const User = use("App/Models/User");
const Question = use("App/Models/Question");

class AuthController {
  async login({auth, request}) {
    const {username, password} = request.all();

    return await auth.withRefreshToken().attempt(username, password);
  }

  async logout({auth, request}) {
    return auth.logout();
  }

  async refresh({auth, request}) {
    const {refresh_token} = request;

    return auth.newRefreshToken().generateForRefreshToken(refresh_token);
  }

  async user({auth}) {
    return auth.getUser();
  }

  async register({request}) {
    const {username, email, password, question_id, answer} = request.all();
    const newUser = new User();
    newUser.fill(
      {
        username,
        email,
        password,
        question_id,
        answer,
      }
    )
    console.log(newUser.question_id)

    const selectedQuestion = await Question.findOrFail(parseInt(question_id))

    await selectedQuestion.users().save(newUser)


    return {
      message: "You have successfully created your account",
    };
  }
}

module.exports = AuthController;
