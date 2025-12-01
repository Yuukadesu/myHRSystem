package com.example.storage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.common.entity.Organization;

import java.util.List;

/**
 * 机构表 Mapper 接口
 */
public interface OrganizationMapper extends BaseMapper<Organization> {
    /**
     * 根据父机构ID查询子机构列表
     *
     * @param parentId 父机构ID
     * @return 子机构列表
     */
    List<Organization> selectByParentId(Long parentId);

    /**
     * 根据机构级别查询机构列表
     *
     * @param orgLevel 机构级别：1(一级机构), 2(二级机构), 3(三级机构)
     * @return 机构列表
     */
    List<Organization> selectByOrgLevel(Integer orgLevel);
}

