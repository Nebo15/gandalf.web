'use strict';

var base64 = (function () {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt (i++);
        chr2 = input.charCodeAt (i++);
        chr3 = input.charCodeAt (i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN (chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN (chr3)) {
          enc4 = 64;
        }

        output = output +
          keyStr.charAt (enc1) +
          keyStr.charAt (enc2) +
          keyStr.charAt (enc3) +
          keyStr.charAt (enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec (input)) {
        window.alert ("There were invalid base64 characters in the input text.\n" +
          "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
          "Expect errors in decoding.");
      }
      input = input.replace (/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf (input.charAt (i++));
        enc2 = keyStr.indexOf (input.charAt (i++));
        enc3 = keyStr.indexOf (input.charAt (i++));
        enc4 = keyStr.indexOf (input.charAt (i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode (chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode (chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode (chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };
})();

angular.module('ng-gandalf').provider('$gandalf', function () {

  var config = {
    apiEnpoint: '',
    clientId: null,
    clientSecret: null,

    user: {
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresIn: null
    },
    projectId: null
  };

  return {
    setEndpoint: function (endpoint) {
      config.apiEnpoint = endpoint;
    },
    init: function (clientId, clientSecret) {
      config.clientId = clientId;
      config.clientSecret = clientSecret;
    },
    $get: function ($httpParamSerializer, $http, $log, $q, $rootScope, $localStorage)  {

      var refreshTokenPromise = $q.resolve();
      function $request(opts, data) {
        var endpoint = opts.endpoint,
          method = opts.method || 'get',
          params = opts.params || {};

        if (angular.isUndefined(endpoint)) {
          throw Error('undefined request enpoint');
        }

        endpoint = config.apiEnpoint + endpoint;
        var paramsStr = $httpParamSerializer(params);
        if (paramsStr) {
          endpoint += '?' + paramsStr;
        }

        var headers = {
          'Content-type': 'application/json'
        };
        if (config.user.accessToken && config.user.tokenType) {
          headers['Authorization'] = [config.user.tokenType, config.user.accessToken].join(' ');
        }
        if (config.projectId) {
          headers['X-Application'] = config.projectId;
        }

        headers = angular.extend(headers, opts.headers || {});

        return refreshTokenPromise.then(function () {
          return $http({
            method: method,
            url: endpoint,
            headers: headers,
            data: data || null
          })
        }).then(function (response) {
          $log.debug('$request: response', response);
          return response.data;
        }).catch(function (response) {

          // refresh token logic
          if (response.status === 401) {
            return self.refreshToken().then(function () {
              return $request(opts, data);
            });
          }

          return $q.reject(response);

        }).catch(function (responce) {

          $log.log('$request: catch', response);
          $rootScope.$broadcast('$gandalfError', response);

          return $q.reject(response);
        })
      }

      $request.get = function (url, options) {
        var config = angular.extend({
          endpoint: url,
          method: 'get'
        }, options);

        return $request(config);
      };

      var self = {};

      self.setAuthorization = function (username, password) {
        return self.admin.checkAuth(username, password).then(function (resp) {
          if (resp.error) throw $q.reject(resp); // fix for API error response with status 200
          self.setToken(resp);
          return resp;
        });
      };
      self.resetAuthorization = function () {
        config.user = {};
      };
      self.setToken = function (data) {
        config.user.accessToken = data.access_token;
        config.user.refreshToken = data.refresh_token;
        config.user.tokenType = data.token_type;
        config.user.expiresIn = data.expires_in;
      };

      self.setProjectId = function (projectId) {
        config.projectId = projectId;
      };

      self.refreshToken = function () {
        if (!config.user.refreshToken) {
          return $q.reject(false);
        }

        refreshTokenPromise = $request({
          endpoint: 'api/v1/oauth',
          method: 'post',
          headers: {
            Authorization: 'Basic ' + base64.encode([config.clientId, config.clientSecret].join(':'))
          }
        }, {
          refresh_token: config.user.refreshToken,
          grant_type: 'refresh_token'
        }).then(function (response) {
          self.setToken(response);
          $localStorage.auth = response;

          return response;
        }).catch(function (resp) {
          config.user.refreshToken = null;
          return $q.reject(resp);
        });

        return refreshTokenPromise;
      };

      self.admin = {};

      self.admin.checkToken = function (oauthObj) {
        return $request({
          endpoint: 'api/v1/projects',
          method: 'get',
          headers: {
            Authorization: [oauthObj.token_type, oauthObj.access_token].join(' ')
          }
        });
      };
      self.admin.checkAuth = function (username, password) {
        return $request({
          endpoint: 'api/v1/oauth',
          method: 'post',
          headers: {
            Authorization: 'Basic ' + base64.encode([config.clientId, config.clientSecret].join(':'))
          }
        }, {
          username: username,
          password: password,
          grant_type: 'password'
        });
      };

      self.admin.createUser = function (user) {
        return $request({
          endpoint: 'api/v1/users',
          method: 'post',
          headers: {
            Authorization: 'Basic ' + base64.encode([config.clientId, config.clientSecret].join(':'))
          }
        }, {
          username: user.username,
          password: user.password,
          email: user.email
        });
      };

      // User

      self.admin.getUsers = function (size, page, filter) {
        filter = filter || {};
        return $request.get('api/v1/users', {
          params: {
            size: size,
            page: page,
            name: filter.name
          }
        });
      };
      self.admin.getUser = function () {
        return $request.get('api/v1/users/current');
      };
      self.admin.updateUser = function (user, password) {
        return $request({
          method: 'put',
          endpoint: 'api/v1/users/current'
        }, {
          password: password,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        });
      };

      // Projects

      self.admin.getCurrentProject = function () {
        return $request.get('api/v1/projects/current');
      };

      self.admin.getProjects = function (size, page) {
        return $request.get('api/v1/projects', {
          params: {
            size: size,
            page: page
          }
        });
      };
      self.admin.createProject = function (project) {
        return $request({
          endpoint: 'api/v1/projects',
          method: 'post'
        }, project);
      };
      self.admin.updateProject = function (project) {
        return $request({
          endpoint: 'api/v1/projects',
          method: 'put'
        }, project);
      };
      self.admin.deleteProject = function () {
        return $request({
          endpoint: 'api/v1/projects',
          method: 'delete'
        });
      };

      // Project.users
      self.admin.addProjectUser = function (user) {
        return $request({
          method: 'post',
          endpoint: 'api/v1/projects/users'
        }, {
          user_id: user.user_id,
          role: user.role,
          scope: user.scope
        });
      };
      self.admin.updateProjectUser = function (user) {
        return $request({
          method: 'put',
          endpoint: 'api/v1/projects/users'
        }, {
          user_id: user.user_id,
          role: user.role,
          scope: user.scope
        });
      };
      self.admin.removeProjectUser = function (userId) {
        return $request({
          method: 'delete',
          endpoint: 'api/v1/projects/users'
        }, {
          user_id: userId
        });
      };

      // Project.consumers
      self.admin.getProjectConsumers = function () {
        return $request({
          method: 'GET',
          endpoint: 'api/v1/projects/consumers'
        });
      };

      self.admin.addProjectConsumer = function (consumer) {
        return $request({
          method: 'post',
          endpoint: 'api/v1/projects/consumers'
        }, {
          description: consumer.description,
          scope: consumer.scope
        });
      };
      self.admin.updateProjectConsumer = function (consumer) {
        return $request({
          method: 'put',
          endpoint: 'api/v1/projects/consumers'
        }, {
          client_id: consumer.client_id,
          description: consumer.description,
          scope: consumer.scope
        });
      };
      self.admin.removeProjectConsumer = function (clientId) {
        return $request({
          method: 'delete',
          endpoint: 'api/v1/projects/consumers'
        }, {
          client_id: clientId
        });
      };

      // Tables

      self.admin.getTables = function (size, page, filter) {
        var options = filter || {};
        return $request.get('api/v1/admin/tables', {
          params: {
            size: size,
            page: page,
            title: options.title,
            description: options.description
          }
        });
      };
      self.admin.getTableById = function (id) {
        return $request.get('api/v1/admin/tables/'+id);
      };

      self.admin.createTable= function (obj) {
        return $request({
          endpoint: 'api/v1/admin/tables/',
          method: 'post'
        }, obj);
      };
      self.admin.updateTableById = function (id, obj) {
        return $request({
          endpoint: 'api/v1/admin/tables/'+id,
          method: 'put'
        }, obj);
      };
      self.admin.deleteTableById = function (id) {
        return $request({
          endpoint: 'api/v1/admin/tables/'+id,
          method: 'delete'
        });
      };
      self.admin.copyTableById= function (id) {
        return $request({
          endpoint: 'api/v1/admin/tables/'+id+'/copy',
          method: 'post'
        });
      };

      // Groups
      self.admin.getGroups = function (size, page) {
        return $request({
          endpoint: 'api/v1/admin/groups',
          method: 'get',
          params: {
            size: size,
            page: page
          }
        });
      };
      self.admin.createGroup = function (obj) {
        return $request({
          endpoint: 'api/v1/admin/groups',
          method: 'post'
        }, obj);
      };
      self.admin.deleteGroupById = function (groupId) {
        return $request({
          endpoint: 'api/v1/admin/groups/' + groupId,
          method: 'delete'
        });
      };
      self.admin.getGroupById = function (groupId) {
        return $request({
          endpoint: 'api/v1/admin/groups/' + groupId,
          method: 'get'
        });
      };
      self.admin.updateGroupById = function (groupId, obj) {
        return $request({
          endpoint: 'api/v1/admin/groups/' + groupId,
          method: 'put'
        }, obj);
      };

      self.admin.copyGroupById = function (groupId) {
        return $request({
          endpoint: 'api/v1/admin/groups/' + groupId + '/copy',
          method: 'post'
        });
      };

      // Changelog

      self.admin.getTablesChangelogs = function () {
        return $request({
          endpoint: 'api/v1/admin/changelog/tables',
          method: 'get'
        });
      };
      self.admin.getTableChangelogs = function (tableId) {
        return $request({
          endpoint: 'api/v1/admin/changelog/tables/' + tableId,
          method: 'get'
        });
      };
      self.admin.getTableChangelogsDiff = function (tableId, compareID) {
        return $request({
          endpoint: 'api/v1/admin/changelog/tables/' + tableId + '/diff',
          method: 'get',
          params: {
            compare_with: compareID
          }
        });
      };
      self.admin.rollbackTableToChangelog = function (tableId, rollbackId) {
        return $request({
          endpoint: 'api/v1/admin/changelog/tables/' + tableId + '/rollback/' + rollbackId,
          method: 'post'
        });
      };

      // Analytics

      self.admin.getTableAnalytics = function (tableId, variantId) {
        return $request({
          endpoint: 'api/v1/admin/tables/' + tableId + '/' + variantId + '/analytics',
          method: 'get'
        });
      };
      // Decisions

      self.admin.getDecisions = function (tableId, size, page) {
        return $request.get('api/v1/admin/decisions', {
          params: {
            table_id: tableId,
            size: size,
            page: page
          }
        });
      };
      self.admin.getDecisionById = function (historyId) {
        return $request.get('api/v1/admin/decisions/'+historyId);
      };


      self.consumer = {};
      self.consumer.send = function (tableId, obj) {
        return $request({
          endpoint: 'api/v1/tables/' + tableId + '/decisions',
          method: 'post'
        }, obj);
      };
      self.consumer.check = function (decisionId) {
        return $request.get('api/v1/decisions/' + decisionId);
      };

      return self;

    }
  };

});
