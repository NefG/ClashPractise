import {Component, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ClashCircleComponent} from '../clash-circle-component/clash-circle-component';
import {ClashManagerComponent} from '../clash-manager-component/clash-manager-component';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {ClashModel} from '../model/model';
import {MatMiniFabButton} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [ClashManagerComponent, MatIcon, MatFormField, MatSelect, MatOption, MatLabel, FormsModule, MatMiniFabButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TypingPractise');

  private readonly clashListKey = 'clash-list';
  protected clashSelect: ClashModel = {name: 'Temp', sequence: []};
  protected clashSelectList: ClashModel[] = [];

  public constructor() {
    this.loadClashList();
  }

  public saveNewClash(clash: ClashModel) {
    this.clashSelectList.push(clash);
    this.saveClashList();
  }

  public saveClashList() {
    localStorage.setItem(this.clashListKey, JSON.stringify(this.clashSelectList));
  }

  public loadClashList() {
    const list = localStorage.getItem(this.clashListKey);
    if (list) this.clashSelectList = JSON.parse(list);
    else {
      this.clashSelectList = [];
      this.saveNewClash({
        name: 'Test clash',
        keyGroup: [['Q', 'W', 'E', 'R']],
        sequence: [
          { type: 'random', delay: 200, positionX: 100, positionY: 150 },
          { type: 'random', delay: 500, positionX: 250, positionY: 80 },
          { type: 'random', delay: 700, positionX: 400, positionY: 150 },
          { type: 'random', delay: 500, positionX: 550, positionY: 80 },
          { type: 'random', delay: 500, positionX: 550, positionY: 200 },
          { type: 'static', key: 'Q', delay: 200, positionX: 100, positionY: 400 },
          { type: 'static', key: 'Q', delay: 200, positionX: 200, positionY: 400 },
          { type: 'static', key: 'Q', delay: 200, positionX: 300, positionY: 400 },
          { type: 'static', key: 'Q', delay: 200, positionX: 400, positionY: 400 },
          { type: 'static', key: 'Q', delay: 200, positionX: 500, positionY: 400 },
        ]
      });
    }
    if (this.clashSelectList.length > 0) {
      this.clashSelect = this.clashSelectList[0];
    }
  }

  public clear() {
    localStorage.clear();
  }
}
