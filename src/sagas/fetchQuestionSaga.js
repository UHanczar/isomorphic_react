import { takeEvery, put } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';

export default function* () {
  yield takeEvery('REQUEST_FETCH_QUESTION', handleFetchQuestion);
}

function* handleFetchQuestion({ questionId }) {
  const raw = yield fetch(`/api/question/${questionId}`);
  const json = yield raw.json();
  const question = json.items[0];

  yield put({ type: 'FETCHED_QUESTION', question });
}
