import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ClashSettings} from '../model/model';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-clash-settings',
  imports: [
    MatDialogContent,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './clash-settings.html',
  styleUrl: './clash-settings.css',
})
export class ClashSettingsComponent {
  public clashSettings: ClashSettings;
  public constructor(public dialogRef: MatDialogRef<ClashSettingsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.clashSettings = data.clashSettings;
  }
  public save() {
    this.dialogRef.close(true);
  }
  public close() {
    this.dialogRef.close();
  }
}
