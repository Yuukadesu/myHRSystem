package com.example.storage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.common.entity.Position;

import java.util.List;

/**
 * 职位表 Mapper 接口
 */
public interface PositionMapper extends BaseMapper<Position> {
    /**
     * 根据三级机构ID查询职位列表
     *
     * @param thirdOrgId 三级机构ID
     * @return 职位列表
     */
    List<Position> selectByThirdOrgId(Long thirdOrgId);
}

