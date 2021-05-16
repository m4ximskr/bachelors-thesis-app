import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  addNotification(text: string) {
    this.snackBar.open(text, null, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 5000,
    });
  }

}
