# IDEA 启动指南

## 📋 启动前准备

1. ✅ 确保 MySQL 服务已启动
2. ✅ 确保数据库 `myHRSystem` 已创建并导入数据
3. ✅ 确保所有模块已编译（`Build` → `Build Project`）

## 🚀 启动方式

### 方式1：逐个启动（推荐新手）

按以下顺序逐个启动4个服务：

#### 1. 认证服务（端口 8080）
- **文件路径**: `authorization-management/src/main/java/com/example/authorization/AuthorizationManagementApplication.java`
- **操作**: 右键 → `Run 'AuthorizationManagementApplication'`
- **等待**: 看到 `Started AuthorizationManagementApplication` 日志

#### 2. 系统管理服务（端口 8081）
- **文件路径**: `system-management/src/main/java/com/example/system/management/SystemManagementApplication.java`
- **操作**: 右键 → `Run 'SystemManagementApplication'`
- **等待**: 看到 `Started SystemManagementApplication` 日志

#### 3. 档案管理服务（端口 8082）
- **文件路径**: `human-resource-archive-management/src/main/java/com/example/human/resource/archive/management/HumanResourceArchiveManagementApplication.java`
- **操作**: 右键 → `Run 'HumanResourceArchiveManagementApplication'`
- **等待**: 看到 `Started HumanResourceArchiveManagementApplication` 日志

#### 4. 薪酬管理服务（端口 8083）
- **文件路径**: `human-resource-salary-management/src/main/java/com/example/human/resource/salary/management/HumanResourceSalaryManagementApplication.java`
- **操作**: 右键 → `Run 'HumanResourceSalaryManagementApplication'`
- **等待**: 看到 `Started HumanResourceSalaryManagementApplication` 日志

### 方式2：配置 Compound 运行配置（一次启动所有服务）

#### 步骤1：创建 Compound 配置

1. 点击 `Run` → `Edit Configurations...`
2. 点击左上角 `+` 号 → 选择 `Compound`
3. 配置名称：`All HR Services`

#### 步骤2：添加所有服务

在 `Before launch` 区域，点击 `+` → `Add New Configuration` → `Spring Boot`，依次添加：

1. **AuthorizationManagementApplication**
   - Main class: `com.example.authorization.AuthorizationManagementApplication`
   - Module: `authorization-management`
   - Working directory: `$PROJECT_DIR$/authorization-management`

2. **SystemManagementApplication**
   - Main class: `com.example.system.management.SystemManagementApplication`
   - Module: `system-management`
   - Working directory: `$PROJECT_DIR$/system-management`

3. **HumanResourceArchiveManagementApplication**
   - Main class: `com.example.human.resource.archive.management.HumanResourceArchiveManagementApplication`
   - Module: `human-resource-archive-management`
   - Working directory: `$PROJECT_DIR$/human-resource-archive-management`

4. **HumanResourceSalaryManagementApplication**
   - Main class: `com.example.human.resource.salary.management.HumanResourceSalaryManagementApplication`
   - Module: `human-resource-salary-management`
   - Working directory: `$PROJECT_DIR$/human-resource-salary-management`

#### 步骤3：启动

1. 在运行配置下拉框选择 `All HR Services`
2. 点击运行按钮 ▶️
3. IDEA 会按顺序启动所有服务

## ✅ 验证服务启动成功

### 查看控制台日志

每个服务启动成功后，控制台会显示：
```
Started XXXApplication in X.XXX seconds (JVM running for X.XXX)
```

### 检查端口占用

在 IDEA Terminal 中运行：
```bash
netstat -ano | findstr "8080 8081 8082 8083"
```

应该看到4个端口都在监听。

## 🌐 启动前端

在 IDEA Terminal 中运行：
```bash
cd ui-react
npm run dev
```

前端将在 `http://localhost:8000` 启动。

## 🔍 常见问题

### 1. 端口被占用

**错误**: `Port 8080 is already in use`

**解决**: 
- 修改对应服务的 `application.yml` 中的 `server.port`
- 或者关闭占用端口的进程

### 2. 数据库连接失败

**错误**: `CannotGetJdbcConnectionException`

**解决**:
- 检查 MySQL 服务是否启动
- 检查数据库密码是否正确（应该是 `123456`）
- 检查数据库 `myHRSystem` 是否存在

### 3. 编译错误

**错误**: `package does not exist`

**解决**:
- `Build` → `Rebuild Project`
- 确保所有模块都已正确编译

### 4. 服务启动顺序错误

**现象**: 其他服务无法验证 Token

**解决**: 必须先启动认证服务（8080），再启动其他服务

## 📝 服务端口对照表

| 服务名称 | 端口 | 启动类 |
|---------|------|--------|
| 认证服务 | 8080 | AuthorizationManagementApplication |
| 系统管理 | 8081 | SystemManagementApplication |
| 档案管理 | 8082 | HumanResourceArchiveManagementApplication |
| 薪酬管理 | 8083 | HumanResourceSalaryManagementApplication |

## 🎯 快速启动检查清单

- [ ] MySQL 服务已启动
- [ ] 数据库 `myHRSystem` 已创建
- [ ] 所有模块已编译
- [ ] 启动认证服务（8080）
- [ ] 启动系统管理服务（8081）
- [ ] 启动档案管理服务（8082）
- [ ] 启动薪酬管理服务（8083）
- [ ] 启动前端（`npm run dev`）
- [ ] 访问 http://localhost:8000 测试登录

