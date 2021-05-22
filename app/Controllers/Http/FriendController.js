"use strict";

const Database = use("Database");
const Friend = use("App/Models/Friend");
const User = use("App/Models/User");

class FriendController {
  async getFriends({ auth, request }) {
    const user = await auth.getUser();
    const Friends = (await user.friends().with("userTwo").fetch()).toJSON();
    return Friends.map((friendRelation) => ({
      id: friendRelation.id,
      username: friendRelation.userTwo.username,
      friend_id: friendRelation.userTwo.id,
      status: friendRelation.status,
    }));
  }

  async getPendingReq({ auth, request }) {
    const user = await auth.getUser();
    const Friends = [...(await user.friends().fetch()).toJSON()];
    const Result = [];
    for (var i = 0; i < Friends.length; i++) {
      if (Friends[i].status === 0) {
        const Friend = await User.findOrFail(Friends[i].friend_id);
        Result.push({
          id: Friend.id,
          username: Friend.username,
        });
      }
    }
    return Result;
  }

  async addFriend({ auth, request }) {
    const { name } = request.all();

    const friend = await User.findByOrFail("username", name);
    const user = await auth.getUser();

    await Database.table("friends").insert({
      user_id: user.id,
      friend_id: friend.id,
      status: 0,
    });
    await Database.table("friends").insert({
      user_id: friend.id,
      friend_id: user.id,
      status: 0,
    });

    return {
      message: "New friend added",
      friend,
    };
  }

  async removeFriend({ auth, request }) {
    const { id: friendId } = request.all();
    const user = await auth.getUser();
    await Database.table("friends")
      .where("user_id", user.id)
      .where("friend_id", friendId)
      .delete();
    await Database.table("friends")
      .where("user_id", friendId)
      .where("friend_id", user.id)
      .delete();
  }
}

module.exports = FriendController;
