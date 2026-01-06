async function fetchOrders() {
    const res = await fetch("http://localhost:9090/api/orders");
    const orders = await res.json();

    const tbody = document.getElementById("ordersBody");
    tbody.innerHTML = "";

    orders.forEach(o => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.customerName}</td>
            <td>${o.phoneNumber}</td>
            <td>${o.orderStatus}</td>
            <td>₹${o.totalAmount}</td>
            <td>${o.items}</td>
            <td>
                ${
                  o.orderStatus === "PENDING"
                  ? `<button onclick="markPacked(${o.id})">Mark PACKED</button>`
                  : "✔ Packed"
                }
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function markPacked(id) {
    await fetch(`http://localhost:9090/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PACKED" })
    });

    fetchOrders();
}

fetchOrders();
setInterval(fetchOrders, 5000);
