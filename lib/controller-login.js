
exports.Login = function(view, user) {
  this.view = view;
  this.user = user;
  
  this.show = function(onSuccess) {
    var that = this;
    this.view.show();
    this.view.onLogin(function(username) {
      that.view.startLoading();
      if (that.user.validName(username)) {
        that.view.hideError();
        that.user.setUser(username);
        that.user.ifValid(function() {
          that.view.hide();
          _.defer(onSuccess);
        });
      } else {
        that.view.stopLoading();
        that.view.showError("That's not a valid username!");
      }
    });
  }
}
