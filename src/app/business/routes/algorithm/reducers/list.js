import {actionTypes} from '../actions';

const initialState = {
    init: false,
    loading: false,
    error: null,
    results: [],
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.list.REQUEST:
            return {
                ...state,
                error: false,
                loading: true,
            };

        case actionTypes.list.SUCCESS:
            return {
                ...state,
                init: true,
                results: payload,
                error: false,
                loading: false,
            };

        case actionTypes.list.FAILURE:
            return {
                ...state,
                init: true,
                error: payload,
                loading: false,
            };
        default:
            return state;
    }
};
