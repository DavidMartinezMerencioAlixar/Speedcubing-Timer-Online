import { AfterViewInit, Component } from '@angular/core';
import { User } from '../user.model';

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

  newUser() {
    return new User("", "", "");
  }

  matchPasswords() {
      return document.querySelectorAll("input")[1].className.match("ng-touched") === null ||
        document.querySelectorAll("input")[2].className.match("ng-touched") === null ||
        this.user.password === this.user.confirmPassword
  }

  async registerUser() {
    if (this.matchPasswords()) {
      const URL = "http://localhost:5000/users";
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: this.user.username, password: this.user.password })
      }).then(response => {
        if (response.status === 200) {
          localStorage.setItem("loggedUser", "y");
          response.json().then(user => {
            console.log(user.username);
            localStorage.setItem("user.data", user.username);
            localStorage.setItem("user.name", this.user.username);
          });
          window.location.href = "";
        } else {
          location.reload();
        }
      }).catch(error => {
        console.error("Error creating an user:", error);
      });
    } else {
      window.location.href = "register";
    }
  }
}