"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

class User extends Model {
  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Models/Token");
  }
  messages() {
    return this.hasMany("App/Models/Message");
  }
  rooms() {
    return this.belongsToMany("App/Models/Room");
  }

  myRooms() {
    return this.hasMany("App/Models/Room", "id", "owner_id");
  }

  question() {
    return this.belongsTo("App/Models/Question");
  }

  friends() {
    return this.hasMany("App/Models/Friend", "id", "user_id");
  }
  friend() {
    return this.belongsToMany(
      "App/Models/User",
      "user_id",
      "friend_id",
      "id",
      "id"
    ).pivotTable("friends");
  }
}

module.exports = User;
