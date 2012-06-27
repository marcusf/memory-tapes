var isLoading = false;

var playlist = {
  hide: function() {
    $('#date-selector').unbind();
    $('#logout').unbind();
    $('#mtapes-ui').removeClass('active');
  },
  onResize: function() {
    var width = $(window).width();
    if (width < 800) {
      $('#playlist-container').addClass('small');
    } else {
      $('#playlist-container').removeClass('small');
    }
  },
  show: function() {
    $('#userinfo-name').text(user.getUser());
    $('#mtapes-ui').addClass('active');
    $(window).bind('resize', _.debounce(playlist.onResize, 100));
    playlist.onResize();
  },
  startLoading: function() {
    isLoading = true;
    _.delay(function() { 
      if (isLoading) {
        $('#playlist-loading').show()
      }
    }, 300);
  },
  stopLoading: function() {
    isLoading = false;
    $('#playlist-loading').hide();
  },
  onClickLogout: function(f) {
    $('#logout').bind('click', f);
  },
  getMonthSelector: function() {
    var dateSelector = $('#date-selector');
    return {
      add: function(label, value) {
        var node = document.createElement('option');
        node.setAttribute('value', value);
        node.appendChild(document.createTextNode(label));
        dateSelector.append(node);
      },
      onChange: function(f) {
        dateSelector.bind('change', function() { 
          var date = dateSelector.val();
          if (date.length > 0) {
            f.call(this, date); 
          }
        });
      },
      setSelected: function(key) {
        var selection = dateSelector.find('option[value="' + key + '"]').index();
        if (selection > 0) {
          dateSelector.get(0).selectedIndex = selection;
          dateSelector.trigger('change');
        }
      }
    }
  },
  newMonthSelector: function() {
    $('#date-selector option').detach();
    var fs = playlist.getMonthSelector();
    fs.add("Select a Month", "");
    return fs;
  },
  tearDown: function() {
    if (document.activePlaylist) {
      var node = document.activePlaylist.node;
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
    $('#playlist-container').hide();
    $('#playlist-sidebar .sp-image').detach();
    $('#add-playlist').unbind('click');
  },
  setImage: function(image) {
    if (image != null) {
      var spotifyImage = new v.Image(image);
      $('#playlist-sidebar').prepend(spotifyImage.node);
    }
  },
  onClickAddPlaylist: function(f) {
    $('#add-playlist').bind('click', f);
  },
  showPlaylist: function(plist, title, onAddFavorite) {
    
    $('#no-tracks-found').hide();
    $('#playlist-container').show();
    
    playlist.setImage(plist.image());
    playlist.onClickAddPlaylist(onAddFavorite);
    $('#add-playlist').show();
    
    var viewlist = new v.List(plist.playlist());
    document.activePlaylist = viewlist;
    $(viewlist.node).addClass('sp-light');
    $('#playlist-title').text(title);
    $('#playlist').append(viewlist.node);
  },
  showNoTracksFound: function() {
    $('#no-tracks-found').show();
  },
  showError: function(text) {
    if (text == undefined) {
      text = 'Sorry, something went horribly wrong.'
    }
    $('#mtapes-ui .error').text(text).addClass('active');
    _.delay(playlist.hideError, 5000);
  },
  hideError: function() {
    $('#mtapes-ui .error').removeClass('active');
  }
}

exports.playlistView = playlist;