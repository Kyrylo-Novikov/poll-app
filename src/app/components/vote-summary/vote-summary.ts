import { Component, computed, inject, input } from '@angular/core';
import { Survey } from '../../shared/interfaces/survey';
import { Supabase } from '../../shared/service/supabase';
import { QuestionData } from '../../shared/interfaces/survey';

@Component({
  selector: 'app-vote-summary',
  imports: [],
  templateUrl: './vote-summary.html',
  styleUrl: './vote-summary.scss',
})
export class VoteSummary {
  sb = inject(Supabase);
  /**
   * Letters represent the answers notation (A., B., C., ...)
   */
  letters = input<string[]>([]);
  /**
   * Loaded Survey from Supabase
   */
  surveyData = input<Survey | null>(null);
  /**
   * Shows what the user has currently selected
   */
  liveSelections = input<number[]>([]);

  /**
   * Prepares the survey data for the UI by calculating votes and percentages.
   * Updates automaticlly when data or user selections change.
   * @returns Array of questions with calculated vote sums and percentages
   */
  processedData = computed(() => {
    const data = this.surveyData();
    if (!data || !data.questions) return [];
    return data.questions.map((q) => {
      return this.addPercent(q);
    });
  });

  /**
   * Calculates persentage of votes for each answer.
   * @param q The data object for a single question
   * @returns The question object extended with the total vote sum and the percentage for the answer.
   */
  addPercent(q: QuestionData) {
    let result = this.addLiveVotes(q);
    let liveVoteSum = result.sum;
    const finalAnswers = result.answers.map((a) => {
      let percent = liveVoteSum > 0 ? ((100 * a.votes) / liveVoteSum).toFixed(0) : '0';
      return { ...a, percent };
    });
    return { ...q, totalVote: liveVoteSum, answers: finalAnswers };
  }

  /**
   * Calculates the current votes for a question. If the user has selected an answer, its vote count is incremented.Finally it , calculates the total sum of all votes
   * @param q The data object for a single question
   * @returns The question object extended with updated answer votes and the total sum.
   */
  addLiveVotes(q: QuestionData) {
    let localSum = 0;
    const updatetAnswer = q.answers.map((a) => {
      let currentVote = a.votes;
      if (this.liveSelections().includes(a.id)) {
        currentVote += 1;
      }
      localSum += currentVote;
      return { ...a, votes: currentVote };
    });
    return { answers: updatetAnswer, sum: localSum };
  }
}
