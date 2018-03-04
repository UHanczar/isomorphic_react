import unionWith from 'lodash/unionWith';

export const questions = (state = [], {type, questions, question}) => {
  const questionEquality = (a = {}, b = {}) => a.question_id == b.question_id;

  if (type === 'FETCHED_QUESTIONS') {
    state = unionWith(state, questions, questionEquality);
  }

  if (type === 'FETCHED_QUESTION') {
    state = unionWith(state, [question], questionEquality);
  }

  return state;
};
