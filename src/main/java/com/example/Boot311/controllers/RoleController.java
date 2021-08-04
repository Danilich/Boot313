package com.example.Boot311.controllers;


import com.example.Boot311.models.Role;
import com.example.Boot311.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {


    @Autowired
    public RoleService roleService;

    @GetMapping
    public List<Role> findAll() {
        return roleService.getAllRoles();
    }
}
