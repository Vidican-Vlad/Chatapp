"use strict";

class StoreUser {
  get rules() {
    return {
      email: "required|email|unique:users",
      username: "required|unique:users",
      password: "required|min:6|confirmed",
      password_confirmation: "required|min:6",
      question_id: "required|exists:questions,id",
      answer: "required|min:3|max:100",
    };
  }
}

module.exports = StoreUser;
