package com.example.authorization.controller;

import com.example.common.dto.ApiResponse;
import com.example.authorization.dto.LoginRequest;
import com.example.authorization.dto.LoginResponse;
import com.example.authorization.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 用户登录
     *
     * @param request 登录请求
     * @return 登录响应
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ApiResponse.success("登录成功", response);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    /**
     * 用户登出
     *
     * @param token Token（从Header中获取）
     * @return 响应
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("Authorization") String token) {
        try {
            // 移除 "Bearer " 前缀
            String actualToken = token.replace("Bearer ", "");
            authService.logout(actualToken);
            return ApiResponse.success("登出成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    /**
     * 刷新Token
     *
     * @param token 旧Token
     * @return 新Token
     */
    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refreshToken(@RequestHeader("Authorization") String token) {
        try {
            // 移除 "Bearer " 前缀
            String actualToken = token.replace("Bearer ", "");
            LoginResponse response = authService.refreshToken(actualToken);
            return ApiResponse.success("Token刷新成功", response);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    /**
     * 验证Token
     *
     * @param token Token
     * @return 是否有效
     */
    @GetMapping("/validate")
    public ApiResponse<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // 移除 "Bearer " 前缀
            String actualToken = token.replace("Bearer ", "");
            boolean isValid = authService.validateToken(actualToken);
            return ApiResponse.success(isValid ? "Token有效" : "Token无效", isValid);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}

