import { AfterViewInit, Component, Input } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements AfterViewInit {
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

  matchPasswords() {
    try {
      return document.querySelectorAll("input")[1].className.match("ng-touched") === null ||
      document.querySelectorAll("input")[2].className.match("ng-touched") === null ||
      this.user.password === this.user.confirmPassword
    } catch {
      console.log("error");
      
      return false;
    }

  }
}