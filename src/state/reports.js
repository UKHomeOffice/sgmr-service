import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createRoutine } from 'redux-saga-routines';

import Auth from '@lib/Auth';
import { USER_VOYAGE_REPORT_URL } from '@constants/ApiConstants';
import { redirectToSignIn } from './redirectToSignIn';

// ROUTINE
export const fetchReportsRoutine = createRoutine('FETCH_REPORTS');

// Set initial states to false/null
export const initialState = Object.freeze({
  isLoading: false,
  hasLoaded: false,
  list: [],
  error: null,
});

// REDUCERS
export const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    // When fetchReports is triggered, it is now loading (isLoading: true)
    case fetchReportsRoutine.TRIGGER:
      return { ...state, isLoading: true, hasLoaded: false };
    // When fetchreports has finished, update loading states and data
    case fetchReportsRoutine.SUCCESS:
      return {
        ...state, isLoading: false, hasLoaded: true, list: action.payload,
      };
    // When fetchreports returns an error update error details
    case fetchReportsRoutine.FAILURE:
      return {
        ...state, isLoading: false, hasLoaded: false, error: action.payload,
      };
    default: {
      return state;
    }
  }
};

// FETCH
const fetchReportsRequest = async () => {
  const data = await axios.get(`${USER_VOYAGE_REPORT_URL}?pagnation=false`, {
    headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
  });
  return data;
};

// Worker Saga: will be fired on fetchReportsRequest action
export function* fetchReports() {
  try {
    const { data } = yield call(fetchReportsRequest);
    // if successful then the reportsReducer runs the SUCCESS outcome
    yield put(fetchReportsRoutine.success(data));
  } catch (error) {
    // if failed then the reportsReducer runs the FAILURE outcome
    yield put(fetchReportsRoutine.failure(error));
    // and redirect the user to signIn as GET errors are usually a result of bad/expired token
    yield call(redirectToSignIn, error);
  }
}

// Watch for the fetchReportssRoutine to be triggered, and the reportsReducer will run the TRIGGER outcome
export function* watchReports() {
  // and runs fetchReports
  yield takeLatest(fetchReportsRoutine.TRIGGER, fetchReports);
}