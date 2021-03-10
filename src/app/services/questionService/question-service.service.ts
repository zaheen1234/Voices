import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionServiceService {


  currentQuestionIndex = 0;

  questionsList = [
    {
      id: 1,
      question: 'Where were you born?',
      isAnswered: false
    },
    {
      id: 2,
      question: 'What were the foods and flavours of your childhood? ',
      isAnswered: false
    },
    {
      id: 3,
      question: 'Who was your hero / heroine when you were growing up?',
      isAnswered: false
    },
    {
      id: 4,
      question: 'What was the most memorable and treasured gift of your childhood and why? ',
      isAnswered: false
    },
    {
      id: 5,
      question: "What were your parents’ names?",
      isAnswered: false
    },
    {
      id: 6,
      question: 'What did your parents do for a living?',
      isAnswered: false
    },
    {
      id: 7,
      question: 'Do you know where they came from?',
      isAnswered: false
    },
    {
      id: 8,
      question: 'What smells and noises do you associate with your parents?',
      isAnswered: false
    },
    {
      id: 9,
      question: 'How many brothers and sisters did / do you have?',
      isAnswered: false
    },
    {
      id: 10,
      question: 'Where you close to them growing up, did you get on better with one, if so why?',
      isAnswered: false
    },
    {
      id: 11,
      question: 'What did they teach you?',
      isAnswered: false
    },
    {
      id: 12,
      question: 'Where are your roots, do you have a particularly strong feeling towards a place you have lived?',
      isAnswered: false
    },
    {
      id: 13,
      question: "What sort of food was cooked in the home, were there any particular food you enjoyed?",
      isAnswered: false
    },
    {
      id: 14,
      question: 'Where was your favourite holiday destination and why?',
      isAnswered: false
    },
    {
      id: 15,
      question: 'When did you leave home?',
      isAnswered: false
    },
    {
      id: 16,
      question: 'Did your circle of friends change and evolve during that time?',
      isAnswered: false
    },
    {
      id: 17,
      question: 'Where did you meet your partner?',
      isAnswered: false
    },
    {
      id: 18,
      question: 'What is the secret to a good marriage?',
      isAnswered: false
    },
    {
      id: 19,
      question: "What advise would you give your 18 year old self?",
      isAnswered: false
    },
    {
      id: 20,
      question: 'Were you raised in a particular faith? If so how did it influence you?',
      isAnswered: false
    }
  ];

  fallbackReturn = [{
    id: 1000,
      question: "You have answered all the Questions!!!",
      isAnswered: false
  }];

  currentPermissionStatus: any;

  constructor() { }

  startQuestionService() {
    const ifQuestionAlreadyInLocalStorage = localStorage.getItem('questionsList');
    if (ifQuestionAlreadyInLocalStorage != null) {
      let abc = ifQuestionAlreadyInLocalStorage;
      this.questionsList = JSON.parse(abc);
      return this.questionsList;
    } else {

      localStorage.setItem('questionsList', JSON.stringify(this.questionsList));
      let xyz = localStorage.getItem('questionsList');
      this.questionsList = JSON.parse(xyz);
      return this.questionsList;
    }

  }

  public getPermissionStatus() {
    const checkNavSetting = localStorage.getItem('permission');
    if (checkNavSetting != null) {
      return this.currentPermissionStatus = checkNavSetting;
    } else {
      this.setPermissionStatus(false);
      return 'false';
    }

  }

  public setPermissionStatus(val) {

    localStorage.setItem('permission', val);
    this.currentPermissionStatus = localStorage.getItem('permission');
  }

   
  increaseQuestionIndex() {
    let questionArrayLen = this.questionsList.length - 1;
    console.log('what is current length', questionArrayLen);
    if (this.currentQuestionIndex === questionArrayLen) {
      this.currentQuestionIndex = 0;
    } else {
      this.currentQuestionIndex = this.currentQuestionIndex + 1;
    }
  }

  decreaseQuestionIndex() {
    let questionArrayLen = this.questionsList.length - 1;
    console.log('what is current length', questionArrayLen);
    if (this.currentQuestionIndex === questionArrayLen) {
      this.currentQuestionIndex = questionArrayLen;
    } else {
      this.currentQuestionIndex = this.currentQuestionIndex - 1;
    }
  }

  getCurrentQuestion() {

   for(let i = this.currentQuestionIndex; i < this.questionsList.length; i++) {
     if (this.questionsList[i].isAnswered) {
       // do nothing
     } else {
       this.currentQuestionIndex = i;
       return this.questionsList[this.currentQuestionIndex];
     }
   }
   return this.fallbackReturn[0];

    // return;
    // let currentQuestion = this.questionsList[this.currentQuestionIndex];
    // console.log('currentQuestion', currentQuestion);
    // return currentQuestion;

  }
}


