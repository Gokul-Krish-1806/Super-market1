package com.example.villagegrocery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.villagegrocery.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
