import { Component } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  model = this.newUser();

  submitted = false;

  onSubmit() {
    this.submitted = true;
    localStorage.setItem("loggedUser", "y");
    localStorage.setItem("username", this.model.username);
    window.location.href = "";
  }

  newUser() {
    return new User("", "");
  }
}
