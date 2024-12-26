import { auth, provider } from "./lib/firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, fetchSignInMethodsForEmail, signInWithPopup } from "firebase/auth";
import { addUser } from "./userController.js";

export const registerWithAuth = async (data) => {
    const {username, email, password, age, fname, lname, gender, avatar, registeredOn} = data;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
            username,
            email,
            uid: user.uid,
            age: age ?? "prefer not to say", //default age 
            fname,
            lname,
            gender: gender ?? "prefer not to say", //default gender 
            registeredOn: registeredOn ?? new Date(), //give current time of registration
            avatar: avatar ?? "https://firebasestorage.googleapis.com/v0/b/travelo-b3a59.firebasestorage.app/o/images%2Fprof.png?alt=media&token=cba32a15-af9b-4256-acbe-2cdb1d0a75b4",
        }
        
        await sendEmailVerification(userCredential.user).then(() => {
          console.log("Email verification link sent");
        });
        return await addUser(userData);
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            return {"msg": "Email is already registered"};
        } else {
            return {"msg": `Error registering user: ${error.message}`}
        }
    }
}

//register user
export const register = async (data) => {
    const {uid, email, phoneNumber, age, fname, lname, gender, avatar, registeredOn } = data;

    try {
        const userData = {
            uid: uid,
            email,
            phoneNumber,
            age: age ?? "prefer not to say", //default age 
            fname,
            lname,
            gender: gender ?? "prefer not to say", //default gender
            registeredOn: registeredOn ?? new Date(), //give current time of registration
            avatar: avatar ?? "https://firebasestorage.googleapis.com/v0/b/travelo-b3a59.firebasestorage.app/o/images%2Fprof.png?alt=media&token=cba32a15-af9b-4256-acbe-2cdb1d0a75b4",
            consent_agreed: consent_agreed ?? false
        }
        const mentalAssessment = {0:q1, 1:q2, 2:q3, 3:q4, 4:q5, 5:q6, 6:q7, 7:q8};

        return await addUser(userData, mentalAssessment);
    } catch(error) {
        return {"msg": `Error registering user: ${error.message}`}
    }
}


export const googleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(user);
        const userData = {
            username: user.displayName,
            email: user.email,
            uid: user.uid,
            age: null,
            fname: user.displayName,
            lname: null,
            gender: null,
            occupation: null,
            registeredOn: new Date(),
            avatar: user.photoURL
        }
        return addUser(userData);
    } catch (error) {
        console.log(error);
    }
}

// User login
export const login = async (data) => {
    const {email, password} = data;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if(user.emailVerified) return user;
        else throw new Error("user email not verified");

        // if (user.emailVerified) {
        //     // Generate an authentication token using Firebase Auth
        //     const idToken = await user.getIdToken(true);
        //     return {
        //       msg: "Login successful",
        //       authToken: idToken, // Send the authentication token
        //     };
        // } else {
        //     return { msg: "user email not verified" };
        // }

    } catch (error) {
        if (error.code === "auth/invalid-email") {
          throw new Error("Invalid email address");
        } else if (error.code === "auth/wrong-password") {
          throw new Error("Incorrect password");
        } else {
          throw new Error(`Error logging in user: ${error.message}`);
        }
    }
}

export const forgotPassword = async (data) => {
    const {email} = data;
    //if email is present in firestore users collection
    try {
      // Check if the email is present in Firestore's users collection
    //   const methods = await fetchSignInMethodsForEmail(auth, email);

      if (email) {
          // If email exists, send password reset email
          await sendPasswordResetEmail(auth, email);
          return {
              status: 200,
              msg: "Password reset link sent to your email"
          };
      } else {
          return {
              status: 404,
              msg: "Email not registered"
          };
      }
    } catch (error) {
        return {
            status: 500,
            msg: `Error sending password reset link: ${error.message}`
        };
    }
}
