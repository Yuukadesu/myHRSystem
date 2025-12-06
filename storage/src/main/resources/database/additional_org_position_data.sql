-- ============================================
-- 扩展的机构和职位数据
-- 用于增加更多测试数据，丰富系统内容
-- 
-- 使用方法：
-- 1. 在MySQL客户端中执行此脚本
-- 2. 或者使用命令行：mysql -u root -p myHRSystem < additional_org_position_data.sql
-- ============================================

USE myHRSystem;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. 添加更多机构数据
-- ============================================

-- 添加一级机构
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('03', '运营中心', 1, NULL, '负责产品运营和用户增长', 'ACTIVE', NOW(), NOW()),
('04', '财务中心', 1, NULL, '负责公司财务管理和会计核算', 'ACTIVE', NOW(), NOW()),
('05', '人事中心', 1, NULL, '负责人力资源管理和招聘', 'ACTIVE', NOW(), NOW());

-- 获取刚插入的一级机构ID（使用变量）
SET @运营中心_id = (SELECT org_id FROM organization WHERE org_code = '03' AND org_level = 1 ORDER BY org_id DESC LIMIT 1);
SET @财务中心_id = (SELECT org_id FROM organization WHERE org_code = '04' AND org_level = 1 ORDER BY org_id DESC LIMIT 1);
SET @人事中心_id = (SELECT org_id FROM organization WHERE org_code = '05' AND org_level = 1 ORDER BY org_id DESC LIMIT 1);

-- 添加二级机构（运营中心下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '用户运营部', 2, @运营中心_id, '负责用户增长和活跃度提升', 'ACTIVE', NOW(), NOW()),
('02', '内容运营部', 2, @运营中心_id, '负责内容策划和运营', 'ACTIVE', NOW(), NOW()),
('03', '数据分析部', 2, @运营中心_id, '负责数据分析和运营支持', 'ACTIVE', NOW(), NOW());

-- 添加二级机构（财务中心下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '会计核算部', 2, @财务中心_id, '负责日常会计核算', 'ACTIVE', NOW(), NOW()),
('02', '财务管理部', 2, @财务中心_id, '负责财务预算和资金管理', 'ACTIVE', NOW(), NOW());

-- 添加二级机构（人事中心下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '招聘部', 2, @人事中心_id, '负责人才招聘', 'ACTIVE', NOW(), NOW()),
('02', '人事管理部', 2, @人事中心_id, '负责员工关系管理', 'ACTIVE', NOW(), NOW());

-- 获取二级机构ID
SET @用户运营部_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 2 AND parent_id = @运营中心_id ORDER BY org_id DESC LIMIT 1);
SET @内容运营部_id = (SELECT org_id FROM organization WHERE org_code = '02' AND org_level = 2 AND parent_id = @运营中心_id ORDER BY org_id DESC LIMIT 1);
SET @数据分析部_id = (SELECT org_id FROM organization WHERE org_code = '03' AND org_level = 2 AND parent_id = @运营中心_id ORDER BY org_id DESC LIMIT 1);
SET @会计核算部_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 2 AND parent_id = @财务中心_id ORDER BY org_id DESC LIMIT 1);
SET @财务管理部_id = (SELECT org_id FROM organization WHERE org_code = '02' AND org_level = 2 AND parent_id = @财务中心_id ORDER BY org_id DESC LIMIT 1);
SET @招聘部_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 2 AND parent_id = @人事中心_id ORDER BY org_id DESC LIMIT 1);
SET @人事管理部_id = (SELECT org_id FROM organization WHERE org_code = '02' AND org_level = 2 AND parent_id = @人事中心_id ORDER BY org_id DESC LIMIT 1);

-- 添加三级机构（用户运营部下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '用户增长组', 3, @用户运营部_id, '负责新用户获取', 'ACTIVE', NOW(), NOW()),
('02', '用户留存组', 3, @用户运营部_id, '负责用户活跃和留存', 'ACTIVE', NOW(), NOW());

-- 添加三级机构（内容运营部下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '内容策划组', 3, @内容运营部_id, '负责内容策划', 'ACTIVE', NOW(), NOW()),
('02', '内容编辑组', 3, @内容运营部_id, '负责内容编辑和发布', 'ACTIVE', NOW(), NOW());

-- 添加三级机构（数据分析部下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '数据运营组', 3, @数据分析部_id, '负责运营数据分析', 'ACTIVE', NOW(), NOW());

-- 添加三级机构（会计核算部下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '成本会计组', 3, @会计核算部_id, '负责成本核算', 'ACTIVE', NOW(), NOW()),
('02', '总账会计组', 3, @会计核算部_id, '负责总账核算', 'ACTIVE', NOW(), NOW());

-- 添加三级机构（财务管理部下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '预算管理组', 3, @财务管理部_id, '负责预算编制和管理', 'ACTIVE', NOW(), NOW());

-- 添加三级机构（招聘部下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '技术招聘组', 3, @招聘部_id, '负责技术岗位招聘', 'ACTIVE', NOW(), NOW()),
('02', '非技术招聘组', 3, @招聘部_id, '负责非技术岗位招聘', 'ACTIVE', NOW(), NOW());

-- 添加三级机构（人事管理部下）
INSERT INTO `organization` (`org_code`, `org_name`, `org_level`, `parent_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('01', '员工关系组', 3, @人事管理部_id, '负责员工关系管理', 'ACTIVE', NOW(), NOW());

-- ============================================
-- 2. 添加更多职位数据
-- ============================================

-- 获取三级机构ID
SET @用户增长组_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 3 AND parent_id = @用户运营部_id ORDER BY org_id DESC LIMIT 1);
SET @用户留存组_id = (SELECT org_id FROM organization WHERE org_code = '02' AND org_level = 3 AND parent_id = @用户运营部_id ORDER BY org_id DESC LIMIT 1);
SET @内容策划组_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 3 AND parent_id = @内容运营部_id ORDER BY org_id DESC LIMIT 1);
SET @内容编辑组_id = (SELECT org_id FROM organization WHERE org_code = '02' AND org_level = 3 AND parent_id = @内容运营部_id ORDER BY org_id DESC LIMIT 1);
SET @数据运营组_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 3 AND parent_id = @数据分析部_id ORDER BY org_id DESC LIMIT 1);
SET @成本会计组_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 3 AND parent_id = @会计核算部_id ORDER BY org_id DESC LIMIT 1);
SET @总账会计组_id = (SELECT org_id FROM organization WHERE org_code = '02' AND org_level = 3 AND parent_id = @会计核算部_id ORDER BY org_id DESC LIMIT 1);
SET @预算管理组_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 3 AND parent_id = @财务管理部_id ORDER BY org_id DESC LIMIT 1);
SET @技术招聘组_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 3 AND parent_id = @招聘部_id ORDER BY org_id DESC LIMIT 1);
SET @非技术招聘组_id = (SELECT org_id FROM organization WHERE org_code = '02' AND org_level = 3 AND parent_id = @招聘部_id ORDER BY org_id DESC LIMIT 1);
SET @员工关系组_id = (SELECT org_id FROM organization WHERE org_code = '01' AND org_level = 3 AND parent_id = @人事管理部_id ORDER BY org_id DESC LIMIT 1);

-- 用户运营部职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('用户增长专员', @用户增长组_id, '负责用户增长策略制定和执行', 'ACTIVE', NOW(), NOW()),
('用户运营专员', @用户留存组_id, '负责用户活跃和留存运营', 'ACTIVE', NOW(), NOW());

-- 内容运营部职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('内容策划专员', @内容策划组_id, '负责内容策划和选题', 'ACTIVE', NOW(), NOW()),
('内容编辑', @内容编辑组_id, '负责内容编辑和发布', 'ACTIVE', NOW(), NOW());

-- 数据分析部职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('数据分析师', @数据运营组_id, '负责运营数据分析和报表', 'ACTIVE', NOW(), NOW());

-- 会计核算部职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('成本会计', @成本会计组_id, '负责成本核算和分析', 'ACTIVE', NOW(), NOW()),
('总账会计', @总账会计组_id, '负责总账核算和报表', 'ACTIVE', NOW(), NOW());

-- 财务管理部职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('预算专员', @预算管理组_id, '负责预算编制和管理', 'ACTIVE', NOW(), NOW());

-- 招聘部职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('技术招聘专员', @技术招聘组_id, '负责技术岗位招聘', 'ACTIVE', NOW(), NOW()),
('招聘专员', @非技术招聘组_id, '负责非技术岗位招聘', 'ACTIVE', NOW(), NOW());

-- 人事管理部职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('人事专员', @员工关系组_id, '负责员工关系管理', 'ACTIVE', NOW(), NOW());

-- 为现有机构添加更多职位
INSERT INTO `position` (`position_name`, `third_org_id`, `description`, `status`, `create_time`, `update_time`) VALUES
('UI设计师', 6, '负责产品界面设计', 'ACTIVE', NOW(), NOW()),
('运维工程师', 7, '负责系统运维和监控', 'ACTIVE', NOW(), NOW()),
('测试工程师', 6, '负责前端功能测试', 'ACTIVE', NOW(), NOW()),
('测试工程师', 7, '负责后端功能测试', 'ACTIVE', NOW(), NOW());

-- ============================================
-- 3. 添加薪酬标准数据
-- ============================================

-- 获取职位ID
SET @用户增长专员_position_id = (SELECT position_id FROM position WHERE position_name = '用户增长专员' ORDER BY position_id DESC LIMIT 1);
SET @用户运营专员_position_id = (SELECT position_id FROM position WHERE position_name = '用户运营专员' ORDER BY position_id DESC LIMIT 1);
SET @内容策划专员_position_id = (SELECT position_id FROM position WHERE position_name = '内容策划专员' ORDER BY position_id DESC LIMIT 1);
SET @内容编辑_position_id = (SELECT position_id FROM position WHERE position_name = '内容编辑' ORDER BY position_id DESC LIMIT 1);
SET @数据分析师_position_id = (SELECT position_id FROM position WHERE position_name = '数据分析师' ORDER BY position_id DESC LIMIT 1);
SET @成本会计_position_id = (SELECT position_id FROM position WHERE position_name = '成本会计' ORDER BY position_id DESC LIMIT 1);
SET @总账会计_position_id = (SELECT position_id FROM position WHERE position_name = '总账会计' ORDER BY position_id DESC LIMIT 1);
SET @预算专员_position_id = (SELECT position_id FROM position WHERE position_name = '预算专员' ORDER BY position_id DESC LIMIT 1);
SET @技术招聘专员_position_id = (SELECT position_id FROM position WHERE position_name = '技术招聘专员' ORDER BY position_id DESC LIMIT 1);
SET @招聘专员_position_id = (SELECT position_id FROM position WHERE position_name = '招聘专员' ORDER BY position_id DESC LIMIT 1);
SET @人事专员_position_id = (SELECT position_id FROM position WHERE position_name = '人事专员' ORDER BY position_id DESC LIMIT 1);
SET @UI设计师_position_id = (SELECT position_id FROM position WHERE position_name = 'UI设计师' AND third_org_id = 6 ORDER BY position_id DESC LIMIT 1);
SET @运维工程师_position_id = (SELECT position_id FROM position WHERE position_name = '运维工程师' ORDER BY position_id DESC LIMIT 1);

-- 创建薪酬标准（状态为APPROVED，已审核通过）
INSERT INTO `salary_standard` (`standard_code`, `standard_name`, `position_id`, `job_title`, `formulator_id`, `registrar_id`, `registration_time`, `reviewer_id`, `review_time`, `review_comments`, `status`, `create_time`, `update_time`) VALUES
-- 运营中心职位
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '001'), '用户增长专员-中级标准', @用户增长专员_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '002'), '用户运营专员-中级标准', @用户运营专员_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '003'), '内容策划专员-中级标准', @内容策划专员_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '004'), '内容编辑-中级标准', @内容编辑_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '005'), '数据分析师-中级标准', @数据分析师_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
-- 财务中心职位
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '006'), '成本会计-中级标准', @成本会计_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '007'), '总账会计-中级标准', @总账会计_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '008'), '预算专员-中级标准', @预算专员_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
-- 人事中心职位
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '009'), '技术招聘专员-中级标准', @技术招聘专员_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '010'), '招聘专员-中级标准', @招聘专员_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '011'), '人事专员-中级标准', @人事专员_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
-- 技术中心新增职位
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '012'), 'UI设计师-中级标准', @UI设计师_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(CONCAT('SAL', DATE_FORMAT(NOW(), '%Y%m%d'), '013'), '运维工程师-中级标准', @运维工程师_position_id, 'INTERMEDIATE', NULL, 2, NOW(), 3, DATE_ADD(NOW(), INTERVAL 1 DAY), '标准合理，已通过', 'APPROVED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- 获取薪酬标准ID
SET @用户增长专员_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @用户增长专员_position_id ORDER BY standard_id DESC LIMIT 1);
SET @用户运营专员_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @用户运营专员_position_id ORDER BY standard_id DESC LIMIT 1);
SET @内容策划专员_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @内容策划专员_position_id ORDER BY standard_id DESC LIMIT 1);
SET @内容编辑_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @内容编辑_position_id ORDER BY standard_id DESC LIMIT 1);
SET @数据分析师_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @数据分析师_position_id ORDER BY standard_id DESC LIMIT 1);
SET @成本会计_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @成本会计_position_id ORDER BY standard_id DESC LIMIT 1);
SET @总账会计_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @总账会计_position_id ORDER BY standard_id DESC LIMIT 1);
SET @预算专员_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @预算专员_position_id ORDER BY standard_id DESC LIMIT 1);
SET @技术招聘专员_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @技术招聘专员_position_id ORDER BY standard_id DESC LIMIT 1);
SET @招聘专员_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @招聘专员_position_id ORDER BY standard_id DESC LIMIT 1);
SET @人事专员_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @人事专员_position_id ORDER BY standard_id DESC LIMIT 1);
SET @UI设计师_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @UI设计师_position_id ORDER BY standard_id DESC LIMIT 1);
SET @运维工程师_standard_id = (SELECT standard_id FROM salary_standard WHERE position_id = @运维工程师_position_id ORDER BY standard_id DESC LIMIT 1);

-- 创建薪酬标准明细（为每个标准添加基本薪酬项目）
-- 用户增长专员
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@用户增长专员_standard_id, 1, 10000.00, 0, NOW(), NOW()),  -- 基本工资
(@用户增长专员_standard_id, 2, 2500.00, 0, NOW(), NOW()),  -- 绩效奖金
(@用户增长专员_standard_id, 3, 500.00, 0, NOW(), NOW()),   -- 交通补贴
(@用户增长专员_standard_id, 4, 300.00, 0, NOW(), NOW()),   -- 餐费补贴
(@用户增长专员_standard_id, 6, 0.00, 1, NOW(), NOW()),     -- 养老保险（自动计算）
(@用户增长专员_standard_id, 7, 0.00, 1, NOW(), NOW()),     -- 医疗保险（自动计算）
(@用户增长专员_standard_id, 8, 0.00, 1, NOW(), NOW()),     -- 失业保险（自动计算）
(@用户增长专员_standard_id, 9, 0.00, 1, NOW(), NOW());    -- 住房公积金（自动计算）

-- 用户运营专员
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@用户运营专员_standard_id, 1, 9500.00, 0, NOW(), NOW()),
(@用户运营专员_standard_id, 2, 2300.00, 0, NOW(), NOW()),
(@用户运营专员_standard_id, 3, 500.00, 0, NOW(), NOW()),
(@用户运营专员_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@用户运营专员_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@用户运营专员_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@用户运营专员_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@用户运营专员_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 内容策划专员
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@内容策划专员_standard_id, 1, 9000.00, 0, NOW(), NOW()),
(@内容策划专员_standard_id, 2, 2200.00, 0, NOW(), NOW()),
(@内容策划专员_standard_id, 3, 500.00, 0, NOW(), NOW()),
(@内容策划专员_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@内容策划专员_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@内容策划专员_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@内容策划专员_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@内容策划专员_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 内容编辑
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@内容编辑_standard_id, 1, 8500.00, 0, NOW(), NOW()),
(@内容编辑_standard_id, 2, 2000.00, 0, NOW(), NOW()),
(@内容编辑_standard_id, 3, 500.00, 0, NOW(), NOW()),
(@内容编辑_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@内容编辑_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@内容编辑_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@内容编辑_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@内容编辑_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 数据分析师
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@数据分析师_standard_id, 1, 11000.00, 0, NOW(), NOW()),
(@数据分析师_standard_id, 2, 3000.00, 0, NOW(), NOW()),
(@数据分析师_standard_id, 3, 500.00, 0, NOW(), NOW()),
(@数据分析师_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@数据分析师_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@数据分析师_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@数据分析师_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@数据分析师_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 成本会计
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@成本会计_standard_id, 1, 8000.00, 0, NOW(), NOW()),
(@成本会计_standard_id, 2, 1500.00, 0, NOW(), NOW()),
(@成本会计_standard_id, 3, 400.00, 0, NOW(), NOW()),
(@成本会计_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@成本会计_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@成本会计_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@成本会计_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@成本会计_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 总账会计
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@总账会计_standard_id, 1, 8500.00, 0, NOW(), NOW()),
(@总账会计_standard_id, 2, 1800.00, 0, NOW(), NOW()),
(@总账会计_standard_id, 3, 400.00, 0, NOW(), NOW()),
(@总账会计_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@总账会计_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@总账会计_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@总账会计_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@总账会计_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 预算专员
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@预算专员_standard_id, 1, 9000.00, 0, NOW(), NOW()),
(@预算专员_standard_id, 2, 2000.00, 0, NOW(), NOW()),
(@预算专员_standard_id, 3, 500.00, 0, NOW(), NOW()),
(@预算专员_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@预算专员_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@预算专员_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@预算专员_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@预算专员_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 技术招聘专员
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@技术招聘专员_standard_id, 1, 7500.00, 0, NOW(), NOW()),
(@技术招聘专员_standard_id, 2, 1500.00, 0, NOW(), NOW()),
(@技术招聘专员_standard_id, 3, 400.00, 0, NOW(), NOW()),
(@技术招聘专员_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@技术招聘专员_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@技术招聘专员_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@技术招聘专员_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@技术招聘专员_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 招聘专员
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@招聘专员_standard_id, 1, 7000.00, 0, NOW(), NOW()),
(@招聘专员_standard_id, 2, 1200.00, 0, NOW(), NOW()),
(@招聘专员_standard_id, 3, 400.00, 0, NOW(), NOW()),
(@招聘专员_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@招聘专员_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@招聘专员_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@招聘专员_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@招聘专员_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 人事专员
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@人事专员_standard_id, 1, 7500.00, 0, NOW(), NOW()),
(@人事专员_standard_id, 2, 1500.00, 0, NOW(), NOW()),
(@人事专员_standard_id, 3, 400.00, 0, NOW(), NOW()),
(@人事专员_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@人事专员_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@人事专员_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@人事专员_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@人事专员_standard_id, 9, 0.00, 1, NOW(), NOW());

-- UI设计师
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@UI设计师_standard_id, 1, 11000.00, 0, NOW(), NOW()),
(@UI设计师_standard_id, 2, 2800.00, 0, NOW(), NOW()),
(@UI设计师_standard_id, 3, 500.00, 0, NOW(), NOW()),
(@UI设计师_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@UI设计师_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@UI设计师_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@UI设计师_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@UI设计师_standard_id, 9, 0.00, 1, NOW(), NOW());

-- 运维工程师
INSERT INTO `salary_standard_item` (`standard_id`, `item_id`, `amount`, `is_calculated`, `create_time`, `update_time`) VALUES
(@运维工程师_standard_id, 1, 12000.00, 0, NOW(), NOW()),
(@运维工程师_standard_id, 2, 3000.00, 0, NOW(), NOW()),
(@运维工程师_standard_id, 3, 500.00, 0, NOW(), NOW()),
(@运维工程师_standard_id, 4, 300.00, 0, NOW(), NOW()),
(@运维工程师_standard_id, 6, 0.00, 1, NOW(), NOW()),
(@运维工程师_standard_id, 7, 0.00, 1, NOW(), NOW()),
(@运维工程师_standard_id, 8, 0.00, 1, NOW(), NOW()),
(@运维工程师_standard_id, 9, 0.00, 1, NOW(), NOW());

-- ============================================
-- 4. 添加员工档案数据
-- ============================================

-- 获取一级和二级机构ID（用于员工档案）
SET @运营中心_first_id = @运营中心_id;
SET @财务中心_first_id = @财务中心_id;
SET @人事中心_first_id = @人事中心_id;

-- 获取机构编号（用于生成档案编号）
SET @运营中心_code = '03';
SET @财务中心_code = '04';
SET @人事中心_code = '05';
SET @用户运营部_code = '01';
SET @内容运营部_code = '02';
SET @数据分析部_code = '03';
SET @会计核算部_code = '01';
SET @财务管理部_code = '02';
SET @招聘部_code = '01';
SET @人事管理部_code = '02';
SET @用户增长组_code = '01';
SET @用户留存组_code = '02';
SET @内容策划组_code = '01';
SET @内容编辑组_code = '02';
SET @数据运营组_code = '01';
SET @成本会计组_code = '01';
SET @总账会计组_code = '02';
SET @预算管理组_code = '01';
SET @技术招聘组_code = '01';
SET @非技术招聘组_code = '02';
SET @员工关系组_code = '01';

-- 创建员工档案（状态为NORMAL，已复核通过，有薪酬标准）
-- 注意：档案编号格式：年份4位+一级机构编号2位+二级机构编号2位+三级机构编号2位+员工编号2位
-- 例如：202503010101 = 2025年 + 03(运营中心) + 01(用户运营部) + 01(用户增长组) + 01(编号)

-- 用户增长组员工
INSERT INTO `employee_archive` (
  `archive_number`, `name`, `gender`, `id_number`, `birthday`, `age`, `nationality`, 
  `place_of_birth`, `ethnicity`, `religious_belief`, `political_status`, `education_level`, `major`,
  `email`, `phone`, `qq`, `mobile`, `address`, `postal_code`, `hobby`, `personal_resume`, `family_relationship`, `remarks`,
  `first_org_id`, `second_org_id`, `third_org_id`, `position_id`, `job_title`, `salary_standard_id`,
  `registrar_id`, `registration_time`, `reviewer_id`, `review_time`, `review_comments`, `status`,
  `create_time`, `update_time`
) VALUES
(CONCAT('2025', @运营中心_code, @用户运营部_code, @用户增长组_code, '01'), '陈八', 'MALE', '110101199201011234', '1992-01-01', 33, '中国', '北京', '汉族', '无', '团员', '本科', '市场营销',
 'chenba@example.com', '010-12345678', '111111111', '13800138010', '北京市海淀区xxx街道xxx号', '100000', '运动、阅读', '2010-2014 就读于XX大学市场营销系...', '父亲：陈XX，母亲：刘XX', '工作认真负责',
 @运营中心_first_id, @用户运营部_id, @用户增长组_id, @用户增长专员_position_id, 'INTERMEDIATE', @用户增长专员_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 用户留存组员工
(CONCAT('2025', @运营中心_code, @用户运营部_code, @用户留存组_code, '01'), '周九', 'FEMALE', '110101199303152345', '1993-03-15', 32, '中国', '上海', '汉族', '无', '党员', '本科', '市场营销',
 'zhoujiu@example.com', '021-87654321', '222222222', '13900139011', '上海市徐汇区xxx路xxx号', '200000', '旅游、摄影', '2011-2015 就读于XX大学市场营销系...', '父亲：周XX，母亲：吴XX', '运营能力强',
 @运营中心_first_id, @用户运营部_id, @用户留存组_id, @用户运营专员_position_id, 'INTERMEDIATE', @用户运营专员_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 内容策划组员工
(CONCAT('2025', @运营中心_code, @内容运营部_code, @内容策划组_code, '01'), '吴十', 'MALE', '110101199405203456', '1994-05-20', 31, '中国', '广州', '汉族', '无', '群众', '本科', '新闻传播',
 'wushi@example.com', '020-12345678', '333333333', '13700137012', '广州市越秀区xxx大道xxx号', '510000', '写作、阅读', '2012-2016 就读于XX大学新闻系...', '父亲：吴XX，母亲：郑XX', '内容策划能力强',
 @运营中心_first_id, @内容运营部_id, @内容策划组_id, @内容策划专员_position_id, 'INTERMEDIATE', @内容策划专员_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 内容编辑组员工
(CONCAT('2025', @运营中心_code, @内容运营部_code, @内容编辑组_code, '01'), '郑十一', 'FEMALE', '110101199507254567', '1995-07-25', 30, '中国', '深圳', '汉族', '无', '团员', '本科', '中文',
 'zhengshiyi@example.com', '0755-12345678', '444444444', '13600136013', '深圳市福田区xxx路xxx号', '518000', '编辑、阅读', '2013-2017 就读于XX大学中文系...', '父亲：郑XX，母亲：王XX', '文字功底好',
 @运营中心_first_id, @内容运营部_id, @内容编辑组_id, @内容编辑_position_id, 'INTERMEDIATE', @内容编辑_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 数据运营组员工
(CONCAT('2025', @运营中心_code, @数据分析部_code, @数据运营组_code, '01'), '王十二', 'MALE', '110101199610305678', '1996-10-30', 29, '中国', '杭州', '汉族', '无', '党员', '硕士', '统计学',
 'wangshier@example.com', '0571-87654321', '555555555', '13500135014', '杭州市西湖区xxx街xxx号', '310000', '数据分析、编程', '2014-2017 就读于XX大学统计系...', '父亲：王XX，母亲：冯XX', '数据分析能力强',
 @运营中心_first_id, @数据分析部_id, @数据运营组_id, @数据分析师_position_id, 'INTERMEDIATE', @数据分析师_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 成本会计组员工
(CONCAT('2025', @财务中心_code, @会计核算部_code, @成本会计组_code, '01'), '冯十三', 'FEMALE', '110101199701115789', '1997-01-11', 28, '中国', '成都', '汉族', '无', '群众', '本科', '会计学',
 'fengshisan@example.com', '028-12345678', '666666666', '13400134015', '成都市锦江区xxx路xxx号', '610000', '阅读、电影', '2015-2019 就读于XX大学会计系...', '父亲：冯XX，母亲：陈XX', '会计基础扎实',
 @财务中心_first_id, @会计核算部_id, @成本会计组_id, @成本会计_position_id, 'INTERMEDIATE', @成本会计_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 总账会计组员工
(CONCAT('2025', @财务中心_code, @会计核算部_code, @总账会计组_code, '01'), '陈十四', 'MALE', '110101199803206890', '1998-03-20', 27, '中国', '武汉', '汉族', '无', '团员', '本科', '财务管理',
 'chenshisi@example.com', '027-87654321', '777777777', '13300133016', '武汉市武昌区xxx大道xxx号', '430000', '运动、音乐', '2016-2020 就读于XX大学财务管理系...', '父亲：陈XX，母亲：褚XX', '财务分析能力强',
 @财务中心_first_id, @会计核算部_id, @总账会计组_id, @总账会计_position_id, 'INTERMEDIATE', @总账会计_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 预算管理组员工
(CONCAT('2025', @财务中心_code, @财务管理部_code, @预算管理组_code, '01'), '褚十五', 'FEMALE', '110101199905257901', '1999-05-25', 26, '中国', '西安', '汉族', '无', '党员', '本科', '财务管理',
 'chushiwu@example.com', '029-12345678', '888888888', '13200132017', '西安市雁塔区xxx路xxx号', '710000', '阅读、旅游', '2017-2021 就读于XX大学财务管理系...', '父亲：褚XX，母亲：卫XX', '预算管理经验丰富',
 @财务中心_first_id, @财务管理部_id, @预算管理组_id, @预算专员_position_id, 'INTERMEDIATE', @预算专员_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 技术招聘组员工
(CONCAT('2025', @人事中心_code, @招聘部_code, @技术招聘组_code, '01'), '卫十六', 'MALE', '110101200001308012', '2000-01-30', 25, '中国', '南京', '汉族', '无', '群众', '本科', '人力资源管理',
 'weishiliu@example.com', '025-87654321', '999999999', '13100131018', '南京市鼓楼区xxx街xxx号', '210000', '招聘、面试', '2018-2022 就读于XX大学人力资源管理系...', '父亲：卫XX，母亲：蒋XX', '招聘经验丰富',
 @人事中心_first_id, @招聘部_id, @技术招聘组_id, @技术招聘专员_position_id, 'INTERMEDIATE', @技术招聘专员_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 非技术招聘组员工
(CONCAT('2025', @人事中心_code, @招聘部_code, @非技术招聘组_code, '01'), '蒋十七', 'FEMALE', '110101200103151234', '2001-03-15', 24, '中国', '苏州', '汉族', '无', '团员', '本科', '人力资源管理',
 'jiangshigi@example.com', '0512-12345678', '101010101', '13000130019', '苏州市工业园区xxx路xxx号', '215000', '沟通、协调', '2019-2023 就读于XX大学人力资源管理系...', '父亲：蒋XX，母亲：沈XX', '沟通能力强',
 @人事中心_first_id, @招聘部_id, @非技术招聘组_id, @招聘专员_position_id, 'INTERMEDIATE', @招聘专员_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- 员工关系组员工
(CONCAT('2025', @人事中心_code, @人事管理部_code, @员工关系组_code, '01'), '沈十八', 'MALE', '110101200205202345', '2002-05-20', 23, '中国', '无锡', '汉族', '无', '党员', '本科', '人力资源管理',
 'shenshiba@example.com', '0510-87654321', '202020202', '12900129020', '无锡市滨湖区xxx大道xxx号', '214000', '员工关系、培训', '2020-2024 就读于XX大学人力资源管理系...', '父亲：沈XX，母亲：韩XX', '员工关系处理能力强',
 @人事中心_first_id, @人事管理部_id, @员工关系组_id, @人事专员_position_id, 'INTERMEDIATE', @人事专员_standard_id,
 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 3, DATE_SUB(NOW(), INTERVAL 9 DAY), '档案信息完整，已通过复核', 'NORMAL',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 说明
-- ============================================
-- 本脚本添加了以下内容：
-- 1. 3个一级机构：运营中心、财务中心、人事中心
-- 2. 8个二级机构：分布在3个一级机构下
-- 3. 12个三级机构：分布在各个二级机构下
-- 4. 15个职位：分布在各个三级机构下
-- 5. 13个薪酬标准：为新职位创建的中级薪酬标准（已审核通过）
-- 6. 13个薪酬标准明细：每个标准包含基本工资、绩效奖金、交通补贴、餐费补贴等
-- 7. 11个员工档案：分布在各个新三级机构下（状态为NORMAL，已复核通过，有薪酬标准）
--
-- 执行此脚本后：
-- ✅ 新添加的机构和职位会自动出现在系统中
-- ✅ 薪酬发放登记表单会立即显示新添加的三级机构（因为已有员工且有薪酬标准）
-- ✅ 每个新机构下至少有1名员工，可以直接进行薪酬发放登记
--
-- 员工分布：
-- - 用户增长组：1名员工（陈八）
-- - 用户留存组：1名员工（周九）
-- - 内容策划组：1名员工（吴十）
-- - 内容编辑组：1名员工（郑十一）
-- - 数据运营组：1名员工（王十二）
-- - 成本会计组：1名员工（冯十三）
-- - 总账会计组：1名员工（陈十四）
-- - 预算管理组：1名员工（褚十五）
-- - 技术招聘组：1名员工（卫十六）
-- - 非技术招聘组：1名员工（蒋十七）
-- - 员工关系组：1名员工（沈十八）

