import React from 'react';

import TagsList from './TagsList';

const QuestionListItem = ({ title, tags }) => (
  <div className='mb-3'>
    <h3>{title}</h3>
    <div className='mb-2'>
      <TagsList tags={tags} />
    </div>
  </div>
);

export default QuestionListItem;