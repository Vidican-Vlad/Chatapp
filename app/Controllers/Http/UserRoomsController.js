"use strict";

const Database = use("Database");
const Room = use("App/Models/Room");
const Message = use("App/Models/Message");

class UserRoomsController {
  async index({ auth, request }) {
    const user = await auth.getUser();
    return [
      ...(await user.myRooms().fetch()).toJSON(),
      ...(await user.rooms().fetch()).toJSON(),
    ];
  }

  async messages({ params }) {
    const room = await Room.findOrFail(params.id);

    Message.onQuery((query) => console.log(query));

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
    const { name } = request.all();
    const room = await Room.findByOrFail("name", name);
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
}

module.exports = UserRoomsController;
