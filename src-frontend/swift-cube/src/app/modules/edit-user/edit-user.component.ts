import { AfterViewInit, Component } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    (<HTMLInputElement>document.getElementById("formContainer")).scrollIntoView();
    this.user.username = localStorage.getItem("user.name") || "";
  }

  user: User = this.newUser();

  newUser() {
    return new User("", "", "");
  }

  async editUser() {
    const URL = "http://localhost:5000/users?" + new URLSearchParams({
      oldUsername: localStorage.getItem("user.name") || "",
      newUsername: this.user.username
    });
    console.log(URL);
    const response = await fetch(URL , {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ oldPassword: this.user.password, newPassword: this.user.confirmPassword })
    }).then(response => {
      if (response.status === 200) {
        response.json().then(user => {
          localStorage.setItem("user.data", user.username);
          localStorage.setItem("user.name", this.user.username);
        });
        window.location.href = "";
      } else {
        // window.location.reload();
      }
    }).catch(error => {
      console.error("Error creating an user:", error);
    });
  }
}
