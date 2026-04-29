import { NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
/**
 * A reuseble form field componente that support text, date, and textarea inputs.
 * It includes a label , an optional marker, and a clear-input function.
 */
@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule, NgOptimizedImage],
  template: `<div class="field">
    <div class="field__label-wrapper">
      @if (this.type() == 'date' || this.isTextArea()) {
        <label class="field__label" for="{{ rngId }}"
          >{{ label() }} <span class="field__opt-marker">(optional)</span>
        </label>
      } @else {
        <label class="field__label" for="{{ rngId }}">{{ label() }} </label>
      }
      <img
        class="field__clear-input"
        [ngSrc]="iconSrc"
        width="20"
        height="20"
        alt=""
        (click)="clearInput()"
      />
    </div>
    @if (isTextArea()) {
      <textarea
        [id]="rngId"
        rows="5"
        class="field__inp"
        name="desc-creat-form"
        id="desc-creat-form"
        [formControl]="control()"
      ></textarea>
    } @else {
      <input
        #dateInput
        (focus)="datePrep(dateInput)"
        class="field__inp"
        [type]="type()"
        [id]="rngId"
        [formControl]="control()"
      />
    }
  </div>`,
  styleUrl: './form-field.scss',
})
export class FormField {
  /** It's the date for today */
  todayDate = new Date().toISOString().split('T')[0];
  /** It's the date for today in above 50 Years */
  futureDate = new Date(new Date().setFullYear(new Date().getFullYear() + 50))
    .toISOString()
    .split('T')[0];

  @Output() onClear = new EventEmitter<void>();
  /** Icon src for the delete icon */
  iconSrc = '/assets/imgs/icons/delete.svg';
  /** The text displayed on the label*/
  readonly label = input.required<string>();
  /** The type on the input*/
  readonly type = input<'text' | 'date'>('text');
  /** Indicate whenen it is a textarea */
  readonly isTextArea = input<boolean>(false);
  /** The  formcontrole given as a input signal  */
  readonly control = input.required<FormControl>();
  /** Create a random id for the inputs */
  readonly rngId = Math.round(Math.random() * 100) ** 2;

  /** Clear the current input value */
  clearInput() {
    this.onClear.emit();
  }

  /** Set min , max and showpicker if the input type is 'date' */
  datePrep(dateInput: HTMLInputElement) {
    if (this.type() == 'date') {
      dateInput.min = this.todayDate;
      dateInput.max = this.futureDate;
      dateInput.showPicker();
    }
  }
}
