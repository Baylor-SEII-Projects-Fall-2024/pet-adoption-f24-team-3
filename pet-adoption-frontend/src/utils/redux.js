import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

function eventsReducer(state = [], action) {
    switch (action.type) {
        default:
            return state;
    }
}

function userReducer(state = { userId: null }, action) {
    switch (action.type) {
        case 'SET_USER_ID':
            return { ...state, userId: action.payload };
        default:
            return state;
    }
}

const reducers = combineReducers({
    events: eventsReducer,
    user: userReducer
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