-- 将状态为"已驳回"（REJECTED）的薪酬发放单更新为"待复核"（PENDING_REVIEW）
-- 这样这些记录可以重新被复核

UPDATE `salary_issuance` 
SET `status` = 'PENDING_REVIEW',
    `reject_reason` = NULL,
    `reviewer_id` = NULL,
    `review_time` = NULL,
    `update_time` = NOW()
WHERE `status` = 'REJECTED';

-- 查看更新结果
SELECT 
    `issuance_id`,
    `salary_slip_number`,
    `status`,
    `reject_reason`,
    `update_time`
FROM `salary_issuance`
WHERE `status` = 'PENDING_REVIEW'
ORDER BY `update_time` DESC;

