angular.module('starter.services', []);
angular.module('ionic.utils', [])
.factory('Authorization', function () {
 
    var authorization = {};
 
    return {
        getAuthObject: function () {
            return authorization;
        },
        setAuthObject: function (authObject) {
            authorization = authObject;
        }
    };
})
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || null;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
       try{
      return JSON.parse($window.localStorage[key]);      
       }catch(e){
           return null;
       }
    }
  }
}]);

angular.module('dataServices', [])
.factory('contentService', function ($resource,$localstorage) {
        var catalogs = [];
        var contents = [];
        return {
            listCatalogs: function () {
                // catalogs = $localstorage.getObject('catalogs');
                // if(catalogs == null){
                    catalogs = $resource('http://cds.bigpay.vn/content/icare/catalogs').query();
                //     $localstorage.setObject('catalogs',catalogs);    
                // }
                return catalogs;
            },
            getCatalog: function (id) {
                for(var i =0;i<catalogs.length;i++)
                {
                    if(catalogs[i].id  == id) {
                        return catalogs[i];
                    }
                }
                //return $resource('http://cds.bigpay.vn/content/icare/catalog/' + id, {}).get();
            },
            listContents: function (id) {
                //contents = $resource('http://cds.bigpay.vn/content/icare/contents/' + id + '/' + $localstorage.getObject('user').user_name).query();
                contents = $resource('http://cds.bigpay.vn/content/icare/contents/' + id + '/all?date=&year=&month=&period=').query();
                return contents;
            },
            getContent: function (catalogId, Id) {
                for(var i = 0;i<contents.length;i++)
                {
                    if(contents[i].id == Id) return contents[i];
                }
                return $resource('http://cds.bigpay.vn/content/icare/' + catalogId +'/' + Id).get();
            },
            searchContent:function(searchdata){
                var user_name="all";
                if($localstorage.getObject('user'))
                {
                    user_name=$localstorage.getObject('user').customer_code;
                }
                contents =  $resource('http://cds.bigpay.vn/content/icare/contents/'
                + searchdata.catalogId
                + '/'
                + user_name
                +'?month='
                + searchdata.month
                +'&year='
                + searchdata.year
                +'&period='
                + searchdata.period
                + '&date='
                + searchdata.date).query();
                return contents;
            }
        }
    }) 
	.factory('apiService', function ($http) {
        return {
            postLogin: function (username, password) {
                return $http.get('http://cds.bigpay.vn/id/login/icare?username=' + username + '&password=' + password);
            }
        }
    });
