import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  template: `<div class="badge" [class]="type()">
    <p>{{ lable() }}</p>
  </div>`,
  styleUrl: './badge.scss',
})
export class Badge {
  lable = input.required<string>();
  type = input<'badge__state' | 'badge__time'>('badge__state');
}
