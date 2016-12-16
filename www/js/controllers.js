angular.module('starter.controllers', ['ionic', 'ngCordova', 'ngResource', 'ngSanitize', 'ionic.utils', 'dataServices', 'chart.js'])
.controller('AppCtrl', function ($rootScope, $scope, $cordovaAppVersion, $cordovaBadge, $ionicModal, $timeout,
$state, $localstorage, $location, $window, apiService, contentService, $cordovaDialogs) {
    $rootScope.has_unread = false;
    $rootScope.notif = 0;
    $rootScope.loadNotifs = function () {
        var user_info = $localstorage.getObject('user');
        var notif_catalog_id = '566e017de77a499f271b0d25';
        if (user_info) {
            $rootScope.listNotif = contentService.listContents(notif_catalog_id, user_info.user_name);
            //Kiem tra co thang nao chua doc k, neu co thi set bien has_unread = true;
            // for (var i = 0; i < $rootScope.listNotif.length ; i++) {
            //     if ($rootScope.listNotif[i].isread == false) {
            //         $rootScope.has_unread = true;
            //         break;
            //     }
            // }
             $scope.listNotif = contentService.httpListContents(notif_catalog_id, user_info.user_name).then(function(response){
                $scope.listNotif = response.data;
                for (var i = 0; i < $scope.listNotif.length; i++) {
                    $rootScope.has_unread = false;
                if ($scope.listNotif[i].isread == false) {
                    $rootScope.has_unread = true;  
                    console.log($rootScope.has_unread);
                    break;
                    }
                }
                 $rootScope.notif = 0;
                for(var i=0; i< $scope.listNotif.length; i++)
                {
                    if ($scope.listNotif[i].isread == false) {
                        $rootScope.notif ++ ;
                    }
                }
                var notiffalse = $rootScope.notif;
                
                   if (notiffalse > 0) {
                    
                       ionic.Platform.ready(function () {
                       cordova.plugins.notification.badge.promptForPermission();
                       cordova.plugins.notification.badge.configure({ smallIcon: 'icon', title: 'Bạn có '+notiffalse +' Thông báo mới', autoClear: true });
                       cordova.plugins.notification.badge.set(notiffalse);

                    }, false);
                    
                    //  $cordovaBadge.promptForPermission();
                    //  $cordovaBadge.hasPermission().then(function(result) {
                    //  $cordovaBadge.set(total);
                    //  }, function(error) {
                    //     console.log(error);
                    // });
                 
                    // $cordovaBadge.set(total).then(function () {
                    //     $cordovaBadge.hasPermission().then(function(){
                    // });
                    // }, function (err) {
                    //     // You do not have permission.
                    //     $cordovaDialogs.alert('not allowed');      
                    // });
                }
                else {
                    $cordovaBadge.clear();
                }
                
            });
            console.log($rootScope.has_unread);
            console.log($rootScope.notif);
            contentService.gettotalnoif(user_info.user_name).then(function (response) {
                $scope.notifInfo = response.data;

                var total = $scope.notifInfo.Total;
                
                console.log(total);
                
                console.log('Load notifications');
                // total = 10;
                // console.log($scope.totalnotif)
//                 if (notiffalse > 0) {
//                     
//                     ionic.Platform.ready(function () {
//                        cordova.plugins.notification.badge.promptForPermission();
//                        cordova.plugins.notification.badge.configure({ smallIcon: 'icon', title: 'Bạn có '+notiffalse +' Thông báo mới', autoClear: true });
//                        cordova.plugins.notification.badge.set(notiffalse);
// 
//                     }, false);
//                     
//                     //  $cordovaBadge.promptForPermission();
//                     //  $cordovaBadge.hasPermission().then(function(result) {
//                     //  $cordovaBadge.set(total);
//                     //  }, function(error) {
//                     //     console.log(error);
//                     // });
//                  
//                     // $cordovaBadge.set(total).then(function () {
//                     //     $cordovaBadge.hasPermission().then(function(){
//                     // });
//                     // }, function (err) {
//                     //     // You do not have permission.
//                     //     $cordovaDialogs.alert('not allowed');      
//                     // });
//                 }
//                 else {
//                     $cordovaBadge.clear();
//                 }
                
            });
        }
    };
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
        var user_info = $localstorage.getObject('user');
        if (user_info == null) {
            if (next.name == 'tab.home' || next.name == 'tab.account' || next.name == 'tab.notif') {
                event.preventDefault();
                $state.go('tab.login');
            }
        }
        else {
            //Load thong bao o day
            if (next.name == 'tab.notif') {
                $rootScope.loadNotifs();
            }
        }
    });
    $rootScope.loadNotifs();

    document.addEventListener("deviceready", function () {
        $cordovaAppVersion.getVersionNumber().then(function (version) {
            $rootScope.version_info = "v." + version;
        });
    }, false);
    
    //background app runing pushnotification
    document.addEventListener('deviceready', function () {
        if (cordova.backgroundapp.resumeType == 'launch') {
            renderUi();
        }
    }, false);
    document.addEventListener("resume", function () {
        if (cordova.backgroundapp.resumeType == 'normal-launch') {
            renderUi();
        } else if (cordova.backgroundapp.resumeType == 'programmatic-launch') {
            cordova.backgroundapp.show();
        }
    }, false);
    // $cordovaAppVersion.getVersionNumber().then(function (version) {
    // 		  
    // 	});
    
   $ionicModal.fromTemplateUrl('templates/done.html', {
    scope: $scope
  }).then(function(apopup) {
    $scope.apopup = apopup;
  });

  // Triggered in the login modal to close it
  $scope.closedone = function() {
    $scope.apopup.hide();
  };
$scope.catalogs = contentService.listCatalogs();
  // Open the login modal
  $scope.done = function() {
    $scope.apopup.show();
  };
    ///////////////////////////////
//     $ionicModal.fromTemplateUrl('templates/tappay.html', {
//     scope: $scope
//   }).then(function(dpopup) {
//     $scope.dpopup = dpopup;
//   });
// 
//   // Triggered in the login modal to close it
//   $scope.closedone = function() {
//     $scope.dpopup.hide();
//   };
// $scope.catalogs = contentService.listCatalogs();
//   // Open the login modal
//   $scope.done = function() {
//     $scope.dpopup.show();
//   };
    ///////////////////////////////

    $scope.changePassData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/changepass.html', {
        scope: $scope
    }).then(function (mpopup) {
        $scope.mpopup = mpopup;
    });

    // Triggered in the login modal to close it
    $scope.closepopup = function () {
        $scope.mpopup.hide();
    };

    // Open the login modal
    $scope.popup = function () {
        $scope.mpopup.show();
    };


    $scope.catalogs = contentService.listCatalogs();
    $scope.signIn = function (user) {
        //var passhash = CryptoJS.MD5(user.password).toString();
        // alert(passhash)
        // get uuid & platform
        ionic.Platform.ready(function () {
            user.platform = window.device.platform;
            user.uuid = window.device.uuid;
            
            // window.plugins.pushNotification.register(
                // successHandler,
                // errorHandler,
                // {
                    // "senderID": "345481149877",
                    // "ecb": "onNotificationGCM",
                    // "badge": "true",
                    // "sound": "true",
                    // "alert": "true"
                // });
            // function successHandler(result) {
                // alert("Result " + result);
            // }
            // function errorHandler(error) {
                // alert("error " + result);
            // }
            // function onNotificationGCM(e) {
                // alert("true");
                // switch (e.event) {
                    // case 'registered':
                        // prompt("Copy Register Id", e.regid);
                        // // alert("ID: " + e.regid);
                        // sendRequest(e.regid);
                        // alert("Successfully Registered");
                        // break;
                    // case 'message':
                        // // alert(JSON.stringify(e.payload));
                        // // prompt("imessege", e.payload.message);
                        // alert("imessage: " + e.payload.message);
                        // var sound = new Media("assets/www/" + e.soundname);
                        // sound.play();
                        // break;
                    // default:
                        // alert("unknown event");
                // }

            // }
            // var appv = window.cordova.plugins.version.getAppVersion();
            // console.log(appv);
        });
        //
        try {
            apiService.postLogin(user.username, user.password, user.platform, user.uuid).then(function (response) {
                $scope.result = response.data;
                if ($scope.result.full_name) {
                    // alert(user.uuid);
                    // alert(user.platform);
                    $scope.isLogin = false;
                    $localstorage.setObject('user', $scope.result);
                    $state.go('tab.home', {}, { reload: true });
                    $window.location.reload(true);
                    return;
                }
                else {
                    $scope.error_message = "Sai thông tin đăng nhập";
                }
            }, function (error) {
                console.log('opsssss' + error);
                $scope.error_message = "Có lỗi trong quá trình xử lý";
            });
        }
        catch (ex) { }
    };


    // Perform the login action when the user submits the login form
    $scope.doChangePass = function () {
        console.log('Doing change pass', $scope.changePassData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeChangePass();
        }, 1000);
    };

    //logout
    $scope.signOut = function () {
        $window.localStorage.clear();
        console.log("Clean storage");
        // $scope.isLogin =true;    
        $window.location.reload(true);
        // $state.go('tab.login', {}, { reload: true });
    }
    $scope.user = $localstorage.getObject('user');
    if ($scope.user) {
        $scope.isLogin = false;
    }
    else {
        $scope.isLogin = true;
        $state.go('tab.login', {}, { reload: true });
    }
})
.controller('PaymentCtrl', function ($scope, $localstorage, $location, $window, $stateParams, $state, apiService, contentService) {
     var info = $localstorage.getObject('user');
     $scope.user = {};
     $scope.user.customerId = info.user_name;

     $scope.pay_do = function (user) {
        $localstorage.setObject('cusId', user.customerId);
        $state.go('tab.paymentdetail', {}, {reload:true})
        
    //     var search_data = {};
    //     search_data.username = user.customerId;
    //     $scope.pay = false;
    //     ionic.Platform.ready(function () {
    //         user.platform = "browser";
    //         user.uuid = "uuid";
    //     });
    //     if(!search_data.username)
    //     {
    //         apiService.postLogin(search_data.username, search_data.username, user.platform, user.uuid).then(function (response) {
    //             $scope.result = response.data;
    //             if ($scope.result) {
    //                 console.log($scope.result);
    //                 $scope.user = $scope.result;
    //                 $scope.pay = true;
    //                 $state.go('tab.paymentdetail', {}, {reload:true})
    //             }
    //             else {
    //                 $scope.error_message = "Sai thông tin đăng nhập";
    //             }
    //         }, function (error) {
    //             console.log('opsssss' + error);
    //             $scope.error_message = "Có lỗi trong quá trình xử lý";
    //         });
    //     }
    //     else
    //         {
    //             apiService.postLogin(user.customerId, user.customerId, user.platform, user.uuid).then(function (response) {
    //             $scope.result = response.data;
    //             if ($scope.result) {
    //                 console.log($scope.result);
    //                 $scope.user = $scope.result;
    //                 $scope.pay = true;
    //                 $state.go('tab.paymentdetail', {}, {reload:true})
    //             }
    //             else {
    //                 $scope.error_message = "Sai thông tin đăng nhập";
    //             }
    //         }, function (error) {
    //             console.log('opsssss' + error);
    //             $scope.error_message = "Có lỗi trong quá trình xử lý";
    //         });   
    //         }
    //     }
    
    //  $scope.searchContent = function () {
    //     var searchdata={};
    //     searchdata.money = 150000;
    //     searchdata.otp = 20160616;
    //     var hass_key = "198BE3F2E8C75A53F38C1C4A5B6DBA27";
    //     var access_code = "BIGPAYTEST";
    //     var locale = "VN";
    //     var merchant = "TESTMERCHANT";
    //     var order_info = "Thanh toán tiền điện"
    //     var return_url = "templates/home.html";
    //     var versions = 1.0;
        
    //     var md5 = CryptoJS.MD5(hass_key + access_code + searchdata.money + locale + merchant + searchdata.otp + order_info + return_url + versions).toString();
        
        // $window.location.href = 'http://sandbox.bigpay.vn/#/?version=1.0&locale=VN&command=pay&merchant=TESTMERCHANT&access_code=BIGPAYTEST&merch_txn_ref=' + search_data.otp +'&currency=VND&amount='+ search_data.money +'&return_url=' + return_url + '&secure_hash=' + md5
        
        //    ionic.Platform.ready(function () {
        //     var ref = window.open('http://sandbox.bigpay.vn/#/?version=1.0&locale=VN&command=pay&merchant=TESTMERCHANT&access_code=BIGPAYTEST&merch_txn_ref=' + searchdata.otp +'&currency=VND&amount='+ searchdata.money + '&order_info='+ order_info + '&return_url=' + return_url + '&secure_hash=' + md5);
        // });
        // try{
        //     apiService.bigPay(searchdata.otp, searchdata.money, return_url, md5).then(function (response) {
        //                 $scope.result = response.data;
        //                 $localstorage.setObject('bigpay', $scope.result);
        //                 $state.go('tab.done',{bigPay : $scope.result} , { reload: true });
                        // $window.location.reload(true);
                        // console.log($scope.result);
                        // $window.location.href = $scope.result;
        //         }, function (error) {
        //             console.log('opsssss' + error);
        //             $scope.error_message = "Có lỗi trong quá trình xử lý";
        //         });
        // }catch(ex){}
    };  
})
.controller('PaymentDetailCtrl',function ($scope, $localstorage, $ionicLoading, $location, $window, $stateParams, $state, apiService, contentService,  $ionicPopup, $timeout){
    var _Id = $localstorage.getObject('cusId');
        if(_Id)
        {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Đang tải dữ liệu'
            });
            $scope.invoices = contentService.GetinvoiceDetail(_Id);
            console.log($scope.invoices);
            if ($scope.invoices) {
                $ionicLoading.hide();
            }
        }

        // Triggered on a button click, or some other target
        $scope.showPopup = function() {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="number" ng-model="data.otp">',
            title: 'Nhập mã OTP của bạn',
            // subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
            { text: 'Cancel' },
            {
                text: '<b>OKay</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.otp) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.otp;
                    }
                }
            }
            ]
        });

        myPopup.then(function(res) {
            console.log('OTP', res);
            $state.go('tab.success', {}, { reload: true });
        });

        // $timeout(function() {
        //     myPopup.close(); //close the popup after 3 seconds for some reason
        // }, 3000);
        };
})
.controller('SuccessCtrl',function($scope, $state, apiService, $localstorage,$ionicLoading, $location, $window, $stateParams, contentService, $sce){
        var _Id = $localstorage.getObject('cusId');
        if(_Id)
        {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Đang tải dữ liệu'
            });
            $scope.invoices = contentService.GetinvoiceDetail(_Id);
            console.log($scope.invoices);
            if ($scope.invoices) {
                $ionicLoading.hide();
            }
        }
})
.controller('BankCtrl',function ($scope, $state, apiService, $localstorage, $location, $window, $stateParams, contentService, $sce) {
        var tmp = $stateParams.amount;
        var money = tmp.replace(",", "");
        $scope.amount = $stateParams.amount;
        $scope.search_data = {};
        $scope.search_data.user = '';
        $scope.search_data.pass = '';
        var merchant = "TESTMERCHANT";
        var return_url = "http://localhost:800/ntg/mobil_final/www/#/tab/payment";
        var trans_confirm_info = {};
                trans_confirm_info.merchant = 'bigpay';
                // trans_confirm_info.provider = {code:"evnhn",name:'EVN Hà Nội'};
                trans_confirm_info.service = {code: "payment", name:'Thanh toán điện tử'};
                trans_confirm_info.sub_service = {code:"billing",name:'Thanh toán hoá đơn'};
                trans_confirm_info.customer = {
                    name: "CUSTOMER "+$stateParams.customerid,
                    mobile: "", //ma hoa don
                    email: ""
                };
                // trans_confirm_info.customer_ref = $stateParams.customerid;//mã khách hàng
                trans_confirm_info.note = "thanh toán tiền điện";
                // trans_confirm_info.system_note = "Thanh toán " + $stateParams.amount + ' cho hóa đơn '
                // + $stateParams.customerid + ' ("thanh toán tiền điện")';
                trans_confirm_info.amount = $stateParams.amount;//So tien thanh toan
                trans_confirm_info.detail = {
                    amount: $stateParams.amount,
                    bill_info: $stateParams.customerid, //ma hoa don
                    bill_provider: "EVNHN"
                };
                trans_confirm_info.status = {code:"waiting",name:'chờ xác nhận'};
                
                trans_confirm_info.payment_method = "atm"; //atm - credit
                // trans_confirm_info.status = { code: "confirm", name: 'chờ thanh toán' };
                 
            $scope.show =false;
            // $scope.pay = function(){
                // $scope.show =true;
                apiService.create_transaction(JSON.stringify(trans_confirm_info))
                 .then(function(response) {
                        var result = response.data;
                        if (!result || result.error_code != "00") {
                            $scope.onloginerror = "Có lỗi trong quá trình xử lý. Vui lòng thử lại sau";
                            return;
                        }
                        // if (payment_option == "bigpay") {
                        //     $state.go('transaction.paybybigpay', {}, { reload: true });
                        // };
                        // if (payment_method == "atm" || payment_method == "credit") {
                           $scope.url = function(src){
                               return $sce.trustAsResourceUrl(src);                               
                           }
                           $scope.murl = {src:result.url_redirect};
                        // }
                        console.log($scope.url);
                    });
            // };
})
.controller('TappayCtrl', function ($scope, $state, apiService, $localstorage, $location, $window, $stateParams, contentService) {
    
        $scope.search_data = {};
        $scope.search_data.user = '';
        $scope.search_data.pass = '';
        
    $scope.searchContent = function (search_data) {
        var searchdata={};
        searchdata.user = search_data.user;
        searchdata.pass = search_data.pass;
        searchdata.money = 150000;
        searchdata.otp = 20160616;
        var hass_key = "198BE3F2E8C75A53F38C1C4A5B6DBA27";
        var access_code = "BIGPAYTEST";
        var locale = "VN";
        var merchant = "TESTMERCHANT";
        var return_url = "http://localhost:800/ntg/mobil_final/www/#/tab/payment";
        var order_info = "Thanh toán tiền điện"
        var versions = 1.0;
        
        console.log(searchdata);
        // var md5 = CryptoJS.MD5(hass_key + access_code + searchdata.money + locale + merchant + searchdata.otp + return_url + order_info + versions).toString();
        
        // $window.location.href = 'http://sandbox.bigpay.vn/#/?version=1.0&locale=VN&command=pay&merchant=TESTMERCHANT&access_code=BIGPAYTEST&merch_txn_ref=' + search_data.otp +'&currency=VND&amount='+ search_data.money +'&return_url=' + return_url + '&secure_hash=' + md5
        
        //    ionic.Platform.ready(function () {
        //     // var ref = window.open('http://sandbox.bigpay.vn/#/mobile/api?version=1.0&locale=VN&command=pay&merchant=TESTMERCHANT&access_code=BIGPAYTEST&merch_txn_ref=' + searchdata.otp +'&currency=VND&amount='+ searchdata.money + '&order_info='+ order_info +'&secure_hash=' + md5 + '&bigpayu=' + searchdata.user + '&bigpayp=' + searchdata.pass);
        //     var ref = window.open('http://sandbox.bigpay.vn/#/?version=1.0&locale=VN&command=pay&merchant=TESTMERCHANT&access_code=BIGPAYTEST&merch_txn_ref=' + searchdata.otp +'&currency=VND&amount='+ searchdata.money +'&return_url=' + return_url + '&secure_hash=' + md5);
        // });
        // console.log(md5);
        // try{
        if(searchdata.user !='' && searchdata.pass !='')
         {
             apiService.auth(searchdata.user, searchdata.pass).then(function (response) {
                var auth_response = response.data;
                $scope.data_is_ok = auth_response.error_code == "00";
                
                if (!$scope.data_is_ok) {
                    $scope.error_message = "Thông tin tài khoản không hợp lệ. Vui lòng kiểm tra và thử lại !";
                }
                else {
                    apiService.pay(searchdata.user, merchant, searchdata.otp, searchdata.money, 'GNCE')
                        .then(function (response) {
                            var result = response.data;
                            $scope.pay_ok = result.error_code == "00";
                            var return_result = {};
                            return_result.error_message = result.error_message;
                            if ($scope.pay_ok) {
                                $scope.confirm = true;
                                $scope.trans_id = result.trans_id;
                                // $scope.error_message = result.error_message;
                                return_result.return_url = return_url + "&response_code=0"
                                   + "&response_message=" + result.error_message
                                   + "&transaction_no=" + result.trans_id
                                   + "&payment_type=BIGPAY&secure_hash=";
                            }
                            else {
                                $scope.error_message = result.error_message;
                                return_result.return_url = return_url + "&response_code=3"
                                    + "&response_message=" + result.error_message
                                    + "&transaction_no=" + result.trans_id
                                    + "&payment_type=BIGPAY&secure_hash=";
                            }
                            console.log(return_result);
                        })
                }
            });
             
            // apiService.auth(searchdata.user, searchdata.pass).then(function (response) {
            //             $scope.result = response.data;
            //             console.log($scope.result);
            //     }, function (error) {
            //         console.log('opsssss' + error);
            //         $scope.error_message = "Có lỗi trong quá trình xử lý";
            //     });
        // }catch(ex){}
         }
         else
        {
                 $scope.error_message = "Thông tin tài khoản không hợp lệ. Vui lòng kiểm tra và thử lại !";
        }    
        $scope.clear_data = function () {
            $window.location.reload(true);
        }
    };  
})
.controller('AtmCtrl', function ($scope, $localstorage, $location, $window, $stateParams, contentService) {
    $scope.ebanklist = [
        { value:'Ngân hàng Ngoại Thương Việt Nam - Vietcombank', id:'970436'},
        { value:'Ngân hàng Kỹ thương Việt Nam - Techcombank', id:'970407'},
        { value:'Ngân hàng Quân đội - MBBank', id:'970422'},
        { value:'Ngân hàng Quốc tế - VIB', id:'970441'},
        { value:'Ngân hàng Công thương - ViettinBank', id:'970489'},
        { value:'Ngân hàng Hàng hải - Maritimebank', id:'970441'},
        { value:'Ngân hàng Việt Nam Thịnh vượng - VPBank', id:'970432'},
        { value:'Ngân hàng Nam Á - NamAbank', id:'970428'},
        { value:'Ngân hàng Sài Gon - Saigonbank', id:'161087'},
        { value:'Ngân hàng Xăng dầu Petrolimex - PGBank', id:'970430'},
        { value:'Ngân hàng Phát triển Nông thôn - Agribank', id:'970499'},
        { value:'Ngân hàng Việt Á - VietAbank', id:'970427'},
        { value:'Ngân hàng Đại dương - Oceanbank', id:'970414'},
        { value:'Ngân hàng An Bình - ABBank', id:'970459'},
        { value:'Ngân hàng Tiên Phong - TPBank', id:'970423'},
        { value:'Ngân hàng Đầu tư và phát triển Việt Nam - BIDV', id:'970488'},
        { value:'Ngân hàng SHB - SHBank', id:'970443'},
        { value:'Ngân hàng Đông Nam Á - Seabank', id:'970468'},
        { value:'Ngân hàng Bắc Á - BACA', id:'970409'}
    ];
    
 $scope.search_data = {};
	$scope.search_data.bank = '';
	$scope.search_data.name = '';
	$scope.search_data.numbers = '';
	$scope.search_data.month = '';
	
 $scope.searchContent = function (search_data) {
	var searchdata={};
	searchdata.bank = search_data.bank.value;
	searchdata.name = search_data.name;
	searchdata.numbers = search_data.numbers;
	searchdata.month = search_data.month;
    // $scope.contents = contentService.searchContent(searchdata);  
    // console.log($scope.contents);
    console.log(searchdata);
 };
})
.controller('DoneCtrl', function ($scope, $localstorage, $location, $window, $stateParams, contentService) {
})
.controller('NotifCtrl', function ($scope, $localstorage, $location, $window, $stateParams, contentService) {
        //var notif_catalog_id = '566e017de77a499f271b0d25';
        //var user_info = $localstorage.getObject('user');
        //loadNotifs();
        // $scope.contents = contentService.listContents(notif_catalog_id, user_info.user_name);
        //console.log($scope.contents);
})
.controller('NotifDetailCtrl', function ($rootScope,$scope, $localstorage, $location, $window, $stateParams, contentService) {
    for (var i = 0; i < $scope.catalogs.length; i++) {
        if ($scope.catalogs[i].id == $stateParams.catalogId) {
            $scope.catalog = $scope.catalogs[i];
            break;
        }
    }

    // console.log(search_data);
    var user_info = $localstorage.getObject('user');
    var notif_catalog_id = '566e017de77a499f271b0d25';
    var searchdata = {};
    searchdata.year = '';
    searchdata.month = '';
    searchdata.date = '';
    searchdata.period = '';
    searchdata.catalogId = $stateParams.catalogId;
    $scope.contents = contentService.getContent(notif_catalog_id, $stateParams.catalogId, user_info.user_name);
    console.log($scope.contents);
})
.controller('LoginCtrl', function ($scope, $localstorage, apiService, $state) {
    try {
        $scope.user_info = $localstorage.getObject('user');
        if ($scope.user_info) {
            $scope.isLogin = false;
            $state.go('tab.home', {}, { reload: true });
            return;
        }
        else {
            $scope.isLogin = true;
            $state.go('tab.login', {}, { reload: true });
            return;
        }
    } catch (ex) { }
})
.controller('SearchListCtrl', function ($scope, $localstorage, $location, $window, $stateParams, contentService) {
    //== get date ==//
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    // if(mm<10) {
    //     mm=mm
    // } 
    var stoday = dd + '/' + "0" + mm + '/' + yyyy;
    //== get month ==//
    var tomonth = new Date();
    var mm2 = tomonth.getMonth() + 1; //January is 0!
    var yyyy2 = tomonth.getFullYear();
    if (mm < 10) {
        mm2 = '0' + mm
    }
    var stomonth = mm2 + '/' + yyyy2;

    $scope.search_data = {};
    $scope.search_data.date = stoday;//.toLocaleString().substring(0,today.toLocaleString().indexOf(' ')).replace(',','');
    $scope.search_data.month = stomonth;
    $scope.search_data.year = '' + yyyy;
    $scope.search_data.period = 1;
    for (var i = 0; i < $scope.catalogs.length; i++) {
        if ($scope.catalogs[i].id == $stateParams.catalogId) {
            $scope.catalog = $scope.catalogs[i];
            break;
        }
    }
    $scope.query_date = $stateParams.queryType === "date";
    $scope.query_year = $stateParams.queryType === "year";
    $scope.query_month = $stateParams.queryType === "month" || $stateParams.queryType === "period";
    $scope.query_period = $stateParams.queryType === "period";
    $scope.searchContent = function (search_data) {
        //console.log(search_data);
        var searchdata = {};
        searchdata.year = '';
        searchdata.month = '';
        searchdata.date = '';
        searchdata.period = '';
        searchdata.catalogId = $stateParams.catalogId;
        //    var myDate = {};
        // searchdata = search_data;
        if ($scope.query_date) {
            console.log(search_data.date);
            searchdata.year = search_data.date.split('/')[2];
            searchdata.month = search_data.date.split('/')[1];
            searchdata.date = search_data.date.split('/')[0];
            //   myDate = search_data.date;
            //   searchdata.year ='';
            //   var monthDate = myDate.getMonth() + 1;
            //   var sMonthDate = monthDate + '';
            //   if (monthDate < 10) sMonthDate = '0' + sMonthDate;
            //   searchdata.date= myDate.getFullYear()+''+monthDate+''+myDate.getDate()
        }
        if ($scope.query_year) {
            searchdata.year = search_data.year;
        }
        if ($scope.query_month) {
            searchdata.year = search_data.month.split('/')[1];
            searchdata.month = search_data.month.split('/')[0];
        }
        if ($scope.query_period) {
            searchdata.period = search_data.period;
        }
        $scope.contents = contentService.searchContent(searchdata);
        console.log($scope.contents);
    };

    //console.log($scope.search_data);
})
.controller('ListContentCtrl', function ($scope, $localstorage, $location, $window, $stateParams, contentService) {
    for (var i = 0; i < $scope.catalogs.length; i++) {
        if ($scope.catalogs[i].id == $stateParams.catalogId) {
            $scope.catalog = $scope.catalogs[i];
            break;
        }
    }

    // console.log(search_data);
    var searchdata = {};
    searchdata.year = '';
    searchdata.month = '';
    searchdata.date = '';
    searchdata.period = '';
    searchdata.catalogId = $stateParams.catalogId;
    $scope.contents = contentService.searchContent(searchdata);
    console.log(searchdata);
    console.log($scope.contents);
})
.controller('AccountCtrl', function ($scope, $localstorage, $state, $cordovaAppVersion) {
    $scope.user_info = $localstorage.getObject('user');
    //   $cordovaAppVersion.getVersionNumber().then(function (version) {
    // 			 $scope.version_info = "v." + version; 
    // 		});
    // if ($scope.user_info) {
    //     $scope.isLogin =false;
    //   }
    //   else
    //   {
    //     $scope.isLogin =true;
    //     $state.go('tab.login', {}, { reload: true });
    //   }
    // console.log($scope.user)
})
.controller('HomeCtrl', function ($scope, $localstorage, $state, $ionicConfig) {
    $scope.user_info = $localstorage.getObject('user');
    //   $ionicConfig.backButton.text('');
    // if ($scope.user_info) {
    //   $scope.isLogin =false;
    // }
    // else
    // {
    //   $scope.isLogin =true;
    //   $state.go('tab.login', {}, { reload: true });
    //   return;
    // }
    //console.log($scope.user_info)
})
.controller('GuideCtrl', function ($scope, $localstorage, $state, $ionicConfig) {
    // if ($scope.user_info) {
    //   $scope.isLogin =false;
    // }
    // else
    // {
    //   $scope.isLogin =true;
    //   $state.go('tab.login', {}, { reload: true });
    //   return;
    // }
    //console.log($scope.user_info)
})
.controller('ChartCtrl', function ($scope, $localstorage, $location, $window, $stateParams, contentService) {
    for (var i = 0; i < $scope.catalogs.length; i++) {
        if ($scope.catalogs[i].id == $stateParams.catalogId) {
            $scope.catalog = $scope.catalogs[i];
            break;
        }
    }

    // $scope.graph = {};

    $scope.searchChartContent = function (year) {
        //console.log(search_data);
        var searchdata = {};
        searchdata.year = year;
        searchdata.month = '';
        searchdata.date = '';
        searchdata.period = '';
        searchdata.catalogId = $stateParams.catalogId;
        $scope.series1 = ['Điện tiêu thụ ' + (year - 1), 'Điện tiêu thụ ' + year];
        $scope.series2 = ['Tiền điện ' + (year - 1), 'Tiền điện ' + year];
        $scope.title1 = "Thống kê điện tiêu thụ năm " + (year - 1) + ' - ' + year;
        $scope.title2 = "Thống kê tiền điện năm " + (year - 1) + ' - ' + year;

        //    var myDate = {};
        // searchdata = search_data; 
        console.log($scope.year);
        $scope.datagraph = contentService.searchContent(searchdata);
        console.log($scope.datagraph);
        //       $scope.graph = {};
        //   $scope.graph.data = [
        //     //Awake
        //     $scope.datagraph.san_luong
        //   ];
        //   $scope.graph.labels = $scope.datagraph.thang;
        //   $scope.graph.series = ['Điện năng (Kwh)',];
        //   console.log($scope.graph);
    };
});
