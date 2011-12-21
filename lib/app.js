/** 
 * Mostly wiring and getting app logic up and running etc.
 */
var sp           = getSpotifyApi(1); 
var m            = sp.require("sp://import/scripts/api/models");
var v            = sp.require("sp://import/scripts/api/views");

var lastfm_api   = sp.require('lib/api-lastfm');
var lastfm       = sp.require('lib/service-lastfm'); 
var sfm          = sp.require('lib/service-spotfm');
var cfm          = sp.require('lib/service-cachefm'); 

var sess         = sp.require('lib/session');

var m_user       = sp.require('lib/model-user');
var m_playlist   = sp.require('lib/model-playlist');

var c_login      = sp.require('lib/controller-login');
var c_playlist   = sp.require('lib/controller-playlist');

var v_login      = sp.require('lib/view-login');
var v_playlist   = sp.require('lib/view-playlist');

try {
  var apiKey     = sp.core.readFile('/LASTFM_API_KEY');
} catch (e) {
  var errmsg = 'Failed to load the last.fm API key from file \'LASTFM_API_KEY\' in project root. ' + 
                'Please create a file with the name \'LASTFM_API_KEY\' and place it in the project root. ' +
                'The file should contain your API key alone on one line, without any carriage return.';
  console.error(errmsg);
  document.write('<h1>' + errmsg + '</h1>');
  throw(e);
}

var api        = new lastfm_api.Api(apiKey);
var user       = new m_user.User(api);

var client     = new cfm.Cache(new sfm.Resolver(new lastfm.Client(user, api), sp));

var ui   = sp.require('lib/new-ui');


var session    = new sess.Session(user);
var login      = new c_login.Login(v_login, user);
var m_playlist = new m_playlist.Playlists(client, m);
var playlist   = new c_playlist.Playlist(m_playlist, v_playlist, session);

var showPlaylists = function() {
  playlist.show(function() {
    user.clear();
    start();
  });
}

var showLogin = function() { 
  login.show(showPlaylists); 
};

var start = function() {
  user.ifLoggedIn(showPlaylists, showLogin);
}

start();