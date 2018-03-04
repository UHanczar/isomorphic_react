import React from 'react';
import Markdown from 'react-markdown';
import { connect } from 'react-redux';

import TagsList from './TagsList';

const QuestionDetail = ({ title, body, answer_Count, tags }) => (
  <div>
    <h3 className='mb-2'>{title}</h3>
    {body ? (
      <div>
        <div className='mb-3'>
          <TagsList tags={tags} />
        </div>
        <Markdown source={body} />
        <div>{answer_Count} Answers</div>
      </div>) : (
        <div>
          <h4>Loading Question</h4>
        </div>
      )}
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  ...state.questions.find(({ question_id }) => question_id == ownProps.question_id)
});

export default connect(mapStateToProps)(QuestionDetail);
