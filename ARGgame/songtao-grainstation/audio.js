(function () {
  'use strict';

  const AudioSys = {
    ctx: null,
    master: null,
    ambGain: null,
    sfxGain: null,
    ambienceNodes: [],
    ambiencePlaying: false,
    enabled: true,
    noiseBuffer: null,

    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.36;
      this.master.connect(this.ctx.destination);

      this.ambGain = this.ctx.createGain();
      this.ambGain.gain.value = 0.12;
      this.ambGain.connect(this.master);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.52;
      this.sfxGain.connect(this.master);
    },

    ensureInit() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },

    toggle() {
      this.ensureInit();
      this.enabled = !this.enabled;
      if (this.master && this.ctx) {
        const now = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setValueAtTime(this.master.gain.value, now);
        this.master.gain.linearRampToValueAtTime(this.enabled ? 0.36 : 0.0, now + 0.12);
      }
      if (this.enabled) this.startAmbience();
      else this.stopAmbience();
      const btn = document.getElementById('audio-toggle');
      if (btn) btn.textContent = this.enabled ? '♪ 音效开' : '♪ 音效关';
      return this.enabled;
    },

    createNoise() {
      this.ensureInit();
      if (!this.ctx) return null;
      if (this.noiseBuffer) return this.noiseBuffer;
      const length = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < length; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
      this.noiseBuffer = buffer;
      return buffer;
    },

    startAmbience() {
      this.ensureInit();
      if (!this.ctx || this.ambiencePlaying || !this.enabled) return;
      const ctx = this.ctx;
      const noise = this.createNoise();
      this.ambiencePlaying = true;

      const hum = ctx.createOscillator();
      hum.type = 'sine';
      hum.frequency.value = 58;
      const humGain = ctx.createGain();
      humGain.gain.value = 0.28;

      const wobble = ctx.createOscillator();
      wobble.type = 'sine';
      wobble.frequency.value = 0.18;
      const wobbleGain = ctx.createGain();
      wobbleGain.gain.value = 5;
      wobble.connect(wobbleGain);
      wobbleGain.connect(hum.frequency);

      const disk = ctx.createBufferSource();
      disk.buffer = noise;
      disk.loop = true;
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = 980;
      band.Q.value = 0.55;
      const diskGain = ctx.createGain();
      diskGain.gain.value = 0.22;

      const tick = ctx.createOscillator();
      tick.type = 'square';
      tick.frequency.value = 7.5;
      const tickFilter = ctx.createBiquadFilter();
      tickFilter.type = 'highpass';
      tickFilter.frequency.value = 1500;
      const tickGain = ctx.createGain();
      tickGain.gain.value = 0.015;

      hum.connect(humGain);
      humGain.connect(this.ambGain);
      disk.connect(band);
      band.connect(diskGain);
      diskGain.connect(this.ambGain);
      tick.connect(tickFilter);
      tickFilter.connect(tickGain);
      tickGain.connect(this.ambGain);

      hum.start();
      wobble.start();
      disk.start();
      tick.start();
      this.ambienceNodes = [hum, wobble, disk, tick, humGain, wobbleGain, band, diskGain, tickFilter, tickGain];
    },

    stopAmbience() {
      this.ambienceNodes.forEach((node) => {
        try { if (node.stop) node.stop(); } catch (error) {}
        try { if (node.disconnect) node.disconnect(); } catch (error) {}
      });
      this.ambienceNodes = [];
      this.ambiencePlaying = false;
    },

    blip(type, freq, endFreq, duration, gain) {
      this.ensureInit();
      if (!this.ctx || !this.enabled) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq || 900, now);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(gain || 0.35, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    },

    playClick() {
      this.blip('square', 1180, 780, 0.055, 0.28);
    },

    playError() {
      this.blip('sawtooth', 220, 92, 0.32, 0.32);
    },

    playClue() {
      this.ensureInit();
      if (!this.ctx || !this.enabled) return;
      const notes = [620, 930, 1240];
      notes.forEach((freq, index) => {
        setTimeout(() => this.blip('triangle', freq, freq * 1.02, 0.18, 0.25), index * 90);
      });
    },

    playUnlock() {
      this.ensureInit();
      if (!this.ctx || !this.enabled) return;
      [392, 523, 659, 784].forEach((freq, index) => {
        setTimeout(() => this.blip('triangle', freq, freq * 1.04, 0.22, 0.31), index * 105);
      });
    },

    playDramatic() {
      this.ensureInit();
      if (!this.ctx || !this.enabled) return;
      [82, 110, 146].forEach((freq, index) => {
        setTimeout(() => this.blip('sawtooth', freq, freq * 0.72, 0.85, 0.18), index * 70);
      });
    }
  };

  window.AudioSys = AudioSys;
})();
