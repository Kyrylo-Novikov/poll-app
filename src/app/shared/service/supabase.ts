import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { Environment } from '../../environment';
import { Survey, HeaderSurvay, QuestionData, AnswersData } from '../interfaces/survey';

type tableName = 'answers' | 'question' | 'survey';
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
   * Increments the vote counter for the selected answer via supabase RPC(Remote Procedure Call)
   * Prevents race conditions during simultaneous updates.
   * @param id Id of the selected answer
   * @returns Gives the result of the database operation
   */
  async increment_vote(id: number) {
    return await this.supabaseClient.rpc('increment_vote', { answer_id: id });
  }

  /**
   * Submits survey metadata to the database.
   * On success , triggers the insertion of associated questions
   */
  async surveyToSupabaseService(headerData: HeaderSurvay) {
    const { data, error } = await this.supabaseClient
      .from('survey')
      .insert([headerData])
      .select('id')
      .single();
    if (data) return data.id;
    if (error) {
      return null;
    }
    return null;
  }

  /**
   * Submits questions metadata to the database.
   * On success , triggers the insertion of associated answers
   */
  async postQuestionsService(id_survey: number, questionData: any[]) {
    const singQ = questionData.map((q) => {
      return { question: q.question, survey_id: id_survey, multi_answers: q.multi_answers };
    });
    const { data, error } = await this.supabaseClient.from('question').insert(singQ).select('id');
    if (data) {
      for (let index = 0; index < data.length; index++) {
        const answerStrings: string[] = questionData[index].answers;
        await this.postAnswer(data[index].id, answerStrings);
      }
    }
  }

  /**
   * Submits answers metadata to the database.
   */
  async postAnswer(qID: number, currentAnswers: string[]) {
    for (let index = 0; index < currentAnswers.length; index++) {
      const element = currentAnswers[index];
      console.log(element);
    }
    const answerToInsert = currentAnswers.map((text: string) => {
      return { answer: text, question_id: qID, votes: 0 };
    });
    const { error } = await this.supabaseClient.from('answers').insert(answerToInsert).select('');
    if (error) console.error('Fehler beim Speichern der Antworten:', error.message);
  }

  async loadSurvay<T>(table: tableName, colum: string, id: number): Promise<T | null> {
    let { data, error } = await this.supabaseClient.from(table).select('*').eq(colum, id).single();
    if (error) {
      console.error(`Fehler beim laden von ${table}:`, error);
      return null;
    }
    return data as T;
  }

  async loadMany<T>(table: tableName, colum: string, id: number): Promise<T[] | null> {
    let { data, error } = await this.supabaseClient.from(table).select('*').eq(colum, id);
    if (error) {
      console.error(`Fehler beim laden von ${table}:`, error);
      return null;
    }
    return data as T[];
  }
}
