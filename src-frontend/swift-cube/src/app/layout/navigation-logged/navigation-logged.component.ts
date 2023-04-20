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
    location.reload();
  }

  toHome() {
    location.href = "";
  }
}