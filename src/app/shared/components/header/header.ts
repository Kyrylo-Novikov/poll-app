import { Component, inject, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Btn } from '../btn/btn';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, Btn],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly logoSrc: string = '/assets/imgs/icons/header-orange.svg';
  readonly whiteBgLogoSrc: string = '/assets/imgs/icons/header-purple.svg';
  readonly isLandingPage = computed(() => this.currentUrl() === '/');
  readonly isAnswerPage = computed(() => this.currentUrl().startsWith('/answer'));
  isActive: boolean = false;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  routeToCreateSurvey() {
    this.isActive = true;
    setTimeout(() => {
      this.router.navigate(['/create']);
    }, 300);
  }
}
