// keys and consts
import {
    firebaseConfig
} from './constants';

import 'react-native-get-random-values';
import {
    v4 as uuidv4
} from 'uuid';

import * as SMS from 'expo-sms';


// REDUX
import store from "./redux/store";
import {
    changeStatus,
    saveDogCards,
    saveUserDetails,
    signInAccount,
    markLostDog,
    changeDogInUser,
    removeDogfromUser
} from "./redux/slices/userSlice";
import {
    createDUID,
    saveOwner
} from "./redux/slices/rawDogSlice";
import {
    addLocalAlert,
    addTag,
    removeTag,
    foundZoneDog,
    saveZoneData,
    updateDogView,
    updateLoading,
} from "./redux/slices/exploreSlice";

// FIREBASE
import {
    initializeApp,
} from 'firebase/app';


// auth 
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';

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
    increment,
    deleteDoc,
    arrayRemove,
    doc
} from 'firebase/firestore';

import {
    getDownloadURL,
    getStorage,
    uploadBytes,
    ref,
} from "firebase/storage";
import {
    saveDogPic
} from './redux/slices/rawDogSlice';
import {
    sendNotificationtoZone
} from './notifcations/server';

import * as Analytics from 'expo-firebase-analytics';
import {
    updateCreateAlert,
    updateDogProgress,
    updateLoginAlert,
    updateShowDogModal
}
from './redux/slices/interfaceSlice';
////////// APP START

initializeApp(firebaseConfig)
const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

onAuthStateChanged(auth, user => {
    if (user != null) {
        const uid = user.uid;
        const email = user.email;
        store.dispatch(signInAccount({
            email,
            uid
        }))
        getUserDetails(uid);
        Analytics.logEvent('Logged_in')

    } else {
        store.dispatch(changeStatus('new'))
    }

});


//////////////////// UI FUNCTIONS 
export function setScreenAnalytics(screenName) {
    Analytics.logEvent('Opened_' + screenName)

}

export function viewDog(dog) {
    //send dog to redux

    store.dispatch(updateDogView(dog))
    // show modal
    store.dispatch(updateShowDogModal(true))

}

//////////////////// USER AUTH FUNCTIONS 

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

export function createUserAccount(email, password, confirm) {


    if (password === confirm) {
        // FIREBASE
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                // Get UID 
                const uid = userCredential.user.uid
                Analytics.logEvent('Create_user_start')

                // Sign In
                createUserDoc(email, uid)
            })
            .catch((error) => {
                // analytics.logEvent("error: creating user");
                // analytics.logEvent(error.message);
                console.log(error.message);
                Analytics.logEvent('fire_error', {
                    message: error.message
                })
                store.dispatch(updateCreateAlert(error.message))


                // ..
            });
    } else {
        store.dispatch(updateCreateAlert("Passwords do not match"))

    }



}

export async function createUserDoc(email, uid) {

    // add user to redux
    store.dispatch(signInAccount({
        email,
        uid
    }));
    // create user doc

    try {
        const docRef = await setDoc(doc(db, "users", uid), {
            uid: uid,
            email: email,
            zone: "Unverified",
            dogs: [],
            reported: 0
        });

        store.dispatch(changeStatus('returning'))
        Analytics.logEvent('Create_user_finish')


    } catch (e) {
        console.error("Error adding document: ", e);
        Analytics.logEvent('fire_error', {
            message: e.message
        })
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

            console.log(error.message);
            Analytics.logEvent('fire_error', {
                message: error.message
            })
            store.dispatch(updateLoginAlert(error.message))

        });
}

export async function getUserDetails(uid) {

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let response = docSnap.data();
        store.dispatch(saveUserDetails(response));
        store.dispatch(changeStatus('returning'))

    } else {
        console.log("No such user!");
    }


}

export function reportUser(reportedDog) {

    const userRef = doc(db, "users", reportedDog.owner);
    const dogRef = doc(db, "dogs", reportedDog.duid);

    // report user
    updateDoc(userRef, {
        reported: increment(1)
    }).then((result) => {
        // remove dog from local explore
        updateDoc(dogRef, {
            reported: increment(1)
        }).then((result) => {
            store.dispatch(removeTag(reportedDog.duid));

        }).catch((err) => {
            Analytics.logEvent('fire_error', {
                message: err.message
            })
        });

    }).catch((err) => {
        Analytics.logEvent('fire_error', {
            message: err.message
        })
    });


}

//////////////////// ZONE FUNCTIONS 
export async function compareTask(lat, long) {
    console.log("getting lat long comparison");

    const dogsRef = collection(db, "dogs");

    // create bubble zone query
    const latQ = query(dogsRef, where("latitude", ">=", lat - 0.15), where("latitude", "<=", lat + 0.15));
    const longQ = query(dogsRef, where("longitude", ">=", long - 0.15), where("longitude", "<=", long + 0.15));
    Analytics.logEvent('got_homies_locations')

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
    Analytics.logEvent('got_homies_data')


    const bubbleArray = latArray.filter(a => longArray.some(b => a.duid === b.duid));

    store.dispatch(updateLoading(false));

    return bubbleArray;
}

export async function getHomies() {

    Analytics.logEvent('getting_homies_start')


    // LAT & LONG METHOD 
    // var bubbleTask = compareTask(lat, long);
    // bubbleTask.then((response) => {

    //     console.log("response from compare: ")
    //     console.log(response);
    //     response.forEach((dog) => {
    //         store.dispatch(addTag(dog))
    //     })
    // })

    // GET DOGS WITH ZIPCODE
    const zone = store.getState().user.zone
    const uid = store.getState().user.uid

    const dogsRef = collection(db, "dogs");

    const zoneQ = query(dogsRef, where("zone", "==", zone));
    const zoneSnapshot = await getDocs(zoneQ);

    let homiesArray = [];

    Analytics.logEvent('got_homies_finish')
    zoneSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().reported < 1 || doc.data().owner == uid) {
            homiesArray.push(doc.data())
        }
    });
    homiesArray.forEach((dog) => {
        // for my dogs 
        if (dog.owner == uid) {
            store.dispatch(saveDogCards(dog))
        }
        // for explore map
        if (dog.visibility == 'n') {
            store.dispatch(addTag(dog));
        }
        // for lost dogs 
        if (dog.lost == true) {
            store.dispatch(addLocalAlert(dog.alert))
        }
    })
    store.dispatch(updateLoading(false));

}

export async function addUsertoZone(pushToken) {

    // add token to user
    const uid = store.getState().user.uid
    const userRef = doc(db, "users", uid);

    updateDoc(userRef, {
        pushToken: pushToken
    }).catch((err) => {
        console.log(err)
    });

    // add to zones
    const zone = store.getState().user.zone
    const ref = doc(db, "zones", zone);
    const zoneRef = await getDoc(ref);

    if (zone != "Unverified") {
        if (zoneRef.exists()) {
            updateDoc(zoneRef, {
                members: arrayUnion(pushToken)

            }).then((resp) => {
                Analytics.logEvent('joined_nieghborhood')


            }).catch((err) => {
                console.log(err)
                Analytics.logEvent('fire_error', {
                    message: err.message
                })


            })
        } else {
            // doc.data() will be undefined in this case
            console.log("FIRST TIME ZONER");
            setDoc(doc(db, "zones", zone), {
                members: [pushToken]
            });
        }
    }

}


export async function updateFireLocation(location) {

    // get user details
    const uid = store.getState().user.uid
    const pushToken = store.getState().user.pushToken

    const userRef = doc(db, "users", uid);
    updateDoc(userRef, {
        zone: location.zone,
        longitude: location.longitude,
        latitude: location.latitude,
    }).then(() => {
        console.log("udated user doc with loccation and pushToken")
    })

    if (pushToken) {
        addUsertoZone(pushToken, location);
    }

}


//////////////////// DOG FUNCTIONS 


export async function startPublish(imageURI, navigation) {

    Analytics.logEvent('Create_dog_start')

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

    store.dispatch(updateDogProgress(10))
    // upload dog photo with duid 
    const storageRef = ref(storage, 'profileImages/' + duid + '.jpg');
    uploadBytes(storageRef, blob).then((snapshot) => {

        console.log('Uploaded a blob or file!');
        Analytics.logEvent('Created_dog_photo')
        store.dispatch(updateDogProgress(25))


        // get download URL
        getDownloadURL(snapshot.ref).then((PURI) => {
            console.log('File available at', PURI);
            Analytics.logEvent('Created_dog_photoURL')
            store.dispatch(updateDogProgress(50))


            // add url to redux
            store.dispatch(saveDogPic(PURI))

            const readyDog = store.getState().rawDog
            // upload readyDog to dogs/

            setDoc(doc(db, "dogs", duid), readyDog)
                .then((resp) => {
                    Analytics.logEvent('Created_dog_doc')
                    store.dispatch(updateDogProgress(75))

                    // add readyDog to user.dogs redux 
                    store.dispatch(saveDogCards(readyDog))
                    // post new dog list + update coords
                    const userRef = doc(db, "users", uid);
                    updateDoc(userRef, {
                        dogs: arrayUnion(duid),
                        zone: readyDog.zone,
                        longitude: readyDog.longitude,
                        latitude: readyDog.latitude,
                    }).then((resp) => {
                        console.log("finished creating dog")
                        Analytics.logEvent('Created_dog_finish')

                        // add dogcard to explore locally 
                        store.dispatch(addTag(readyDog));

                        store.dispatch(updateDogProgress(100))
                        navigation.navigate('Profile')
                        store.dispatch(updateDogProgress(0))


                    })
                })
                .catch((error) => {
                    Analytics.logEvent('fire_error', {
                        message: error.message
                    })

                })

        });
    }).catch((error) => {
        console.log(error)
        Analytics.logEvent('fire_error', {
            message: error.message
        })

    })

}

export async function editPublish(imageURI, navigation) {

    Analytics.logEvent('Edit_dog_start')

    // get owner
    const uid = store.getState().rawDog.owner
    // create dog duid 
    const duid = store.getState().rawDog.duid


    // check if image uploaded 

    if (imageURI.includes("firebasestorage")) {
        // no new picture

        console.log("OLD PICTURE")

        const readyDog = store.getState().rawDog
        // upload readyDog to dogs/

        setDoc(doc(db, "dogs", duid), readyDog)
            .then((resp) => {
                Analytics.logEvent('Updated_dog')
                // add readyDog to user.dogs redux 
                store.dispatch(changeDogInUser(readyDog))
                // post new dog list + update coords
                const userRef = doc(db, "users", uid);
                updateDoc(userRef, {
                    zone: readyDog.zone,
                    longitude: readyDog.longitude,
                    latitude: readyDog.latitude,
                }).then((resp) => {
                    Analytics.logEvent('Created_dog_finish')

                    navigation.navigate('Profile')

                })
            })
            .catch((error) => {
                Analytics.logEvent('fire_error', {
                    message: error.message
                })

            })
    } else {


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
            Analytics.logEvent('Created_dog_photo')

            // get download URL
            getDownloadURL(snapshot.ref).then((PURI) => {
                Analytics.logEvent('Created_dog_photoURL')

                // add url to redux
                store.dispatch(saveDogPic(PURI))

                const readyDog = store.getState().rawDog
                // upload readyDog to dogs/

                setDoc(doc(db, "dogs", duid), readyDog)
                    .then((resp) => {
                        Analytics.logEvent('Created_dog_doc')
                        // add readyDog to user.dogs redux 
                        store.dispatch(changeDogInUser(readyDog))

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
                            Analytics.logEvent('Created_dog_finish')

                            navigation.navigate('Profile')

                        })
                    })
                    .catch((error) => {
                        Analytics.logEvent('fire_error', {
                            message: error.message
                        })

                    })

            });
        }).catch((error) => {
            console.log(error)
            Analytics.logEvent('fire_error', {
                message: error.message
            })

        })
    }

}

export async function markLost(dog, EContact, index, message) {
    Analytics.logEvent('dog_marked_lost_start')
    let lost = true
    // send changes to redux (local UI changes)
    store.dispatch(markLostDog({
        index,
        EContact,
        lost
    }));
    const alert = {
        duid: dog.duid,
        date: new Date().toLocaleDateString('en-us'),
        message: message,
        dog: dog,
        contact: EContact,
    }
    // mark LOST in DOGS/duid
    const dogRef = doc(db, "dogs", dog.duid);
    updateDoc(dogRef, {
        lost: true,
        contact: EContact,
        alert: alert
    }).then(() => {
        Analytics.logEvent('dog_marked_lost_publicly')

    });
    const zone = store.getState().user.zone
    const docRef = doc(db, "zones", zone);
    getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                let members = docSnap.data().members
                console.log("got zone info: ", docSnap.data())
                store.dispatch(saveZoneData(members));

                const senderToken = store.getState().user.pushToken
                console.log("MEMEBERS ARE: ", members)
                sendNotificationtoZone(dog, message, members, senderToken, 'LOST DOG')
                Analytics.logEvent('dog_lost_notification_sent')
                store.dispatch(addLocalAlert(alert))
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }

        })
        .catch((error) => {
            console.log("Error getting document:", error);
            Analytics.logEvent('fire_error', {
                message: error.message
            })

        })

}

export async function markFound(dog, index) {
    let lost = false;
    let EContact = dog.contact
    // mark in DOGS
    const dogRef = doc(db, "dogs", dog.duid);
    updateDoc(dogRef, {
        lost: lost,
        alert: null,
    }).then(() => {
        console.log("marked public dog as found");
    });
    // mark dog as found in user locally 
    store.dispatch(markLostDog({
        index,
        EContact,
        lost
    }));
    // mark dog as found in zone locally 
    store.dispatch(foundZoneDog(dog.duid))
}
export function deleteDog(duid, uid, navigation) {

    console.log("starting delete")

    // remove dog locally from explore tags
    store.dispatch(removeTag(duid));

    const rawDog = store.getState().rawDog

    // delete dog doc
    deleteDoc(doc(db, "dogs", duid)).then((resp) => {
        // remove dog from user list
        const userRef = doc(db, "users", uid);

        // remove dog from user redux list
        store.dispatch(removeDogfromUser(duid))

        // update doc with new user list
        updateDoc(userRef, {
            dogs: arrayRemove(duid)
        }).then((resp) => {
            // update redux state
            navigation.navigate('Profile')
        }).catch((error) => {
            console.log("error", error)
            Analytics.logEvent('fire_error', {
                message: error.message
            })
        });
    }).catch((error) => {
        console.log("error", error)
        Analytics.logEvent('fire_error', {
            message: error.message
        })
    });

}


export async function inviteFriends(){
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
        // do your SMS stuff here
        SMS.sendSMSAsync(
            [],
            'https://dogwatch.page.link/join'
        );

    } else {
        // misfortune... there's no SMS available on this device
    }
}
