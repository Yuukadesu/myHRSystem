package com.example.authorization;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码验证工具类
 * 用于验证数据库中的密码哈希值是否对应 password123
 */
public class PasswordVerifier {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password123";
        
        // 数据库中的哈希值
        String dbHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwxi8xNa";
        
        boolean matches = encoder.matches(password, dbHash);
        System.out.println("原始密码: " + password);
        System.out.println("数据库哈希: " + dbHash);
        System.out.println("密码匹配: " + matches);
        
        if (!matches) {
            System.out.println();
            System.out.println("❌ 数据库中的密码哈希值不匹配 password123！");
            System.out.println("需要更新数据库中的密码哈希值。");
            System.out.println();
            System.out.println("新的哈希值: " + encoder.encode(password));
        } else {
            System.out.println();
            System.out.println("✅ 密码哈希值匹配！");
        }
    }
}

