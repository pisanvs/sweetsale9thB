import { collection, doc, getDoc, getDocs, onSnapshot, query } from "firebase/firestore";
import { db } from './firebase'

function updateStatistics(overallProfit, productsSold, productList, percentageOfTarget, amountOfSales, preOrderList) {
    if (overallProfit)
        document.getElementById('overallProfit').textContent = overallProfit;
    if (productsSold)
        document.getElementById('productsSold').textContent = productsSold;
    if (percentageOfTarget)
        document.getElementById('percentageOfTarget').textContent = percentageOfTarget + '%';
    if (amountOfSales)
        document.getElementById('amountOfSales').textContent = amountOfSales;

//    // Update the product list
//    if (productList) {
//        const productListElement = document.getElementById('productList');
//        productListElement.innerHTML = '';
//        productList.forEach(product => {
//            const listItem = document.createElement('li');
//            listItem.textContent = `${product.name} - ${product.sales} Sales`;
//            productListElement.appendChild(listItem);
//        });
//    }

    // Update the pre-order list
    if (preOrderList) {
        const preOrderListElement = document.getElementById('preOrderList');
        const preOrderAmountElement = document.getElementById('amountofpreorders');
        preOrderListElement.innerHTML = '';
        preOrderList.forEach(preOrder => {
            const listItem = document.createElement('li');
            listItem.textContent = `${preOrder.name} ${preOrder.class} - Code: ${preOrder.code} - Contents: ${preOrder.contents}`;
            preOrderListElement.appendChild(listItem);
        });
        preOrderAmountElement.textContent = preOrderList.length
    }
}

onSnapshot(doc(db, "stats", "saleEvents"), (snap) => {
    let data = snap.data();
    updateStatistics(null, null, null, null, data["amount"], null);
})

//onSnapshot(collection(db, "pos_sales"), (snap) => {
//    let sales = []
//    snap.forEach((doc) => {
//        sales.push({sales: doc.data()["quantity"], name: doc.id})
//    })
//    updateStatistics(null, null, sales, null, null, null);
//})

onSnapshot(collection(db, "preorders"), (snap) => {
    let preorders = []
    snap.forEach((doc) => {
        let data = doc.data();
        let contents = "";
        Object.keys(data["order"]).forEach(key => {
            contents += key + " x" + data["order"][key] + "\n"
        })
        preorders.push({name: data["name"], class: doc["class"], code: doc["code"], contents: contents})
    })
    updateStatistics(null, null, null, null, null, preorders);
})

