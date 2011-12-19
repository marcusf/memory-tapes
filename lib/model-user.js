var User = exports.User = function(api) {
  this.api = api;
  this.changeListeners = [];
}

var methods = function() {
  
  this.isLoggedIn = function() {
    return _(localStorage['user']).isString();
  }
  
  this.ifLoggedIn = function(onLoggedIn, onNotLoggedIn) {
    if (this.isLoggedIn()) {
      this.notifyChanges();
      onLoggedIn.call(this);
    } else {
      onNotLoggedIn.call(this);
    }
  
  }
  
  this.onChange = function(callback) {
    this.changeListeners.push(callback);
  }
  
  this.notifyChanges = function() {
    var that = this;
    this.changeListeners.forEach(function(f) {
      f.call(this, that);
    });
  }
  
  this.getUser = function() {
    return localStorage['user'];
  }
  
  this.setUser = function(name, success, error) {
    
    var that = this;
    var _success = function(data) {
      localStorage['user'] = name;
      that.notifyChanges.call(that);
      success.call(that);
    }
    if (this.getUser() != name) {
      this.api.user_getinfo({
        user: name,
        onSuccess: _success,
        onError: error
      });
    } else {
      _success.call(this);
    }
    
  }
  
  this.validName = function(name) {
    return _(name).isString() && name.length > 0;
  }
  
  this.clear = function() {
    delete localStorage['user'];
  }
  
}


methods.call(User.prototype);