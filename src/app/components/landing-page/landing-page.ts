import { Component } from '@angular/core';
import { AboveTheFoldComponent } from '../above-the-fold/above-the-fold';
import { EndingSurveys } from '../ending-surveys/ending-surveys';
import { SurveyOverview } from '../survey-overview/survey-overview';

@Component({
  selector: 'app-landing-page',
  imports: [AboveTheFoldComponent, EndingSurveys, SurveyOverview],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {}
