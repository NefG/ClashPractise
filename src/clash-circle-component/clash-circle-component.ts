import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {ClashResult} from '../clash-manager-component/clash-manager-component';

@Component({
  selector: 'app-clash-circle-component',
  imports: [
    NgClass
  ],
  templateUrl: './clash-circle-component.html',
  styleUrl: './clash-circle-component.css',
})
export class ClashCircleComponent {
  @Input() letter!: string;
  @Input() x = 0;
  @Input() y = 0;

  @Input() outerThickness = 2;
  @Input() innerThickness = 8;

  progress = 0;
  resolved = false;
  result?: string;
  resultClass?: string;

  // geometry (must match CSS)
  readonly innerRadius = 60;
  readonly outerStart = 100;
  readonly outerEnd = 40;

  constructor(private cdr: ChangeDetectorRef) {}

  startCollapse(duration: number) {
    const start = performance.now();

    const animate = (now: number) => {
      if (this.resolved) return;

      const t = Math.min((now - start) / duration, 1);
      this.progress = t;
      this.cdr.markForCheck();
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /** Positive = outer outside inner, Negative = overlap */
  getGap(): number {
    const currentOuterRadius = this.outerStart + (this.outerEnd - this.outerStart) * this.progress;
    return Math.abs(currentOuterRadius - this.innerRadius);
  }

  resolve(result: ClashResult) {
    this.resolved = true;
    this.result = result.text;
    this.resultClass = result.type;
  }
}
