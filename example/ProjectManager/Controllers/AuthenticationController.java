package com.example.ProjectManager.Controllers;
import com.example.ProjectManager.entity.User;
import com.example.ProjectManager.repository.UserRepository;
import com.example.ProjectManager.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
public class AuthenticationController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username must be unique!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered!");
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user){
        Optional<User> actualUser = userRepository.findByUsername(user.getUsername());

        if (actualUser.isEmpty()){
            return ResponseEntity.badRequest().body("Invalid username!");
        }
        User theUser = actualUser.get();

        if (passwordEncoder.matches(user.getPassword(), theUser.getPassword())) {
            String token = jwtService.generateToken(theUser.getUsername());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", theUser.getUsername()
            ));
        } else {
            return ResponseEntity.badRequest().body("Invalid password!");
        }
    }
}
