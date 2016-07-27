angular.module('starter.controllers',  ['ionic', 'ngResource','ngSanitize','ionic.utils','dataServices','chart.js'])
.controller('AppCtrl', function ($scope,$ionicModal,$timeout, $state,$localstorage,$location, $window,apiService, contentService) {
  
  ///////////////////////////////
    $scope.changePassData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/changepass.html', {
    scope: $scope
  }).then(function(mpopup) {
    $scope.mpopup = mpopup;
  });

  // Triggered in the login modal to close it
  $scope.closepopup = function() {
    $scope.mpopup.hide();
  };

  // Open the login modal
  $scope.popup = function() {
    $scope.mpopup.show();
  };
$scope.catalogs = contentService.listCatalogs();  
$scope.signIn = function (user) {
        //var passhash = CryptoJS.MD5(user.password).toString();
        // alert(passhash);
        apiService.postLogin(user.username, user.password).then(function (response) {
            $scope.result = response.data;
            if ($scope.result.full_name) {
                $scope.isLogin =false;
                $localstorage.setObject('user',$scope.result);
                $state.go('tab.home', {}, { reload: true });
                return;
            }
            else {
                $scope.error_message = "Sai thông tin đăng nhập";
            }
        }, function (error) {
            console.log('opsssss' + error);
            $scope.error_message = "Có lỗi trong quá trình xử lý";
        });
    };
    
    
  // Perform the login action when the user submits the login form
  $scope.doChangePass = function() {
    console.log('Doing change pass', $scope.changePassData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
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
      $scope.isLogin =false;    
    }
    else
    {
      $scope.isLogin =true;
    $state.go('tab.login', {}, { reload: true });
    }
})
.controller('NotifCtrl', function ($scope, $stateParams,contentService) {
  var notif_catalog_id = '566e017de77a499f271b0d25';
    $scope.contents = contentService.listContents(notif_catalog_id);
    $scope.toggleGroup = function(content) {
    if ($scope.isGroupShown(content)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = content;
    }
  };
  $scope.isGroupShown = function(content) {
    return $scope.shownGroup === content;
  };
})
.controller('LoginCtrl',function($scope,$localstorage, apiService, $state){
 
  $scope.user_info = $localstorage.getObject('user');
   if ($scope.user_info) {
      $scope.isLogin =false;
      $state.go('tab.home', {}, { reload: true });  
      return;  
    }
    else
    {
      $scope.isLogin =true;
    $state.go('tab.login', {}, { reload: true });
    return;
    }
})
.controller('SearchListCtrl', function($scope,$localstorage,$location, $window,$stateParams,contentService){
        //== get date ==//
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10) {
            dd='0'+dd
        } 
        // if(mm<10) {
        //     mm=mm
        // } 
        var stoday = dd+'/'+"0"+mm+'/'+yyyy;
        //== get month ==//
        var tomonth = new Date();
        var mm2 = tomonth.getMonth()+1; //January is 0!
        var yyyy2 = tomonth.getFullYear();
        if(mm<10) {
            mm2='0'+mm
        } 
        var stomonth = mm2+'/'+yyyy2;
        
    $scope.search_data = {};
    $scope.search_data.date = stoday;//.toLocaleString().substring(0,today.toLocaleString().indexOf(' ')).replace(',','');
    $scope.search_data.month = stomonth;
    $scope.search_data.year = ''+yyyy;
    $scope.search_data.period = 1;
   for(var i =0;i<$scope.catalogs.length;i++)
                {
                    if($scope.catalogs[i].id  == $stateParams.catalogId) {
                        $scope.catalog = $scope.catalogs[i];
                        break;
                    }
                }
  $scope.query_date =$stateParams.queryType === "date";
  $scope.query_year =$stateParams.queryType === "year";
  $scope.query_month =$stateParams.queryType === "month" ||$stateParams.queryType === "period" ;
  $scope.query_period =$stateParams.queryType === "period";
  $scope.searchContent = function(search_data){
      //console.log(search_data);
       var searchdata = {};
       searchdata.year ='';
       searchdata.month ='';
       searchdata.date ='';
       searchdata.period ='';
       searchdata.catalogId = $stateParams.catalogId;
    //    var myDate = {};
      // searchdata = search_data;
      if($scope.query_date){
          console.log(search_data.date);
         searchdata.year = search_data.date.split('/')[2];
         searchdata.month= search_data.date.split('/')[1];
         searchdata.date= search_data.date.split('/')[0];
    //   myDate = search_data.date;
    //   searchdata.year ='';
    //   var monthDate = myDate.getMonth() + 1;
    //   var sMonthDate = monthDate + '';
    //   if (monthDate < 10) sMonthDate = '0' + sMonthDate;
    //   searchdata.date= myDate.getFullYear()+''+monthDate+''+myDate.getDate()
      }
      if($scope.query_year){
         searchdata.year = search_data.year; 
      }
      if($scope.query_month){
         searchdata.year = search_data.month.split('/')[1];
         searchdata.month= search_data.month.split('/')[0];
       }
      if($scope.query_period){
        searchdata.period = search_data.period;
      } 
      $scope.contents = contentService.searchContent(searchdata);
      console.log($scope.contents);
    };
    
    //console.log($scope.search_data);
})
.controller('ListContentCtrl', function($scope,$localstorage,$location, $window,$stateParams,contentService){
   for(var i =0;i<$scope.catalogs.length;i++)
                {
                    if($scope.catalogs[i].id  == $stateParams.catalogId) {
                        $scope.catalog = $scope.catalogs[i];
                        break;
                    }
                }
  
      // console.log(search_data);
       var searchdata = {};
       searchdata.year ='';
       searchdata.month ='';
       searchdata.date ='';
       searchdata.period ='';
       searchdata.catalogId = $stateParams.catalogId;
      $scope.contents = contentService.searchContent(searchdata);
      console.log($scope.contents);
})
.controller('AccountCtrl',function($scope, $localstorage, $state){
  $scope.user_info = $localstorage.getObject('user');
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
.controller('HomeCtrl',function($scope, $localstorage, $state, $ionicConfig){
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
.controller('GuideCtrl',function($scope, $localstorage, $state, $ionicConfig){
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
.controller('ChartCtrl', function($scope,$localstorage,$location, $window,$stateParams,contentService){
      for(var i =0;i<$scope.catalogs.length;i++)
                {
                    if($scope.catalogs[i].id  == $stateParams.catalogId) {
                        $scope.catalog = $scope.catalogs[i];
                        break;
                    }
                }
     
                // $scope.graph = {};

  $scope.searchChartContent = function(year){
      //console.log(search_data);
       var searchdata = {};
       searchdata.year =year;
       searchdata.month ='';
       searchdata.date ='';
       searchdata.period ='';
       searchdata.catalogId = $stateParams.catalogId;
       $scope.series1 = ['Điện tiêu thụ ' + (year-1),'Điện tiêu thụ ' + year];
       $scope.series2 = ['Tiền điện ' + (year-1),'Tiền điện ' + year];
       $scope.title1="Thống kê điện tiêu thụ năm " + (year-1) + ' - ' + year;
       $scope.title2="Thống kê tiền điện năm " + (year-1) + ' - ' + year;
           
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
})
;
