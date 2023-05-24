import { AfterViewInit, Component } from '@angular/core';
import { User } from '../user.model';
import * as CryptoJS from "crypto-js";

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
    const encryptedPassword = CryptoJS.AES.encrypt(this.user.password, "/nm8z3}KkeXVpsL").toString();
    const encryptedConfirmPassword = CryptoJS.AES.encrypt(this.user.confirmPassword, "/nm8z3}KkeXVpsL").toString();

    const response = await fetch(URL , {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ oldPassword: encryptedPassword, newPassword: encryptedConfirmPassword })
    }).then(response => {
      if (response.status === 200) {
        response.json().then(user => {
          localStorage.setItem("user.data", user.username);
          localStorage.setItem("user.name", this.user.username);
          const oldRoomCode = localStorage.getItem("room");

          if (oldRoomCode !== null) {
            const URL = "http://localhost:5000/rooms?" + new URLSearchParams({
              oldRoomCode: oldRoomCode
            });

            const response = fetch(URL , {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ room_code: `${this.user.username}-local` })
            }).then(response => { localStorage.setItem("room", `${this.user.username}-local`); });
          }
        });
        // window.location.href = "";
      } else {
        window.location.reload();
      }
    }).catch(error => {
      console.error("Error updating an user:", error);
    });
  }
}
