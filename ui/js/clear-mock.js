// 清理 Mock 数据的脚本
// 在页面加载时清除 localStorage 中的 Mock 数据

(function() {
    // 清除 Mock 数据
    if (localStorage.getItem('mockHRData')) {
        console.log('🧹 清除 localStorage 中的 Mock 数据...');
        localStorage.removeItem('mockHRData');
    }
    
    // 清除可能存在的 Mock API 函数
    if (window.apiRequest && window.apiRequest.toString().includes('MockData')) {
        console.log('🧹 清除 Mock API 函数...');
        delete window.apiRequest;
    }
    
    // 确保使用真实 API
    console.log('✅ 已切换到真实 API 模式');
    console.log('📡 后端服务端口: 8081(认证), 8080(系统), 8082(档案), 8083(薪酬)');
})();

