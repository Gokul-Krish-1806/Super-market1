package com.example.villagegrocery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.villagegrocery.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> { }
    