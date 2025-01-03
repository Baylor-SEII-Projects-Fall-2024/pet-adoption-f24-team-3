import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

function eventsReducer(state = [], action) {
    switch (action.type) {
        default:
            return state;
    }
}

export const setCurrentUserId = (userId) => ({
    type: 'SET_CURRENT_USER_ID',
    payload: userId,
});

export const setGriefEnginePreference = (preference) => ({
    type: 'SET_GRIEF_ENGINE_PREFERENCE',
    payload: preference,
});

function currentUserReducer(state = { currentUserId: null }, action) {
    switch (action.type) {
        case 'SET_CURRENT_USER_ID':
            return { ...state, currentUserId: action.payload };
        case 'SET_CURRENT_USER_FULL_NAME':
            return { ...state, currentUserFullName: action.payload };
        case 'SET_CURRENT_USER_TYPE':
            return { ...state, currentUserType: action.payload };
        default:
            return state;
    }
}

function griefEngineReducer(state = { griefEngineEnabled: false }, action) {
    switch (action.type) {
        case 'SET_GRIEF_ENGINE_PREFERENCE':
            return { ...state, griefEngineEnabled: action.payload };
        default:
            return state;
    }
}

const reducers = combineReducers({
    events: eventsReducer,
    currentUser: currentUserReducer,
    griefEngine: griefEngineReducer,
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

