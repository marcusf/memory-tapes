var User = exports.User = function(client) {
  this.client = client;
}

var methods = function() {
  this.isLoggedIn = function() {
      return _(localStorage['user']).isString();
  }
  
  this.getUser = function() {
    return localStorage['user'];
  }
  
  this.setUser = function(name) {
    localStorage['user'] = name;
    client.setUser(name);
  }
  
  this.validName = function(name) {
    return _(name).isString() && name.length > 0;
  }
  
  this.clear = function() {
    delete localStorage['user'];
  }
  
  this.ifValid = function(success) {
    client.months(success);
  }
  
}


methods.call(User.prototype);