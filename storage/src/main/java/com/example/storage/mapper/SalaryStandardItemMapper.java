package com.example.storage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.common.entity.SalaryStandardItem;

import java.util.List;

/**
 * 薪酬标准明细表 Mapper 接口
 */
public interface SalaryStandardItemMapper extends BaseMapper<SalaryStandardItem> {
    /**
     * 根据薪酬标准ID查询薪酬标准明细列表
     *
     * @param standardId 薪酬标准ID
     * @return 薪酬标准明细列表
     */
    List<SalaryStandardItem> selectByStandardId(Long standardId);
}

