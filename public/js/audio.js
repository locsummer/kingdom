// Kingdom Rush WebAudio Sound Engine & Audio Mute Controller

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxVolume = 0.8;
    this.bgmVolume = 0.5;
    this.muted = false;
    this.isBgmPlaying = false;
    this.bgmOscillators = [];
    this.bgmInterval = null;
    this.currentTheme = 'map';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
    } else {
      this.startBGM(this.currentTheme);
    }
    this.updateAudioButtonsUI();
    return this.muted;
  }

  updateAudioButtonsUI() {
    const icon = this.muted ? '🔇' : '🔊';
    const text = this.muted ? 'Âm thanh: TẮT' : 'Âm thanh: BẬT';
    document.querySelectorAll('.audio-toggle-btn').forEach(btn => {
      btn.innerHTML = `${icon} <span class="audio-btn-text">${text}</span>`;
      btn.classList.toggle('muted', this.muted);
    });
  }

  setSFXVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
  }

  setBGMVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
  }

  // --- Sound Effects Synthesizer ---
  playSfx(type) {
    if (this.muted || this.sfxVolume <= 0) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    try {
      switch (type) {
        case 'click': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
          gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'build': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'triangle';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(520, now);
          osc1.frequency.exponentialRampToValueAtTime(200, now + 0.15);
          osc2.frequency.setValueAtTime(1040, now);
          osc2.frequency.exponentialRampToValueAtTime(400, now + 0.15);
          gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.2);
          osc2.stop(now + 0.2);
          break;
        }

        case 'arrow': {
          const bufferSize = Math.floor(ctx.sampleRate * 0.08);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1400, now);
          filter.frequency.exponentialRampToValueAtTime(400, now + 0.08);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start(now);
          break;
        }

        case 'sword': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.08);
          gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case 'magic': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(1800, now + 0.18);
          gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'cannon': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
          gain.gain.setValueAtTime(0.5 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case 'meteor': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(250, now);
          osc.frequency.exponentialRampToValueAtTime(20, now + 0.6);
          gain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
          break;
        }

        case 'horn': {
          [220, 277.18, 329.63].forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now + idx * 0.08);
            gain.gain.setValueAtTime(0.18 * this.sfxVolume, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + idx * 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + 0.55 + idx * 0.08);
          });
          break;
        }

        case 'levelup': {
          [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);
            gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.3);
          });
          break;
        }

        case 'victory': {
          [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + idx * 0.15);
            gain.gain.setValueAtTime(0.3 * this.sfxVolume, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.65);
          });
          break;
        }

        case 'defeat': {
          [400, 350, 300, 220].forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now + idx * 0.2);
            gain.gain.setValueAtTime(0.3 * this.sfxVolume, now + idx * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.2);
            osc.stop(now + idx * 0.2 + 0.55);
          });
          break;
        }

        case 'gold': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'square';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(987.77, now);
          osc1.frequency.setValueAtTime(1318.51, now + 0.06);
          osc2.frequency.setValueAtTime(1975.53, now + 0.06);
          gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now + 0.06);
          osc1.stop(now + 0.25);
          osc2.stop(now + 0.25);
          break;
        }

        case 'death': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
          gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }
      }
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  // --- Procedural 8-bit / Medieval Background Music ---
  startBGM(theme = 'battle') {
    this.currentTheme = theme;
    if (this.muted) return;
    this.init();
    if (this.isBgmPlaying) this.stopBGM();
    this.isBgmPlaying = true;

    const melody = theme === 'map' ? 
      [220, 261.63, 293.66, 329.63, 293.66, 261.63, 220, 196] :
      [146.83, 146.83, 220, 174.61, 164.81, 146.83, 196, 220, 261.63, 246.94, 220, 196, 174.61, 146.83];

    let noteIndex = 0;
    const tempo = theme === 'map' ? 650 : 420;

    this.bgmInterval = setInterval(() => {
      if (!this.isBgmPlaying || this.muted || this.bgmVolume <= 0) return;
      try {
        const freq = melody[noteIndex % melody.length];
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08 * this.bgmVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (tempo / 1000) * 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + (tempo / 1000));

        noteIndex++;
      } catch (e) {}
    }, tempo);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

window.soundEngine = new SoundEngine();
