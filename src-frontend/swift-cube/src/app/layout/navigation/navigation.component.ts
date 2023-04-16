import { Component } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  toLoggedInNavigation() {
    const skeletonComponent =  new SkeletonComponent();
    skeletonComponent.generateComponent(1);
  }
}