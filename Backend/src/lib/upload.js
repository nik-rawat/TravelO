import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Upload image to firebase storage
export const upload_img = async (fileBuffer, originalname, metadata, path, filename ) => {
    // const dateString = new Date().toISOString().replace(/[:.]/g, '-');
    // const storageRef = ref(storage, `${path}/${dateString}-${originalname}`);
    const storageRef = ref(storage, `${path}/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
            console.log(error);
            reject("Something went wrong!! " + error);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
        }
        );
    })
}

// Upload audio to firebase storage
export const upload_audio = async (fileBuffer, originalname, metadata, path) => {
    // console.log('File size:', file.size, file.originalname);
    const dateString = new Date().toISOString().replace(/[:.]/g, '-');
    const storageRef = ref(storage, `${path}/${dateString}-${originalname}`);

    const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
            console.log(error);
            reject("Something went wrong!! " + error);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
        }
        );
    })
}

// Upload pdf to firebase storage
export const upload_pdf = async (fileBuffer, originalname, metadata, path) => {
    // console.log('File size:', file.size, file.originalname);
    const dateString = new Date().toISOString().replace(/[:.]/g, '-');
    const storageRef = ref(storage, `${path}/${dateString}-${originalname}`);

    const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
            console.log(error);
            reject("Something went wrong!! " + error);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
        }
        );
    })
}