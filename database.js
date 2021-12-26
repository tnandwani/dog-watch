// keys and consts
import {
    firebaseConfig
} from './constants';

import {
    v4 as uuidv4
} from 'uuid';

// REDUX
import store from "./redux/store";
import {
    changeStatus,
    saveDogCards,
    saveUserAccount,
    saveUserDetails,
    signInAccount,
    markLostDog,
    addDogtoUser
} from "./redux/slices/userSlice";
import {
    createDUID,
    saveOwner
} from "./redux/slices/rawDogSlice";
import {
    addTag,
    emptyTag,
    updateLoading,
} from "./redux/slices/exploreSlice";

// FIREBASE
import {
    initializeApp,
} from 'firebase/app';
initializeApp(firebaseConfig)

// auth 
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';

const auth = getAuth();

// firestore
import {
    getFirestore,
    collection,
    setDoc,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
    arrayUnion,
    arrayRemove,
    doc
} from 'firebase/firestore';
const db = getFirestore();

// storage
import {
    getDownloadURL,
    getStorage,
    uploadBytes,
    ref,
} from "firebase/storage";
import {
    saveDogPic
} from './redux/slices/rawDogSlice';
import { sendNotificationtoZone } from './notifcations/server';
const storage = getStorage();

// // analytics
// import { 
//     getAnalytics, 
//     logEvent,
//     setCurrentScreen    
// } from "firebase/analytics";

// const analytics = getAnalytics();


////////// APP START


// Listen for authentication state to change.
onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('We are authenticated now!');
        const uid = user.uid;
        const email = user.email;
        store.dispatch(signInAccount({
            email,
            uid
        }))
        getUserDetails(uid);
        // logEvent(analytics, 'EXPO SIGNED IN ;)');        // ...

    } else {
        store.dispatch(changeStatus('new'))

    }

    // Do other things
});



////////// USER FUNCTIONS 

export function signOutUser() {
    const {
        email,
        uid,
        name
    } = false;

    store.dispatch(signInAccount({
        email,
        uid
    }))

    signOut(auth);
    store.dispatch(changeStatus('new'))

}


export function createUserAccount(email, password) {


    // FIREBASE
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            // Get UID 
            const uid = userCredential.user.uid

            // Sign In
            createUserDoc(email, uid)
        })
        .catch((error) => {
            // analytics.logEvent("error: creating user");
            // analytics.logEvent(error.message);


            // ..
        });

}

export async function createUserDoc(email, uid) {

    // creatubg user doc

    try {
        const docRef = await setDoc(doc(db, "users", uid), {
            uid: uid,
            email: email,
            zone: "Unverified",
            dogs: []
        });
        console.log("Created User with ID: ", docRef.id);
        store.dispatch(saveUserAccount({
            email,
            uid
        }));

        store.dispatch(changeStatus('returning'))

    } catch (e) {
        console.error("Error adding document: ", e);
    }

}


export function signInUser(email, password) {

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            getUserDetails(user.uid);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // analytics.logEvent("error: signing in");

        });
}


export async function getUserDetails(uid) {

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let response = docSnap.data();
        store.dispatch(saveUserDetails(response));
        store.dispatch(changeStatus('returning'))

        // if (response.dogs.length > 0) {
        //     unwrapDogs(response.dogs)

        // } else {
        //     store.dispatch(changeStatus('returning'))

        // }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such user!");
    }


}

export function setScreenAnalytics(screenName) {
    console.log('state changed', screenName);
    // setCurrentScreen(analytics, screenName,{
    //     firebaseScreen: screenName
    // } )
}


////////// DOG FUNCTIONS 

export async function unwrapDogs(dogs) {

    const dogCards = store.getState().user.dogCards

    if (dogs) {
        if (dogCards.length != dogs.length) {
            dogs.map(dog => {
                const docRef = doc(db, "dogs", dog);
                getDoc(docRef).then((docSnap) => {
                        if (docSnap.exists()) {
                            let dogData = docSnap.data()
                            store.dispatch(saveDogCards(dogData));
                            store.dispatch(changeStatus('returning'))
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }

                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);

                    })

            })
        } else {
            console.log('diff sizes')
            store.dispatch(changeStatus('returning'))

        }


    }
    console.log('empty')
    store.dispatch(changeStatus('returning'))



}


export async function compareTask(lat, long) {
    console.log("starting compare");

    const dogsRef = collection(db, "dogs");

    // create bubble zone query
    const latQ = query(dogsRef, where("latitude", ">=", lat - 0.15), where("latitude", "<=", lat + 0.15));
    const longQ = query(dogsRef, where("longitude", ">=", long - 0.15), where("longitude", "<=", long + 0.15));

    const latSnapshot = await getDocs(latQ);
    const longSnapshot = await getDocs(longQ);

    let latArray = [];
    let longArray = [];

    latSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        latArray.push(doc.data())
    });

    longSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        longArray.push(doc.data())
    });


    const bubbleArray = latArray.filter(a => longArray.some(b => a.duid === b.duid));

    console.log("return bubble", bubbleArray);
    store.dispatch(updateLoading(false));

    return bubbleArray;
}

export async function getHomies(lat, long) {

    console.log("getting homies in", );
    // analytics.logEvent('getting tags');


    var bubbleTask = compareTask(lat, long);

    bubbleTask.then((response) => {

        console.log("response from compare: ")
        console.log(response);

        response.forEach((dog) => {
            store.dispatch(addTag(dog))
        })

        // if (bubbleArray.length < 1) {
        //     store.dispatch(emptyTag())
        // } else {
        //     bubbleArray.forEach((dog) => {
        //         store.dispatch(addTag(dog))
        //     })
        // }

    })

}



export async function startPublish(imageURI, navigation) {

    // get owner
    const uid = store.getState().user.uid
    store.dispatch(saveOwner(uid))

    // create dog duid 
    const duid = uuidv4();

    // add duid to redux
    store.dispatch(createDUID(duid));

    // convert image to blob
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", imageURI, true);
        xhr.send(null);
    });

    // upload dog photo with duid 
    const storageRef = ref(storage, 'profileImages/' + duid + '.jpg');
    uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');

        // get download URL
        getDownloadURL(snapshot.ref).then((PURI) => {
            console.log('File available at', PURI);

            // add url to redux
            store.dispatch(saveDogPic(PURI))

            const readyDog = store.getState().rawDog
            // upload readyDog to dogs/

            setDoc(doc(db, "dogs", duid), readyDog)
                .then((resp) => {

                    // add readyDog to user.dogs redux 
                    store.dispatch(addDogtoUser(readyDog))

                    // get list with new dog
                    const newList = store.getState().user.dogs

                    // post new dog list + update coords
                    const userRef = doc(db, "users", uid);
                    updateDoc(userRef, {
                        dogs: newList,
                        zone: readyDog.zone,
                        longitude: readyDog.longitude,
                        latitude: readyDog.latitude,
                    }).then((resp) => {
                        console.log("finished creating dog")
                        navigation.navigate('Profile')

                    })
                })
                .catch((err) => {

                })

        });
    }).catch((error) => {
        console.log(error)
    })

}


export function markLost(dog, EContact, index) {

    // mark in DOGS
    const dogRef = doc(db, "dogs", dog.duid);
    updateDoc(dogRef, {
        lost: true,
        contact: EContact
    }).then(() => {
        console.log("marked public dog as lost");
    });


    // send changes to redux 
    store.dispatch(markLostDog({
        index,
        EContact
    }))

    // const newList = get old list of user.dogs
    const newDogList = store.getState().user.dogs
    const uid = store.getState().user.uid

    console.log("new list is: ", newDogList)

    // post newList
    // mark in DOGS
    const usersRef = doc(db, "users", uid);
    updateDoc(usersRef, {
        dogs: newDogList,
    }).then(() => {
        console.log("marked personal dog as lost");
    });

    const zone = store.getState().user.zone


    // get push Tokens
    const zoneRef = doc(db, "zones", zone);
    getDoc(zoneRef).then((docSnap) => {
            if (docSnap.exists()) {
                let members = docSnap.data().members
                console.log("members:", members);
                // send out push notifications 
                sendNotificationtoZone(dog, "please call" + EContact , members)
            } else {
                // doc.data() will be undefined in this case

            }

        })
        .catch((error) => {
            console.log("Error getting document:", error);

        })


}


export async function updateFireLocation(location) {

    // get user details
    const uid = store.getState().user.uid
    const pushToken = store.getState().explore.pushToken
    console.log("pushToken", pushToken)

    const userRef = doc(db, "users", uid);
    updateDoc(userRef, {
        zone: location.zone,
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        pushToken: pushToken
    }).then(() => {
        console.log("finished creating dog")

    })

    // add to zones

    const ref = doc(db, "zones", location.zone);
    const zoneRef = await getDoc(ref);

    if (zoneRef.exists()) {
        updateDoc(zoneRef, {
            members: arrayUnion(pushToken)

        }).then((resp) => {
            console.log(resp)

        }).catch((err) => {
            console.log(err)

        })
    } else {
        // doc.data() will be undefined in this case
        console.log("FIRST TIME ZONER");
        setDoc(doc(db, "zones", location.zone), {
            members: [pushToken]
        });
    }


}
