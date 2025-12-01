package com.example.storage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.common.entity.SalaryStandard;

import java.util.List;

/**
 * 薪酬标准表 Mapper 接口
 */
public interface SalaryStandardMapper extends BaseMapper<SalaryStandard> {
    /**
     * 根据职位ID和职称查询薪酬标准
     *
     * @param positionId 职位ID
     * @param jobTitle   职称：JUNIOR(初级), INTERMEDIATE(中级), SENIOR(高级)
     * @return 薪酬标准
     */
    SalaryStandard selectByPositionIdAndJobTitle(Long positionId, String jobTitle);

    /**
     * 根据状态查询薪酬标准列表
     *
     * @param status 状态：PENDING_REVIEW(待复核), APPROVED(已通过), REJECTED(已驳回)
     * @return 薪酬标准列表
     */
    List<SalaryStandard> selectByStatus(String status);
}

