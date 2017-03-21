var server = require('express');
var request = require('request');
var port = process.env.PORT || 3500;
var app = server();
var path = require('path');


app.use(server.static(__dirname + '/public'));
app.use(server.static(__dirname + '/bower_components'));
app.use(server.static(__dirname + '/js'));
app.use(server.static(__dirname + '/client'));

var path = require('path');
var mongoose = require('mongoose');
var User = require('./client/js/user-model');
//var Book= require('./client/js/user-model');

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectID;

var BookSchema = new Schema({
    book_title: {
        type: String,
        required: true,
        trim: true
    },
    book_author: {
        type: String,
        required: true,
        trim: true
    },
    book_year: {
        type: String,
        required: true,
        trim: true
    },
    book_requests: {
        type: Array,
        required: false,
        trim: true
    }
});
var Book = mongoose.model('Book', BookSchema);

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
/*

mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});
 */

mongoose.connect('mongodb://user:password@db:port/th-book-exchange');
// create a user a new user
var userName = null;
app.get('/logout', function (req, res) {
    userName = null;
    res.redirect('/');

});

app.get('/login/:uName/:uPass', function (req, res) {
    User.findOne({
        user_name: req.params.uName
    }, function (err, user) {
        if (err) console.log(err);
        if (user == null) {
            console.log("Username Invalid.");
            res.send('badUser');
        }
        if (user) {
            user.comparePassword(req.params.uPass, function (err, isMatch) {
                if (err) throw err;
                console.log("Password is Match: " + isMatch); // -&gt; Password123: true
                if (isMatch == true) {
                    userName = req.params.uName;
                    console.log("Username saved on the server side " + userName);
                    res.send('true');
                } else {
                    res.send('false');
                    console.log("Credentials Incorrect.");
                }
            });
        }
    });

});

app.get('/create/user/:userName/:userPassword', function (req, res) {
    var newUser = new User({
        user_name: req.params.userName, // 'jmar7774@test.com',
        user_password: req.params.userPassword //'Password1234'
    });
    newUser.save(function (err) {
        if (err) throw err;
        console.log('Saved New! Username: ' + req.params.userName);
        userName = req.params.userName;
        res.send('true');
    });

});

app.get('/delete/user/:userName', function (req, res) {
    User.remove({
        user_name: req.params.userName
    }, function (err) {
        if (!err) {
            console.log('notification removing! Username: ' + req.params.userName);
        } else {
            console.log('error on removing. Username: ' + req.params.userName);
        }
    });
    res.redirect('/');

});

app.get('/username', function (req, res) {
    console.log("Send username from server " + userName);
    res.send(userName);
});

app.get('/', function (req, res) {
    var fileName = path.join(__dirname, '/client/index.html');
    res.sendFile(fileName, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        } else {
            console.log('Sent:', fileName);
        }
    });
});
app.get('/home/:online', function (req, res) {
    var fileName = path.join(__dirname, '/client/home.html');
    if (req.params.online == "true") { //TO ADD for security &userName !=null
        res.sendFile(fileName, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Sent:', fileName);
            }
        });
    } else
        console.log("User is not logged in. " + (req.params.online));
});

app.get('/user', function (req, res) {
    var fileName = path.join(__dirname, '/client/js/user.html');
    if (user.id) {
        console.log(user.id + " User ");
        res.sendFile(fileName, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Sent:', fileName);
            }
        });
    } else {
        res.redirect('/');
    }
});

app.get('/data/all', function (req, res) {

    User.find({}, '-_id', {}, function (err, latest_data) {
        if (err) return console.error(err);
        res.json(latest_data);
    });
});

app.get('/books/:userName', function (req, res) {

    User.find({
        user_name: req.params.userName
    }, {
        _id: 0,
        user_books: 1
    }, function (err, latest_data) {
        if (err) return console.error(err);
        res.json(latest_data);
    });
});

app.get('/books/:userName/add/:btitle/:bauthor/:byear', function (req, res) {

    var book = new Book({
        book_title: req.params.btitle, // 'jmar7774@test.com',
        book_author: req.params.bauthor, //'Password1234'
        book_year: req.params.byear
    });
    console.log(book + "112  LOGGING... ");
    User.find({
        user_name: req.params.userName
    }, {}, function (err, latest_data) {
        if (err) return console.error(err);
        latest_data[0].user_books.push(book);
        latest_data[0].markModified('user_books');
        latest_data[0].save(function (err, book) {
            if (err) {
                console.log('error on save_update' + err);
            } else {
                res.send(book);
                console.log('New book is saved: ' + book);
            }
        });
    });


});

app.get('/myInfo/:userName', function (req, res) {

    User.find({
        user_name: req.params.userName
    }, {
        _id: 0,
        user_fullName: 1,
        user_city: 1,
        user_state: 1
    }, function (err, latest_data) {
        if (err) return console.error(err);
        res.json(latest_data);
    });
});

app.get('/myInfo/:userName/save/:fullName/:city/:state', function (req, res) {

    User.find({
        user_name: req.params.userName
    }, {}, function (err, latest_data) {
        if (err) return console.error(err);
        latest_data[0].user_fullName = req.params.fullName;
        latest_data[0].user_city = req.params.city;
        latest_data[0].user_state = req.params.state;
        latest_data[0].save(function (err, newInfo) {
            if (err) {
                console.log('error on save_update' + err);
            } else {
                res.send(newInfo);
                console.log('New book is saved: ' + newInfo);
            }
        });
    });
});

app.get('/books/:userName/remove/:bookTitle/:bookAuthor/:bookYear', function (req, res) {
    User.update({
        "user_name": req.params.userName
    }, {
        $pull: {
            "user_books": {
                book_title: req.params.bookTitle
            }
        }
    }, function (err, latest_data) {
        if (err) return console.error(err + "Error on remove book.");
        else console.log("Book: " + req.params.bookTitle + " was removed successfully.");
    });


});

app.get('/availablebooks/:userName', function (req, res) {
    User.aggregate({
            $match: {
                user_name: {
                    $ne: req.params.userName
                }
            }
        }, {
            $group: {
                _id: "$user_state",
                availableusers: {
                    $push: "$$ROOT"
                }
            }
        },
        function (err, latest_data) {
            if (err) return console.error(err);

            res.json(latest_data);
        });

});

app.get('/myrequestedbooks/:userName', function (req, res) {
    User.find({
            "user_books.book_requests.user_name": req.params.userName
        }, {
            user_name: 1,
            user_city: 1,
            user_state: 1,
            user_books: 1,
            _id: 0
        },
        function (err, latest_data) {
            if (err) return console.error(err);
            res.json(latest_data);
        });
});

app.get('/requestbook/:userName/:bookOwner/:bookTitleRequested/:bookTitleOffered', function (req, res) {
    User.update({
        "user_name": req.params.bookOwner,
        "user_books.book_title": req.params.bookTitleRequested
    }, {
        $addToSet: {
            "user_books.$.book_requests": {
                "user_name": req.params.userName,
                "book_title": req.params.bookTitleOffered
            }
        }
    }, function (err, latest_data) {
        if (err) return console.error(err);

        console.log("Requested Book: " + req.params.bookTitleRequested + " -- " + req.params.bookTitleOffered);
        res.json(latest_data);
    });

});

app.get('/rejectbook/:userName/:bookOwner/:bookTitleRequested/:bookTitleOffered', function (req, res) {
    User.update({
        "user_name": req.params.userName,
        "user_books.book_title": req.params.bookTitleRequested
    }, {
        $pull: {
            "user_books.$.book_requests": {
                "user_name": req.params.bookOwner,
                "book_title": req.params.bookTitleOffered
            }
        }
    }, function (err, latest_data) {
        if (err) return console.error(err);

        console.log("Reject Book Request: " + req.params.bookTitleRequested + " -- " + req.params.bookTitleOffered);
        res.json(latest_data);
    });

});

app.get('/acceptbook/:userName/:bookOwner/:bookTitleRequested/:bookTitleOffered', function (req, res) {

    User.find({
        "user_name": req.params.userName,
        "user_books.book_title": req.params.bookTitleRequested
    }, {
        "user_books.$": 1
    }, function (err, latest_data) {
        if (err) return console.error(err);
        console.log(" GGG " + latest_data);
        var book = new Book({
            book_title: latest_data[0].user_books[0].book_title,
            book_author: latest_data[0].user_books[0].book_author,
            book_year: latest_data[0].user_books[0].book_year,
        });
        console.log(book + "Found Book Requested. ");

        User.find({
            user_name: req.params.bookOwner
        }, {}, function (err, latest_data) {
            if (err) return console.error(err);
            latest_data[0].user_books.push(book);
            latest_data[0].markModified('user_books');
            latest_data[0].save(function (err, book) {
                if (err) {
                    console.log('error on save_update' + err);
                } else {
                    User.update({
                        "user_name": req.params.userName
                    }, {
                        $pull: {
                            "user_books": {
                                book_title: req.params.bookTitleRequested
                            }
                        }
                    }, function (err, latest_data) {
                        if (err) return console.error(err + "Error on remove book.");
                        else console.log("Book Requested: " + req.params.bookTitleRequested + " was removed successfully.");
                    });

                    console.log('New book is saved: ' + book);
                }
            });
        });

    });

    User.find({
        "user_name": req.params.bookOwner,
        "user_books.book_title": req.params.bookTitleOffered
    }, {
        "user_books.$": 1
    }, function (err, latest_data) {
        if (err) return console.error(err);
        var book2 = new Book({
            book_title: latest_data[0].user_books[0].book_title,
            book_author: latest_data[0].user_books[0].book_author,
            book_year: latest_data[0].user_books[0].book_year,
        });
        console.log(book2 + "Found Book Offered. ");

        User.find({
            user_name: req.params.userName
        }, {}, function (err, latest_data) {
            if (err) return console.error(err);
            latest_data[0].user_books.push(book2);
            latest_data[0].markModified('user_books');
            latest_data[0].save(function (err, book) {
                if (err) {
                    console.log('error on save_update' + err);
                } else {
                    User.update({
                        "user_name": req.params.bookOwner
                    }, {
                        $pull: {
                            "user_books": {
                                book_title: req.params.bookTitleOffered
                            }
                        }
                    }, function (err, latest_data) {
                        if (err) return console.error(err + "Error on remove book.");
                        else console.log("Book Offered " + req.params.bookTitleOffered + " was removed successfully.");

                        console.log("Accepted Book Request: " + req.params.bookTitleRequested + " -- " + req.params.bookTitleOffered);

                    });


                    console.log('New book is saved: ' + book);
                }
            });
        });

        console.log("Accept Book Request: " + req.params.bookTitleRequested + " -- " + req.params.bookTitleOffered);

    });






});


app.listen(port, function () {
    console.log('Ready: ' + port);
});