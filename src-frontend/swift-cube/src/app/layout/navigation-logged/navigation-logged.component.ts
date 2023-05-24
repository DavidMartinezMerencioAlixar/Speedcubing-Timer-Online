import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-navigation-logged',
  templateUrl: './navigation-logged.component.html',
  styleUrls: ['./navigation-logged.component.scss']
})
export class NavigationLoggedComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    let usernameText = document.getElementById("username");
    if (usernameText != null) usernameText.textContent = localStorage.getItem("user.name");
  }

  toLoggedOutNavigation() {
    localStorage.setItem("loggedUser", "n");
    localStorage.removeItem("user.data");
    localStorage.removeItem("user.name");
    localStorage.removeItem("room");
    this.toHome();
  }

  toEditUser() {
    window.location.href = "userdata";
  }

  toHome() {
    window.location.href = "";
  }
}