package com.example.authorization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.dao.PersistenceExceptionTranslationAutoConfiguration;
import org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration;

/**
 * 权限管理服务启动类
 */
@SpringBootApplication(
    scanBasePackages = "com.example",
    exclude = {
        ValidationAutoConfiguration.class,
        PersistenceExceptionTranslationAutoConfiguration.class
    }
)
public class AuthorizationManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthorizationManagementApplication.class, args);
    }
}

