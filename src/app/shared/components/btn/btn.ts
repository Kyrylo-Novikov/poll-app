import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

/**
 * This component represents the btn component.
 */
@Component({
  selector: 'app-btn',
  imports: [NgOptimizedImage],
  template: `<button type="button" class="btn" [class]="variant()">
    {{ label() }}
    <img class="btn__icon" [ngSrc]="iconPaths[iconSrc()]" alt="" width="20" height="20" />
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
  /** Selection of the icon to be displayed*/
  readonly iconSrc = input<'createPri' | 'createSec' | 'publish' | 'closing'>('createSec');

  /** Internal mapping of icon names to their file paths */
  readonly iconPaths = {
    createPri: '/assets/imgs/icons/add_circle.svg',
    createSec: '/assets/imgs/icons/add_circle_white.svg',
    publish: '/assets/imgs/icons/check_icon.svg',
    closing: '/assets/imgs/icons/close.svg',
  };
}
