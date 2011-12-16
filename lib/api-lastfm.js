var Api = exports.Api = function(apiKey) {
  this.apiKey  = apiKey,
  this.apiBase = 'http://ws.audioscrobbler.com/2.0/';
}

var methods = function() {
  
  var parseLFMError = function(data, apiKey) {
    if (data.error == 10) {
      console.error('Fatal! ' + apiKey + ' is not a valid API key. Have you configured your LASTFM_API_KEY file properly?');
    } 
    console.error('Last.fm error response: ', data);
    return data.message;
  }
  
  var parseReqError = function(xhr, status, err) {
    console.error('Error! Status ', status, 'with error message', err, '. Request object: ', xhr);
    return err;
  }
  
  var hasError = function(data) {
    return data.hasOwnProperty('error');
  }
  
  var onSuccess = function(success, fail) {
    return function(d) {
      if (hasError(d)) {
        var msg = parseLFMError(d, this.apiKey);
        fail.call(this, msg);
      } else {
        success.call(this, d);
      }
    }
  }
  
  var onError = function(onErrorFn) {
    return function(_, status,err) {
      var msg = parseReqError(_, status, err);
      onErrorFn.call(this, msg);
    }
    
  }

  this.user_getweeklychartlist = function(params) {
    $.ajax({
      url: this.apiBase,
      data: {
        method: 'user.getweeklychartlist',
        user: params.user,
        api_key: this.apiKey,
        format: 'json'
      },
      dataType: 'json',
      success: onSuccess(params.onSuccess, params.onError),
      error: onError(params.onError)
    });
  }
  
  this.user_getweeklytrackchart = function(params) {
    $.ajax({
      url: this.apiBase,
      data: {
        method: 'user.getweeklytrackchart',
        user: params.user,
        api_key: this.apiKey,
        from: params.from,
        to: params.to,
        format: 'json'
      },
      dataType: 'json',
      success: onSuccess(params.onSuccess, params.onError),
      error: onError(params.onError)
    });
  }

}

methods.call(Api.prototype);