var Client = exports.Client = function(api) {
  this.api = api;
}

var methods = function() {

  this.setUser = function(username) {
    this.user = username;
  }

  this.months = function(success, error) {
    this.api.user_getweeklychartlist({
      user      : this.user,
      onSuccess : _.compose(success, parseMonths),
      onError   : normalizeErr(error)
    });
  }

  this.playlist = function(dateArrayString, success, error) {
    
    var dates = JSON.parse(dateArrayString);
    var numPasses = dates.length / 2;
    var results = [];
    
    var returnAll = _.after(numPasses, function(results) {
      success.call(this, { 
        title : makeTitle(dateArrayString), 
        tracks: sortPlaylist(results) 
      });
    });
        
    var onSuccess = function(data) { 
     if (_.isArray(data.weeklytrackchart['track'])) {
       results.push.apply(results, normalizeWeek(data.weeklytrackchart.track));
     }
     returnAll(results);
    }

    for (var i = 0; i < dates.length; i+=2) {
      var from = dates[i], to = dates[i+1];
      this.api.user_getweeklytrackchart({
        user     : this.user,
        from     : from,
        to       : to,
        onSuccess: onSuccess,
        onError  : normalizeErr(error)
      });
    }
  }
  
  /* === Private methods ========================================================*/
  var withLogging = function(xhr, status, error) {
      console.warn('Unexpected response', status, ', with error', error);
  }
  
  var normalizeErr = function(err) {
    return function(error) {
      console.log(error);
      var msg = error;
      if (_.isUndefined(msg) || msg.length == 0 || msg === 'error') {
        msg = 'Cannot connect to last.fm. Are you online?';
      }
      if (_.isFunction(err)) {
        err.call(this, msg);
      } else {
        console.error('No error handler defined');
        console.trace();
      }
    }
  }
  
  var sortPlaylist = function(results) {
    var r = results.sort(function(a,b) { return b.popularity - a.popularity });
    var result = _(r).uniq(true, function(id) { return id.query; });
    return result;
  }
  
  var makeTitle = function(dateArrayString) {
    var dates = JSON.parse(dateArrayString);
    var time = new Date(dates[0]*1000);
    var months = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];
    return months[time.getMonth()] + ' ' + time.getFullYear();
  }
  
  var parseMonths = function(data) {
    var weeks = data.weeklychartlist.chart;
    var months = {};
    weeks.forEach(function(week) {
      var date = new Date(parseInt(week.from*1000));
      var label = date.getFullYear() + ' / ' + (date.getMonth()+1);
      if (months[label] == undefined) {
        months[label] = [];
      }
      months[label].push(week.from, week.to);
    });
    
    var result = _(months).map(function(v,k) {
      return { name: k, date: JSON.stringify(v) };
    });
    
    return result;
  }
  
  var normalizeWeek = function(week) {
    var count  =  week.length * 1.0;
    return week.map(function(track) {
      return {
        query: track.artist['#text'] + ' ' + track.name,
        artist: track.artist['#text'],
        song: track.name,
        count: parseInt(track.playcount),
        popularity: parseInt(track.playcount)*1.0/count
      }
    });
  }
}  

methods.call(Client.prototype);