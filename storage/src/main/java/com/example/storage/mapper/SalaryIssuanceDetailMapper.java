package com.example.storage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.common.entity.SalaryIssuanceDetail;

import java.util.List;

/**
 * 薪酬发放明细表 Mapper 接口
 */
public interface SalaryIssuanceDetailMapper extends BaseMapper<SalaryIssuanceDetail> {
    /**
     * 根据薪酬发放单ID查询薪酬发放明细列表
     *
     * @param issuanceId 薪酬发放单ID
     * @return 薪酬发放明细列表
     */
    List<SalaryIssuanceDetail> selectByIssuanceId(Long issuanceId);

    /**
     * 根据员工ID查询薪酬发放明细列表
     *
     * @param employeeId 员工ID
     * @return 薪酬发放明细列表
     */
    List<SalaryIssuanceDetail> selectByEmployeeId(Long employeeId);
}

