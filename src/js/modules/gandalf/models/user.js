angular.module('ng-gandalf').factory('User', function ($gandalf) {

  function User(data) {
    var obj = data || {};
    this.id = obj._id;
    this.username = obj.username;
    this.email = obj.email;

    this.description = obj.description;
    this.createdAt = obj.created_at;
    this.updatedAt = obj.updated_at;

    this.accessTokens = obj.access_tokens;
    this.refreshTokens = obj.refresh_tokens;

  }

  User.find = function (size, page, filters) {
    return $gandalf.admin.getUsers(size, page, filters).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new User(item);
      });
      return resp;
    });
  };

  User.prototype.toJSON = function () {
    return {
      _id: this.id,
      username: this.username,
      email: this.email,
      description: this.description,
      access_tokens: this.accessTokens,
      refresh_tokens: this.refreshTokens,

      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  };

  return User;
});
