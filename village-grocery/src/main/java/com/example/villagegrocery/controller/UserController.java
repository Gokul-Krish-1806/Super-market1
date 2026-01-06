package com.example.villagegrocery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.villagegrocery.model.User;
import com.example.villagegrocery.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        if(userRepository.findByUsername(user.getUsername())!=null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username exists");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        User u = userRepository.findByUsername(user.getUsername());
        if(u!=null && passwordEncoder.matches(user.getPassword(), u.getPassword()))
            return ResponseEntity.ok("Login successful");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody User user) {
        User u = userRepository.findByUsername(user.getUsername());
        if(u==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        u.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(u);
        return ResponseEntity.ok("Password reset successful");
    }
}
