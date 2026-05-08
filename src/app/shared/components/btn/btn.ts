import { Component, input, model, signal } from '@angular/core';

/**
 * This component represents the btn component.
 */
@Component({
  selector: 'app-btn',
  imports: [],
  template: `<button
    type="button"
    class="btn"
    [class]="variant()"
    [class.active]="isActive()"
    [disabled]="disabled()"
  >
    <!-- (click)="clickHandler()" -->
    <span class="btn__content">
      {{ label() }}
      <div class="btn__icon" alt=""></div>
    </span>
  </button>`,
  styleUrl: './btn.scss',
})
export class Btn {
  /** The text displayed on the button*/
  readonly label = input.required<string>();
  /** The visual style variant of the btn*/
  readonly variant = input<'btn--primary' | 'btn--secondary' | 'btn--filter' | 'btn--answer'>(
    'btn--primary',
  );
  readonly disabled = input<boolean>(false);

  /** Holds the active status of buttons */
  readonly isActive = model<boolean>(false);
}
