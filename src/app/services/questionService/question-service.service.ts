import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionServiceService {


  currentQuestionIndex = 0;

  questionsList = [
    {
      id: 1,
      question: 'Where were you born and what is your full name, does it have any significant meaning?',
      isAnswered: false
    },
    {
      id: 2,
      question: 'What were the foods and flavours of your childhood?',
      isAnswered: false
    },
    {
      id: 3,
      question: 'Where did you go to school and who was your favourite friend and why?',
      isAnswered: false
    },
    {
      id: 4,
      question: 'Did you have a nickname as a child and did your parents have a nickname for you?',
      isAnswered: false
    },
    {
      id: 5,
      question: "Who was your hero/heroine when you were growing up, what did you liked about them?",
      isAnswered: false
    },
    {
      id: 6,
      question: 'What was the most memorable and treasured gift of your childhood and why?',
      isAnswered: false
    },
    {
      id: 7,
      question: 'What did your parents look like, do you look like either of them at all?',
      isAnswered: false
    },
    {
      id: 8,
      question: 'How many brothers and sisters did/do you have and what were their names?',
      isAnswered: false
    },
    {
      id: 9,
      question: 'Where are your roots, do you have a particularly strong feeling towards a house, town or country you have lived and why?',
      isAnswered: false
    },
    {
      id: 10,
      question: 'What sort of food was cooked in the home, were there any particular foods you enjoyed?',
      isAnswered: false
    },
    {
      id: 11,
      question: 'Where was your favourite holiday destination and why?',
      isAnswered: false
    },
    {
      id: 12,
      question: 'When did you leave home and where did you go?',
      isAnswered: false
    },
    {
      id: 13,
      question: "What were your interests/hobbies and why?",
      isAnswered: false
    },
    {
      id: 14,
      question: 'Where did you meet your partner?',
      isAnswered: false
    },
    {
      id: 15,
      question: 'What is the secret to a good marriage?',
      isAnswered: false
    },
    {
      id: 16,
      question: 'What advice would you give to young couples?',
      isAnswered: false
    },
    {
      id: 17,
      question: 'What advise would you give your 18-year-old self?',
      isAnswered: false
    },
    {
      id: 18,
      question: 'What is the main driver or influence if your life?',
      isAnswered: false
    },
    {
      id: 19,
      question: "Were you raised in a particular faith? If so, how did it influenced you?",
      isAnswered: false
    },
    {
      id: 20,
      question: 'If you were to run for public office, what position would you seek and why?',
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


