import throtle from 'lodash.throttle';
import Player from '@vimeo/player';

const playerIframeRef = document.querySelector('#vimeo-player');
const player = new Player(playerIframeRef, { autoplay: true });

const PLAYER_STATE_LS_NAME = 'player-state';

const playerState = {
  currentTime: 0,
  quality: 'auto',
  isPlay: false,
};

const setPlayerStateFromLocalStorage = () => {
  const playerStateStorage = localStorage.getItem(PLAYER_STATE_LS_NAME);

  if (playerStateStorage) {
    const { currentTime, quality, isPlay } = JSON.parse(playerStateStorage);
    playerState.currentTime = currentTime ?? 0;
    playerState.quality = quality ?? 'auto';
    playerState.isPlay = isPlay ?? false;
  }

  player.setCurrentTime(playerState.currentTime);
  player.setQuality(playerState.quality);
  if (playerState.isPlay) {
    // Browser autoplay policy
    player.setVolume(0);
    player.play();
  }
};

setPlayerStateFromLocalStorage();

const updateLocalStorage = () => localStorage.setItem(PLAYER_STATE_LS_NAME, JSON.stringify(playerState));

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
  setTimeout(() => localStorage.removeItem(PLAYER_STATE_LS_NAME), 1000);
};

player.on('timeupdate', throtle(onPlayerTimeUpdate, 1000));
player.on('play', onPlayerPlay);
player.on('pause', onPlayerPause);
player.on('qualitychange', onPlayerQualityChange);
player.on('ended', onPlayerVideoEnded);
