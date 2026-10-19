/**
 * AJI LEKSONO - MUSIC PLAYER: LATHI (Weird Genius ft. Sara Fajira)
 * Direct Local HTML5 Audio Playback Controller
 * File: assets/audio/lathi.mp3
 */

(function () {
  'use strict';

  function getAudioElement() {
    return document.getElementById('lathi-audio-player');
  }

  function getElements() {
    return {
      audio: getAudioElement(),
      dock: document.getElementById('music-dock'),
      vinyl: document.getElementById('music-vinyl'),
      playBtn: document.getElementById('music-play-btn'),
      muteBtn: document.getElementById('music-mute-btn'),
      equalizer: document.getElementById('music-equalizer'),
      playIcon: document.getElementById('play-icon'),
      pauseIcon: document.getElementById('pause-icon'),
      volumeHighIcon: document.getElementById('volume-high-icon'),
      volumeMuteIcon: document.getElementById('volume-mute-icon'),
      musicToast: document.getElementById('music-prompt-toast')
    };
  }

  function updateVisuals(isPlaying) {
    const el = getElements();
    if (isPlaying) {
      el.vinyl?.classList.add('spinning');
      el.equalizer?.classList.add('playing');
      if (el.playIcon) el.playIcon.style.display = 'none';
      if (el.pauseIcon) el.pauseIcon.style.display = 'block';
      if (el.musicToast) el.musicToast.style.display = 'none';
      if (el.playBtn) el.playBtn.title = 'Jeda Musik (Pause)';
    } else {
      el.vinyl?.classList.remove('spinning');
      el.equalizer?.classList.remove('playing');
      if (el.playIcon) el.playIcon.style.display = 'block';
      if (el.pauseIcon) el.pauseIcon.style.display = 'none';
      if (el.playBtn) el.playBtn.title = 'Putar Musik (Play)';
    }
  }

  // Global functions accessible via inline onclick & script
  window.playLathi = function () {
    const audio = getAudioElement();
    if (!audio) return;

    audio.volume = 0.8;
    audio.play().then(() => {
      updateVisuals(true);
    }).catch(err => {
      console.warn('Playback error or user gesture required:', err);
    });
  };

  window.pauseLathi = function () {
    const audio = getAudioElement();
    if (!audio) return;
    audio.pause();
    updateVisuals(false);
  };

  window.toggleLathiPlay = function () {
    const audio = getAudioElement();
    if (!audio) return;

    if (audio.paused) {
      window.playLathi();
    } else {
      window.pauseLathi();
    }
  };

  window.toggleLathiMute = function () {
    const audio = getAudioElement();
    const el = getElements();
    if (!audio) return;

    audio.muted = !audio.muted;
    if (audio.muted) {
      if (el.volumeHighIcon) el.volumeHighIcon.style.display = 'none';
      if (el.volumeMuteIcon) el.volumeMuteIcon.style.display = 'block';
    } else {
      if (el.volumeHighIcon) el.volumeHighIcon.style.display = 'block';
      if (el.volumeMuteIcon) el.volumeMuteIcon.style.display = 'none';
    }
  };

  // Setup event listeners when DOM is loaded
  function initPlayer() {
    const audio = getAudioElement();
    const el = getElements();

    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.8;

    // Direct event sync
    audio.addEventListener('play', () => updateVisuals(true));
    audio.addEventListener('pause', () => updateVisuals(false));
    audio.addEventListener('ended', () => updateVisuals(false));

    // Button event listeners
    if (el.playBtn) {
      el.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleLathiPlay();
      });
    }

    if (el.vinyl) {
      el.vinyl.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleLathiPlay();
      });
    }

    if (el.muteBtn) {
      el.muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleLathiMute();
      });
    }

    if (el.equalizer) {
      el.equalizer.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleLathiPlay();
      });
    }

    if (el.musicToast) {
      el.musicToast.addEventListener('click', () => {
        window.playLathi();
      });
    }

    const heroBtn = document.getElementById('hero-play-music-btn');
    if (heroBtn) {
      heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleLathiPlay();
      });
    }

    // Try autoplay on first load
    audio.play().then(() => {
      updateVisuals(true);
    }).catch(() => {
      // If browser autoplay policy defers, trigger on first interaction
      const onUserInteraction = function () {
        if (audio.paused) {
          audio.play().then(() => {
            updateVisuals(true);
          }).catch(() => {});
        }
        ['click', 'touchstart', 'keydown'].forEach(evt => {
          window.removeEventListener(evt, onUserInteraction);
        });
      };

      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.addEventListener(evt, onUserInteraction, { passive: true });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
  } else {
    initPlayer();
  }

})();
