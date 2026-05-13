import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AnswerForm } from '../answer-form/answer-form';
import { Badge } from '../../shared/components/badge/badge';
import { Supabase } from '../../shared/service/supabase';
import { HeaderSurvey, Survey, QuestionData, AnswersData } from '../../shared/interfaces/survey';
import { RouterLink, Router } from '@angular/router';
import { VoteSummary } from '../vote-summary/vote-summary';

@Component({
  selector: 'app-answer-page',
  imports: [AnswerForm, Badge, RouterLink, VoteSummary],
  templateUrl: './answer-page.html',
  styleUrl: './answer-page.scss',
})
export class AnswerPage implements OnInit {
  sb = inject(Supabase);
  router = inject(Router);
  surveyData = signal<Survey | null>(null);
  surveyHead = signal<HeaderSurvey | null>(null);
  surveyId = input<number>();
  questionArray!: QuestionData[];
  answersArray!: AnswersData[];
  letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  openDD: boolean = false;
  checkedAnswerIDs = signal<number[]>([]);

  /**
   * Toggles the drop down menu
   */
  toggleDD() {
    this.openDD = !this.openDD;
  }

  /**
   * Initializes the component by combining the survey header and all questions into a single object.
   */
  async ngOnInit(): Promise<void> {
    const id = Number(this.surveyId());
    const dataSurveyHeader = await this.sb.loadSurvay<HeaderSurvey>('survey', 'id', id);
    if (!dataSurveyHeader) return;
    const dataQuestions = await this.sb.loadMany<QuestionData>(
      'question',
      'survey_id',
      dataSurveyHeader.id as number,
    );
    if (dataQuestions && dataSurveyHeader) {
      await this.loadDataAnswers(dataQuestions);
      this.setFullSurvey(dataQuestions, dataSurveyHeader);
    }
  }

  /**
   * Sets the fetched data to the variables
   * @param dataQuestions An Array of questions filled with their answers.
   * @param dataSurveyHeader The header of the survey
   */
  setFullSurvey(dataQuestions: QuestionData[], dataSurveyHeader: HeaderSurvey) {
    this.questionArray = dataQuestions;
    this.surveyHead.set(dataSurveyHeader);
    const fullSurvey: Survey = { ...dataSurveyHeader, questions: this.questionArray };
    this.surveyData.set(fullSurvey);
  }

  /**
   * Fetches the answers for each question and attaches them to the respective question object
   * @param dataQuestions Array of questions for filling with answers
   */
  async loadDataAnswers(dataQuestions: QuestionData[]) {
    for (let index = 0; index < dataQuestions.length; index++) {
      const question = dataQuestions[index];
      const dataAnswers = await this.sb.loadMany<AnswersData>(
        'answers',
        'question_id',
        question?.id as number,
      );
      if (dataAnswers) {
        question.answers = dataAnswers;
      }
    }
  }

  /**
   * Incremnets the vote count for each selected answer in Supabase,
   * then navigate the user to the landing page
   * @param votes An array with the IDs of the selected answers.
   */
  async saveVotesToDatabase(votes: number[]) {
    for (const voteID of votes) {
      const { error } = await this.sb.increment_vote(voteID);
      if (error) {
        console.log('Datenbank-fehler :', error);
      }
    }
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300);
  }
}
