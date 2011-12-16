/* ===========================================================================*/
exports.Playlists = function(client, models) {
  this.client = client;
  this.models = models;
  
  this.months = function(onSuccess, onError) {
    this.client.months(onSuccess, onError);
  }
  
  this.playlistFromId = function(playlistId, callbacks) {
    var that = this;
    this.client.playlist(playlistId, function(playlistModel) { 
    
      var result = new Playlist(that.models, playlistModel.title);
      
      var trackArray = [];
      
      var callSuccess = _.after(playlistModel.tracks.length, function() {
        trackArray.forEach(function(track) {
          result.addFromTrack(track);
        });
        callbacks.onSuccess.call(this, result);
      });
              
      for (var i = 0; i < playlistModel.tracks.length; i++) {
        var current = playlistModel.tracks[i];
        result.trackFromURI(current.spotify, (function(i) { 
          return function(track) {
            trackArray[i] = track;
            callSuccess();
          }
        })(i));
      }
    },  callbacks.onFailure);
    
  }
} 

var Playlist = function(models, title) {
  var playlist = new models.Playlist(),
      store    = [];
  
  this.addFromTrack = function(track) {
    if (playlist.indexOf(track) == -1) {
      store.push(track);
      playlist.add(track);
    }
  }
  
  this.trackFromURI = function(uri, onSuccess) {
    m.Track.fromURI(uri, onSuccess);
  }
  
  this.title = function() {
    return title;
  }
  
  this.image = function() {
    document.arsle = store;
    for (var i = 0; i < store.length; i++) {
      if (store[i].image != null) { 
        return store[i].image;
      }
    }
  }
  
  this.length = function() {
    return store.length > 0;
  }
  
  this.playlist = function() {
    return playlist;
  }
  
  this.addAsFavorite = function(label) {
    var playlist = new m.Playlist(label);
    for (var i = 0; i < store.length; i++) {
      playlist.add(store[i]);
    }
  }
}