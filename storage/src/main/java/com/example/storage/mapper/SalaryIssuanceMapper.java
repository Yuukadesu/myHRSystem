package com.example.storage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.common.entity.SalaryIssuance;

import java.time.LocalDate;
import java.util.List;

/**
 * 薪酬发放单表 Mapper 接口
 */
public interface SalaryIssuanceMapper extends BaseMapper<SalaryIssuance> {
    /**
     * 根据三级机构ID和发放月份查询薪酬发放单
     *
     * @param thirdOrgId   三级机构ID
     * @param issuanceMonth 发放月份
     * @return 薪酬发放单
     */
    SalaryIssuance selectByThirdOrgIdAndMonth(Long thirdOrgId, LocalDate issuanceMonth);

    /**
     * 根据状态查询薪酬发放单列表
     *
     * @param status 状态：PENDING_REGISTRATION(待登记), PENDING_REVIEW(待复核), EXECUTED(执行), PAID(已付款)
     * @return 薪酬发放单列表
     */
    List<SalaryIssuance> selectByStatus(String status);
}

