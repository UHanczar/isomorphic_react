import React from 'react';
import { Link } from 'react-router-dom';

import TagsList from './TagsList';

const QuestionListItem = ({ title, tags, question_id }) => (
  <div className='mb-3'>
    <h3>{title}</h3>
    <div className='mb-2'>
      <TagsList tags={tags} />
    </div>
    <div>
      <Link to={`/question/${question_id}`}>
        <button className='btn'>Go to question</button>
      </Link>
    </div>
  </div>
);

export default QuestionListItem;