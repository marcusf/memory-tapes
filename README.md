MemoryTapes - Re-discover the music you loved
===============================================================================
MemoryTapes is a Spotify app that thrawls your last.fm history and creates 
historic playlists. If you're like me you've lost your music collection.
multiple times, but have a scrobble history going back at least a few years. 
If so, you'll love MemoryTapes. Plug it in and it'll find only the tracks 
available on Spotify, rank them and generate a playlist from the twenty-or-so 
most listened tracks that month.

Mostly, this has been an excuse to play with the Spotify API and write some
javascript again.

Installing
-------------------------------------------------------------------------------
Installing is a three step process:

 1. Unpack into ~/Spotify
 2. Configure your last.fm API key (See below)
 3. Type "spotify:app:memory-tapes" in to the search box
  
Last.fm API key
-------------------------------------------------------------------------------
Since I don't want to spread my own last.fm API key, you'll need to get your
own. So, register an API key with last.fm, and place it in a file called
LASTFM\_API\_KEY in the project root. The file should contain only the API
key, and nothing else. No carriage returns.