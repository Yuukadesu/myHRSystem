package com.example.common.aspect;

import com.example.common.annotation.RequireRole;
import com.example.common.util.JwtUtil;
import com.example.common.exception.AuthenticationException;
import com.example.common.exception.AuthorizationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 角色权限切面
 * 用于拦截带有@RequireRole注解的方法或类，验证用户角色
 * 支持方法级别和类级别的注解，方法级别优先级更高
 * 通用切面，所有模块都可以使用
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RoleAuthorizationAspect {

    private final JwtUtil jwtUtil;

    /**
     * 拦截所有Controller方法，但只对带有@RequireRole注解的方法进行权限验证
     */
    @Before("execution(* com.example..controller..*(..))")
    public void checkRole(JoinPoint joinPoint) {
        // 优先使用方法级别的注解，如果没有则使用类级别的注解
        RequireRole methodAnnotation = null;
        RequireRole classAnnotation = null;
        
        try {
            // 获取方法签名
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            
            // 获取方法级别的注解
            methodAnnotation = method.getAnnotation(RequireRole.class);
            
            // 获取类级别的注解
            Class<?> declaringClass = joinPoint.getSignature().getDeclaringType();
            classAnnotation = declaringClass != null ? declaringClass.getAnnotation(RequireRole.class) : null;
        } catch (Exception e) {
            log.warn("获取注解失败: {}", e.getMessage());
        }
        
        // 优先使用方法级别的注解
        RequireRole targetAnnotation = methodAnnotation != null ? methodAnnotation : classAnnotation;
        
        // 如果既没有方法级别也没有类级别的注解，允许访问（不需要权限验证）
        if (targetAnnotation == null) {
            return;
        }
        
        // 有注解，需要进行权限验证
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new AuthenticationException("无法获取请求信息");
        }

        HttpServletRequest request = attributes.getRequest();
        String token = getTokenFromRequest(request);

        if (token == null) {
            throw new AuthenticationException("未提供Token，请先登录");
        }

        // 使用改进的验证方法获取详细错误信息
        String validationError = jwtUtil.validateTokenWithMessage(token);
        if (validationError != null) {
            throw new AuthenticationException(validationError);
        }

        // 获取用户角色
        String userRole = jwtUtil.getRoleFromToken(token);
        String[] requiredRoles = targetAnnotation.value();

        // 检查用户角色是否在允许的角色列表中
        boolean hasPermission = Arrays.asList(requiredRoles).contains(userRole);

        if (!hasPermission) {
            throw new AuthorizationException("权限不足，需要角色: " + Arrays.toString(requiredRoles));
        }
    }

    /**
     * 从请求中获取Token
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

