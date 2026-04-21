import { Component } from '@angular/core';
import { AnswerForm } from '../answer-form/answer-form';
import { VoteForm } from '../vote-form/vote-form';
import { Badge } from '../../shared/components/badge/badge';

@Component({
  selector: 'app-answer-page',
  imports: [AnswerForm, VoteForm, Badge],
  templateUrl: './answer-page.html',
  styleUrl: './answer-page.scss',
})
export class AnswerPage {}
