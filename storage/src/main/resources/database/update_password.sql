-- 更新用户密码为 password123
-- 所有用户的密码都更新为 password123 的正确 BCrypt 哈希值

UPDATE `user` SET `password` = '$2a$10$.byJREIpdV8S4MgI.VdXSeudn1DfPtpx2NzXRncx0mvONIFsi6uAm' 
WHERE `username` IN ('admin', 'hr01', 'hr02', 'salary01', 'salary02');

