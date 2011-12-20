var Playlist = exports.Playlist = function(model, view, session) {
  this.model = model;
  this.view  = view;
  this.session = session;
}

var methods = function() {

  this.show = function(onLogout) {
    var  that = this;
    this.view.onClickLogout(function() { that.logOut(onLogout); });
    var activePlaylist = this.session.getActivePlaylist();
    this.loadMonths(activePlaylist);
    this.view.show();
  }
  
  this.logOut = function(onLoggedOut) {
    this.view.hide();
    onLoggedOut.call();
  }
  
  this.loadMonths = function(currentPlaylist) {
    var that = this;
    this.model.months(function(months) { 
      var monthView = that.view.newMonthSelector();
      _.defer(function() {
        months.forEach(function(month) {
          monthView.add(month.name, escape(month.date));
        });
        if (!_(currentPlaylist).isUndefined()) {
          monthView.setSelected(currentPlaylist);
        }
      });
      monthView.onChange(_.bind(that.loadPlaylist, that));
    }, function(error) {
      that.view.showError(error);
    });
  }
  
  this.loadPlaylist = function(encodedId) {
    this.view.startLoading();
    this.view.hideError();
    
    var that = this;
    var playlistId = unescape(encodedId);
    
    this.model.playlistFromId(playlistId, {
      onSuccess: function(model) {
        
        that.session.setActivePlaylist(encodedId);
        that.view.tearDown();
        
        if (model.length() == 0) {
          that.view.showNoTracksFound();
        } else {        
          var viewTitle = 'Mix for '      + model.title(),
              favTitle  = 'Memory Tapes ' + model.title();
          
          var addFavFn = function() {
              model.addAsFavorite(favTitle);
          };
          
          that.view.showPlaylist(model, viewTitle, addFavFn);
        }
        
        that.view.stopLoading();
      },
      onFailure: function(e) {
        that.view.stopLoading();
        that.view.showError(e);
      }
    });
  }
}

methods.call(Playlist.prototype);