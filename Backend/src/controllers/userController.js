import { doc, setDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
// import { getFirestoreDB, getAuthInstance, getStorageInstance } from "./lib/firebase.js";
import { db } from "../lib/firebase.js";

export const addDocument = async (collection, data) => {
    try {
        const document = doc(db, collection);
        const docRef = await setDoc(document, data);
        return docRef;
    } catch (error) {
        console.log(error);
    }
};

// Add a new user in user collection
export const addUser = async (userData) => {
    try {
        await setDoc(doc(db, "users", userData.uid), userData);
        return (userData);
    } catch (error) {
        console.log(error);
    }
};

// change avatar of user
export const changeAvatar = async (data) => {
    try {
        const {uid, avatarURL} = data;
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {avatar: avatarURL});
    } catch (error) {
        console.log(error);
    }
};

// Get data of user from users collection
export const getUser = async (data) => {
    if (!data || !data.uid) {
        throw new Error('Invalid data');
    }
    try{
        const collectionRef = collection(db, "users");
        // const finalData = [];
        const q = query(collectionRef, where('uid', '==', data.uid));
        const docSnap = await getDocs(q);
        // docSnap.forEach((doc) => {
        // // console.log(doc.age);
        // finalData.push(doc.data());
        // });
        if (docSnap.empty) {
            console.log(`No user found with uid ${data.uid}`);
            return ; // or throw an error
        }
        const user = docSnap.docs[0].data();
        return user;
    } catch(err) {
        console.log(err);
    }
}

// Update user details
export const updateUser = async (data) => {
    try {
        const {uid, ...rest} = data;
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, rest);
    } catch (error) {
        console.log(error);
    }
};

// get user reviews using its uid
export const getUserReviews = async (uid) => {
    try {
        const collectionRef = collection(db, "reviews");
        const q = query(collectionRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
        });
        return reviews;
    } catch (error) {
        console.log(error);
    }
}

// get booked itineraries of user using its uid
export const getBookedItineraries = async (uid) => {
    try {
        const collectionRef = collection(db, "itineraries");
        const q = query(collectionRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        const itineraries = [];
        querySnapshot.forEach((doc) => {
            itineraries.push(doc.data());
        });
        return itineraries;
    } catch (error) {
        console.log(error);
    }
}

// get liked reviews of user using its uid
export const getLikedReviews = async (uid) => {
    try {
        const collectionRef = collection(db, "reviews");
        const q = query(collectionRef, where('like', 'array-contains', uid));
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
        });
        return reviews;
    } catch (error) {
        console.log(error);
    }
}

// Get all documents from a collection
export const getCollection = async (collection) => {
    try {
        const q = query(collection(db, collection));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        });
    } catch (error) {
        console.log(error, "getCollection");
    }
};

// Get a document from a collection
export const getDocument = async (collection, document) => {
    try {
        const docRef = doc(db, collection, document);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error);
    }
};