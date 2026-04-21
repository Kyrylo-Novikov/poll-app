import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { Environment } from '../../environment';
import { HeaderSurvayInterface } from '../interfaces/header-survay-interface';
import { QuestionDataIF } from '../interfaces/question-data-if';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public supabaseClient: SupabaseClient<Database>;

  constructor() {
    this.supabaseClient = createClient<Database>(
      Environment.SUPABASE_URL,
      Environment.SUPABASE_ANON_KEY,
    );
  }

  /**
   * Submits survey metadata to the database.
   * On success , triggers the insertion of associated questions
   */

  async surveyToSupabaseService(headerData: HeaderSurvayInterface) {
    const { data, error } = await this.supabaseClient
      .from('survey')
      .insert([headerData])
      .select('id')
      .single();
    if (error) {
      return null;
    }
    if (data) return data.id;
    return null;
  }

  /**
   * Submits questions metadata to the database.
   * On success , triggers the insertion of associated answers
   */
  async postQuestionsService(id_survey: number, questionData: QuestionDataIF[]) {
    const singQ = questionData.map((q: QuestionDataIF) => {
      return { question: q.question, survey_id: id_survey, multi_answers: q.multi_answers };
    });
    const { data, error } = await this.supabaseClient.from('question').insert(singQ).select('id');
    if (data) {
      for (let index = 0; index < data.length; index++) {
        await this.postAnswer(data[index].id, questionData[index].answers);
      }
    }
  }

  /**
   * Submits answers metadata to the database.
   */
  async postAnswer(qID: number, currentAnswers: string[]) {
    const answerToInsert = currentAnswers.map((a) => {
      return { answer: a, question_id: qID };
    });
    const { error } = await this.supabaseClient.from('answers').insert(answerToInsert).select('id');
    if (error) console.error('Fehler beim Speichern der Antworten:', error.message);
  }
}
