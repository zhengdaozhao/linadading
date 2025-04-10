package com.lina.linadady.controller;

import com.lina.linadady.model.User;
import com.lina.linadady.service.UserService;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        logger.info("info of signup:"+user.getMail()); 
        logger.info("is manager?:"+user.isManager()); 
        userService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        logger.info("info of login:"+ user.getMail());
        User foundUser = userService.findByMail(user.getMail());
        if (foundUser != null && userService.isPasswordValid(user.getPassword(), foundUser.getPassword())) {
            logger.info("search result:"+ foundUser.getPassword());
            logger.info("Password matches");
            return ResponseEntity.ok(foundUser);
        }
        // return ResponseEntity.status(401).body("Invalid credentials");
        return ResponseEntity.status(401).body(null);
    }
}