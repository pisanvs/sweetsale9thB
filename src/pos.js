import { collection, getDocs, query, where, doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { auth, db } from './firebase'

import "./styles/inflow.css"

let order = {};

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location = "/auth.html"
    }

    console.log(user)

    const querySnapshot = await getDocs(query(collection(db, "authorized_users"), where("email", "==", user.email)))
    let isAuthorized = !querySnapshot.empty;
})

function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0")
}

function generateId() {
    var arr = new Uint8Array((16) / 2)
    window.crypto.getRandomValues(arr)
    return (Array.from(arr, dec2hex).join('')).toLowerCase();
}

async function submit(e) {
    e.preventDefault();

    let amountPayed = document.querySelector("#paga").value;
    let amountToPay = Number(document.querySelector("#total").textContent);

    let vuelto = amountPayed - amountToPay > 0 ? amountPayed - amountToPay : 0;
    document.querySelector("#vuelto").textContent = vuelto

    document.querySelectorAll(".quantity span").forEach(s => {
        let name = s.parentElement.parentElement.querySelector("span.label").getAttribute("data-id")

        updateDoc(doc(db, "pos_sales", name), {
            quantity: increment(Number(s.textContent)) 
        }).then(() => {
            s.textContent = "0";
        })

    });

    updateDoc(doc(db, "stats", "saleEvents"), {
        amount: increment(1),
        events: arrayUnion({_id: generateId(), saleTotal: amountToPay})
    })

    alert("Listo! Entrega vuelto de: " + vuelto)
    document.querySelector("#paga").value = 0;
    document.querySelector("#total").textContent = "0";
    document.querySelector("#vuelto").textContent = "0";

}

document.querySelector("#form").addEventListener("submit", submit);

function calculateChange() {
    let amountPayed = document.querySelector("#paga").value;
    let amountToPay = Number(document.querySelector("#total").textContent);

    document.querySelector("#vuelto").textContent = amountPayed - amountToPay > 0 ? amountPayed - amountToPay : 0;

    document.querySelector("#submit-btn").disabled = amountPayed < amountToPay; // cant finish transaction if paid less
}

document.querySelector("#paga").addEventListener("input", () => calculateChange());

// Function to fetch the data and cache it in local storage with an expiration
async function getMenuData() {
  const cachedData = localStorage.getItem('menuData');
  const expiration = localStorage.getItem('menuDataExpiration');

  if (cachedData && expiration && Date.now() < parseInt(expiration, 10)) {
    // Data is still valid, return cached data
    return JSON.parse(cachedData);
  } else {
    // Data has expired or not available in local storage, fetch from API
    const docs = await getDocs(collection(db, "menu"));
    let data = [];
    docs.forEach(doc => {
        data.push(doc.data());
    });

    // Cache the data in local storage with an expiration of, for example, 1 hour (3600 seconds)
    const expirationTime = Date.now() + 3600 * 1000;
    localStorage.setItem('menuData', JSON.stringify(data));
    localStorage.setItem('menuDataExpiration', expirationTime.toString());

    return data;
  }
}


getMenuData().then((data) => {

    const foodList = document.getElementById('foodList');

    function renderMenuItems() {
        data.forEach(item => {
            if (!item["stock"]) {
                return;
            }
            const listItem = document.createElement('li');
            listItem.classList.add('food-item');
            listItem.innerHTML = `
            <span class="label" data-id="${item.item}">${item.item} - $${item.price}</span>
            <div class="quantity">
                <button type="button" class="decrement" data-id="${item.item}">-</button>
                <span>0</span>
                <button type="button" class="increment" data-id="${item.item}">+</button>
            </div>
        `;
            foodList.appendChild(listItem);
        });
    }

    function handleQuantityUpdate(event) {
        const targetButton = event.target;
        const total = document.querySelector("#total");
        if (targetButton.classList.contains('increment') || targetButton.classList.contains('decrement')) {
            const itemId = targetButton.getAttribute('data-id');
            const quantityElement = targetButton.parentElement.querySelector('span');
            let quantity = parseInt(quantityElement.textContent);

            if (targetButton.classList.contains('increment')) {
                quantity++;
                total.textContent = Number(total.textContent) + Number(String(document.querySelector(`span[data-id="${itemId}"]`).textContent).match("\\$(\\d+)")[1])
            } else if (targetButton.classList.contains('decrement')) {
                quantity = Math.max(0, quantity - 1);
                total.textContent = Number(total.textContent) - Number(String(document.querySelector(`span[data-id="${itemId}"]`).textContent).match("\\$(\\d+)")[1])
            }

            order[itemId] = quantity;
            if (quantity == 0) {
                delete order[itemId];
            }

            quantityElement.textContent = quantity;
            calculateChange();
        }
    }

    foodList.addEventListener('click', handleQuantityUpdate);

    renderMenuItems();
})
