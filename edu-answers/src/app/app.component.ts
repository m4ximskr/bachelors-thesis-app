import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {QuestionManagerComponent} from "./shared/components/question-manager/question-manager.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AuthService} from "./shared/services/auth.service";
import {Router} from "@angular/router";
import {UserStorageService} from "./shared/services/user-storage.service";
import {TranslateService} from "@ngx-translate/core";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public dialog: MatDialog,
    public userStorageService: UserStorageService,
    public authService: AuthService,
    private router: Router,
    public translate: TranslateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.iconRegistry.addSvgIcon(
      'lv',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/lv.svg'));
    this.iconRegistry.addSvgIcon(
      'ru',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ru.svg'));
  }

  openDialog() {
    const dialogRef = this.dialog.open(
      QuestionManagerComponent
    );

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
          this.router.navigate([`/questions/${res._id}`])
        }
      });
  }
}
