var Api = exports.Api = function(apiKey) {
  this.apiKey  = apiKey,
  this.apiBase = 'http://ws.audioscrobbler.com/2.0/';
}

var methods = function() {
  
  var hasError = function(data) {
    return data.hasOwnProperty('error');
  }

  this.user_getweeklychartlist = function(params) {
    var onSuccess = function(d) {
      params[hasError(d)?'onError':'onSuccess'].call(this, d);
    }
    $.ajax({
      url: this.apiBase,
      data: {
        method: 'user.getweeklychartlist',
        user: params.user,
        api_key: this.apiKey,
        format: 'json'
      },
      dataType: 'json',
      success: onSuccess,
      error: params.onError
    });
  }
  
  this.user_getweeklytrackchart = function(params) {
    var onSuccess = function(d) {
      params[hasError(d)?'onError':'onSuccess'].call(this, d);
    }
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
      success: onSuccess,
      error: params.onError
    });
  }

}

methods.call(Api.prototype);