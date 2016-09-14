var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
    
    
    
var BookSchema = new Schema({
    book_name : { type: String, required: true, trim: true },
    book_author : { type: String, required: true, trim: true }
    
});

var UserSchema = new Schema({
    user_name : { type: String, required: true, index: { unique: true }  },
    user_password : { type: String, required: true },
    user_fullname : { type: String, required: false, trim: true },
    user_location : { type: String, required: false, trim: true },
    user_books: { type: Array, required: false, trim: true}
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('user_password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.user_password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.user_password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.user_password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1
};


////////////--------------------


UserSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ user_name: username }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

 module.exports = mongoose.model('Book', BookSchema);
 module.exports = mongoose.model('User', UserSchema);

//var Book = mongoose.model('Book',BookSchema);
//var User = mongoose.model('User',UserSchema);