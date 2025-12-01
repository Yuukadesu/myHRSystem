package com.example.storage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.common.entity.SalaryItem;

import java.util.List;

/**
 * 薪酬项目表 Mapper 接口
 */
public interface SalaryItemMapper extends BaseMapper<SalaryItem> {
    /**
     * 根据项目类型查询薪酬项目列表
     *
     * @param itemType 项目类型：INCOME(收入项), DEDUCTION(扣除项)
     * @return 薪酬项目列表
     */
    List<SalaryItem> selectByItemType(String itemType);
}

