
exports.Login = function(view, user) {
  this.view = view;
  this.user = user;
  
  this.onError = function(view) {
    view.stopLoading();
    view.showError("That's not a valid username!");
  }
  
  this.show = function(onSuccess) {
    var that = this;
    this.view.show();
    this.view.onLogin(function(username) {
      that.view.startLoading();
      if (that.user.validName(username)) {
        that.view.hideError();
        that.user.setUser(username, 
          function() {
            that.view.stopLoading();
            that.view.hide();
            _.defer(onSuccess);
          },
          function() {
            that.onError(that.view);
          });
      } else {
        onError(that.view)
      }
    });
  }
}
