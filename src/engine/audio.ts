// Enhanced Audio Controller with File-Based Music & Generative SFX
class AudioController {
    private ctx: AudioContext | null = null;

    private masterGain: GainNode | null = null;
    private musicGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;

    // Track Management
    private currentAudio: HTMLAudioElement | null = null;
    private currentTrack: 'MENU' | 'GAME' | 'VICTORY' | 'DEFEAT' | null = null;


    // Effects
    private delayNode: DelayNode | null = null;
    private feedbackNode: GainNode | null = null;

    constructor() {
        try {
            const CtxClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new CtxClass();
        } catch (e) {
            console.error("Web Audio API not supported", e);
            return;
        }

        if (!this.ctx) return;

        // Master Chain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.4;
        this.masterGain.connect(this.ctx.destination);

        // SFX Bus (with Delay)
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.4;
        this.sfxGain.connect(this.masterGain);

        // Music Bus (Clean)
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.3;
        this.musicGain.connect(this.masterGain);

        // Delay Chain (Dub Effect for SFX)
        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.4; // 400ms delay
        this.feedbackNode = this.ctx.createGain();
        this.feedbackNode.gain.value = 0.3; // 30% feedback

        // Connect Delay: SFX -> Delay -> Feedback -> Delay -> Master
        this.delayNode.connect(this.feedbackNode);
        this.feedbackNode.connect(this.delayNode);
        this.delayNode.connect(this.masterGain);

        this.delayNode.connect(this.masterGain);
    }

    // Public method to be called on user interaction
    public resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
                // Retry playback if we have a current track but no audio playing
                if (this.currentTrack && (!this.currentAudio || this.currentAudio.paused)) {
                    const track = this.currentTrack;
                    this.currentTrack = null;
                    this.startMusic(track);
                }
            });
        }
    }

    private ensureContext() {
        this.resume();
    }

    // Generic envelope generator for SFX
    private playOscillator(freq: number, type: OscillatorType, startTime: number, duration: number, vol: number, useDelay: boolean = false) {
        if (!this.ctx || !this.sfxGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        // ADSR
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        if (useDelay && this.delayNode) {
            const delaySend = this.ctx.createGain();
            delaySend.gain.value = 0.4; // Send level
            gain.connect(delaySend);
            delaySend.connect(this.delayNode);
        }

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    private playNoise(duration: number, vol: number) {
        if (!this.ctx || !this.sfxGain) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start();
    }

    playClick() {
        this.resume();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        this.playOscillator(1500, 'sine', t, 0.05, 0.1);
    }

    playTurnEnd() {
        this.resume();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        this.playOscillator(329.63, 'triangle', t, 0.5, 0.1, true); // E4
        this.playOscillator(493.88, 'triangle', t + 0.1, 0.5, 0.1, true); // B4
    }

    playAttack() {
        this.ensureContext();
        if (!this.ctx) return;
        this.playNoise(0.3, 0.6);
        const t = this.ctx.currentTime;
        this.playOscillator(55, 'sawtooth', t, 0.4, 0.4);
    }

    playBuild() {
        this.ensureContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        this.playOscillator(220, 'square', t, 0.05, 0.2);
        this.playOscillator(220, 'square', t + 0.1, 0.05, 0.2);
    }

    playResearch() {
        this.ensureContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const notes = [60, 64, 67, 72].map(n => 440 * Math.pow(2, (n - 69) / 12));
        notes.forEach((freq, i) => {
            this.playOscillator(freq, 'sine', t + i * 0.1, 0.3, 0.1, true);
        });
    }

    playStart() {
        this.ensureContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        this.playOscillator(55, 'sawtooth', t, 3.0, 0.3, true); // Deep drone
        this.playOscillator(110, 'sine', t + 0.5, 2.0, 0.2, true);
    }

    playDefeat() {
        this.ensureContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        this.playOscillator(55, 'sawtooth', t, 3.0, 0.4);
        this.playOscillator(82.41, 'sawtooth', t + 0.1, 3.0, 0.3); // Minor
    }

    stopMusic() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
    }

    startMusic(track: 'MENU' | 'GAME' | 'VICTORY' | 'DEFEAT') {
        if (this.currentTrack === track && this.currentAudio && !this.currentAudio.paused) return;

        this.stopMusic();
        this.currentTrack = track;

        let filename = '';
        switch (track) {
            case 'MENU':
                filename = '/game_music_main.mp3';
                break;
            case 'GAME':
                filename = '/game_music_1.mp3';
                break;
            case 'VICTORY':
                filename = '/game_music_calm.mp3';
                break;
            case 'DEFEAT':
                filename = '/game_music_calm.mp3';
                break;
        }

        if (filename && this.ctx && this.musicGain) {
            this.currentAudio = new Audio(filename);
            this.currentAudio.loop = true;
            this.currentAudio.volume = 1.0;

            try {
                const source = this.ctx.createMediaElementSource(this.currentAudio);
                source.connect(this.musicGain);
            } catch (e) {
                // Ignore re-connection errors if we partly initialized
            }

            this.currentAudio.play().catch(() => {
                // Expected if no interaction yet. Will be handled by resume().
                console.warn("Audio waiting for interaction...");
            });
        }
    }
}
export const audioController = new AudioController();
