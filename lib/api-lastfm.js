var Api = exports.Api = function(apiKey) {
  this.apiKey  = apiKey,
  this.apiBase = 'http://ws.audioscrobbler.com/2.0/';
}

var methods = function() {
  
  var parseLFMError = function(data, apiKey, url) {
    if (data.error == 10) {
      console.error('Fatal! ' + apiKey + ' is not a valid API key. Have you configured your LASTFM_API_KEY file properly?');
    } 
    console.error('Last.fm:', url,'error. response: ', data);
    return data.message;
  }
  
  var parseReqError = function(call, xhr, status, err) {
    console.error('Error in ',call ,'! Status ', status, 'with error message', err, '. Request object: ', xhr);
    var msg = '';
    return msg;
  }
  
  var hasError = function(data) {
    return data.hasOwnProperty('error');
  }
  
  var onSuccess = function(success, fail) {
    return function(d) {
      if (hasError(d)) {
        var url = this.hasOwnProperty('url') ? this['url'] : '';
        var msg = parseLFMError(d, this.apiKey, url);
        fail.call(this, msg);
      } else {
        success.call(this, d);
      }
    }
  }
  
  var onError = function(apiCall, onErrorFn) {
    return function(_, status,err) {
      var msg = parseReqError(apiCall, _, status, err);
      onErrorFn.call(this, msg);
    }
    
  }
  
  this.user_getinfo = function(params) {
    $.ajax({
      url: this.apiBase,
      data: {
        method: 'user.getinfo',
        user: params.user,
        api_key: this.apiKey,
        format: 'json'
      },
      success: onSuccess(params.onSuccess, params.onError),
      error: onError('user.getinfo', params.onError)
    });
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
      error: onError('user.getweeklychartlist', params.onError)
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
      error: onError('user.getweeklytrackchart', params.onError)
    });
  }

}

methods.call(Api.prototype);