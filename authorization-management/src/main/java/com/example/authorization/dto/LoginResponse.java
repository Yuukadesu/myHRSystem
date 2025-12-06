package com.example.authorization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    /**
     * 访问令牌（与token字段相同，为了兼容API文档）
     */
    private String token;

    /**
     * 访问令牌（别名）
     */
    private String accessToken;

    /**
     * 刷新令牌
     */
    private String refreshToken;

    /**
     * 令牌类型（通常是 "Bearer"）
     */
    @Default
    private String tokenType = "Bearer";

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 真实姓名
     */
    private String realName;

    /**
     * 角色
     */
    private String role;

    /**
     * 过期时间（秒）
     */
    private Long expiresIn;

    /**
     * 用户信息（可选，用于API文档中的user对象）
     */
    private UserInfo user;

    /**
     * 用户信息内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long userId;
        private String username;
        private String realName;
        private String role;
    }
}

