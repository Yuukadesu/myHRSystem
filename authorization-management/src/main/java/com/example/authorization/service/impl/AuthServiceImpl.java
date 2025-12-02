package com.example.authorization.service.impl;

import com.example.authorization.dto.LoginRequest;
import com.example.authorization.dto.LoginResponse;
import com.example.authorization.service.AuthService;
import com.example.common.util.JwtUtil;
import com.example.common.entity.User;
import com.example.common.enums.UserStatus;
import com.example.common.exception.AuthenticationException;
import com.example.storage.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 认证服务实现类
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. 根据用户名查询用户
        User user = userService.getByUsername(request.getUsername());
        if (user == null) {
            throw new AuthenticationException("用户名或密码错误");
        }

        // 2. 验证密码
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        log.debug("密码验证 - 用户名: {}, 验证结果: {}", request.getUsername(), passwordMatches);
        if (!passwordMatches) {
            throw new AuthenticationException("用户名或密码错误");
        }

        // 3. 检查用户状态
        if (!UserStatus.ACTIVE.getCode().equals(user.getStatus())) {
            throw new AuthenticationException("用户已被禁用");
        }

        // 4. 生成JWT Token和Refresh Token
        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // 5. 构建用户信息
        LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .realName(user.getRealName())
                .role(user.getRole())
                .build();

        // 6. 构建响应
        return LoginResponse.builder()
                .token(token)
                .accessToken(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .username(user.getUsername())
                .realName(user.getRealName())
                .role(user.getRole())
                .expiresIn(jwtUtil.getExpirationTime())
                .user(userInfo)
                .build();
    }

    @Override
    public void logout(String token) {
        // TODO: 实现Token黑名单机制（可选）
        // 可以将Token添加到Redis黑名单中，在Token验证时检查
    }

    @Override
    public LoginResponse refreshToken(String token) {
        // 1. 验证Token是否有效
        if (!jwtUtil.validateToken(token)) {
            throw new AuthenticationException("Token无效或已过期");
        }

        // 2. 验证是否为Refresh Token
        if (!jwtUtil.isRefreshToken(token)) {
            throw new AuthenticationException("无效的Refresh Token");
        }

        // 3. 从Token中获取用户信息
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userService.getByUsername(username);

        if (user == null || !UserStatus.ACTIVE.getCode().equals(user.getStatus())) {
            throw new AuthenticationException("用户不存在或已被禁用");
        }

        // 4. 生成新的Access Token和Refresh Token
        String newToken = jwtUtil.generateToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        // 5. 构建用户信息
        LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .realName(user.getRealName())
                .role(user.getRole())
                .build();

        // 6. 构建响应
        return LoginResponse.builder()
                .token(newToken)
                .accessToken(newToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .username(user.getUsername())
                .realName(user.getRealName())
                .role(user.getRole())
                .expiresIn(jwtUtil.getExpirationTime())
                .user(userInfo)
                .build();
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
}

