import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  // Store audio objects in a map for easy access
  private sounds: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Preload your sounds
    this.preload('clash', '314024941.mp3');
  }

  private preload(key: string, path: string) {
    const audio = new Audio(path);
    audio.load(); // Start downloading immediately
    this.sounds.set(key, audio);
  }

  play(key: string, volume: number = 0.1) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.currentTime = 0; // Reset to start (allows rapid fire)
      sound.volume = volume;
      sound.play().catch(err => console.warn('Audio playback failed:', err));
    }
  }
}
