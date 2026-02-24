import {Component, EventEmitter, HostListener, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {ClashCircleComponent} from '../clash-circle-component/clash-circle-component';
import {ClashKey, ClashModel, ClashSettings} from '../model/model';
import {MatDialog} from '@angular/material/dialog';
import {ClashCreateComponent} from '../clash-create-component/clash-create-component';
import {SoundService} from '../sound-service';

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
  host: {
    'tabindex': '0', // Makes the component focusable in the tab order
    'style': 'display: block;' // Ensures the host has a physical area to click
  },
})
export class ClashManagerComponent {
  @ViewChild('spawn', { read: ViewContainerRef, static: true })
  public spawn!: ViewContainerRef;
  @ViewChild('clashStage', { read: ViewContainerRef, static: true })
  public clashStage!: ViewContainerRef;
  @Input()
  public clashSettings!: ClashSettings;
  @Input()
  public clash!:ClashModel;

  private circles: ClashCircleComponent[] = [];
  private backUpKeyGroup = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F'];
  private cleanUp: boolean = false;
  private cleanUpDelay: number = 2000;

  private spawnerList: number[] = [];
  private score:number = 100;
  private gapSum:number = 0;
  private gapCount: number = 0;
  private circleScore:number = 0;

  @Output()
  public setScore:EventEmitter<number> = new EventEmitter<number>();

  public constructor(private soundService: SoundService) {}

  public showScore = (): void => {
    if (this.gapCount > 0) this.score -= this.gapSum / this.gapCount;
    this.setScore.emit(this.score);
  }

  @HostListener('keydown.space', ['$event'])
  protected start(event: Event) {
    this.spawn.clear();
    this.spawnerList.forEach(id => {
      clearTimeout(id);
    });
    this.spawnerList = [];
    this.score = 100;
    this.gapSum = 0;
    this.gapCount = 0;
    this.setScore.emit(undefined);
    this.circleScore = 100 / this.clash.sequence.length;
    this.circles = [];
    let delay: number = 0;
    for (const [index, key] of this.clash.sequence.entries()) {
      delay += key.delay;
      if (index == this.clash.sequence.length - 1) this.spawnCircle(key, delay, this.showScore);
      else this.spawnCircle(key, delay);
    }
  }

  private spawnCircle(clashKey: ClashKey, delay: number, forLast = ()=> {}) {
    const id = setTimeout(() => {
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
      ref.instance.outerThickness = this.clashSettings.perfectMargin;
      ref.instance.innerThickness = this.clashSettings.goodMargin;

      ref.instance.startCollapse(this.clash.speed);
      this.circles.push(ref.instance);

      // timeout fail
      setTimeout(() => {
        if (!ref.instance.resolved) {
          ref.instance.resolve({ text: 'Bad', type: 'fail-red'});
          this.cleanup(ref.instance);
          this.score -= this.circleScore;
        }
        forLast();
      }, this.clash.speed);
    }, delay);
    this.spawnerList.push(id);
  }

  @HostListener('keydown', ['$event'])
  protected onKey(e: KeyboardEvent) {
    const circle = this.circles.find(c => !c.resolved);
    if (!circle) return;

    this.soundService.play('clash');
    if (e.key.toUpperCase() !== circle.letter) {
      circle.resolve({ text: 'Bad', type: 'fail-red'});
      this.cleanup(circle)
      this.score -= this.circleScore;
      return;
    }

    const gap = Math.abs(circle.getGap());
    if (gap <= this.clashSettings.perfectMargin) {
      circle.resolve({ text: 'Perfect', type: 'success-perfect'});
      this.gapSum += gap;
      this.gapCount++;
    } else if (gap <= this.clashSettings.goodMargin) {
      circle.resolve({ text: 'Good', type: 'success-good'});
      this.gapSum += gap;
      this.gapCount++;
    } else {
      circle.resolve({ text: 'Bad', type: 'fail-red'});
      this.score -= this.circleScore;
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
