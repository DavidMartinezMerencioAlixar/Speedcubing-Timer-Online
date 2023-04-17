import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  toLoggedInNavigation() {
    // localStorage.setItem("logged", "yes");
    // location.reload();
    location.href = "register";
  }
}