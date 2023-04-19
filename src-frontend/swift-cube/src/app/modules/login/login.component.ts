import { Component, AfterViewInit } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const formContainer = document.getElementById("formContainer");
    if (formContainer != null) formContainer.scrollIntoView();
  }

  user: User = this.newUser();

  onSubmit() {
    alert("onSubmit");
    localStorage.setItem("loggedUser", "y");
    localStorage.setItem("username", this.user.username);
    window.location.href = "";
  }

  newUser() {
    return new User("", "", "");
  }
}
