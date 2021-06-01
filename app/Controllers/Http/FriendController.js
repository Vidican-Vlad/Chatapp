"use strict";

const Database = use("Database");
const Friend = use("App/Models/Friend");
const User = use("App/Models/User");

class FriendController {
  async messages({ params }) {
    console.log(params.id);
    const friendship = await Friend.findOrFail(params.id);
    console.log(friendship.messages().with("sender").fetch());
    return friendship.messages().with("sender").fetch();
  }
  async getFriends({ auth }) {
    const user = await auth.getUser();
    // const Friends = (await user.friends().with("userTwo").fetch()).toJSON().filter(friendship => friendship.status === 1);
    // return Friends.map((friendRelation) => ({
    //   id: friendRelation.id,
    //   username: friendRelation.userTwo.username,
    //   friend_id: friendRelation.userTwo.id,
    //   status: friendRelation.status,
    // }));
    const Friends1 = (
      await Database.select(
        "friends.id",
        "user_id",
        "friend_id",
        "status",
        "username"
      )
        .from("friends")
        .innerJoin("users", "friends.user_id", "users.id")
        .where("friend_id", user.id)
        .where("status", 1)
    ).map((friendRelation) => ({
      id: friendRelation.id,
      username: friendRelation.username,
      friend_id: friendRelation.user_id,
      status: friendRelation.status,
    }));
    const Friends2 = (
      await Database.select(
        "friends.id",
        "user_id",
        "friend_id",
        "status",
        "username"
      )
        .from("friends")
        .innerJoin("users", "friends.friend_id", "users.id")
        .where("user_id", user.id)
        .where("status", 1)
    ).map((friendRelation) => ({
      id: friendRelation.id,
      username: friendRelation.username,
      friend_id: friendRelation.friend_id,
      status: friendRelation.status,
    }));
    return Friends2.concat(Friends1);
  }

  async getPendingReq({ auth, request }) {
    const user = await auth.getUser();
    //const Requests = (await user.friend().fetch()).toJSON().filter(friendship => friendship.status === 0);
    const Requests = await Database.select(
      "user_id",
      "friend_id",
      "status",
      "username"
    )
      .from("friends")
      .innerJoin("users", "friends.user_id", "users.id")
      .where("friend_id", user.id)
      .where("status", 0);
    // return Requests.map((friendRelation) => ({
    //   id: friendRelation.id,
    //   username: friendRelation.username,
    //   friend_id: friendRelation.user_id,
    //   status: friendRelation.status,
    // }));
    return Requests;
  }
  async notAlreadyFriends(user, friend) {
    if (user.id === friend.id) return false;
    const existingFriendRelation1 = await Database.select(
      "user_id",
      "friend_id"
    )
      .from("friends")
      .where("user_id", user.id)
      .where("friend_id", friend.id);
    const existingFriendRelation2 = await Database.select(
      "user_id",
      "friend_id"
    )
      .from("friends")
      .where("friend_id", user.id)
      .where("user_id", friend.id);
    console.log(existingFriendRelation1);
    console.log(existingFriendRelation2);
    if (
      existingFriendRelation1.length === 0 &&
      existingFriendRelation2.length === 0
    )
      return true;
    return false;
  }

  async sendFriendRequest({ auth, request }) {
    const { name } = request.all();
    const friend = await User.findByOrFail("username", name);
    const user = await auth.getUser();
    const OK = await this.notAlreadyFriends(user, friend);
    if (OK) {
      await Database.table("friends").insert({
        user_id: user.id,
        friend_id: friend.id,
        status: 0,
      });
      return {
        message: "Friend request sent",
        friend,
      };
    }
  }

  async acceptFriendRequest({ auth, request }) {
    const { name } = request.all();

    const RequestSender = await User.findByOrFail("username", name);
    const user = await auth.getUser();

    await Database.table("friends")
      .where("user_id", RequestSender.id)
      .where("friend_id", user.id)
      .update("status", 1);

    return {
      message: "New friend added",
      RequestSender,
    };
  }

  async rejectFriendRequest({ auth, request }) {
    const { name } = request.all();

    const RequestSender = await User.findByOrFail("username", name);
    const user = await auth.getUser();

    await Database.table("friends")
      .where("user_id", RequestSender.id)
      .where("friend_id", user.id)
      .delete();

    return {
      message: "friend request declined",
      RequestSender,
    };
  }

  async removeFriend({ auth, request }) {
    const { id: friendId } = request.all();
    const user = await auth.getUser();
    await Database.table("friends")
      .where("friend_id", user.id)
      .where("user_id", friendId)
      .delete();
    await Database.table("friends")
      .where("user_id", user.id)
      .where("friend_id", friendId)
      .delete();
  }
}

module.exports = FriendController;
