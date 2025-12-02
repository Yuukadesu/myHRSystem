# 扩展机构和职位数据说明

## 文件说明

- `additional_org_position_data.sql` - 包含更多机构和职位数据的SQL脚本

## 使用方法

### 方法1：MySQL命令行执行

```bash
mysql -u root -p myHRSystem < storage/src/main/resources/database/additional_org_position_data.sql
```

### 方法2：MySQL客户端执行

1. 打开MySQL客户端（如Navicat、MySQL Workbench等）
2. 连接到 `myHRSystem` 数据库
3. 打开 `additional_org_position_data.sql` 文件
4. 执行SQL脚本

## 添加的数据内容

### 机构数据

1. **一级机构（3个）**
   - 运营中心
   - 财务中心
   - 人事中心

2. **二级机构（8个）**
   - 运营中心下：用户运营部、内容运营部、数据分析部
   - 财务中心下：会计核算部、财务管理部
   - 人事中心下：招聘部、人事管理部

3. **三级机构（12个）**
   - 用户运营部下：用户增长组、用户留存组
   - 内容运营部下：内容策划组、内容编辑组
   - 数据分析部下：数据运营组
   - 会计核算部下：成本会计组、总账会计组
   - 财务管理部下：预算管理组
   - 招聘部下：技术招聘组、非技术招聘组
   - 人事管理部下：员工关系组

### 职位数据（15个）

- 用户增长专员
- 用户运营专员
- 内容策划专员
- 内容编辑
- 数据分析师
- 成本会计
- 总账会计
- 预算专员
- 技术招聘专员
- 招聘专员
- 人事专员
- UI设计师（前端组）
- 运维工程师（后端组）
- 测试工程师（前端组）
- 测试工程师（后端组）

### 薪酬标准数据（13个）

为新添加的职位创建了中级薪酬标准，状态为 `APPROVED`（已审核通过），包含：
- 基本工资
- 绩效奖金
- 交通补贴
- 餐费补贴
- 社会保险和住房公积金（自动计算）

### 员工档案数据（11个）

为新添加的三级机构创建了员工档案，每个机构至少1名员工：
- **用户增长组**：陈八（用户增长专员）
- **用户留存组**：周九（用户运营专员）
- **内容策划组**：吴十（内容策划专员）
- **内容编辑组**：郑十一（内容编辑）
- **数据运营组**：王十二（数据分析师）
- **成本会计组**：冯十三（成本会计）
- **总账会计组**：陈十四（总账会计）
- **预算管理组**：褚十五（预算专员）
- **技术招聘组**：卫十六（技术招聘专员）
- **非技术招聘组**：蒋十七（招聘专员）
- **员工关系组**：沈十八（人事专员）

**所有员工状态为 `NORMAL`（正常），已复核通过，并已分配薪酬标准**

## 薪酬发放表单同步机制

### ✅ 会自动同步更新

**薪酬发放登记表单会自动包含新添加的机构和职位**，前提是：

1. **新机构必须是三级机构**（`org_level = 3`）
2. **该三级机构下有员工档案**（`employee_archive`）
3. **员工状态为正常**（`status = 'NORMAL'`）
4. **员工有薪酬标准**（`salary_standard_id IS NOT NULL`）

**✅ 本脚本已包含所有必要数据**：
- ✅ 已创建三级机构
- ✅ 已创建职位
- ✅ 已创建薪酬标准（已审核通过）
- ✅ 已创建员工档案（状态正常，有薪酬标准）

**执行脚本后，薪酬发放登记表单会立即显示所有新添加的三级机构！**

### 同步逻辑说明

薪酬发放登记表单的生成逻辑（`getPendingRegistrationList` 方法）：

```java
// 1. 查询所有三级机构
List<Organization> thirdOrgs = organizationService.getByOrgLevel(3);

// 2. 对每个三级机构
for (Organization thirdOrg : thirdOrgs) {
    // 3. 查询该机构下正常状态的员工
    List<EmployeeArchive> employees = employeeArchiveService.getByThirdOrgId(thirdOrg.getOrgId());
    employees = employees.stream()
        .filter(e -> EmployeeArchiveStatus.NORMAL.getCode().equals(e.getStatus()))
        .filter(e -> e.getSalaryStandardId() != null)  // 必须有薪酬标准
        .collect(Collectors.toList());
    
    // 4. 如果有符合条件的员工，显示在待登记列表中
    if (!employees.isEmpty()) {
        // 添加到待登记列表
    }
}
```

### 工作流程

1. **添加机构和职位** → 执行 `additional_org_position_data.sql`
2. **创建员工档案** → 在系统中登记新员工，分配到新机构和新职位
3. **设置薪酬标准** → 为新职位创建薪酬标准并审核通过
4. **分配薪酬标准** → 为员工分配对应的薪酬标准
5. **自动出现在表单** → 薪酬发放登记表单会自动显示该机构

### 注意事项

1. **仅三级机构会出现在薪酬发放表单中**
   - 一级和二级机构不会直接显示
   - 只有三级机构（最底层机构）才会出现在待登记列表中

2. **必须有员工且有薪酬标准**
   - 如果新机构下没有员工，不会显示
   - 如果员工没有薪酬标准，也不会显示

3. **员工状态必须是正常**
   - 待复核（`PENDING_REVIEW`）状态的员工不会包含
   - 已删除（`DELETED`）状态的员工不会包含

4. **已执行的记录不会重复显示**
   - 如果该机构该月份已有 `EXECUTED` 或 `PAID` 状态的发放单
   - 不会再次显示为待登记

## 示例场景

### 场景1：添加新机构后立即使用

1. 执行 `additional_org_position_data.sql` 添加新机构
2. 在系统中创建员工档案，分配到新机构
3. 为新职位创建薪酬标准
4. 为员工分配薪酬标准
5. **刷新薪酬发放登记页面** → 新机构会自动出现

### 场景2：已有机构添加新职位

1. 在现有三级机构下添加新职位
2. 创建员工档案，分配到新职位
3. 为新职位创建薪酬标准
4. 为员工分配薪酬标准
5. **刷新薪酬发放登记页面** → 该机构的员工人数和基本薪酬总额会自动更新

## 验证方法

执行以下SQL查询，检查新添加的数据：

```sql
-- 查看所有三级机构
SELECT org_id, org_name, org_level, parent_id 
FROM organization 
WHERE org_level = 3 
ORDER BY org_id;

-- 查看所有职位
SELECT position_id, position_name, third_org_id 
FROM position 
ORDER BY position_id;

-- 查看哪些三级机构会出现在薪酬发放表单中
SELECT 
    o.org_id,
    o.org_name,
    COUNT(e.archive_id) as employee_count
FROM organization o
LEFT JOIN employee_archive e ON o.org_id = e.third_org_id 
    AND e.status = 'NORMAL' 
    AND e.salary_standard_id IS NOT NULL
WHERE o.org_level = 3
GROUP BY o.org_id, o.org_name
HAVING employee_count > 0
ORDER BY o.org_id;
```

## 总结

✅ **薪酬发放表单会自动同步更新**，无需手动刷新或重启服务

✅ **只要满足条件**（三级机构 + 正常员工 + 有薪酬标准），新机构会自动出现在待登记列表中

✅ **实时更新**，添加数据后刷新页面即可看到

