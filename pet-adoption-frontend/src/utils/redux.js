import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

function eventsReducer(state = [], action) {
    switch(action.type) {
        default:
            return state;
    }
}

const reducers = combineReducers({
    events: eventsReducer
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(thunk);
        },
        devTools: process.env.NODE_ENV !== 'production'
    });
};