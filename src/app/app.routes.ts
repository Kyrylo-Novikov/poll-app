import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { CreateSurveyPage } from './components/create-survey-page/create-survey-page';
import { AnswerPage } from './components/answer-page/answer-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'create',
    component: CreateSurveyPage,
  },
  {
    path: 'answer/:surveyId',
    component: AnswerPage,
  },
];
