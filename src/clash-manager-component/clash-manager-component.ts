import {Component, HostListener, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ClashCircleComponent} from '../clash-circle-component/clash-circle-component';
import {ClashKey, ClashModel} from '../model/model';

interface SpawnPoint {
  x: number;
  y: number;
}

export interface ClashResult {
  text: string;
  type: string;
}

@Component({
  selector: 'app-clash-manager-component',
  imports: [],
  templateUrl: './clash-manager-component.html',
  styleUrl: './clash-manager-component.css',
})
export class ClashManagerComponent {
  @ViewChild('spawn', { read: ViewContainerRef, static: true })
  public spawn!: ViewContainerRef;
  @Input()
  public clash!:ClashModel;

  private circles: ClashCircleComponent[] = [];
  private backUpKeyGroup = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F'];
  private speed: number = 1000;
  private cleanUp: boolean = false;
  private cleanUpDelay: number = 2000;

  @HostListener('window:keydown.space', ['$event'])
  protected start(event: Event) {
    this.spawn.clear();
    this.circles = [];
    let delay: number = 0;
    for (const key of this.clash.sequence) {
      delay += key.delay;
      this.spawnCircle(key, delay);
    }
  }

  private spawnCircle(clashKey: ClashKey, delay: number) {
    setTimeout(() => {
      const ref = this.spawn.createComponent(ClashCircleComponent);
      let letter:string = 'Q';
      if (clashKey.type === 'static') {
        if (clashKey.key) letter = clashKey.key;
      } else {
        const keyGroup: string[] = this.clash.keyGroup ? this.clash.keyGroup[clashKey.keyGroupIndex ?? 0] : this.backUpKeyGroup;
        letter = keyGroup[Math.floor(Math.random() * keyGroup.length)];
      }

      ref.instance.letter = letter;
      ref.instance.x = clashKey.positionX;
      ref.instance.y = clashKey.positionY;

      ref.instance.startCollapse(this.speed);
      this.circles.push(ref.instance);

      // timeout fail
      setTimeout(() => {
        if (!ref.instance.resolved) {
          ref.instance.resolve({ text: 'Bad', type: 'fail-red'});
          this.cleanup(ref.instance);
        }
      }, this.speed);
    }, delay);
  }

  @HostListener('window:keydown', ['$event'])
  protected onKey(e: KeyboardEvent) {
    const circle = this.circles.find(c => !c.resolved);
    if (!circle) return;

    if (e.key.toUpperCase() !== circle.letter) {
      circle.resolve({ text: 'Bad', type: 'fail-red'});
      this.cleanup(circle)
      return;
    }

    const gap = Math.abs(circle.getGap());
    if (gap <= 2) {
      circle.resolve({ text: 'Perfect', type: 'success-perfect'});
    } else if (gap <= 8) {
      circle.resolve({ text: 'Good', type: 'success-good'});
    } else {
      circle.resolve({ text: 'Bad', type: 'fail-red'});
    }

    this.cleanup(circle);
  }

  private cleanup(circle: ClashCircleComponent) {
    if (!this.cleanUp) return;
    setTimeout(() => {
      const index = this.circles.indexOf(circle);
      if (index !== -1) {
        this.spawn.remove(index);
        this.circles.splice(index, 1);
      }
    }, this.cleanUpDelay);
  }
}
