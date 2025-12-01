package com.example.authorization;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码生成工具类
 * 用于生成 BCrypt 密码哈希值
 */
public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password123";
        String encodedPassword = encoder.encode(password);
        System.out.println("原始密码: " + password);
        System.out.println("BCrypt 哈希值: " + encodedPassword);
        System.out.println();
        System.out.println("SQL 更新语句:");
        System.out.println("UPDATE `user` SET `password` = '" + encodedPassword + "' WHERE `username` IN ('admin', 'hr01', 'hr02', 'salary01', 'salary02');");
    }
}

