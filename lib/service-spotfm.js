var Resolver = exports.Resolver = function(lastfm, spotify) {
  this.lastfm = lastfm;
  this.spotify = spotify;
}

var methods = function() {
  
  this.getUser = function() {
    return this.lastfm.getUser();
  }

  this.months = function(success, error) {
    this.lastfm.months(success, error);
  }
  
  this.monthsByYear = function(success, error) {
    this.lastfm.monthsByYear(success, error);
  }

  this.playlist = function(dateString, success, error) {
    var resolver = resolveSpotifyTracks(success, this.spotify);
    this.lastfm.playlist(dateString, resolver, error);
  }
  
  var resolveSpotifyTracks = function(successFn, spotify) {
    return function(playlist) {
    
      var needed = 20, result = [], trackIndex = 0;

      var finished = _.once(function() { 
        var res = result.filter(function(i) { return i != undefined; });
        successFn.call(this, { title: playlist.title,  tracks: res }) 
      });
      
      var getSearchResult = function(track, i) { 
        return function(res) {
          if (res.tracks.length > 0) { 
            needed--;
            result[i] = { spotify: res.tracks[0].uri, track: track };
          }
          getNextTrack();
        }
      }
      
      var getNextTrack = function() {
        if (needed > 0 && trackIndex < playlist.tracks.length) {
          var track = playlist.tracks[trackIndex];
          spotify.core.search(track.query, 
            { onSuccess: getSearchResult(track, trackIndex), 
              onFailure: getNextTrack });
          trackIndex++;
        } else {
          finished();
        }
      }
      
      _(5).times(getNextTrack);
      
    }
  }
  
}

methods.call(Resolver.prototype);