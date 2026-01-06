const phone = localStorage.getItem("phoneNumber");

async function loadMyOrders() {
    const res = await fetch(`http://localhost:9090/api/orders/user/${phone}`);
    const orders = await res.json();

    const div = document.getElementById("myOrders");
    div.innerHTML = "";

    if (orders.length === 0) {
        div.innerHTML = "<p>🛒 No orders yet</p>";
        return;
    }

    orders.forEach(o => {
        let message = "⏳ Your order is being prepared";

        if (o.orderStatus === "PACKED") {
            message = "✅ Your order is packed and ready!";
        }

        div.innerHTML += `
            <p>
                <strong>Order #${o.id}</strong> → 
                <span style="font-weight:600; color:${o.orderStatus === "PACKED" ? "green" : "orange"}">
                    ${message}
                </span>
            </p>
        `;
    });
}

// Initial load + auto refresh
loadMyOrders();
setInterval(loadMyOrders, 5000);
