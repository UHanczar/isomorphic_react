import React from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import QuestionsList from './components/questionsList';
import QuestionDetail from './components/QuestionDetail';

const App = () => (
  <div>
    <h1><Link to='/'>Icomorphic react</Link></h1>
    <div>
      <Route exact path='/' render={() => <QuestionsList />} />
      <Route exact path='/question/:id' render={({ match }) => <QuestionDetail question_id={match.params.id} />} />
    </div>
  </div>
);

const mapStateToProps = (state, ownProps) => state;

export default connect(mapStateToProps)(App);
