/* globals fetch SUBSTRABACKEND_AUTH_ENABLED */

import {
    all, call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';

import {saveAs} from 'file-saver';

import actions, {actionTypes} from '../actions';
import {fetchItemApi, fetchListApi} from '../api';
import {
    fetchItemSaga, fetchListSaga, fetchPersistentSaga, setOrderSaga,
} from '../../../common/sagas';
import {basic, fetchRaw} from '../../../../entities/fetchEntities';
import {getItem} from '../../../common/selector';


function* fetchList(request) {
    const state = yield select();

    const f = () => fetchListApi(state.location.query);

    yield call(fetchListSaga(actions, f), request);
}

function* manageTabs(tabIndex) {
    const state = yield select();
    const item = getItem(state, 'dataset');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({ pkhash: item.key, url: item.description.storageAddress }));
        }
        else if (item.opener && !item.opener.content && tabIndex === 1) {
            yield put(actions.item.opener.request({pkhash: item.key, url: item.opener.storageAddress}));
        }
    }
}

function* fetchItem({payload}) {
    yield call(fetchItemSaga(actions, fetchItemApi), {
        payload: {
            id: payload.key,
            get_parameters: {},
        },
    });
}

function* fetchDetail(request) {
    const state = yield select();

    // fetch current tab content if needed
    yield manageTabs(state.dataset.item.tabIndex);

    const exists = state.dataset.item.results.find(o => o.pkhash === request.payload.key);
    if (!exists) {
        yield put(actions.item.request(request.payload));
    }
}

function* setTabIndexSaga({payload}) {
    yield manageTabs(payload);
}

function* fetchItemDescriptionSaga({payload: {pkhash, url}}) {
    const {res, status} = yield call(fetchRaw, url);

    if (res && status === 200) {
        yield put(actions.item.description.success({pkhash, desc: res}));
    }
}

function* fetchItemOpenerSaga({ payload: {pkhash, url} }) {
    const {res, status} = yield call(fetchRaw, url);
    if (res && status === 200) {
        yield put(actions.item.opener.success({pkhash, openerContent: res}));
    }
}

function* downloadItemSaga({payload: {url}}) {
    let status;
    let filename;

    yield fetch(url, {
        headers: {
            ...(SUBSTRABACKEND_AUTH_ENABLED ? {Authorization: `Basic ${basic()}`} : {}),
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
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItem),

        takeLatest(actionTypes.item.description.REQUEST, fetchItemDescriptionSaga),
        takeLatest(actionTypes.item.opener.REQUEST, fetchItemOpenerSaga),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSaga),

        takeLatest(actionTypes.order.SET, setOrderSaga),
        takeLatest(actionTypes.item.tabIndex.SET, setTabIndexSaga),
    ]);
};


export default sagas;
