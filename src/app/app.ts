import {Component, signal, ViewChild, ViewContainerRef} from '@angular/core';
import {ClashManagerComponent} from '../clash-manager-component/clash-manager-component';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {ClashModel, ClashSettings} from '../model/model';
import {MatMiniFabButton} from '@angular/material/button';
import {ClashCreateComponent, ClashDialogResult} from '../clash-create-component/clash-create-component';
import {MatDialog} from '@angular/material/dialog';
import {BlurOnClick} from '../blur-on-click';
import {ClashSettingsComponent} from '../clash-settings/clash-settings';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ClashManagerComponent, MatIcon, MatFormField, MatSelect, MatOption, MatLabel, FormsModule, MatMiniFabButton, BlurOnClick, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('TypingPractise');

  @ViewChild('clashManager', { read: ViewContainerRef, static: true })
  public clashManager!: ViewContainerRef;

  private readonly clashListKey = 'clash-list';
  private readonly clashSettingKey = 'clash-settings';
  protected clashSelect: ClashModel = {name: 'Temp', speed: 1000, sequence: []};
  protected clashSelectList: ClashModel[] = [];

  public score:number | undefined;
  public setScore(score:number) {
    this.score = score;
  }

  protected clashSettings: ClashSettings = {
    perfectMargin: 2,
    goodMargin: 8,
  };

  public constructor(private dialog: MatDialog) {
    this.loadClashSettings();
    this.loadClashList();
  }

  public saveNewClash(clash: ClashModel) {
    this.clashSelectList.push(clash);
    this.saveClashList();
  }

  private saveClashSettings() {
    localStorage.setItem(this.clashSettingKey, JSON.stringify(this.clashSettings));
  }
  private loadClashSettings() {
    const settings = localStorage.getItem(this.clashSettingKey);
    if (settings) this.clashSettings = JSON.parse(settings) as ClashSettings;
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
        speed: 1000,
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

  public clashManagement() {
    const dialogRef = this.dialog.open(ClashCreateComponent, {
      width: '800px',
      maxWidth: '90vw',
      height: '60%',
      data: { clashList: this.clashSelectList } // Passing data TO the dialog
    });

    // Listen for the result AFTER the dialog closes
    dialogRef.afterClosed().subscribe({ next: (result: ClashDialogResult) => {
      console.log('The dialog was closed. Result:', result);
      if (result.result) {
        this.clashSelectList = result.list;
        this.saveClashList()
      }
    },
    complete: () => {
        this.clashManager.element.nativeElement.focus();
    }});
  }

  public openClashSettings() {
    const dialogRef = this.dialog.open(ClashSettingsComponent, {
      width: '800px',
      maxWidth: '90vw',
      height: '60%',
      data: { clashSettings: this.clashSettings }
    });

    dialogRef.afterClosed().subscribe({
      next: (result: ClashDialogResult) => { if (result) this.saveClashSettings();},
      complete: () => {this.clashManager.element.nativeElement.focus();}});
  }
}
