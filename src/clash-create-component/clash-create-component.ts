import {Component, Inject} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {ClashKey, ClashModel} from '../model/model';
import {JoinPipe} from '../app/join-pipe';
import {MatButton} from '@angular/material/button';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-clash-create-component',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatInput,
    JoinPipe,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    CdkCopyToClipboard,
  ],
  templateUrl: './clash-create-component.html',
  styleUrl: './clash-create-component.css',
})
export class ClashCreateComponent {
    public clashForm: ClashForm = new ClashForm();
    public clashList: ClashModel[] = [];
    public clashSelected?: ClashModel;

    public keySetList: string[][] = [
      ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F'],
      ['Q', 'W', 'E', 'R']
    ];

    public fromJSON: boolean = false;
    public jsonField: string = '';

    public constructor(public dialogRef: MatDialogRef<ClashCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.clashList = data.clashList;
      if (this.clashList.length > 0) {
        this.clashSelected = this.clashList[0];
        this.clashForm = new ClashForm(this.clashSelected);
      }
    }

    public onChange(clash: ClashModel) {
      this.clashSelected = clash;
      this.clashForm = new ClashForm(this.clashSelected);
    }

    public createFromJson() {
      try {
        this.clashForm = new ClashForm(JSON.parse(this.jsonField));
        this.clashSelected = this.clashForm;
        this.clashList.push(this.clashForm);
        this.fromJSON = false;
        this.jsonField = '';
        return true;
      } catch (e) {
        return false;
      }
    }

    public stringifySelected() {
      return JSON.stringify(this.clashSelected);
    }

    public swapToJSON() {
      this.fromJSON = true;
    }

    public cancelFromJson() {
      this.fromJSON = false;
    }

    public deleteCurrent() {
      if (this.clashSelected == undefined) return;
      const index = this.clashList.indexOf(this.clashSelected);
      if (index == -1) return;
      this.clashList.splice(index, 1);

      if (this.clashList.length > 0) {
        this.clashSelected = this.clashList[this.clashList.length - 1];
        this.clashForm = new ClashForm(this.clashSelected);
      } else {
        this.clashSelected = undefined;
        this.clashForm = new ClashForm();
      }
    }

    public close() {
      this.dialogRef.close({result: false, list: this.clashList});
    }

    public save() {
      if (this.clashSelected) {
        this.clashSelected.name = this.clashForm.name;
        this.clashSelected.speed = this.clashForm.speed;
        this.clashSelected.keyGroup = this.clashForm.keyGroup;
        this.clashSelected.sequence = this.clashForm.sequence;
      }

      this.dialogRef.close({result: true, list: this.clashList});
    }
}

export class ClashForm implements ClashModel {
  public name: string = '';
  public speed: number = 1000;
  public keyGroup: string[][] | undefined = [];
  public sequence: ClashKey[] = [];
  public constructor(clash?: ClashModel) {
    if (clash) {
      this.name = clash.name;
      this.speed = clash.speed;
      this.keyGroup = clash.keyGroup;
      this.sequence = clash.sequence;
      this.sequence.forEach(k => {
        if (k.type === 'static') {
          k.key = k.key ? k.key : 'Q';
        } else {
          k.keyGroupIndex = k.keyGroupIndex ? k.keyGroupIndex : 0;
        }
      });
    }
  }
  public addSequence() {
    this.sequence.push({
      type: 'static',
      key: 'Q',
      delay: 500,
      positionX: 0,
      positionY: 0,
    });
  }
  public removeSequence(index: number) {
    this.sequence.splice(index, 1);
  }
}

export interface ClashDialogResult {
  result: boolean;
  list: ClashModel[];
}
