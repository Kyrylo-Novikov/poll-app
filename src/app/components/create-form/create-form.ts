import { Component, inject, signal } from '@angular/core';
import { FormField } from '../../shared/components/form-field/form-field';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Btn } from '../../shared/components/btn/btn';
import { Supabase } from '../../shared/service/supabase';
import { Card } from '../../shared/components/card/card';
import { HeaderSurvayInterface } from '../../shared/interfaces/header-survay-interface';

/** Represents the form for creating a survey */
@Component({
  selector: 'app-create-form',
  imports: [Btn, FormField, ReactiveFormsModule, Card],
  templateUrl: './create-form.html',
  styleUrl: './create-form.scss',
})
export class CreateForm {
  fb = inject(FormBuilder);
  sb = inject(Supabase);
  router = inject(Router);
  submited = signal(false);
  /**Array of letters used to label the answers options*/
  letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  /**
   * Structure of the form
   */
  surveyForm = this.fb.group({
    titel: ['', [Validators.required, Validators.minLength(3)]],
    date: [''],
    description: [''],
    questions: this.fb.array([
      this.fb.group({
        question: ['', Validators.required],
        multi_answers: false,
        answers: this.fb.array([
          this.fb.control('', [Validators.required, Validators.minLength(3)]),
          this.fb.control('', [Validators.required, Validators.minLength(3)]),
        ]),
      }),
    ]),
  });

  /**
   * When the form is valid, pushes the data to Supabase,
   * display the success overlay via signal ,and navigates to the vote page.
   */
  async submitSurvey() {
    if (this.surveyForm.valid) {
      const headerData: HeaderSurvayInterface = this.assembleFormHeader();
      const survID = await this.sb.surveyToSupabaseService(headerData);
      if (survID) {
        const rawQuestionsData = this.questionArray.getRawValue();
        await this.sb.postQuestionsService(survID, rawQuestionsData);
      }
      this.submited.set(true);
      setTimeout(() => {
        this.router.navigate(['answer']);
      }, 1500);
    }
  }

  /**
   * Assemble the header part of the survay
   * @returns Object with 'titel' , 'date'  and, 'description' of the survey
   */
  assembleFormHeader() {
    return {
      titel: this.surveyForm.controls.titel.value,
      date: this.surveyForm.controls.date.value == '' ? null : this.surveyForm.controls.date.value,
      description: this.surveyForm.controls.description.value ?? null,
    };
  }

  /**
   * Referierd the checkbox to the question on the same index
   * @param i - The index of the question in the FormArray
   * @returns The FormControl for the 'multi_answers' checkbox
   */
  getMultiAnswers(i: number): FormControl {
    return this.getQuestionsGroup(i).get('multi_answers') as FormControl;
  }

  /**
   * Adds answer input to a specific question up to  max 10
   * @param i- The index of the question
   */
  addAnswers(i: number) {
    let answers = this.getAnswers(i);
    if (answers.length < 10) {
      answers.push(this.fb.control('', [Validators.required, Validators.minLength(3)]));
    } else {
      console.log('maximal anzahl erreicht');
    }
  }

  /**
   * Adds a question input to the current form up to max 10
   */
  addQuestion() {
    let questions = this.surveyForm.controls.questions as FormArray;
    if (questions.length < 10) {
      questions.push(
        this.fb.group({
          question: [''],
          multi_answers: false,
          answers: this.fb.array([this.fb.control(''), this.fb.control('')]),
        }),
      );
    }
  }

  /**
   *  Removes a specific question from the current form , if its only one question then clear the inputs instead
   * @param i The index of the question that we remove
   */
  removeQuestion(i: number) {
    let questions = this.surveyForm.controls.questions as FormArray;
    let answers = this.getAnswers(i);
    if (questions.length > 1) {
      questions.removeAt(i);
    } else {
      questions.at(0).get('question')?.setValue('');
    }
  }

  /**
   * Clears the answer input
   * @param qIdx The index of the question
   * @param aIdx The index of the answer that we remove
   */
  clearAnswers(qIdx: number, aIdx: number) {
    this.getAnswers(qIdx).at(aIdx).setValue('');
  }

  /**
   * labels the answer with letter that associates to its index
   * @param i The index of the answers
   * @returns The letter string or '?'
   */
  answerSign(i: number): string {
    let letter = this.letters[i] + '.';
    return letter ?? '?';
  }

  /**
   * Retrieves the FormGroup for specific question by its indecx
   * @param i The index of the question in the FormArray
   * @returns The FormGroup containing question text, multi-choice toggle, and answers
   */
  getQuestionsGroup(i: number): FormGroup {
    return this.surveyForm.controls.questions.at(i) as FormGroup;
  }

  /**
   * Retrieves the FormControl from the choicen question
   * @param i The index of the question
   * @returns The FormControl
   */
  getQuestControl(i: number): FormControl {
    return this.getQuestionsGroup(i).get('question') as FormControl;
  }

  /**
   * Retrieves the FormArray for the choicen question
   * @param i The index of the question in the FormArray
   * @returns The FormArray with all answers for this questions
   */
  getAnswers(i: number): FormArray {
    return this.getQuestionsGroup(i).get('answers') as FormArray;
  }

  /**
   * Retrieves the main FormArray containing all questions for the current form.
   * @returns The FormArray with all questions of the survey.
   */
  get questionArray() {
    return this.surveyForm.get('questions') as FormArray;
  }
}
