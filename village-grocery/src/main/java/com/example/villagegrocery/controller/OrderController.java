package com.example.villagegrocery.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.villagegrocery.model.Order;
import com.example.villagegrocery.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository repo;

    // 1️⃣ PLACE ORDER (USER)
    @PostMapping
    public ResponseEntity<String> placeOrder(@RequestBody Order order) {

        if (order.getCustomerName() == null || order.getCustomerName().isBlank() ||
            order.getPhoneNumber() == null || order.getPhoneNumber().isBlank() ||
            order.getItems() == null || order.getItems().isBlank()) {

            return ResponseEntity.badRequest().body("Required fields missing");
        }

        order.setPaymentStatus("COD");
        order.setOrderStatus("PENDING"); // USER → PENDING
        repo.save(order);

        return ResponseEntity.ok("Order placed successfully");
    }

    // 2️⃣ GET ALL ORDERS (OWNER)
    @GetMapping
    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    // 3️⃣ UPDATE STATUS (OWNER → PACKED)
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Order order = repo.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        String status = body.get("status"); // { "status": "PACKED" }
        order.setOrderStatus(status);
        repo.save(order);

        return ResponseEntity.ok("Order status updated to " + status);
    }

    // 4️⃣ USER ORDERS BY PHONE (ALL)
    @GetMapping("/user/{phone}")
    public List<Order> getOrdersByUser(@PathVariable String phone) {
        return repo.findAll()
                .stream()
                .filter(o -> o.getPhoneNumber().equals(phone))
                .toList();
    }

    // ✅ 5️⃣ USER → ONLY PACKED ORDERS (NEW)
    @GetMapping("/user/{phone}/packed")
    public List<Order> getPackedOrdersByUser(@PathVariable String phone) {
        return repo.findAll()
                .stream()
                .filter(o ->
                        o.getPhoneNumber().equals(phone) &&
                        "PACKED".equals(o.getOrderStatus()))
                .toList();
    }
}
