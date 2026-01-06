// ================== LOGIN CHECK ==================
const user = localStorage.getItem("username");
if (!user) location = "index.html";
document.getElementById("user").innerText = user;

// ================== LOGOUT ==================
function logout() {
    localStorage.clear();
    location = "index.html";
}

// ================== ITEM DATA ==================
const items = [
    { name: "Tomato", price: 20, img: "https://cdn.pixabay.com/photo/2018/07/13/20/47/tomatoes-3536465_1280.jpg", discount: 5, qty: 0 },
    { name: "Potato", price: 15, img: "https://cdn.pixabay.com/photo/2016/10/09/19/51/potatoes-1727328_1280.jpg", discount: 2, qty: 0 },
    { name: "Onion", price: 18, img: "https://cdn.pixabay.com/photo/2017/01/20/15/06/onions-1995028_1280.jpg", discount: 3, qty: 0 },
    { name: "Carrot", price: 25, img: "https://cdn.pixabay.com/photo/2017/01/20/15/06/carrots-1995026_1280.jpg", discount: 5, qty: 0 },
    { name: "Cabbage", price: 22, img: "https://cdn.pixabay.com/photo/2016/03/05/19/02/cabbage-1238254_1280.jpg", discount: 4, qty: 0 },
    { name: "Spinach", price: 12, img: "https://cdn.pixabay.com/photo/2017/01/20/15/05/spinach-1995023_1280.jpg", discount: 1, qty: 0 },
    { name: "Capsicum", price: 30, img: "https://cdn.pixabay.com/photo/2017/01/14/12/59/bell-pepper-1979106_1280.jpg", discount: 6, qty: 0 },
    { name: "Cauliflower", price: 25, img: "https://cdn.pixabay.com/photo/2016/09/25/21/52/cauliflower-1697142_1280.jpg", discount: 5, qty: 0 },
    { name: "Beetroot", price: 28, img: "https://cdn.pixabay.com/photo/2017/08/02/01/01/beetroot-2562496_1280.jpg", discount: 7, qty: 0 },
    { name: "Pumpkin", price: 18, img: "https://cdn.pixabay.com/photo/2014/10/21/17/36/pumpkin-497832_1280.jpg", discount: 3, qty: 0 },
    { name: "Brinjal", price: 22, img: "https://cdn.pixabay.com/photo/2017/08/10/04/50/brinjal-2621443_1280.jpg", discount: 4, qty: 0 },
    { name: "Green Beans", price: 20, img: "https://cdn.pixabay.com/photo/2017/06/20/18/17/green-beans-2426421_1280.jpg", discount: 3, qty: 0 },
    { name: "Radish", price: 15, img: "https://cdn.pixabay.com/photo/2018/04/10/17/29/radishes-3300479_1280.jpg", discount: 2, qty: 0 },
    { name: "Lettuce", price: 18, img: "https://cdn.pixabay.com/photo/2017/01/20/15/06/lettuce-1995029_1280.jpg", discount: 1, qty: 0 },
    { name: "Garlic", price: 12, img: "https://cdn.pixabay.com/photo/2017/01/20/15/06/garlic-1995030_1280.jpg", discount: 1, qty: 0 },
    { name: "Ginger", price: 25, img: "https://cdn.pixabay.com/photo/2018/02/28/16/27/ginger-3186745_1280.jpg", discount: 4, qty: 0 },
    { name: "Chili", price: 20, img: "https://cdn.pixabay.com/photo/2016/03/05/19/02/chili-peppers-1238243_1280.jpg", discount: 2, qty: 0 },
    { name: "Sweet Corn", price: 18, img: "https://cdn.pixabay.com/photo/2016/03/27/21/45/corn-1284256_1280.jpg", discount: 3, qty: 0 },
    { name: "Peas", price: 15, img: "https://cdn.pixabay.com/photo/2014/12/13/01/02/peas-566468_1280.jpg", discount: 1, qty: 0 },
    { name: "Okra", price: 22, img: "https://cdn.pixabay.com/photo/2017/09/21/08/30/okra-2774173_1280.jpg", discount: 3, qty: 0 }
];


const container = document.getElementById("vegContainer");
const totalSpan = document.getElementById("total");
let cart = [];

// ================== RENDER ITEMS ==================
function renderItems() {
    container.innerHTML = '';
    items.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p class="price">₹${item.price} <span class="discount">₹${item.price + item.discount}</span></p>
            <div class="quantity">
                <button onclick="decrease(${index})">-</button>
                <span id="qty${index}">${item.qty}</span>
                <button onclick="increase(${index})">+</button>
            </div>
            <button class="add-btn" onclick="addToCart(${index})">ADD</button>
        `;
        container.appendChild(card);
    });
}
renderItems();

// ================== QUANTITY ==================
function increase(i) {
    items[i].qty++;
    document.getElementById(`qty${i}`).innerText = items[i].qty;
    renderTotal();
}

function decrease(i) {
    if (items[i].qty > 0) items[i].qty--;
    document.getElementById(`qty${i}`).innerText = items[i].qty;
    renderTotal();
}

// ================== CART ==================
function addToCart(i) {
    if (items[i].qty === 0) return alert("Select quantity first");
    const existing = cart.find(x => x.name === items[i].name);
    if (existing) existing.qty = items[i].qty;
    else cart.push({ ...items[i] });
    renderTotal();
}

function renderTotal() {
    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalSpan.innerText = total.toFixed(2);
}

// ================== MODAL ==================
const modal = document.getElementById("orderModal");
const orderDetails = document.getElementById("orderDetails");
const modalTotal = document.getElementById("modalTotal");

function placeOrder() {
    if (cart.length === 0) return alert("Add items to cart first");

    let summaryHTML = '<ul style="list-style:none; padding-left:0;">';
    cart.forEach(item => {
        summaryHTML += `<li>${item.name} x ${item.qty} = ₹${item.price * item.qty}</li>`;
    });
    summaryHTML += '</ul>';

    orderDetails.innerHTML = summaryHTML;
    modalTotal.innerText = totalSpan.innerText;

    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) closeModal();
}

// ================== PLACE ORDER ==================
const API = "http://localhost:9090/api/orders";
const phone = localStorage.getItem("phoneNumber");

async function confirmOrder() {
    const name = document.getElementById("custName").value.trim();
    const phoneInput = document.getElementById("custPhone").value.trim();
    if (!name || !phoneInput) return alert("Enter customer name and phone number");

    localStorage.setItem("phoneNumber", phoneInput);

    const order = {
        customerName: name,
        phoneNumber: phoneInput,
        items: JSON.stringify(cart.map(i => ({ name: i.name, qty: i.qty, price: i.price }))),
        totalAmount: parseFloat(totalSpan.innerText)
    };

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });
        if (!res.ok) throw new Error("Failed to place order");

        alert("Order placed successfully!");

        // Reset cart
        cart = [];
        items.forEach(i => i.qty = 0);
        renderItems();
        renderTotal();
        document.getElementById("custName").value = "";
        document.getElementById("custPhone").value = "";

        closeModal();
        loadMyOrders();
    } catch (err) {
        alert(err.message);
    }
}

// ================== LOAD USER ORDERS ==================
async function loadMyOrders() {
    if (!phone) return;

    try {
        const res = await fetch(`${API}/user/${phone}`);
        const orders = await res.json();
        const container = document.getElementById("myOrders");
        container.innerHTML = "";

        if (!orders || orders.length === 0) {
            document.getElementById("orderStatusText").innerText = "No orders yet";
            container.innerHTML = "<p>🛒 No orders yet</p>";
            return;
        }

        orders.forEach(order => {
            let itemsText = "";
            try { 
                itemsText = JSON.parse(order.items).map(i => `${i.name} x ${i.qty} = ₹${i.price * i.qty}`).join("<br>");
            } catch {
                itemsText = order.items;
            }

            const status = (order.orderStatus || "").toUpperCase();
            const statusMsg = status === "PACKED" ? "✅ Your order is packed and ready!" : "⏳ Your order is being prepared";

            const div = document.createElement("div");
            div.className = "order-card";
            div.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p>Status: <strong>${status}</strong></p>
                <p>${statusMsg}</p>
                <p>Total: ₹${order.totalAmount}</p>
                <p>Items:<br>${itemsText}</p>
                <hr>
            `;
            container.appendChild(div);
        });

        const latestOrder = orders[orders.length - 1];
        const latestStatus = (latestOrder.orderStatus || "").toUpperCase();
        document.getElementById("orderStatusText").innerText = latestStatus === "PACKED" ? "✅ Your order is packed and ready!" : "⏳ Your order is being prepared";

    } catch (err) {
        console.error(err);
    }
}

// ================== AUTO REFRESH ==================
loadMyOrders();
setInterval(loadMyOrders, 3000);

// ================== LOCAL STORAGE LISTENER ==================
window.addEventListener("storage", (event) => {
    if (event.key === "orderUpdated") {
        const data = JSON.parse(event.newValue);
        if (data.phone === phone) loadMyOrders();
    }
});
