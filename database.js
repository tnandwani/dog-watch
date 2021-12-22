// keys and consts
import {
    firebaseConfig
} from './constants';

// REDUX
import store from "./redux/store";
import {
    changeStatus,
    saveDogCards,
    saveUserAccount,
    saveUserDetails,
    signInAccount,
    addDogtoUser
} from "./redux/slices/userSlice";
import {
    saveOwner
} from "./redux/slices/rawDogSlice";
import {
    addTag,
    emptyTag,
    updateLoading,
} from "./redux/slices/exploreSlice";

// FIREBASE
import {
    initializeApp
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
    doc
} from 'firebase/firestore';
const db = getFirestore();

// storage
import {
    getDownloadURL,
    getStorage,
    uploadBytes,
    ref
} from "firebase/storage";
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
        let response = docSnap.data()
        console.log("Welcome back User", response);
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


export async function compressImage(imageURI) {

    // convert to convas
    const img = new Image();
    img.src = blob;
    img.onload = function (ev) {
        window.URL.revokeObjectURL(blob); // release memory
        // Use the img
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 500, 500);

        // compress
        canvas.toBlob(function (cblob) {
            // Handle the compressed image
            console.log("blob", blob)
            console.log("c blob", cblob)

            return cblob
        }, 'image/jpeg', 0.8);

    };

}
export async function startPublish(imageURI, navigation) {

    // convert to Blob
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

    // get user uid
    const uid = store.getState().user.uid
    store.dispatch(saveOwner(uid))

    // get rawDog state
    const rawDog = store.getState().rawDog

    // upload rawDog
    console.log("STARTING TO CREATE DOG", rawDog)



    // Add a new document with a generated id.


    try {
        addDoc(collection(db, "dogs"), rawDog).then((docRef) => { // get duid
            const duid = docRef.id
            console.log("Created dog with duid: ", duid);


            // add duid to user dog list 
            store.dispatch(addDogtoUser(rawDog))

            // get new list 
            const newList = store.getState().user.dogs

            // post new dog list + update coords
            const userRef = doc(db, "users", uid);
            updateDoc(userRef, {
                dogs: newList,
                zone: rawDog.zone,
                longitude: rawDog.longitude,
                latitude: rawDog.latitude,

            }).then(() => {
                // update file
                const storageRef = ref(storage, 'profileImages/' + duid + '.jpg');
                // 'file' comes from the Blob or File API
                uploadBytes(storageRef, blob).then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                    getDownloadURL(snapshot.ref).then((PURI) => {
                        console.log('File available at', PURI);
                        // add profileURL to rawDOG document

                        const dogRef = doc(db, "dogs", duid);
                        updateDoc(dogRef, {
                            profileImage: PURI,
                            duid: duid
                        }).then(() => {
                                console.log("added dog URL");
                                navigation.navigate('Profile');

                            }

                        );

                    });
                }).catch((error) => {
                    console.log(error)
                })
            })
        })



    } catch (e) {
        console.error("Error adding document: ", e);
    }


}



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
