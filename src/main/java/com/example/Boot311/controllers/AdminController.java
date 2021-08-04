package com.example.Boot311.controllers;

import com.example.Boot311.models.User;
import com.example.Boot311.service.RoleService;
import com.example.Boot311.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Book;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    public UserService userService;

    @Autowired
    public RoleService roleService;


    @GetMapping("/users")
    public List<User> index() {
        return userService.listUsers();
    }

    @PostMapping()
    public ResponseEntity<User> create(@RequestBody User user) {
        userService.add(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable("id") long id) {
        return userService.getUserById(id);

    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<Void> update(@RequestBody User user) {
        userService.edit(user);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        userService.delete(id);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
