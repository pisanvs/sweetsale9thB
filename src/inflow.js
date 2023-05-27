import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from './firebase'


auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location = "/auth.html"
    }

    const querySnapshot = await getDocs(query(collection(db, "authorized_users"), where("email", "==", user.email)))
    let isAuthorized = !querySnapshot.empty;

    document.onreadystatechange = () => {
        if (document.readyState != "complete") return;

        attachListeners();

    }
})

function attachListeners() {

}
