import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionServiceService {

  currentQuestionIndex = 0;

public questionArray = [
  {id: 1,
  question: 'Where were you born?'},
  {id: 2,
  question:'What were the foods and flavours of your childhood? '},
  {id: 3,
  question:'Who was your hero / heroine when you were growing up?'},
  {id: 4,
  question:'What was the most memorable and treasured gift of your childhood and why? '},
  {id: 5,
  question:"What were your parents’ names?"},
  {id: 6,
  question:'What did your parents do for a living?'},
  {id: 7,
    question:'Do you know where they came from?'},
  {id: 8,
  question:'What smells and noises do you associate with your parents?'},
  {id: 9,
  question:'How many brothers and sisters did / do you have?'},
  {id: 10,
  question:'Where you close to them growing up, did you get on better with one, if so why?'},
  {id: 11,
  question:'What did they teach you?'},
  {id: 12,
  question:'Where are your roots, do you have a particularly strong feeling towards a place you have lived?'},
  {id: 13,
  question:"What sort of food was cooked in the home, were there any particular food you enjoyed?"},
  {id: 14,
  question:'Where was your favourite holiday destination and why?'},
  {id: 15,
  question:'When did you leave home?'},
  {id: 16,
  question:'Did your circle of friends change and evolve during that time?'},
  {id: 17,
  question:'Where did you meet your partner?'},
  {id: 18,
  question:'What is the secret to a good marriage?'},
  {id: 19,
  question:"What advise would you give your 18 year old self?"},
  {id: 20,
  question:'Were you raised in a particular faith? If so how did it influence you?'}
  ];


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


