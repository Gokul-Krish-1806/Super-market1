// ================== LOGIN CHECK ==================
const owner = localStorage.getItem("username");
if (!owner) location = "index.html";

// ================== LOGOUT ==================
function logout() {
    localStorage.clear();
    location = "index.html";
}

// ================== API ==================
const API = "http://localhost:9090/api/orders";
const ordersBody = document.getElementById("ordersBody");

// ================== LOAD ORDERS ==================
async function loadOrders() {
    try {
        const res = await fetch(API);
        const orders = await res.json();
        ordersBody.innerHTML = "";

        if (!orders || orders.length === 0) {
            ordersBody.innerHTML = "<tr><td colspan='7'>No orders yet</td></tr>";
            return;
        }

        orders.forEach(order => {
            let itemsText = "";
            try {
                itemsText = JSON.parse(order.items)
                    .map(i => `${i.name} x ${i.qty}`)
                    .join(", ");
            } catch {
                itemsText = order.items;
            }

            const status = (order.orderStatus || "").toUpperCase();
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.phoneNumber}</td>
                <td>${status}</td>
                <td>₹${order.totalAmount}</td>
                <td>${itemsText}</td>
                <td></td>
            `;

            const actionTd = tr.querySelector("td:last-child");

            if (status === "PENDING" || status === "PAID") {
                const btn = document.createElement("button");
                btn.innerText = "Mark PACKED";
                btn.className = "mark-packed-btn";
                btn.onclick = () => markPacked(order.id, order.phoneNumber);
                actionTd.appendChild(btn);
            } else {
                actionTd.innerText = "✅ Packed";
            }

            ordersBody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        ordersBody.innerHTML = "<tr><td colspan='7'>Error loading orders</td></tr>";
    }
}

// ================== MARK PACKED (✔ FIXED) ==================
async function markPacked(orderId, phone) {
    try {
        const res = await fetch(`${API}/${orderId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "PACKED" })
        });

        if (!res.ok) throw new Error("Failed to mark order as PACKED");

        // notify user dashboard
        localStorage.setItem(
            "orderUpdated",
            JSON.stringify({ phone, status: "PACKED", time: Date.now() })
        );

        loadOrders();
        alert("Order marked as PACKED!");
    } catch (err) {
        alert(err.message);
    }
}

// ================== AUTO REFRESH ==================
loadOrders();
setInterval(loadOrders, 3000);
