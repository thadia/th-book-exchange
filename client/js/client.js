
var myApp = angular.module('myApp',['googlechart']);


myApp.controller('mainController', function($scope, $http, $window) {
     $http.get("/polls/all")
    .then(function (response) {
         $scope.polls = response.data;
         $scope.getUsername();
         $scope.getmyip();

         
    });
    
     $scope.getUsername = function(){
         $http.get("/username")
            .then(function (response) {
         if(response.data)      
         $scope.userdata = response.data;
         else { 
             $scope.getmyip();
             console.log("IP " + $scope.myip);
            }
         });
     } 
     
     $scope.getmyip = function(){
         $http.get("/myip")
            .then(function (response) {
         if(response)      
         $scope.myip = response.data;
         else $scope.myip=null;
         });
     } 
     
    /*  $scope.hasVoted = function(itemName,voter){
         $http.get("/voters/"+ itemName)
            .then(function (response) {
             console.log("Voters: "+ response.data);        
             $scope.voters = response.data;
             for(var i=0;i< $scope.voters.length;i++){
                 if($scope.voters[i] == voter){
                     return true;
                 }
             }
             return false;
         });
     } */
     

     $scope.getAll = function(){
          $http.get("/polls/all")
            .then(function (response) {
            $scope.polls = response.data;
        });
     } 
     
      $scope.isOwner = function(poll_owner,owner){
          if(poll_owner == owner && (typeof(owner) != "undefined"))
            return true;
           { //console.log(poll_owner + "=="+ owner );
               return false;    
           }
     } 
     
     $scope.logout = function() {
        $http.get("/logout")
        .then(function (response) {
             $scope.userdata = null;
             $scope.getAll();
             $window.location.href = '/home';
        }); 
    }; 
     
     $scope.vote = function(poll, itemName, slectedItemObj) {
         //voting call here
         $scope.selectedName = slectedItemObj;
         $scope.selectedName.item = itemName;
         $scope.poll = poll;
        // $scope.user = "guest";
         $scope.string_API = "/polls/vote/" +$scope.poll.title+"/" +$scope.selectedName;
         console.log("LOG Voting: "+ $scope.string_API);
    
         $http.get($scope.string_API)  //string 
        .then(function (response) {
             $scope.getAll();
             $scope.alertVoted = "You voted for: " + $scope.selectedName;
             //$window.location.href = '/home';
        }); 
    };
    
    
    $scope.voteIp = function(poll, itemName, slectedItemObj,ip) {
         //voting call here
         $scope.selectedName = slectedItemObj;
         $scope.selectedName.item = itemName;
         $scope.poll = poll;
         $scope.poll.ip = ip;
        // $scope.user = "guest";
         $scope.string_API = "/polls/vote/" +$scope.poll.ip+"/" +$scope.poll.title+"/" +$scope.selectedName;
         console.log("LOG Voting: "+ $scope.string_API);
    
         $http.get($scope.string_API)  //string 
        .then(function (response) {
             $scope.getAll();
             $scope.alertVoted = "You voted for: " + $scope.selectedName;
             //$window.location.href = '/home';
        }); 
    };
    
      
   //  $scope.newPoll = function(owner, pollName, items ) {
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
    
    

       $scope.drawChart = function(itemName) {

         $scope.string_API = "/polls/viewChart/" + itemName;
         console.log("LOG Show drawChart: "+ $scope.string_API);
    
         $http.get($scope.string_API)  //string 
        .then(function (response) {
            $scope.itemToDraw = response.data;
           
            
                   var chart1 = {};
                   chart1.type = "PieChart";
                   chart1.data = [['Item', 'Votes'],];
                   for(var i=0;i<$scope.itemToDraw.list.length;i++){
                       chart1.data.push([$scope.itemToDraw.list[i].item,$scope.itemToDraw.list[i].count]);
                   }
                  
                   chart1.options = {
                       displayExactValues: true,
                       border: 0,
                       width: 800,
                       height: 600,
                       is3D: false,
                       chartArea: {left:20,top:40,bottom:0,height:"100%"}
                   };
               
                   chart1.formatters = {
                     number : [{
                       columnNum: 1,
                       pattern: "#,##0.00"
                     }]
                   };
               
                   $scope.chart = chart1;
               
            
             console.log("My Object to Draw Scope Chart "+ $scope.chart.data);
            
            
            
            
            
            
        }); 
    };   
    
    
    
}); 


$('#myNav').affix({
   offset: {
      top: 100, bottom: function () {
         return (this.bottom = $('.bs-footer').outerHeight(true))
      }
   }
})


 
   
 






