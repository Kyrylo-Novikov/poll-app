import { Component, inject, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly logoSrc: string = '/assets/imgs/icons/header-orange.svg';
  readonly whiteBgLogoSrc: string = '/assets/imgs/icons/header-purple.svg';
  readonly isLandingPage = computed(() => this.currentUrl() === '/');

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
}
