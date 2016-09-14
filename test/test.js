var assert = require('assert');
var User = require('/home/ubuntu/workspace/client/js/user-model');
var mongoose = require('mongoose');

describe('Example HW', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
 
});

describe('DB Tests', function(){
    
   describe('Check Password Fails', function() {
      it('should return false when the password is not matching', function(done) {
            
            mongoose.connect('mongodb://dbuser:password@ds019796.mlab.com:19796/th-book-exchange'); 


            User.findOne({ user_name: 'jmar7774' }, function(err, user) {
                if (err) throw err;
                user.comparePassword('123Password', function(err, isMatch) {
                    if (err) throw err;
                    console.log('123Password:', isMatch); // -&gt; 123Password: false
                    assert.equal(false, isMatch);
                });
            });
           
            done();
      });
  });
  
  
  
   describe('Check Password Succeds', function() {
      it('should return true when the password is matching', function(done) {
          
            User.findOne({ user_name: 'jmar7774' }, function(err, user) {
                if (err) throw err;
                user.comparePassword('Password123', function(err, isMatch) {
                    if (err) throw err;
                    console.log('Password123:', isMatch); // -&gt; Password123: true
                    assert.equal(true, isMatch);
                });
            });  
            
            done();

       });
       
       
  });

    
     describe('Save new Users Succeds', function() {
      it('should return true when the user was saved in the db', function(done) {
            var testUserCreation = new User({
                user_name: 'jmar7774@test.com',
                user_password: 'Password1234',
                user_location: 'Seattle, WA'
            });
            
            testUserCreation.save(function(err) {
                if (err) throw err;
            }); 
            
            User.findOne({ user_name: 'jmar7774@test.com' }, function(err, user) {
                    if (err) throw err;
                    user.comparePassword('Password1234', function(err, isMatch) {
                        if (err) throw err;
                        console.log('Password1234:', isMatch); // -&gt; Password123: true
                        assert.equal(true, isMatch);
                    });
             });
             mongoose.connection.close();
             done();
             
       });
       
  });

  
});  




