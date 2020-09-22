import {createAction} from 'redux-actions';
import createRequestActionTypes from '../../utils/createRequestActionTypes';

const prefix = 'SUBSTRA__OBJECTIVE';

export const actionTypes = {
    list: {
        ...createRequestActionTypes(`${prefix}_LIST`),
        SELECTED: `${prefix}_LIST_SELECTED`,
        UNSELECT: `${prefix}_LIST_UNSELECT`,
    },

    item: {
        ...createRequestActionTypes(`${prefix}_ITEM`),
        description: createRequestActionTypes(`${prefix}_ITEM_DESCRIPTION`),
        leaderboard: createRequestActionTypes(`${prefix}_ITEM_LEADERBOARD`),
        download: createRequestActionTypes(`${prefix}_ITEM_DOWNLOAD`),
        tabIndex: {
            SET: `${prefix}_TAB_INDEX`,
        },
    },

    persistent: createRequestActionTypes(`${prefix}_PERSISTENT`),

    order: {
        SET: `${prefix}_ORDER`,
    },
};

export default {
    list: {
        request: createAction(actionTypes.list.REQUEST),
        success: createAction(actionTypes.list.SUCCESS),
        failure: createAction(actionTypes.list.FAILURE),
        selected: createAction(actionTypes.list.SELECTED),
        unselect: createAction(actionTypes.list.UNSELECT),
    },

    item: {
        request: createAction(actionTypes.item.REQUEST),
        success: createAction(actionTypes.item.SUCCESS),
        failure: createAction(actionTypes.item.FAILURE),
        description: {
            request: createAction(actionTypes.item.description.REQUEST),
            success: createAction(actionTypes.item.description.SUCCESS),
            failure: createAction(actionTypes.item.description.FAILURE),
        },
        download: {
            request: createAction(actionTypes.item.download.REQUEST),
            success: createAction(actionTypes.item.download.SUCCESS),
            failure: createAction(actionTypes.item.download.FAILURE),
        },
        leaderboard: {
            request: createAction(actionTypes.item.leaderboard.REQUEST),
            success: createAction(actionTypes.item.leaderboard.SUCCESS),
            failure: createAction(actionTypes.item.leaderboard.FAILURE),
        },
        tabIndex: {
            set: createAction(actionTypes.item.tabIndex.SET),
        },
    },

    persistent: {
        request: createAction(actionTypes.persistent.REQUEST),
        success: createAction(actionTypes.persistent.SUCCESS),
        failure: createAction(actionTypes.persistent.FAILURE),
    },

    order: {
        set: createAction(actionTypes.order.SET),
    },
};
