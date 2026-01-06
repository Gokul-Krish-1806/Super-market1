const API = "http://localhost:9090/api/orders";
const phone = localStorage.getItem("phoneNumber");

// ================== LOAD USER ORDERS ==================
async function loadMyOrders() {
    if (!phone) return;

    try {
        const res = await fetch(`${API}/user/${phone}`);
        const orders = await res.json();

        const container = document.getElementById("myOrders");
        container.innerHTML = "";

        if (!orders || orders.length === 0) {
            container.innerHTML = "<p>🛒 No orders yet</p>";
            document.getElementById("orderStatusText").innerText = "No orders yet";
            return;
        }

        orders.forEach(order => {
            let itemsText = "";
            try {
                const items = JSON.parse(order.items);
                itemsText = items.map(i => `${i.name} x ${i.qty} = ₹${i.price * i.qty}`).join("<br>");
            } catch {
                itemsText = order.items;
            }

            // Ensure status check works even if backend uses lowercase or typo
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

        // Update top status text for latest order
        const latestOrder = orders[orders.length - 1];
        const latestStatus = (latestOrder.orderStatus || "").toUpperCase();
        document.getElementById("orderStatusText").innerText =
            latestStatus === "PACKED"
                ? "✅ Your order is packed and ready!"
                : "⏳ Your order is being prepared";

    } catch (err) {
        console.error(err);
        document.getElementById("myOrders").innerHTML = "<p>Error loading orders</p>";
    }
}

// ================== LOAD LATEST STATUS ONLY ==================
async function loadLatestOrderStatus() {
    if (!phone) return;

    try {
        const res = await fetch(`${API}/user/${phone}`);
        const orders = await res.json();
        if (!orders || orders.length === 0) {
            document.getElementById("orderStatusText").innerText = "No orders yet";
            return;
        }

        const latestOrder = orders[orders.length - 1];
        const status = (latestOrder.orderStatus || "").toUpperCase();

        document.getElementById("orderStatusText").innerText =
            status === "PACKED"
                ? "✅ Your order is packed and ready!"
                : "⏳ Your order is being prepared";

    } catch (err) {
        console.error(err);
    }
}

// ================== INITIAL LOAD & INTERVALS ==================
loadMyOrders();
setInterval(loadMyOrders, 3000);      // refresh order cards
loadLatestOrderStatus();
setInterval(loadLatestOrderStatus, 5000); // refresh top status text

// ================== LOCAL STORAGE LISTENER ==================
window.addEventListener("storage", (event) => {
    if (event.key === "orderUpdated") {
        const data = JSON.parse(event.newValue);
        if (data.phone === phone) loadMyOrders();
    }
});
