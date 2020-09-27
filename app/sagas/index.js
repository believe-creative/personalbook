import { takeLatest, takeEvery, put, call, fork } from "redux-saga/effects";
import { api } from "../services";
import * as actions from "../actions";

const { getItem,getItems,askPermission } = actions;

//reusable fetch subroutine.
function* fetchEntity(entity, apiFn, id, url) {
  const { response, error } = yield call(apiFn, url || id);
  if (response) {
    yield put(entity.success(id, response));
  } else {
    yield put(entity.failure(id, error));
  }
}

export const fetchAskPermission = fetchEntity.bind(
  null,
  askPermission,
  api.askPermission
);
export const fetchGetItems = fetchEntity.bind(
  null,
  getItems,
  api.getItems
);


function* loadAskPermission(action) {
  yield call(fetchAskPermission, action.data);
}
function* loadGetItems(action) {
  yield call(fetchGetItems, action.data);
}


function* watchLoadAskPermission() {
  yield takeLatest(actions.ASKPERMISSION.REQUEST, loadAskPermission);
}
function* watchLoadGetItems() {
  yield takeLatest(actions.GETITEMS.REQUEST, loadGetItems);
}



export default function* () {
  yield fork(watchLoadAskPermission);
  yield fork(watchLoadGetItems);
}
