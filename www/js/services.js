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
.factory('contentService', function ($resource,$http,$localstorage) {
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
            gettotalnoif: function (id){
                return $http.get('http://cds.bigpay.vn/content/icare/' + id );
                // return contents;
            },
            httpListContents: function (id, uId) {
                //contents = $resource('http://cds.bigpay.vn/content/icare/contents/' + id + '/' + $localstorage.getObject('user').user_name).query();
                contents = $http.get('http://cds.bigpay.vn/content/icare/contents/' + id + '/'+ uId +'?date=&year=&month=&period=');
                return contents;
            },
            listContents: function (id, uId) {
                //contents = $resource('http://cds.bigpay.vn/content/icare/contents/' + id + '/' + $localstorage.getObject('user').user_name).query();
                contents = $resource('http://cds.bigpay.vn/content/icare/contents/' + id + '/'+ uId +'?date=&year=&month=&period=').query();
                return contents;
            },
            getContent: function (catalogId, Id, uId) {
                // for(var i = 0;i<contents.length;i++)
                // {
                //     if(contents[i].id == Id) return contents[i];
                // }
                contents = $resource('http://cds.bigpay.vn/content/icare/' + catalogId +'/' + Id +'/' + uId +'?date=&year=&month=&period=').get();
                return contents;
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
            },
            GetinvoiceDetail: function(customerid) {
               contents = $resource('http://billing.bigpay.vn/home/evn/hanoi/'+customerid+'/detail').get();
                return contents;
            }
        }
    }) 
	.factory('apiService', function ($http) {
        return {
            postLogin: function (username, password, platform, uuid) {
                return $http.get('http://cds.bigpay.vn/id/login/icare?username=' + username + '&password=' + password + '&platform=' + platform + '&uuid=' + uuid );
            },
            auth: function (big_user, big_password) {
                    return $http.get('http://bigpay.vn/api/sandbox/auth/' + big_user + '/' + big_password );  
            },
            pay: function (profile_id, merchant_code, merch_txn_ref, amount, payment_provider) {
                 return $http.get('http://bigpay.vn/api/sandbox/pay/ECOM/' + merchant_code + '/' + merch_txn_ref
                + '/?profile_id=' + profile_id
                +'&amount=' + amount
                + '&payment_provider=' + payment_provider
                + '&bank='
                );
            },
            comfirm: function (transaction_type, trans_id, profile_id, amount, otp) {
                return $http.get('http://bigpay.vn/api/sandbox/confirm/' + transaction_type + '/' + trans_id
                + '/?profile_id=' + profile_id
                + '&amount=' + amount
                + '&otp=' + otp
                );
            },
             create_transaction: function(transaction) {
                // var user_info = $localstorage.getObject('user_info');
                var id = "huynq@payflow.vn";
                // console.log('user:',user_info);
                // if(user_info != null) id= transaction.customer_ref;
                var url = 'http://api.bigpay.vn/transaction/create/bigpay_2.0.0.0/' + id + '/?transaction=' + transaction + "&sign=";
                var auth_response = $http.get(url);
                console.log('resp:', auth_response);
                return auth_response;
            }
        }
    });
