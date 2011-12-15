var Cache = exports.Cache = function(lastfm) {
  this.lastfm = lastfm;
}

var methods = function() {
  
  this.setUser = function(username) {
    this.lastfm.setUser(username);
    this.monthKey = username + ':months';
    this.playlistCache = new LocalStorageCache(username + ':', isPlaylistCacheable);
  }
  
  this.months = function(success, error) {
    var that = this;
    var _success = function(data) {
      localStorage[that.monthKey] = JSON.stringify(data);
      success.call(this, data);
    }
    
    var cachedMonths = localStorage[this.monthKey];
    
    if (undefined == cachedMonths) {
        this.lastfm.months(_success, error);
    } else {
      var parsedMonths = JSON.parse(cachedMonths);
      if (!isRecentMonthsList(parsedMonths)) {
        this.lastfm.months(_success, error);
      } else {
        success.call(this, parsedMonths);
      }
    }
  }
  
  this.playlist = function(dateString, success, error) {
    var playlist = this.playlistCache.get(dateString);
    var that = this;
    if (playlist != null) {
      success.call(this, playlist);
    } else {
      var _success = function(playlist) {
        that.playlistCache.put(dateString, playlist);
        success.call(this, playlist);
      }
      this.lastfm.playlist(dateString, _success, error);
    }
  } 
}

methods.call(Cache.prototype);

var LocalStorageCache = function(namespace, isCacheableFn) {
  
  this.get = function(key) {
    var cachedItem = localStorage[namespace + key];
    if (cachedItem == undefined) {
      return null;
    } else if (!isCacheableFn.call(this, key)) {
      delete localStorage[namespace + key];
      return null;
    } else {
      var jsonItem = JSON.parse(cachedItem);
      // Should catch and clean up on parsing step.
      return jsonItem;
    }
  }
  
  this.put = function(key, data) {
    if (isCacheableFn.call(this, key)) {
      var serialized = JSON.stringify(data);
      localStorage[namespace + key] = serialized;
    }
  }
}

// This function hates timezones as much as I hate js time functions.
// Basically, we define a key as cacheable if no dates in the date
// string occur this month.
var isPlaylistCacheable = function(dateString) {
  var dates = parseDateString(dateString);
  var now = new Date();
  var currentDates = dates.filter(function(date) {
      var endTime = new Date(date * 1000);
      return (endTime.getFullYear()  == now.getFullYear() && 
              endTime.getMonth() >= now.getMonth() - 1);
  });
  return currentDates.length == 0;
}

// Returns true if this list was fetched within the last 7 days
// Really, we should just check if it's within the same week,
// but the javascript date functions are just absymal and it's
// too late at night for me to care.
function isRecentMonthsList(list) {
  var latest = parseDateString(list[list.length-1].date);
  var timeStamp = latest[1] * 1000;
  var now = (new Date()).getTime();
  return now - timeStamp < (7 * 24 * 60 * 60 * 1000);
}

var parseDateString = function(dateString) {
  return JSON.parse(dateString);
}