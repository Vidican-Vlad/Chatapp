"use strict";

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
const Route = use("Route");

Route.post("auth/login", "AuthController.login").middleware("guest");

Route.post("auth/logout", "AuthController.logout").middleware("auth");

Route.post("auth/refresh", "AuthController.refresh").middleware("auth");

Route.post("auth/register", "AuthController.register")
  .middleware("guest")
  .validator("StoreUser");
Route.post("create-room", "UserRoomsController.create").middleware("auth");

Route.post("join-room", "UserRoomsController.joinRoom").middleware("auth");
Route.post("leave-room", "UserRoomsController.leaveRoom").middleware("auth");
Route.post("send-room-invite", "UserRoomsController.sendRoomInvite").middleware(
  "auth"
);
Route.get("auth/user", "AuthController.user").middleware("auth");

Route.get("user-rooms", "UserRoomsController.index").middleware("auth");

Route.get("room-messages/:id", "UserRoomsController.messages").middleware(
  "auth"
);
Route.post(
  "send-friend-request",
  "FriendController.sendFriendRequest"
).middleware("auth");
Route.post(
  "accept-friend-request",
  "FriendController.acceptFriendRequest"
).middleware("auth");
Route.post(
  "reject-friend-request",
  "FriendController.rejectFriendRequest"
).middleware("auth");
Route.post("remove-friend", "FriendController.removeFriend").middleware("auth");
Route.get("user-friends", "FriendController.getFriends").middleware("auth");
Route.get("user-requests", "FriendController.getPendingReq").middleware("auth");
Route.post(
  "get-potential-members",
  "UserRoomsController.getFriendsNotInRoom"
).middleware("auth");
Route.get("get-room-invites", "UserRoomsController.getRoomInvites").middleware(
  "auth"
);
Route.post(
  "accept-room-invite",
  "UserRoomsController.acceptRoomRequest"
).middleware("auth");
Route.post(
  "reject-room-invite",
  "UserRoomsController.rejectRoomRequest"
).middleware("auth");
