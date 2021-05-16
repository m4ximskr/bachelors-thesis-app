import { Component, OnInit } from '@angular/core';
import {UserData, UsersService} from "../../users.service";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {debounceTime, filter, startWith} from "rxjs/operators";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ConfirmationDialogComponent} from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {UserStorageService} from "../../../../shared/services/user-storage.service";

@UntilDestroy()
@Component({
  selector: 'qna-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'type', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  searchControl = new FormControl('');

  actions = [
    { name: 'Dzēst lietotāju', method: id => this.deleteUser(id) },
  ];


  constructor(
    public dialog: MatDialog,
    public userStorageService: UserStorageService,
    private usersService: UsersService,
    private snackBarService: SnackBarService,
  ) {
    this.listenForSearchControlChanges();
  }

  ngOnInit(): void {
    this.getUsers('');
  }

  private listenForSearchControlChanges() {
    this.searchControl.valueChanges.pipe(
      untilDestroyed(this),
      debounceTime(400),
      filter(value => value.length >= 3 || value === ''),
      startWith(''),
    ).subscribe(searchVal => {
      this.getUsers(searchVal);
    })
  }

  private getUsers(searchVal: string) {
    this.usersService.getUsers(searchVal).subscribe((users: UserData[]) => {
      this.dataSource = new MatTableDataSource(users);
    })
  }

  private deleteUser(id) {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent, {
        data: {
          title: 'Vai tiešām izdzēst lietotāju?',
          desc: 'Šo darbību vairs nevarēs atcelt.',
        }
      }
    );

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
          console.log(id);
          this.usersService.deleteUser(id).subscribe(res => {
            const filteredUsers = this.dataSource.data.filter(user => user._id !== id)
            this.dataSource = new MatTableDataSource(filteredUsers);
            this.snackBarService.addNotification('Lietotājs tika izdzēsts');

          }, err => {
            this.snackBarService.addNotification('Notika kļūda');
          })
        }
      });
  }

}
