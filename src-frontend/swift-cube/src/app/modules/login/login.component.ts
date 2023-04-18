import { Component, AfterViewInit } from '@angular/core';
import { User } from '../user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  user: User = this.newUser();
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.pattern(this.passwordPattern)])
  });

  ngAfterViewInit(): void {
    const formContainer = document.getElementById("formContainer");
    if (formContainer != null) formContainer.scrollIntoView();
  }

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
