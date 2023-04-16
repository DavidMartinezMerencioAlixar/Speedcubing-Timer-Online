import { Component } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-navigation-logged',
  templateUrl: './navigation-logged.component.html',
  styleUrls: ['./navigation-logged.component.scss']
})
export class NavigationLoggedComponent {
  toLoggedOutNavigation() {
    const skeletonComponent =  new SkeletonComponent();
    skeletonComponent.generateComponent(0);
  }
}