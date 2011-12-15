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

var apiKey     = sp.core.readFile('/LASTFM_API_KEY');
var api        = new lastfm_api.Api(apiKey);
var client     = new cfm.Cache(new sfm.Resolver(new lastfm.Client(api), sp));

var user       = new m_user.User(client);
var session    = new sess.Session(user);
var login      = new c_login.Login(v_login, user);
var m_playlist = new m_playlist.Playlists(client, m);
var playlist   = new c_playlist.Playlist(m_playlist, v_playlist, session);

var showPlaylists = function() {
  client.setUser(user.getUser());
  playlist.show(function() {
    user.clear();
    start();
  });
}

var start = function() {
  if (!user.isLoggedIn()) {
    login.show(showPlaylists);
  } else {
    showPlaylists();
  }
}

start();