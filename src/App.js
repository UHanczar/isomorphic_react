import React from 'react';
import { connect } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';

import QuestionsList from './components/questionsList';

const App = () => (
  <div>
    <h1>Icomorphic react</h1>
    <div>
      <QuestionsList />
    </div>
  </div>
);

const mapStateToProps = (state, ownProps) => state;

export default connect(mapStateToProps)(App);
