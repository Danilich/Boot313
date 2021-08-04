package com.example.Boot311.controllers;


import com.example.Boot311.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AppController {

    @GetMapping("/users")
    public String index(@ModelAttribute("user") User user, Model model) {
        return "index";
    }

}
