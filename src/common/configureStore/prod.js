import {connectRoutes} from 'redux-first-router';
import {applyMiddleware, compose} from 'redux';
import {createInjectSagasStore, sagaMiddleware} from 'redux-sagas-injector';

import options from './options';
import rootReducer from '../../app/reducer';
import rootSaga from '../../app/sagas';
import routes from '../../app/routesMap';

const configureStore = (initialState, initialEntries) => {
    const {
        reducer, middleware, enhancer, thunk, initialDispatch,
    } = connectRoutes(routes, {
        initialDispatch: false,
        ...options,
        ...initialEntries,
    }); // yes, 5 redux aspects

    const enhancers = [
        // create the saga middleware
        applyMiddleware(sagaMiddleware, middleware),
    ];

    const reducers = {...rootReducer, location: reducer};
    const store = createInjectSagasStore({rootSaga}, reducers, initialState, compose(enhancer, ...enhancers));
    initialDispatch();

    return {store, thunk};
};

export default configureStore;
