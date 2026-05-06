import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Btn } from '../../shared/components/btn/btn';
import { Router } from '@angular/router';

/**
 * This component displays the hero section without any code logic.
 */
@Component({
  selector: 'app-above-the-fold',
  imports: [NgOptimizedImage, Btn],
  templateUrl: './above-the-fold.html',
  styleUrl: './above-the-fold.scss',
})
export class AboveTheFoldComponent {
  router = inject(Router);
  isActive: boolean = false;

  /**
   * Navigates to the create form after a short delay (300ms)
   * to allow the button icon state change to be rendered visually
   * before the route transition.
   */
  routeToCreateSurvey() {
    this.isActive = true;
    setTimeout(() => {
      this.router.navigate(['/create']);
    }, 300);
  }
}
