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
    { name: "Tomato", price: 20, img: "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg", discount: 5, qty: 0 },
    { name: "Potato", price: 15, img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Patates.jpg", discount: 2, qty: 0 },
    { name: "Onion", price: 18, img: "https://upload.wikimedia.org/wikipedia/commons/4/45/Onions.jpg", discount: 3, qty: 0 },
    { name: "Carrot", price: 25, img: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Carrot.jpg", discount: 5, qty: 0 },
    { name: "Cabbage", price: 22, img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Cabbage_and_cross_section.jpg", discount: 4, qty: 0 },
    { name: "Spinach", price: 12, img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Spinacia_oleracea_Spinazie_bloeiend.jpg", discount: 1, qty: 0 },
    { name: "Capsicum", price: 30, img: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Capsicum_Annunicum.jpg", discount: 6, qty: 0 },
    { name: "Cauliflower", price: 25, img: "https://upload.wikimedia.org/wikipedia/commons/1/11/Cauliflower_and_cross_section_edit.jpg", discount: 5, qty: 0 },
    { name: "Beetroot", price: 28, img: "https://upload.wikimedia.org/wikipedia/commons/0/01/Beetroot.jpg", discount: 7, qty: 0 },
    { name: "Pumpkin", price: 18, img: "https://upload.wikimedia.org/wikipedia/commons/5/55/Pumpkin_and_cross_section.jpg", discount: 3, qty: 0 }
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
const qrCodeContainer = document.getElementById("qrCodeContainer");

function placeOrder() {
    if (cart.length === 0) return alert("Add items to cart first");

    let summaryHTML = '<ul style="list-style:none; padding-left:0;">';
    cart.forEach(item => {
        summaryHTML += `<li>${item.name} x ${item.qty} = ₹${item.price * item.qty}</li>`;
    });
    summaryHTML += '</ul>';

    orderDetails.innerHTML = summaryHTML;
    modalTotal.innerText = totalSpan.innerText;

    // Generate QR code for payment (dummy link)
    qrCodeContainer.innerHTML = "";
    new QRCode(qrCodeContainer, {
        text: "https://payment.example.com/?amount=" + totalSpan.innerText,
        width: 150,
        height: 150
    });

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

async function confirmOrder() {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    if (!name || !phone) return alert("Enter customer name and phone number");

    localStorage.setItem("phoneNumber", phone);

    const order = {
        customerName: name,
        phoneNumber: phone,
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

        // Reset
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

// ================== LOAD ORDERS ==================
const phone = localStorage.getItem("phoneNumber");
async function loadMyOrders() {
    if (!phone) return;

    try {
        const res = await fetch(`${API}/user/${phone}`);
        const orders = await res.json();
        const container = document.getElementById("myOrders");
        container.innerHTML = "";

        if (!orders || orders.length === 0) {
            document.getElementById("orderStatusText").innerText = "No orders yet";
            return;
        }

        orders.forEach(order => {
            let itemsText = "";
            try { itemsText = JSON.parse(order.items).map(i => `${i.name} x ${i.qty} = ₹${i.price * i.qty}`).join("<br>"); }
            catch { itemsText = order.items; }

            const status = (order.orderStatus || "").toUpperCase();
            const statusMsg = status === "PACKED"
                ? "✅ Your order is packed and ready!"
                : "⏳ Your order is being prepared";

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
        document.getElementById("orderStatusText").innerText =
            latestStatus === "PACKED"
                ? "✅ Your order is packed and ready!"
                : "⏳ Your order is being prepared";

    } catch (err) {
        console.error(err);
    }
}

// ================== AUTO REFRESH ==================
loadMyOrders();
setInterval(loadMyOrders, 3000);
