package com.example.system.management.controller;

import com.example.common.annotation.RequireRole;
import com.example.common.dto.ApiResponse;
import com.example.common.dto.CreatePositionRequest;
import com.example.common.dto.PositionResponse;
import com.example.common.dto.UpdatePositionRequest;
import com.example.common.entity.Organization;
import com.example.common.entity.Position;
import com.example.common.enums.OrgStatus;
import com.example.storage.service.OrganizationService;
import com.example.storage.service.PositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 职位设置 Controller
 */
@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;
    private final OrganizationService organizationService;

    /**
     * 获取职位列表，支持按三级机构筛选
     */
    @GetMapping
    public ApiResponse<List<PositionResponse>> getPositions(@RequestParam(required = false) Long thirdOrgId) {
        List<Position> positions;
        if (thirdOrgId != null) {
            positions = positionService.getByThirdOrgId(thirdOrgId);
        } else {
            positions = positionService.list();
        }

        // 只返回激活状态的职位
        List<PositionResponse> responses = positions.stream()
                .filter(position -> OrgStatus.ACTIVE.getCode().equals(position.getStatus()))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("查询成功", responses);
    }

    /**
     * 获取职位详情
     */
    @GetMapping("/{positionId}")
    public ApiResponse<PositionResponse> getPosition(@PathVariable Long positionId) {
        Position position = positionService.getById(positionId);
        if (position == null) {
            return ApiResponse.error(404, "职位不存在");
        }
        return ApiResponse.success("查询成功", convertToResponse(position));
    }

    /**
     * 创建职位
     */
    @PostMapping
    @RequireRole({"HR_MANAGER", "SALARY_MANAGER"})
    public ApiResponse<PositionResponse> createPosition(@Valid @RequestBody CreatePositionRequest request) {
        try {
            // 记录请求信息，便于调试
            System.out.println("创建职位请求: positionName=" + request.getPositionName() + ", thirdOrgId=" + request.getThirdOrgId());
            
            // 验证必填字段
            if (request.getPositionName() == null || request.getPositionName().trim().isEmpty()) {
                return ApiResponse.error(400, "职位名称不能为空");
            }
            if (request.getThirdOrgId() == null) {
                return ApiResponse.error(400, "所属三级机构ID不能为空");
            }
            
            // 验证三级机构是否存在且为激活状态
            Organization thirdOrg = organizationService.getById(request.getThirdOrgId());
            if (thirdOrg == null) {
                return ApiResponse.error(404, "三级机构不存在，ID: " + request.getThirdOrgId());
            }
            if (thirdOrg.getOrgLevel() == null || !thirdOrg.getOrgLevel().equals(3)) {
                return ApiResponse.error(400, "指定的机构不是三级机构，当前级别: " + thirdOrg.getOrgLevel());
            }
            if (thirdOrg.getStatus() == null || !OrgStatus.ACTIVE.getCode().equals(thirdOrg.getStatus())) {
                return ApiResponse.error(400, "指定的三级机构未激活，当前状态: " + thirdOrg.getStatus());
            }
            
            Position position = new Position();
            position.setPositionName(request.getPositionName().trim());
            position.setThirdOrgId(request.getThirdOrgId());
            if (request.getDescription() != null && !request.getDescription().trim().isEmpty()) {
                position.setDescription(request.getDescription().trim());
            }
            position.setStatus(OrgStatus.ACTIVE.getCode());

            // 保存职位（MyBatis-Plus 的 save 方法会自动设置生成的ID）
            System.out.println("准备保存职位: " + position);
            boolean saved = positionService.save(position);
            System.out.println("保存结果: " + saved + ", 职位ID: " + position.getPositionId());
            
            if (!saved) {
                return ApiResponse.error(500, "创建失败：保存操作失败");
            }
            
            // 检查ID是否已生成
            if (position.getPositionId() == null) {
                return ApiResponse.error(500, "创建失败：职位ID未生成");
            }
            
            // 重新获取保存后的职位，确保包含所有字段（如自动生成的时间戳）
            Position savedPosition = positionService.getById(position.getPositionId());
            if (savedPosition == null) {
                return ApiResponse.error(500, "创建失败：无法获取保存后的职位信息");
            }
            
            System.out.println("保存后的职位: " + savedPosition);
            
            try {
                PositionResponse response = convertToResponse(savedPosition);
                System.out.println("转换后的响应: " + response);
                return ApiResponse.success("创建成功", response);
            } catch (Exception e) {
                System.err.println("转换响应对象时出错: " + e.getMessage());
                e.printStackTrace();
                return ApiResponse.error(500, "创建失败：转换响应对象时出错: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("创建职位时发生异常: " + e.getMessage());
            e.printStackTrace(); // 打印异常堆栈，便于调试
            return ApiResponse.error(500, "创建失败: " + e.getMessage());
        }
    }

    /**
     * 更新职位
     */
    @PutMapping("/{positionId}")
    @RequireRole({"HR_MANAGER", "SALARY_MANAGER"})
    public ApiResponse<PositionResponse> updatePosition(@PathVariable Long positionId,
                                                         @Valid @RequestBody UpdatePositionRequest request) {
        Position position = positionService.getById(positionId);
        if (position == null) {
            return ApiResponse.error(404, "职位不存在");
        }

        if (request.getPositionName() != null) {
            position.setPositionName(request.getPositionName());
        }
        if (request.getDescription() != null) {
            position.setDescription(request.getDescription());
        }

        positionService.updateById(position);
        return ApiResponse.success("更新成功", convertToResponse(position));
    }

    /**
     * 删除职位（软删除）
     */
    @DeleteMapping("/{positionId}")
    @RequireRole({"HR_MANAGER", "SALARY_MANAGER"})
    public ApiResponse<Void> deletePosition(@PathVariable Long positionId) {
        Position position = positionService.getById(positionId);
        if (position == null) {
            return ApiResponse.error(404, "职位不存在");
        }

        // 软删除：设置状态为INACTIVE
        position.setStatus(OrgStatus.INACTIVE.getCode());
        positionService.updateById(position);
        return ApiResponse.success("删除成功", null);
    }

    /**
     * 转换为响应对象
     */
    private PositionResponse convertToResponse(Position position) {
        if (position == null) {
            throw new IllegalArgumentException("职位对象不能为空");
        }
        
        PositionResponse response = new PositionResponse();
        BeanUtils.copyProperties(position, response);

        // 填充三级机构信息（如果查询失败，不影响主流程）
        try {
            if (position.getThirdOrgId() != null) {
                Organization thirdOrg = organizationService.getById(position.getThirdOrgId());
                if (thirdOrg != null) {
                    response.setThirdOrgName(thirdOrg.getOrgName());

                    // 构建机构全路径
                    if (thirdOrg.getParentId() != null) {
                        Organization secondOrg = organizationService.getById(thirdOrg.getParentId());
                        if (secondOrg != null && secondOrg.getParentId() != null) {
                            Organization firstOrg = organizationService.getById(secondOrg.getParentId());
                            if (firstOrg != null) {
                                response.setOrgFullPath(
                                        firstOrg.getOrgName() + "/" + secondOrg.getOrgName() + "/" + thirdOrg.getOrgName()
                                );
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            // 如果查询机构信息失败，记录日志但不影响主流程
            System.err.println("警告：查询机构信息失败: " + e.getMessage());
            e.printStackTrace();
            // 继续执行，不抛出异常
        }

        return response;
    }
}

