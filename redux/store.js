import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import {userSlice} from './slices/userSlice'

// REDUX
const rootReducer = combineReducers({userSlice});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer, 
composeEnhancer(applyMiddleware(thunk))
);
