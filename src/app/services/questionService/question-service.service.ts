import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionServiceService {


public questionArray = [
  {id: 1,
  question: 'What is the first thing you remember from your childhood?'},
  {id: 2,
  question:'What is your favorite holiday destination?'},
  {id: 3,
  question:'What was the name of your best friend in childhood?'},
  {id: 4,
  question:'What is your nick name?'},
  {id: 5,
  question:'Who did you sit next to in School?'},
  {id: 6,
  question:'What is your best Childhood Memory?'}
  ];

  currentQuestionIndex = 0;

  constructor() { }

  increaseQuestionIndex() {
    let questionArrayLen = this.questionArray.length - 1;
    console.log('what is current length', questionArrayLen);
    if(this.currentQuestionIndex === questionArrayLen) {
      this.currentQuestionIndex = 0;
    } else {
      this.currentQuestionIndex = this.currentQuestionIndex + 1;
    }
  }

  getCurrentQuestion() {
  	let currentQuestion = this.questionArray[this.currentQuestionIndex];
  	 console.log('currentQuestion' , currentQuestion);
  	return currentQuestion;

  }
}


