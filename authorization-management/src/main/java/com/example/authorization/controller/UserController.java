package com.example.authorization.controller;

import com.example.common.annotation.RequireRole;
import com.example.common.dto.ApiResponse;
import com.example.common.entity.User;
import com.example.common.exception.AuthenticationException;
import com.example.storage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理控制器
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 获取当前用户信息
     * 需要登录
     */
    @GetMapping("/me")
    public ApiResponse<User> getCurrentUser() {
        // 从Security上下文获取当前认证用户
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() 
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AuthenticationException("用户未登录");
        }
        
        // 获取用户名
        String username = authentication.getName();
        
        // 根据用户名查询用户信息
        User user = userService.getByUsername(username);
        if (user == null) {
            throw new AuthenticationException("用户不存在");
        }
        
        return ApiResponse.success("获取成功", user);
    }

    /**
     * 根据角色查询用户列表
     * 需要人事经理或薪酬经理权限
     */
    @GetMapping("/by-role")
    @RequireRole({"HR_MANAGER", "SALARY_MANAGER"})
    public ApiResponse<List<User>> getUsersByRole(@RequestParam String role) {
        List<User> users = userService.getByRole(role);
        return ApiResponse.success("查询成功", users);
    }

    /**
     * 根据状态查询用户列表
     * 需要人事经理权限
     */
    @GetMapping("/by-status")
    @RequireRole({"HR_MANAGER"})
    public ApiResponse<List<User>> getUsersByStatus(@RequestParam String status) {
        List<User> users = userService.getByStatus(status);
        return ApiResponse.success("查询成功", users);
    }
}

