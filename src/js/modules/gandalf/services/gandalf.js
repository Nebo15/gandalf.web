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
    apiEnpoint: '/api/v1/'
  };

  return {
    setEndpoint: function (endpoint) {
      config.apiEnpoint = endpoint;
    },
    $get: function ($httpParamSerializer, $http, $log, $q, $filter)  {

      function $request(opts, data) {

        var endpoint = opts.endpoint,
          method = opts.method || 'get',
          params = opts.params || {};

        if (angular.isUndefined(endpoint)) {
          throw Error('undefined request enpoint');
        }

        endpoint = config.apiEnpoint + endpoint;
        endpoint += '?' + $httpParamSerializer(params);

        var headers = {
          'Content-type': 'application/json'
        };
        if (config.authorization) {
          headers['Authorization'] = config.authorization;
        }

        return $http({
          method: method,
          url: endpoint,
          headers: headers,
          data: data || null
        }).then(function (resp) {
          $log.debug('$request: response', resp);
          return resp.data;
        });
      }

      $request.get = function (url, options) {
        var config = angular.extend({
          endpoint: url,
          method: 'get'
        }, options);

        return $request(config);
      };

      var self = {};

      self.setAuthorization = function (apiKey, apiSecret) {
        config.authorization = 'Basic ' + base64.encode([apiKey, apiSecret].join(':'));
      };
      self.resetAuthorization = function () {
        config.authorization = null;
      };
      self.testAuthorization = function (apiKey, apiSecret) {
        var oldAuthorization = config.authorization;
        this.setAuthorization(apiKey, apiSecret);

        return this.admin.getTables(0,0).finally(function () {
          config.authorization = oldAuthorization;
        });
      };

      self.admin = {};

      // Tables

      self.admin.getTables = function (size, page) {
        return $request.get('admin/tables', {
          params: {
            size: size,
            page: page
          }
        });
      };
      self.admin.getTableById = function (id) {
        return $request.get('admin/tables/'+id);
      };

      self.admin.createTable= function (obj) {
        return $request({
          endpoint: 'admin/tables/',
          method: 'post'
        }, {
          table: obj
        });
      };
      self.admin.updateTableById = function (id, obj) {
        return $request({
          endpoint: 'admin/tables/'+id,
          method: 'put'
        }, {
          table: obj
        });
      };
      self.admin.deleteTableById= function (id) {
        return $request({
          endpoint: 'admin/tables/'+id,
          method: 'delete'
        });
      };

      // Changelog

      self.admin.getTablesChangelogs = function () {
        return $request({
          endpoint: 'admin/changelog/tables',
          method: 'get'
        });
      };
      self.admin.getTableChangelogs = function (tableId) {
        return $request({
          endpoint: 'admin/changelog/tables/' + tableId,
          method: 'get'
        });
      };
      self.admin.getTableChangelogsDiff = function (tableId) {
        return $request({
          endpoint: 'admin/changelog/tables/' + tableId + '/diff',
          method: 'get'
        });
      };
      self.admin.rollbackTableToChangelog = function (tableId, rollbackId) {
        return $request({
          endpoint: 'admin/changelog/tables/' + tableId + '/rollback/' + rollbackId,
          method: 'post'
        });
      };

      // Decisions

      self.admin.getDecisions = function (tableId, size, page) {
        return $request.get('admin/decisions', {
          params: {
            table_id: tableId,
            size: size,
            page: page
          }
        });
      };
      self.admin.getDecisionById = function (historyId) {
        return $request.get('admin/decisions/'+historyId);
      };


      self.consumer = {};
      self.consumer.send = function (tableId, obj) {
        return $request({
          endpoint: 'tables/' + tableId + '/decisions',
          method: 'post'
        }, obj);
      };
      self.consumer.check = function (decisionId) {
        return $request.get('decisions/' + decisionId);
      };

      return self;

    }
  };

});
