// 游戏音效工具
// 使用 Web Audio API 生成简单的音效

type SoundType = 'dice' | 'build' | 'damage' | 'heal' | 'win' | 'lose' | 'click' | 'warning' | 'event' | 'move' | 'achievement';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not supported');
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  play(type: SoundType) {
    if (!this.enabled) return;

    switch (type) {
      case 'dice':
        // 骰子滚动声 - 短促的随机音
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            this.playTone(200 + Math.random() * 400, 0.1, 'square', 0.1);
          }, i * 80);
        }
        break;

      case 'build':
        // 建造声 - 金属感的上升音
        this.playTone(440, 0.1, 'square', 0.2);
        setTimeout(() => this.playTone(554, 0.1, 'square', 0.2), 100);
        setTimeout(() => this.playTone(659, 0.2, 'square', 0.2), 200);
        break;

      case 'damage':
        // 受伤声 - 低沉的下降音
        this.playTone(200, 0.3, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(150, 0.3, 'sawtooth', 0.2), 100);
        break;

      case 'heal':
        // 治疗声 - 上升的愉悦音
        this.playTone(523, 0.15, 'sine', 0.2);
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.2), 100);
        setTimeout(() => this.playTone(784, 0.3, 'sine', 0.2), 200);
        break;

      case 'win':
        // 胜利音乐 - 上升和弦
        this.playTone(523, 0.3, 'sine', 0.2);
        setTimeout(() => this.playTone(659, 0.3, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(784, 0.3, 'sine', 0.2), 400);
        setTimeout(() => this.playTone(1047, 0.6, 'sine', 0.2), 600);
        break;

      case 'lose':
        // 失败音乐 - 下降的悲伤音
        this.playTone(400, 0.4, 'sine', 0.2);
        setTimeout(() => this.playTone(300, 0.4, 'sine', 0.2), 300);
        setTimeout(() => this.playTone(200, 0.6, 'sine', 0.2), 600);
        break;

      case'click':
        // 点击声 - 短促的提示音
        this.playTone(800, 0.05, 'sine', 0.15);
        break;

      case 'warning':
        // 警告声 - 急促的重复音
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            this.playTone(600, 0.15, 'square', 0.2);
          }, i * 200);
        }
        break;

      case 'event':
        // 事件卡片翻开声 - 神秘的音效
        this.playTone(300, 0.2, 'sine', 0.15);
        setTimeout(() => this.playTone(400, 0.2, 'sine', 0.15), 150);
        setTimeout(() => this.playTone(500, 0.3, 'sine', 0.15), 300);
        break;

      case 'move':
        // 移动脚步声 - 轻柔的敲击音
        this.playTone(150, 0.08, 'triangle', 0.1);
        break;

      case 'achievement':
        // 成就解锁 - 庆祝的上升音阶
        this.playTone(523, 0.15, 'sine', 0.2);
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.2), 100);
        setTimeout(() => this.playTone(784, 0.15, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(1047, 0.3, 'sine', 0.25), 300);
        break;
    }
  }
}

export const soundManager = new SoundManager();
