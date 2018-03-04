import React from 'react';
import { connect } from 'react-redux';

import QuestionListItem from './QuestionListItem';

const QuestionsList = ({ questions }) => (
  <div>
    {
      questions && questions.length ? (
        <div>
          {questions.map(question => (
            <QuestionListItem key={question.question_id} {...question} />
          ))}
        </div>) : <div>Loading questions...</div>
      }
  </div>
);

const mapStateToProps = ({ questions }) => ({ questions });

export default connect(mapStateToProps)(QuestionsList);
