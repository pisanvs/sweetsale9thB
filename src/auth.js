import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider();


document.onreadystatechange = () => {
    if (document.readyState != "complete") return;

    document.getElementById("login").onclick = (e) => {
        signInWithPopup(auth, provider)
            .then((r) => {
                const credential = GoogleAuthProvider.credentialFromResult(r);
                const token = credential.accessToken;
                const user = r.user;

                window.location = "/index.html";
            }).catch((e) => {
                const errorCode = e.code;
                const errorMessage = e.message;

                document.getElementById("msg").innerText = errorMessage
            })
    }
}

