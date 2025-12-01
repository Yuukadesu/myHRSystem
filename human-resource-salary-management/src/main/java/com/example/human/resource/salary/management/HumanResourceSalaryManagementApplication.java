package com.example.human.resource.salary.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 人力资源薪酬管理模块主应用类
 */
@SpringBootApplication(scanBasePackages = {
        "com.example.human.resource.salary.management",
        "com.example.storage",
        "com.example.common"
})
public class HumanResourceSalaryManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(HumanResourceSalaryManagementApplication.class, args);
    }

    /**
     * CORS配置
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}

