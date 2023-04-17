import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-logged',
  templateUrl: './navigation-logged.component.html',
  styleUrls: ['./navigation-logged.component.scss']
})
export class NavigationLoggedComponent {
  toLoggedOutNavigation() {
    localStorage.setItem("loggedUser", "n");
    location.reload();
  }
}