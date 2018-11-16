/* global fetch SUBSTRABAC_USER SUBSTRABAC_PASSWORD */

import {
    takeLatest, takeEvery, all, select, call,
} from 'redux-saga/effects';


import btoa from 'btoa';
import {saveAs} from 'file-saver';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {fetchListSaga, fetchPersistentSaga, fetchItemSaga} from '../../../common/sagas/index';

function* fetchList(request) {
    const state = yield select();

    const f = () => fetchListApi(state.location.query);

    yield call(fetchListSaga(actions, f), request);
}

// function* fetchDetail({payload}) {
//     const state = yield select();
//
//     if (!state.model.item.results.find(o => o.pkhash === payload)) {
//         yield put(actions.item.request({id: payload.endModel.hash, get_parameters: {}}));
//     }
// }

function* fetchItemFileSaga({payload: {url}}) {
    let status;
    let filename;

    const basic = btoa(`${SUBSTRABAC_USER}:${SUBSTRABAC_PASSWORD}`);

    yield fetch(url, {
        headers: {
            ...(process.env.NODE_ENV === 'production' ? {Authorization: `Basic ${basic}`} : {}),
            Accept: 'application/json;version=0.0',
        },
        mode: 'cors',
    }).then((response) => {
        status = response.status;
        if (!response.ok) {
            return response.text().then(result => Promise.reject(new Error(result)));
        }

        filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

        return response.blob();
    }).then((res) => {
        saveAs(res, filename);
    }, error => ({error, status}));
}


/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        // takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga(actions, fetchItemApi)),

        takeEvery(actionTypes.item.file.REQUEST, fetchItemFileSaga),
    ]);
};


export default sagas;
