
var myApp = angular.module('myApp',[]);


myApp.controller('mainController', function($scope, $http, $window) {
 //    $http.get("/polls/all")
 //   .then(function (response) {
 //        $scope.polls = response.data;
 // }); 
     $http.get("/username")
     .then(function (response) {
              if(response.data !=  null){
               $scope.userName=response.data;
               console.log(response.data + ' Get My Username ' +  $scope.userName);
                $http.get("/myInfo/"+$scope.userName)
                    .then(function (response) {
                        if(response.data !=  null){
                         $scope.fullName=JSON.stringify(response.data[0].user_fullName);
                         $scope.city=JSON.stringify(response.data[0].user_city);
                         $scope.state=JSON.stringify(response.data[0].user_state);
                         console.log(response.data + ' Get My Info ' + $scope.state);
                      }
            });
              }
    });
    
     $http.get("/books/"+$scope.userName)
            .then(function (response) {
                if(response.data !=  null){
                 $scope.myBooks=response.data;
                 console.log(response.data + ' Get My Books ' +  $scope.myBooks);
              }
    });
    
   
    
    
    $scope.getAll = function(){
          $http.get("/polls/all")
            .then(function (response) {
           
        });
     }
     
     
       
   
     
     $scope.login = function(userName,userPwd){
          $http.get("/login/"+userName+"/"+userPwd)
            .then(function (response) {
              if(response.data == 'true'){
               userName=userName;
               console.log(response.data + 'LOG HERE');
               $window.location.href = '/home/true';
              }
        });
     } 
     
      $scope.getUserName = function(){
          $http.get("/username")
            .then(function (response) {
              if(response.data !=  null){
               $scope.userName=response.data;
               console.log(response.data + ' Get My Username');
              }
        });
     } 
     
     $scope.create = function(userName,userPwd){
          $http.get("/create/user/"+userName+"/"+userPwd)
            .then(function (response) {
              if(response.data == 'true'){
               $scope.userName=userName;
               console.log(response.data + 'LOG HERE');
               $window.location.href = '/home/true';
              }
        });
     } 
     
     $scope.logout = function(){
          $http.get("/logout")
            .then(function (response) {
               console.log('LogOut was pressed. ');
               console.log(' Username before logout: ' +  $scope.userName);
               $scope.userName=null;
               $window.location.href = '/';
               console.log(' Username after logout: ' +  $scope.userName);

        });
     }  
     
    $scope.newPoll = function(pollName, items ) {
         // polls/post/:user/:title/:list
         
         $scope.pollName = pollName;
         $scope.items = items;
         $scope.string_API = "/polls/post/"+$scope.pollName+"/" +$scope.items;
         console.log("LOG New Poll: "+ $scope.string_API);
    
         $http.get($scope.string_API)  
        .then(function (response) {
             $scope.getAll();
             $scope.alertVoted = "Your New Poll: "+$scope.pollName+" was added.";
        });
        
         $scope.pollName = "";
         $scope.items = "";
    }; 
    $scope.removePoll = function(pollName ) {
         $scope.pollName = pollName;
         $scope.string_API = "/polls/remove/"+$scope.pollName ;
         console.log("LOG New Poll: "+ $scope.string_API);
         $http.get($scope.string_API)  
        .then(function (response) {
             $scope.getAll();
             $scope.alertVoted = "Your Poll: "+$scope.pollName+" was removed.";
             $scope.pollName = "";
        }); 
    }; 
    
    

}); 


 
   
 






