import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { CreateSurveyPage } from './components/create-survey-page/create-survey-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'create',
    component: CreateSurveyPage,
  },
];
