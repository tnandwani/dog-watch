
const initialUserState = {
    firebaseUser: null,
    email: null,
    uid: null,
    dogName: 'Milo',
    gender: 'male',
    age: '5',
    breed: 'german-shepherd',
    range: '5',
    privacy: 'public',
    location: null,
    lat: null,
    long: null,

}
export function userReducer(state = initialUserState, action){
    switch (action.type) {
            default:
                return state
    }
}
