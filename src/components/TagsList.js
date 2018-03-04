import React from 'react';

const Tags = ({ tags }) => {
  return (
    <div>{tags.map(tag => <code key={tag}>{tag}, </code>)}</div>
  );
}

export default Tags;
