import { Component, effect, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Survey } from '../../shared/interfaces/survey';
import { Btn } from '../../shared/components/btn/btn';
import { Supabase } from '../../shared/service/supabase';

@Component({
  selector: 'app-answer-form',
  imports: [Btn, ReactiveFormsModule],
  templateUrl: './answer-form.html',
  styleUrl: './answer-form.scss',
})
export class AnswerForm {
  /**Array of letters used to label the answers options*/
  letters = input<string[]>([]);
  fb = inject(FormBuilder);
  surveyData = input<Survey | null>(null);
  sb = inject(Supabase);
  answerForm: FormGroup = this.fb.group({});
  votesSubmitted = output<number[]>();
  /**
   * When data is available use addControls
   */
  constructor() {
    effect(() => {
      const data = this.surveyData();
      if (data) this.addControls();
    });
  }

  /**
   * Adds controls to the answerForm for every input with the qId as [formControlName]
   */
  addControls() {
    let currentQuestions = this.surveyData()?.questions;
    if (currentQuestions) {
      currentQuestions.forEach((q) => {
        let qId = q.id;
        if (!qId) return;
        this.answerForm.addControl(qId.toString(), new FormControl([]));
      });
    }
  }

  /**
   * Toggles the selection of an answer in the form control.
   * Adds the answer ID if checked, and remove it if unchecked.
   * @param qId Id of the question used as form controle name
   * @param aId Id of the chosen answer to toggle
   * @param event - The change event from the checkbox input.
   */
  toggleCheckbox(qId: number, aId: number, event: Event): void {
    const inputTarget = event.target as HTMLInputElement;
    if (!inputTarget) return;
    const checked = inputTarget.checked;
    const answerControle = this.answerForm.get(qId.toString());
    if (answerControle) {
      let currentAnswers: number[] = Array.isArray(answerControle.value)
        ? answerControle.value
        : [];
      if (checked) answerControle.setValue([...currentAnswers, aId]);
      else answerControle.setValue(currentAnswers.filter((id) => id !== aId));
    }
  }

  /**
   * Flattens selected answer IDs and emits the ids of the votes to the parent component
   */
  completeSurveyVote() {
    const votesID = Object.values(this.answerForm.value).flat() as number[];
    this.votesSubmitted.emit(votesID);
  }
}
