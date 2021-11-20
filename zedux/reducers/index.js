import { combineReducers } from "redux";
import {user} from './user'

// REDUCERS

const Reducers = combineReducers({
    userState: user
})

export default Reducers
