
var myApp = angular.module('myApp',[]);
myApp.factory('names_list', function($http){
   return $http.get("/stocks/mylist/all/names");
});   








 window.onload=function(){
     $(function(){
         if(window.location.protocol==="https:")
             window.location.protocol="http";
     });
 }








