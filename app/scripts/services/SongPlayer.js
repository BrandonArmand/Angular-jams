(function() {
    function SongPlayer($rootScope, Fixtures) {
         var SongPlayer = {};

         /**
         * @private variable
         * @desc holds the album information
         **/
         var currentAlbum = Fixtures.getAlbum();


         /**
         * @desc Buzz object audio file
         * @type {object}
         **/
         var currentBuzzObject = null;

         /**
         * @function playSong
         * @desc plays the current song, and sets song.playing to true
         **/
         var playSong = function(song){
           currentBuzzObject.play();
           song.playing = true;
         };

         /**
         * @function stopSong
         * @desc stops the current song, and sets song.playing to true
         **/
         var stopSong = function(){
           currentBuzzObject.stop();
           SongPlayer.currentSong.playing = null;
         };

         /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {object} song
         **/
         var setSong = function(song) {
            if (currentBuzzObject) {
              stopSong();
            }
            currentBuzzObject = new buzz.sound(song.audioUrl, {
              formats: ['mp3'],
              preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
               $rootScope.$apply(function() {
                 SongPlayer.currentTime = currentBuzzObject.getTime();
               });
             });

            SongPlayer.currentSong = song;
         };

         /**
         * @function getSongIndex
         * @desc finds the current index of a song in the album
         * @param {object} song
         **/
         var getSongIndex = function(song){
           return currentAlbum.songs.indexOf(song);
         };

         /**
         * @public variable getSongIndex
         * @desc contains the song
         **/
         SongPlayer.currentSong = null;

         /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
         SongPlayer.currentTime = null;

         /**
         * @function play
         * @desc plays a song selected
         * @param {object} song
         **/
         SongPlayer.play = function(song) {
           song = song || SongPlayer.currentSong;
           if(SongPlayer.currentSong !== song){
             setSong(song);
             playSong(song);
           } else if (SongPlayer.currentSong === song){
             if(currentBuzzObject.isPaused()){
               playSong(song);
             }
           }
         };

         /**
         * @function pause
         * @desc pauses the current song
         * @param {object} song
         **/
         SongPlayer.pause = function(song){
           song = song || SongPlayer.currentSong;
           currentBuzzObject.pause();
           song.playing = false;
         };

         /**
         * @function previous
         * @desc goes back one place in the song list
         **/
         SongPlayer.previous = function(){
           var currentSongIndex = getSongIndex(SongPlayer.currentSong);
           currentSongIndex--;

           if(currentSongIndex < 0){
             stopSong();
           } else {
             var song = currentAlbum.songs[currentSongIndex];
             setSong(song);
             playSong(song);
           }
         }

         /**
         * @function next
         * @desc goes foward one place in the song list
         **/
         SongPlayer.next = function(){
           var currentSongIndex = getSongIndex(SongPlayer.currentSong);
           currentSongIndex++;

           if(currentSongIndex > currentAlbum.songs.length - 1){
             stopSong();
           } else {
             var song = currentAlbum.songs[currentSongIndex];
             setSong(song);
             playSong(song);
           }
         }

         SongPlayer.setCurrentTime = function(time){
           if (currentBuzzObject){
             currentBuzzObject.setTime(time);
           }
         }

         return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
