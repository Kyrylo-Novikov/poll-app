import { Component } from '@angular/core';
import { CreateForm } from '../create-form/create-form';
import { Badge } from '../../shared/components/badge/badge';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-survey-page',
  imports: [CreateForm, Badge, RouterLink],
  templateUrl: './create-survey-page.html',
  styleUrl: './create-survey-page.scss',
})
export class CreateSurveyPage {}
