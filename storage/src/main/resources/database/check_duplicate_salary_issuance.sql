-- 检查重复的薪酬发放单数据
-- 用于诊断问题

-- 1. 查找所有重复的记录（同一机构同一月份有多条记录）
SELECT 
    third_org_id,
    issuance_month,
    COUNT(*) as duplicate_count,
    GROUP_CONCAT(
        CONCAT('ID:', issuance_id, 
               ' 单号:', IFNULL(salary_slip_number, '无'), 
               ' 状态:', status,
               ' 创建时间:', create_time)
        ORDER BY issuance_id 
        SEPARATOR ' | '
    ) as details
FROM salary_issuance
GROUP BY third_org_id, issuance_month
HAVING COUNT(*) > 1
ORDER BY third_org_id, issuance_month;

-- 2. 查看某个具体机构的重复记录详情
-- 将下面的 ? 替换为实际的 third_org_id 和 issuance_month
-- 例如：WHERE third_org_id = 9 AND issuance_month = '2025-12-01'
SELECT 
    issuance_id,
    salary_slip_number,
    third_org_id,
    issuance_month,
    status,
    total_employees,
    total_basic_salary,
    total_net_pay,
    create_time,
    update_time
FROM salary_issuance
WHERE third_org_id = ? AND issuance_month = ?
ORDER BY 
    CASE status
        WHEN 'PENDING_REGISTRATION' THEN 1
        WHEN 'PENDING_REVIEW' THEN 2
        WHEN 'REJECTED' THEN 3
        WHEN 'EXECUTED' THEN 4
        WHEN 'PAID' THEN 5
        ELSE 6
    END,
    create_time DESC;

-- 3. 查找没有薪酬单号的记录（可能是数据异常）
SELECT 
    issuance_id,
    third_org_id,
    issuance_month,
    status,
    create_time
FROM salary_issuance
WHERE salary_slip_number IS NULL OR salary_slip_number = '';

