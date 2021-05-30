"use strict";

const Database = use("Database");
const Room = use("App/Models/Room");
const Message = use("App/Models/Message");

class UserRoomsController {
  async index({ auth, request }) {
    const user = await auth.getUser();
    return [
      ...(await user.myRooms().fetch()).toJSON(),
      ...(await user.rooms().where("status", 1).fetch()).toJSON(),
    ];
  }

  async messages({ params }) {
    const room = await Room.findOrFail(params.id);
    return room.messages().with("sender").fetch();
  }

  async create({ request, auth }) {
    const { name } = request.all();
    try {
      const user = await auth.getUser();
      const newRoom = new Room();
      newRoom.fill({
        name,
      });

      await user.myRooms().save(newRoom);

      return {
        message: "You have successfully created a room",
        newRoom,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async joinRoom({ request, auth }) {
    const { name } = request.all();

    const room = await Room.findByOrFail("name", name);
    const user = await auth.getUser();

    await user.rooms().attach([room.id]);

    return {
      message: "You have successfully joined a room",
      room,
    };
  }

  async leaveRoom({ request, auth }) {
    const { id } = request.all();
    const room = await Room.findOrFail(id);
    const user = await auth.getUser();
    if (user.id === room.owner_id) {
      await Database.table("rooms")
        .where("id", room.id)
        .update("owner_id", null);
    } else {
      await Database.table("room_user")
        .where("user_id", user.id)
        .where("room_id", room.id)
        .delete();
    }
  }

  async checkIfUserIsRoomOwner({ request, auth }) {
    const { room_id } = request.all();
    const room = await Room.findOrFail(room_id);
    const user = auth.getUser();
    return room.owner_id === user.id;
  }

  async getMembers({ params }) {
    // should be done
    const { roomId } = params;
    const SimpleMembers = await Database.select(
      "user_id",
      "username",
      "room_id"
    )
      .from("room_user")
      .innerJoin("users", "user_id", "users.id")
      .where("status", 1)
      .where("room_id", roomId);
    const Owner = await Database.select(
      "owner_id as user_id",
      "username",
      "rooms.id as room_id"
    )
      .from("rooms")
      .innerJoin("users", "owner_id", "users.id")
      .where("rooms.id", roomId);

    return Owner.concat(SimpleMembers);
  }

  async __getFriends({ auth }) {
    const user = await auth.getUser();
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

  async getFriendsNotInRoom({ auth, params }) {
    //not done yet, need to substract members from friends
    const { roomId } = params;
    const friends = await this.__getFriends({ auth });
    const members = await Database.select("user_id as friend_id")
      .from("room_user")
      .where("room_id", roomId);
    const result = [];
    for (let i = 0; i < friends.length; i++) {
      let OK = true;
      for (let j = 0; j < members.length && OK; j++) {
        if (friends[i].friend_id === members[j].friend_id) OK = false;
      }
      if (OK) result.push(friends[i]);
    }
    return result;
  }

  async getRoomInvites({ auth }) {
    const user = await auth.getUser();
    const Invites = await Database.select("room_user.id", "name", "user_id")
      .from("room_user")
      .innerJoin("rooms", "room_id", "rooms.id")
      .where("user_id", user.id)
      .where("status", 0);
    return Invites;
  }

  async sendRoomInvite({ request, auth }) {
    //not done yetn
    const { roomId, friendId } = request.all();
    await Database.table("room_user").insert({
      user_id: friendId,
      room_id: roomId,
      status: 0,
    });
  }

  async acceptRoomRequest({ request, auth }) {
    const { id } = request.all();
    console.log(id);
    await Database.table("room_user").where("id", id).update("status", 1);
  }

  async rejectRoomRequest({ request, auth }) {
    const { id } = request.all();
    console.log(id);
    await Database.table("room_user").where("id", id).delete();
  }
}

module.exports = UserRoomsController;
