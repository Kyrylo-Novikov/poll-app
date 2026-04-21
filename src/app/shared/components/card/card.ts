import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `<div class="card" [class]="variant()">
    <div class="card__container">
      <p class="card__categorie">test</p>
      <p class="card__title">Es ist eine Test umfrage</p>
      <div class="card__badge-wrapper">
        <div class="card__badge">5tage</div>
      </div>
    </div>
  </div>`,
  styleUrl: './card.scss',
})
export class Card {
  readonly variant = input<'card--listed' | 'card--ending-soon'>('card--listed');
}
