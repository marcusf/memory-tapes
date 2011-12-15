var Session = exports.Session = function(user) {
  this.user = user;
}

var methods = function() {
  this.setActivePlaylist = function(playlistId) {
    localStorage[this.playlistKey()] = playlistId;
  }
  this.getActivePlaylist = function() {
    return localStorage[this.playlistKey()];
  }
  this.playlistKey = function() {
    return this.user.getUser() + ':playlist';
  }
}

methods.call(Session.prototype);