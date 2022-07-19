import throtle from 'lodash.throttle';
import Player from '@vimeo/player';

const playerIframeRef = document.querySelector('#vimeo-player');
const player = new Player(playerIframeRef, { autoplay: true });

const PLAYER_STATE_LS_KEY = 'player-state';

let playerState = JSON.parse(localStorage.getItem(PLAYER_STATE_LS_KEY)) ?? {};

const setPlayerStateFromLocalStorage = () => {
  if (Object.keys(playerState).length === 0) return;

  player.setCurrentTime(playerState.currentTime ?? 0);
  player.setQuality(playerState.quality ?? 'auto');
  if (playerState.isPlay) {
    // Mute because of browser autoplay policy
    player.setVolume(0);
    player.play();
  }
};

setPlayerStateFromLocalStorage();

const updateLocalStorage = () => localStorage.setItem(PLAYER_STATE_LS_KEY, JSON.stringify(playerState));

const onPlayerTimeUpdate = ({ seconds }) => {
  playerState.currentTime = seconds;
  updateLocalStorage();
};

const onPlayerPlay = () => {
  playerState.isPlay = true;
  updateLocalStorage();
};

const onPlayerPause = ({ seconds }) => {
  playerState.currentTime = seconds;
  playerState.isPlay = false;
  updateLocalStorage();
};

const onPlayerQualityChange = ({ quality }) => {
  playerState.quality = quality;
  updateLocalStorage();
};

const onPlayerVideoEnded = () => {
  // Timeout because of throtle
  setTimeout(() => localStorage.removeItem(PLAYER_STATE_LS_KEY), 1000);
  playerState = {};
};

player.on('timeupdate', throtle(onPlayerTimeUpdate, 1000));
player.on('play', onPlayerPlay);
player.on('pause', onPlayerPause);
player.on('qualitychange', onPlayerQualityChange);
player.on('ended', onPlayerVideoEnded);
