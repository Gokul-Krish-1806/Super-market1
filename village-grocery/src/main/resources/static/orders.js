// Store user's phone number when they login
const phone = localStorage.getItem("phone"); // Make sure to save phone on login

async function fetchMyOrders() {
    try {
        const res = await fetch(`http://localhost:9090/api/orders/user/${phone}`);
        const orders = await res.json();

        const container = document.getElementById("ordersContainer");
        container.innerHTML = "";

        orders.forEach(order => {
            let itemsText = "";
            try {
                const items = JSON.parse(order.items);
                itemsText = items.map(i => `${i.name} x ${i.qty} = ₹${i.price * i.qty}`).join("<br>");
            } catch (e) {
                itemsText = order.items;
            }

            // Show special message if order is packed
            let statusMsg = "";
            if(order.orderStatus === "CONFIRMED") statusMsg = "Your order is being packed!";
            if(order.orderStatus === "PACKED") statusMsg = "✅ Your order is packed and ready!";

            const div = document.createElement("div");
            div.className = "order-card";
            div.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p>Status: <strong>${order.orderStatus}</strong></p>
                <p>${statusMsg}</p>
                <p>Total: ₹${order.totalAmount}</p>
                <p>Items:<br>${itemsText}</p>
                <hr>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        alert("Failed to fetch your orders");
    }
}

// Fetch orders every 5 seconds to reflect updates
fetchMyOrders();
setInterval(fetchMyOrders, 5000);
