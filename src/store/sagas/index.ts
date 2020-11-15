import { all, spawn } from 'redux-saga/effects'

export function* rootSaga(): Generator {
  yield all([].map(spawn))
}
export default rootSaga
