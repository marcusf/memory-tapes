var Client = exports.Client = function(user, api) {
  this.user = user;
  this.api = api;
}

var methods = function() {

  this.getUser = function() {
    return this.user;
  }

  this.months = function(success, error) {
    this.api.user_getweeklychartlist({
      user      : this.user.getUser(),
      onSuccess : _.compose(success, parseMonths, removeEarlierThan(this.user)),
      onError   : normalizeErr(error)
    });
  }
  
  this.monthsByYear = function(success, error) {
    this.api.user_getweeklychartlist({
      user      : this.user.getUser(),
      onSuccess : _.compose(success, parseByYear, removeEarlierThan(this.user)),
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
        user     : this.user.getUser(),
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
  
  var mergeTracksAcrossWeeks = function(results) {
    var rmap = {}, res = [];
    results.forEach(function(track) {
      if (rmap.hasOwnProperty(track.query)) {
        rmap[track.query].popularity += track.popularity;
      } else {
        rmap[track.query] = track;
      }
    });
    for (var key in rmap) {
      if (rmap.hasOwnProperty(key)) {
        res.push(rmap[key]);
      }
    }
    return res;
  }
  
  var sortPlaylist = function(results) {
    var r = results.sort(function(a,b) { return b.popularity - a.popularity });
    var result = mergeTracksAcrossWeeks(r);
    return result;
  }
  
  var makeTitle = function(dateArrayString) {
    var dates = JSON.parse(dateArrayString);
    var time = new Date(dates[0]*1000);
    var months = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];
    return months[time.getMonth()] + ' ' + time.getFullYear();
  }
  
  var removeEarlierThan = function(user) {
    var registered = user.getRegisteredDate();
    return function(data) {
      var weeks = data.weeklychartlist.chart;
      return weeks.filter(function(week) {
        return week.from > registered;
      });
    }
  }
  
  var parseMonths = function(weeks) {
    
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
  
  var parseByYear = function(weeks) {
    
    var years = {};
    
    weeks.forEach(function(week) {
      var date = new Date(parseInt(week.from*1000));
      var year  = date.getFullYear(),
          month = date.getMonth();
      if (!years.hasOwnProperty(year)) years[year] = {};
      if (!years[year].hasOwnProperty(month)) years[year][month] = [];
      years[year][month].push(week.from, week.to);
    });
    
    var result = _(years).map(function(months, year) {
      var monthArray = _(months).map(function(dates, month) {
        return { month: month, dates: dates }
      });
      return { year: year, months: monthArray }
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
        popularity: parseInt(track.playcount) // *1.0/count
      }
    });
  }
}  

methods.call(Client.prototype);