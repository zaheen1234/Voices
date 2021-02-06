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
  question:'What is your full name, and was there any reason for calling you so?'},
  {id: 3,
  question:'What is the first thing you remember from your childhood?'},
  {id: 4,
  question:'What were the foods and flavours of your childhood?'},
  {id: 5,
  question:'What was your day to day life like growing up?'},
  {id: 6,
  question:'What was your childhood home like?'},
  {id: 7,
  question:'Where did you go to school and who was your favourite friend?'},
  {id: 8,
  question:'Did you like school, what was your favourite subject and why?'},
  {id: 9,
  question:'Did you have a favourite and least favourite teacher, if so, then why?'},
  {id: 10,
  question:'Who was your best friend when you were growing up, and what did you like about them?'},
  {id: 11,
  question:'Did you have a nickname as a child, or did your parents have a nickname for you?'},
  {id: 12,
  question:"How did you celebrate birthday’s in your household?"},
  {id: 13,
  question:'What memories do you have from family holidays?'},
  {id: 14,
  question:'Who was your hero/heroine when you were growing up?'},
  {id: 15,
  question:'Did you have pets when you were growing up?'},
  {id: 16,
  question:'What smells and noises remind you of your childhood, and why?'},
  {id: 17,
  question:'What was the most memorable and treasured gift of your childhood, and why?'},
  {id: 18,
  question:"What were your parents’ names?"},
  {id: 19,
  question:'What did your parents look like, do you look like either of them at all?'},
  {id: 20,
  question:'Do you have similar traits to either of your parents, which one do you think you are more like?'},
  {id: 21,
  question:'What did your parents do for a living?'},
  {id: 22,
  question:'Were your parents particularly close, how would you describe their relationship?'},
  {id: 23,
  question:'Do you know where they came from?'},
  {id: 24,
  question:'How did they meet? '},
  {id: 25,
  question:'What year and where did they married?'},
  {id: 26,
  question:'Do you know how old they were when they married?'},
  {id: 27,
  question:'What smells and noises do you associate with your parents?'},
  {id: 28,
  question:'What values did they instil in you, and do you still hold them?'},
  {id: 29,
  question:'How would you describe the relationship you had with your parents?'},
  {id: 30,
  question:'How many brothers and sisters did/do you have?'},
  {id: 31,
  question:'What are their names?'},
  {id: 32,
  question:'Were they younger or older?'},
  {id: 33,
  question:'Were you close to them growing up, did you get on better with one, if so, why?'},
  {id: 34,
  question:'Where are they now?'},
  {id: 35,
  question:'Did they have any children?'},
  {id: 36,
  question:'How would they describe you as a child do you think?'},
  {id: 37,
  question:'What was your relationship like with your individual siblings?'},
  {id: 38,
  question:'What did they teach you?'},
  {id: 39,
  question:'Where are your roots? Do you have a particularly strong feeling towards a place you have lived?'},
  {id: 40,
  question:'What was it like living in that Town/City/Country?'},
  {id: 41,
  question:'What was the weather like, were the seasons particularly memorable?'},
  {id: 42,
  question:'What sort of food was cooked in the home, was there any particular food you enjoyed?'},
  {id: 43,
  question:'Why did you end of staying/leaving that destination?'},
  {id: 44,
  question:'What do you love most about where you live now?'},
  {id: 45,
  question:'Where was your favourite holiday destination, and why?'},
  {id: 46,
  question:'When did you leave home?'},
  {id: 47,
  question:'Did you go to university or move away from home for work?'},
  {id: 48,
  question:'Did your circle of friends change and evolve during that time?'},
  {id: 49,
  question:'What was it like to live on your own for the first time?'},
  {id: 50,
  question:'Did you play sports or join societies or clubs during that time?'},
  {id: 51,
  question:'What were your interests/hobbies, and why?'},
  {id: 52,
  question:'Where did you meet your partner?'},
  {id: 53,
  question:'What attracted you to them?'},
  {id: 54,
  question:'What was your wedding day like, where was it held?'},
  {id: 55,
  question:'What lessons have you learnt from your relationships?'},
  {id: 56,
  question:'What is the secret to a good marriage?'},
  {id: 57,
  question:'What advice would you give to young couples?'},
  {id: 58,
  question:'What advise would you give your 18-year-old self?'},
  {id: 59,
  question:'What is the main driver or influence of your life?'},
  {id: 60,
  question:'How would you change the world we live in today?'},
  {id: 61,
  question:'Were you raised in a particular faith? If so, how did it influenced you?'},
  {id: 62,
  question:'If you were to run for public office, what position would you seek, and why?'}
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


