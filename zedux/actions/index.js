import firebase from "firebase";
import { GET_USER_DETAILS, SET_USER_BASICS } from "../constants";

// ACTIONS

export function fetchUser() {
    console.log("starting fetch");

    // login user
    const user = firebase.auth().currentUser;

    if (user != null){
        return ((dispatch) => {
            console.log('loggin in user');
            dispatch({
                type: GET_USER_DETAILS,
                data: user
            });
        })
    }
    else {
        console.log('LOGIN ERROR');
    }

 
}

export function getUserDetails(){
    console.log("gettinng user details ");

    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    console.log(snapshot.data())
                    dispatch({
                        type: GET_USER_DETAILS,
                        data: snapshot.data()
                    });
                }
                else {
                    console.log('Account incomplete');
                }
            })
    })
}
