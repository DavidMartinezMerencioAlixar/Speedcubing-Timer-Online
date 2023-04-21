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

  // onSubmit() {
  //   alert("onSubmit");
  //   localStorage.setItem("loggedUser", "y");
  //   localStorage.setItem("username", this.user.username);
  //   window.location.href = "";
  // }

  newUser() {
    return new User("", "", "");
  }

  async loginUser() {
    const URL = "http://localhost:5000/users/login";
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
  }
}
