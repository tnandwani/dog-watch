import {
    GET_USER_LOGIN,
    GET_USER_DETAILS,
    SET_USER_BASICS,
    SET_USER_LOCATION,
    SET_USER_LOGIN
}
from "../constants";


// REDUCERS

const initialState = {
    firebaseUser: null,
    email: null,
    uid: null,
    dogName: 'Milo',
    gender: 'male',
    breed: 'german-shepherd',
    range: '5',
    privacy: 'public',
    location: null,
    lat: null,
    long: null,

}
export const user = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_DETAILS:
            return {
                ...state,
                firebaseUser: action.data,
                email: action.data.email,
                uid: action.data.uid
            }
            default:
                return state
    }
}
