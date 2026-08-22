/**
 * AudioSys - Web Audio API based procedural sound system
 * 潮汐福利院：1999关停档案 (Tide Orphanage: 1999 Shutdown Files)
 *
 * Retro Windows 98 style archive investigation game.
 * All sounds are generated procedurally via oscillators, noise buffers,
 * gain envelopes and biquad filters - no external audio files required.
 *
 * Ambient layering evokes a coastal / rainy city: bandpass-filtered
 * pink noise with slow LFO modulation (distant ocean swells) plus a
 * low rumble layer for distant storms.
 */
(function () {
  'use strict';

  var AudioSys = {
    ctx: null,
    master: null,
    ambGain: null,
    sfxGain: null,
    enabled: true,
    ambienceNodes: [],
    ambiencePlaying: false,
    _noiseCache: {}
  };

  /* ============================================================
   * Initialization
   * ============================================================ */

  AudioSys.init = function () {
    if (AudioSys.ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    AudioSys.ctx = new AC();

    // Master gain (overall volume 0.4)
    AudioSys.master = AudioSys.ctx.createGain();
    AudioSys.master.gain.value = 0.4;
    AudioSys.master.connect(AudioSys.ctx.destination);

    // Ambience gain (0.15) - background ambient bed
    AudioSys.ambGain = AudioSys.ctx.createGain();
    AudioSys.ambGain.gain.value = 0.15;
    AudioSys.ambGain.connect(AudioSys.master);

    // SFX gain (0.5) - one-shot sound effects
    AudioSys.sfxGain = AudioSys.ctx.createGain();
    AudioSys.sfxGain.gain.value = 0.5;
    AudioSys.sfxGain.connect(AudioSys.master);
  };

  AudioSys.ensureInit = function () {
    if (!AudioSys.ctx) {
      AudioSys.init();
    }
    if (AudioSys.ctx && AudioSys.ctx.state === 'suspended') {
      AudioSys.ctx.resume();
    }
  };

  /* ============================================================
   * Toggle
   * ============================================================ */

  AudioSys.toggle = function () {
    AudioSys.ensureInit();
    AudioSys.enabled = !AudioSys.enabled;

    if (AudioSys.master && AudioSys.ctx) {
      var now = AudioSys.ctx.currentTime;
      AudioSys.master.gain.cancelScheduledValues(now);
      AudioSys.master.gain.setValueAtTime(AudioSys.master.gain.value, now);
      AudioSys.master.gain.linearRampToValueAtTime(
        AudioSys.enabled ? 0.4 : 0.0, now + 0.15
      );
    }

    // Update button display if present on the page
    var btn = document.getElementById('audio-toggle') ||
              document.querySelector('.audio-btn');
    if (btn) {
      btn.textContent = AudioSys.enabled ? '\u266A \u97F3\u6548\u5F00' : '\u266A \u97F3\u6548\u5173';
      btn.setAttribute('data-on', AudioSys.enabled ? '1' : '0');
    }

    if (!AudioSys.enabled) {
      AudioSys.stopAmbience();
    } else {
      AudioSys.startAmbience();
    }
    return AudioSys.enabled;
  };

  /* ============================================================
   * Noise generation
   * ============================================================ */

  AudioSys.createNoise = function (type) {
    if (!AudioSys.ctx) AudioSys.init();
    if (!AudioSys.ctx) return null;

    type = type || 'white';
    if (AudioSys._noiseCache[type]) {
      return AudioSys._noiseCache[type];
    }

    var bufferSize = AudioSys.ctx.sampleRate * 2; // 2 seconds
    var buffer = AudioSys.ctx.createBuffer(1, bufferSize, AudioSys.ctx.sampleRate);
    var data = buffer.getChannelData(0);

    if (type === 'pink') {
      // Pink noise via Paul Kellet's economical algorithm
      var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (var i = 0; i < bufferSize; i++) {
        var white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      // White noise
      for (var j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }
    }

    AudioSys._noiseCache[type] = buffer;
    return buffer;
  };

  /* ============================================================
   * Ambience - coastal rain / ocean waves
   * ============================================================ */

  AudioSys.startAmbience = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx) return;
    if (AudioSys.ambiencePlaying) return;

    var ctx = AudioSys.ctx;
    AudioSys.ambiencePlaying = true;
    AudioSys.ambienceNodes = [];

    /* --- Layer 1: base ocean / rain bed (bandpass pink noise) --- */
    var noiseBuf = AudioSys.createNoise('pink');
    var noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    noiseSrc.loop = true;

    // Bandpass to shape the noise into an ocean-like wash
    var bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 500;
    bandpass.Q.value = 0.6;

    // Lowpass to soften high frequencies (distant rain feel)
    var lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1800;
    lowpass.Q.value = 0.5;

    // Gain node for LFO-driven wave swells
    var swellGain = ctx.createGain();
    swellGain.gain.value = 0.6;

    // Slow LFO (~0.08 Hz) for ocean swell amplitude modulation
    var lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;
    var lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(swellGain.gain);

    // Second LFO (~0.13 Hz) to sweep the bandpass frequency (wave texture)
    var lfo2 = ctx.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.13;
    var lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 150;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(bandpass.frequency);

    // Chain: noise -> bandpass -> lowpass -> swell -> ambGain
    noiseSrc.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(swellGain);
    swellGain.connect(AudioSys.ambGain);

    noiseSrc.start();
    lfo.start();
    lfo2.start();

    AudioSys.ambienceNodes.push(
      noiseSrc, lfo, lfo2, bandpass, lowpass, swellGain, lfoGain, lfo2Gain
    );

    /* --- Layer 2: distant thunder / low rumble --- */
    var rumbleSrc = ctx.createBufferSource();
    rumbleSrc.buffer = noiseBuf;
    rumbleSrc.loop = true;

    var rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 120;
    rumbleFilter.Q.value = 0.7;

    var rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.3;

    // Very slow LFO (~0.05 Hz) fading the rumble in/out (distant storm)
    var rumbleLfo = ctx.createOscillator();
    rumbleLfo.type = 'sine';
    rumbleLfo.frequency.value = 0.05;
    var rumbleLfoGain = ctx.createGain();
    rumbleLfoGain.gain.value = 0.25;
    rumbleLfo.connect(rumbleLfoGain);
    rumbleLfoGain.connect(rumbleGain.gain);

    rumbleSrc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(AudioSys.ambGain);

    rumbleSrc.start();
    rumbleLfo.start();

    AudioSys.ambienceNodes.push(
      rumbleSrc, rumbleLfo, rumbleFilter, rumbleGain, rumbleLfoGain
    );
  };

  AudioSys.stopAmbience = function () {
    if (!AudioSys.ambiencePlaying) return;
    AudioSys.ambiencePlaying = false;

    for (var i = 0; i < AudioSys.ambienceNodes.length; i++) {
      var node = AudioSys.ambienceNodes[i];
      try { if (node.stop) node.stop(); } catch (e) { /* already stopped */ }
      try { if (node.disconnect) node.disconnect(); } catch (e) { /* ignore */ }
    }
    AudioSys.ambienceNodes = [];
  };

  /* ============================================================
   * Sound effects
   * ============================================================ */

  // Windows 98 style click - short square beep ~1200Hz
  AudioSys.playClick = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    var osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.5, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(g);
    g.connect(AudioSys.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  };

  // Typewriter key - square wave with random frequency
  AudioSys.playType = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    var freq = 1500 + Math.random() * 800;
    var osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.03);

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(g);
    g.connect(AudioSys.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  };

  // Clue discovery - rising sine 880 -> 1760Hz
  AudioSys.playClue = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.35);

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
    g.gain.setValueAtTime(0.4, now + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(g);
    g.connect(AudioSys.sfxGain);
    osc.start(now);
    osc.stop(now + 0.65);
  };

  // Error / buzz - sawtooth 200 -> 100Hz
  AudioSys.playError = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    var osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    g.gain.setValueAtTime(0.35, now + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    osc.connect(filter);
    filter.connect(g);
    g.connect(AudioSys.sfxGain);
    osc.start(now);
    osc.stop(now + 0.45);
  };

  // Unlock fanfare - ascending C-E-G-C
  AudioSys.playUnlock = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    // C5, E5, G5, C6
    var notes = [523.25, 659.25, 783.99, 1046.50];
    var step = 0.12;

    for (var i = 0; i < notes.length; i++) {
      var t = now + i * step;
      var osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[i], t);

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.setValueAtTime(0.35, t + step - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + step + 0.15);

      osc.connect(g);
      g.connect(AudioSys.sfxGain);
      osc.start(t);
      osc.stop(t + step + 0.2);
    }
  };

  // Dramatic low chord for plot twists - 110, 82, 65, 55 Hz
  AudioSys.playDramatic = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    var freqs = [110, 82, 65, 55];

    for (var i = 0; i < freqs.length; i++) {
      var osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freqs[i], now);
      // Slight detune drift for an unsettling, beating quality
      osc.detune.setValueAtTime(0, now);
      osc.detune.linearRampToValueAtTime(8 - i * 2, now + 1.5);

      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 1.8);
      filter.Q.value = 2;

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.22, now + 0.4);
      g.gain.setValueAtTime(0.22, now + 1.2);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(filter);
      filter.connect(g);
      g.connect(AudioSys.sfxGain);
      osc.start(now);
      osc.stop(now + 2.3);
    }
  };

  // Paper flip - filtered noise burst
  AudioSys.playPaperFlip = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    var noiseBuf = AudioSys.createNoise('white');
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = false;

    // Bandpass sweeping down for a paper rustle texture
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2500, now);
    bp.frequency.exponentialRampToValueAtTime(1200, now + 0.18);
    bp.Q.value = 1.5;

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.15, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    src.connect(bp);
    bp.connect(g);
    g.connect(AudioSys.sfxGain);
    src.start(now);
    src.stop(now + 0.25);
  };

  // Single musical note (for the music cipher puzzle)
  AudioSys.playMusicNote = function (freq) {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;
    freq = freq || 440;

    // Fundamental sine
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Triangle harmonic an octave up for a richer, music-box tone
    var osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.4, now + 0.03);
    g.gain.setValueAtTime(0.4, now + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    var g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, now);
    g2.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc.connect(g);
    g.connect(AudioSys.sfxGain);
    osc2.connect(g2);
    g2.connect(AudioSys.sfxGain);
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.95);
    osc2.stop(now + 0.75);
  };

  // Subtle child laughter - high freq oscillators with vibrato, very quiet
  AudioSys.playChildLaugh = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    // "ha-ha" syllable pattern
    var syllables = [0, 0.12, 0.24, 0.42, 0.54];
    var baseFreq = 700 + Math.random() * 200;

    for (var i = 0; i < syllables.length; i++) {
      var t = now + syllables[i];
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 80, t);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.15 + Math.random() * 60, t + 0.06);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, t + 0.1);

      // Vibrato LFO for an eerie, wavering quality
      var vibrato = ctx.createOscillator();
      vibrato.type = 'sine';
      vibrato.frequency.value = 12 + Math.random() * 4;
      var vibratoGain = ctx.createGain();
      vibratoGain.gain.value = 25;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      var g = ctx.createGain();
      // Very quiet
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(g);
      g.connect(AudioSys.sfxGain);
      osc.start(t);
      vibrato.start(t);
      osc.stop(t + 0.12);
      vibrato.stop(t + 0.12);
    }
  };

  // Heartbeat - tense "lub-dub" double thump
  AudioSys.playHeartbeat = function () {
    AudioSys.ensureInit();
    if (!AudioSys.ctx || !AudioSys.enabled) return;
    var ctx = AudioSys.ctx;
    var now = ctx.currentTime;

    function thump(start, amp) {
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, start);
      osc.frequency.exponentialRampToValueAtTime(35, start + 0.12);

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(amp, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;

      osc.connect(filter);
      filter.connect(g);
      g.connect(AudioSys.sfxGain);
      osc.start(start);
      osc.stop(start + 0.2);
    }

    thump(now, 0.5);       // lub
    thump(now + 0.16, 0.35); // dub
  };

  /* ============================================================
   * Expose globally
   * ============================================================ */

  window.AudioSys = AudioSys;
})();
