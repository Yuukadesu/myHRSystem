# 测试数据使用说明

## 文件说明

`test_data.sql` 包含了系统的测试数据，用于填充空表，方便测试系统功能。

## 数据内容

### 1. 薪酬标准 (salary_standard)
- **6条记录**：包含不同职位和职称的薪酬标准
  - 前端工程师：初级、中级、高级标准（其中高级标准待复核）
  - 后端工程师：中级、高级标准
  - 产品经理：中级标准

### 2. 薪酬标准明细 (salary_standard_item)
- **54条记录**：为每个薪酬标准配置了9个薪酬项目
  - 收入项：基本工资、绩效奖金、交通补贴、餐费补贴、全勤奖
  - 扣除项：养老保险、医疗保险、失业保险、住房公积金（自动计算）

### 3. 员工档案 (employee_archive)
- **5条记录**：
  - **已复核通过**（3条）：
    - 张三 - 前端工程师（中级）
    - 李四 - 后端工程师（中级）
    - 王五 - 产品经理（中级）
  - **待复核**（2条）：
    - 赵六 - 前端工程师（初级）
    - 孙七 - 后端工程师（初级，未设置薪酬标准）

### 4. 薪酬发放单 (salary_issuance)
- **2条记录**：
  - **已复核通过**：PAY202501001（前端组，2025年1月）
  - **待复核**：PAY202501002（后端组，2025年1月）

### 5. 薪酬发放明细 (salary_issuance_detail)
- **3条记录**：
  - 张三的薪酬明细（已复核）
  - 赵六的薪酬明细（已复核）
  - 李四的薪酬明细（待复核）

## 使用方法

### 方法1：在IDEA Database工具中执行

1. 打开IDEA的Database工具
2. 连接到 `myHRSystem` 数据库
3. 打开 `test_data.sql` 文件
4. 全选SQL内容，右键选择 `Execute` 或按 `Ctrl+Enter`
5. 等待执行完成

### 方法2：使用命令行执行

```bash
# 进入项目目录
cd E:\myHRSystem

# 执行SQL文件（需要先设置MySQL路径）
mysql -u root -p123456 myHRSystem < storage/src/main/resources/database/test_data.sql
```

### 方法3：在MySQL客户端执行

1. 打开MySQL客户端（如Navicat、MySQL Workbench等）
2. 连接到数据库
3. 打开 `test_data.sql` 文件
4. 执行SQL脚本

## 数据关系说明

```
organization (机构)
  ├── position (职位)
  │     └── salary_standard (薪酬标准)
  │           └── salary_standard_item (薪酬标准明细)
  │
  └── employee_archive (员工档案)
        └── salary_issuance (薪酬发放单)
              └── salary_issuance_detail (薪酬发放明细)
```

## 测试场景

### 1. 人事专员功能测试
- **档案登记**：可以登记新员工（如孙七）
- **档案查询**：可以查询所有员工档案

### 2. 人事经理功能测试
- **档案复核**：可以复核待复核的档案（赵六、孙七）
- **档案查询**：可以查询所有员工档案
- **删除管理**：可以查看已删除的档案（当前无）

### 3. 薪酬专员功能测试
- **标准登记**：可以登记新的薪酬标准
- **标准查询**：可以查询所有薪酬标准
- **标准变更**：可以变更已通过的薪酬标准
- **发放登记**：可以登记新的薪酬发放单
- **发放查询**：可以查询所有薪酬发放单

### 4. 薪酬经理功能测试
- **标准复核**：可以复核待复核的薪酬标准（前端工程师-高级标准）
- **标准查询**：可以查询所有薪酬标准
- **发放复核**：可以复核待复核的发放单（PAY202501002）
- **发放查询**：可以查询所有薪酬发放单

## 注意事项

1. **外键约束**：数据插入顺序已按照依赖关系排列，请按顺序执行
2. **AUTO_INCREMENT**：如果表中已有数据，ID可能会冲突，建议先清空表或调整ID
3. **日期数据**：测试数据使用的是2025年的日期，请根据实际情况调整
4. **金额计算**：扣除项的计算基于基本工资，实际金额可能略有差异

## 清空测试数据（可选）

如果需要清空测试数据，可以执行以下SQL：

```sql
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM salary_issuance_detail;
DELETE FROM salary_issuance;
DELETE FROM employee_archive;
DELETE FROM salary_standard_item;
DELETE FROM salary_standard;

SET FOREIGN_KEY_CHECKS = 1;
```

## 数据验证

执行完测试数据后，可以执行以下查询验证：

```sql
-- 查看薪酬标准数量
SELECT COUNT(*) FROM salary_standard;

-- 查看员工档案数量
SELECT COUNT(*) FROM employee_archive WHERE status = 'NORMAL';
SELECT COUNT(*) FROM employee_archive WHERE status = 'PENDING_REVIEW';

-- 查看薪酬发放单数量
SELECT COUNT(*) FROM salary_issuance WHERE status = 'EXECUTED';
SELECT COUNT(*) FROM salary_issuance WHERE status = 'PENDING_REVIEW';
```

