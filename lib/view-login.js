var login = {
    show: function() {
      $('#login-ui').addClass('active');
    },
    hide: function() {
      $('#loading').hide();
      $('#login-ui').removeClass('active');
    },
    userName: function() {
      return $('#username').val();
    },
    startLoading: function() {
      $('#username').attr('disabled','disabled');
      $('#loading').show();
    },
    stopLoading: function() {
      $('#loading').hide();
      $('#username').removeAttr('disabled');
    },
    onLogin: function(f) {
      var loginAction = function(e) {
        e.preventDefault();
        var username = login.userName();
        f.call(this, username);
      }
      $('#login').bind('submit', loginAction);
    },
    showError: function(text) {
      $('#login-ui .error').text(text).addClass('active');
      _.delay(login.hideError, 5000);
    },
    hideError: function() {
      $('#login-ui .error').removeClass('active');
    }
}

exports = login;