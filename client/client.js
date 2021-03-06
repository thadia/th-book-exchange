var myApp = angular.module('myApp', []);


myApp.controller('mainController', function($scope, $http, $window) {

    $http.get("/username")
        .then(function(response) {
            if (response.data != null) {
                $scope.userName = response.data;
                console.log(response.data + ' Get My Username ' + $scope.userName);

                $http.get("/myInfo/" + $scope.userName)
                    .then(function(response) {
                        if (response.data != null) {
                            $scope.fullName = response.data[0].user_fullName;
                            $scope.city = response.data[0].user_city;
                            $scope.state = response.data[0].user_state;
                            console.log(response.data + ' Get My Info ' + JSON.stringify($scope.state));
                        }
                    });

                $http.get("/books/" + $scope.userName)
                    .then(function(response) {
                        if (response.data != null) {
                            $scope.myBooks = response.data[0].user_books;
                            console.log(response.data + ' Get My Books ' + JSON.stringify($scope.myBooks));
                        }
                    });
                
                $http.get("/availablebooks/" + $scope.userName)
                    .then(function(response) {
                        if (response.data != null) {
                            $scope.availableBooks = response.data;
                            console.log('--- Get Available Books ' + JSON.stringify($scope.availableBooks));
                }
                
                 $http.get("/myrequestedbooks/" + $scope.userName)
                    .then(function(response) {
                        if (response.data != null) {
                            $scope.requestedBooks = response.data;
                            console.log('--- Get My Requested Books ' + JSON.stringify($scope.requestedBooks));
                        }
                 });

                
                
            });
            }
        });


    $scope.login = function(userName, userPwd) {
        $http.get("/login/" + userName + "/" + userPwd)
            .then(function(response) {
                if (response.data == 'true') {
                    userName = userName;
                    console.log(response.data + 'LOG HERE');
                    $window.location.href = '/home/true';
                }
                if(response.data == 'false'){
                    alert("Password invalid.");
                }
                if(response.data == 'badUser'){
                    alert("Username invalid.");
                }
            });
    }
    $scope.logout = function() {
        $http.get("/logout")
            .then(function(response) {
                console.log('LogOut was pressed. ');
                console.log(' Username before logout: ' + $scope.userName);
                $scope.userName = null;
                $window.location.href = '/';
                console.log(' Username after logout: ' + $scope.userName);

            });
    }

    $scope.newPoll = function(pollName, items) {
        // polls/post/:user/:title/:list

        $scope.pollName = pollName;
        $scope.items = items;
        $scope.string_API = "/polls/post/" + $scope.pollName + "/" + $scope.items;
        console.log("LOG New Poll: " + $scope.string_API);

        $http.get($scope.string_API)
            .then(function(response) {
                $scope.getAll();
                $scope.alertVoted = "Your New Poll: " + $scope.pollName + " was added.";
            });

        $scope.pollName = "";
        $scope.items = "";
    };
    $scope.removePoll = function(pollName) {
        $scope.pollName = pollName;
        $scope.string_API = "/polls/remove/" + $scope.pollName;
        console.log("LOG New Poll: " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                $scope.getAll();
                $scope.alertVoted = "Your Poll: " + $scope.pollName + " was removed.";
                $scope.pollName = "";
            });
    };

    //CREATE
    $scope.create = function(userName, userPwd) {
        $http.get("/create/user/" + userName + "/" + userPwd)
            .then(function(response) {
                if (response.data == 'true') {
                    $scope.userName = userName;
                    console.log(response.data + 'LOG HERE');
                   
                }
                 $http.get("/username")
            .then(function(response) {
                if (response.data != null) {
                    $scope.userName = response.data;
                    console.log(response.data + ' Get My Username');
                     $window.location.href = '/home/true';
                }
            });
            });
    }
    //READ
    $scope.getUserName = function() {
        $http.get("/username")
            .then(function(response) {
                if (response.data != null) {
                    $scope.userName = response.data;
                    console.log(response.data + ' Get My Username');
                }
            });
    }
    $scope.getMyBooks = function(userName) {
        $http.get("/books/" + $scope.userName)
            .then(function(response) {
                if (response.data != null) {
                    $scope.myBooks = response.data[0].user_books;
                    console.log('--- Get My Books ' + JSON.stringify($scope.myBooks));
                }
            });

    }
    
    $scope.getAvailableBooks = function(userName) {
        $http.get("/availablebooks/" + $scope.userName)
            .then(function(response) {
                if (response.data != null) {
                    $scope.availableBooks = response.data;
                    console.log('--- Get Available Books ' + JSON.stringify($scope.availableBooks));
                }
            });

    }
    $scope.getAll = function() {
        $http.get("/data/all")
            .then(function(response) {

            });
    }
    
    $scope.getMyRequestedBooks = function(userName) {
        $http.get("/myrequestedbooks/" + $scope.userName)
            .then(function(response) {
                if (response.data != null) {
                    $scope.requestedBooks = response.data;
                    console.log('--- Get My Requested Books ' + JSON.stringify($scope.requestedBooks));
                }
            });

    }
    
    //UPDATE
    $scope.addBook = function(userName, bookTitle, bookAuthor, bookYear) {
        $http.get("/books/" + userName + "/add/" + bookTitle + "/" + bookAuthor + "/" + bookYear)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log(response.data + 'BOOK WAS ADDED.');
                }
            });

    }
    $scope.saveMyInfo = function(userName, fullName, city, state) {
        $http.get("/myInfo/" + userName + "/save/" + fullName + "/" + city + "/" + state)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- INFO DATA WAS SAVED.');
                }
            });

    }
    $scope.requestBook = function(userName,ownerName, bookTitleRequested, bookTitleOffered) {
        $http.get("/requestbook/" + userName + "/" + ownerName+ "/" + bookTitleRequested  + "/" + bookTitleOffered)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- INFO DATA WAS SAVED. ' + bookTitleOffered);
                }
            });
        
        $http.get("/availablebooks/" + $scope.userName)
                    .then(function(response) {
                        if (response.data != null) {
                            $scope.availableBooks = response.data;
                            console.log('--- Get Available Books ' + JSON.stringify($scope.availableBooks));
                }
        });

    }
    $scope.rejectBook = function(userName,ownerName, bookTitleRequested, bookTitleOffered) {
        $http.get("/rejectbook/" + userName + "/" + ownerName + "/" + bookTitleRequested  + "/" + bookTitleOffered)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- Request was Deleted. Book Requested: ' + bookTitleRequested + 'User_request: '+ ownerName + "Book_offered: " + bookTitleOffered);
                }
            });
    }
   
    $scope.acceptBook = function(userName,ownerName, bookTitleRequested, bookTitleOffered) {
        $http.get("/acceptbook/" + userName + "/" + ownerName + "/" + bookTitleRequested  + "/" + bookTitleOffered)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- Request was Accepted. Book Requested: ' + bookTitleRequested + 'User_request: '+ ownerName + "Book_offered: " + bookTitleOffered);
                }
            });
    }

    //DELETE
    $scope.deleteMyBook = function(userName,bookTitle,bookAuthor,bookYear) {
        $http.get("/books/" + userName + "/remove/" + bookTitle + "/" + bookAuthor + "/" + bookYear)
            .then(function(response) {
                if (response.data != null) {
                    $scope.myBooks = response.data[0].user_books;
                    console.log('--- Get My Books After Delete ' + JSON.stringify($scope.myBooks));
                }
            });

    }

});
