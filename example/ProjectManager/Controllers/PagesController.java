package com.example.ProjectManager.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PagesController {
    @GetMapping("/register")
    public String registerPage() {
        return "register.html";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login.html";
    }

    @GetMapping("/")
    public String home() {
        return "login.html";
    }

    @GetMapping("/hey")
    public String hey() {
        return "hey.html";
    }

    @GetMapping("/dashboard")
    public String dashboardPage() {
        return "dashboard.html";
    }
}
