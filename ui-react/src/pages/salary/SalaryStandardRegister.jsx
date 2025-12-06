import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, InputNumber, message, Card, Row, Col, Space } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import { salaryStandardService } from '../../services/salaryStandardService'
import { positionService } from '../../services/positionService'
import { salaryItemService } from '../../services/salaryItemService'
import { userService } from '../../services/userService'
import dayjs from 'dayjs'

const SalaryStandardRegister = () => {
  const { user } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [positions, setPositions] = useState([])
  const [salaryItems, setSalaryItems] = useState([])
  const [users, setUsers] = useState([])
  const [standardCode, setStandardCode] = useState('') // 薪酬标准编号（系统生成）
  const [registrationTime, setRegistrationTime] = useState(dayjs().format('YYYY-MM-DD HH:mm')) // 登记时间

  useEffect(() => {
    loadPositions()
    loadSalaryItems()
    loadUsers()
    // 设置默认登记人为当前登录用户
    if (user?.userId) {
      form.setFieldsValue({ registrarId: user.userId })
    }
  }, [user])

  const loadPositions = async () => {
    try {
      const response = await positionService.getList()
      if (response.code === 200) {
        setPositions(response.data || [])
      } else {
        message.warning(response.message || '加载职位失败')
      }
    } catch (error) {
      console.error('加载职位失败:', error)
      if (error.response?.status === 403) {
        message.error('权限不足，无法加载职位列表')
      } else {
        message.error('加载职位失败，请稍后重试')
      }
    }
  }

  const loadSalaryItems = async () => {
    try {
      const response = await salaryItemService.getList()
      if (response.code === 200) {
        // 按排序顺序排序
        const sortedItems = (response.data || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        setSalaryItems(sortedItems)
      } else {
        message.warning(response.message || '加载薪酬项目失败')
      }
    } catch (error) {
      console.error('加载薪酬项目失败:', error)
      if (error.response?.status === 403) {
        message.error('权限不足，无法加载薪酬项目列表')
      } else {
        message.error('加载薪酬项目失败，请稍后重试')
      }
    }
  }

  const loadUsers = async () => {
    try {
      const response = await userService.getList()
      if (response.code === 200) {
        setUsers(response.data || [])
      } else {
        message.warning(response.message || '加载用户列表失败')
      }
    } catch (error) {
      console.error('加载用户列表失败:', error)
      message.error('加载用户列表失败，请稍后重试')
    }
  }

  // 判断是否为三险一金（需要自动计算）
  const isAutoCalculated = (itemName) => {
    const autoCalculatedItems = ['养老保险', '医疗保险', '失业保险', '住房公积金']
    return autoCalculatedItems.includes(itemName)
  }

  // 根据基本工资计算三险一金
  const calculateInsurance = (itemName, basicSalary) => {
    if (!basicSalary || basicSalary <= 0) return 0
    const salary = parseFloat(basicSalary)
    
    switch (itemName) {
      case '养老保险':
        return (salary * 0.08).toFixed(2)
      case '医疗保险':
        return (salary * 0.02 + 3).toFixed(2)
      case '失业保险':
        return (salary * 0.005).toFixed(2)
      case '住房公积金':
        return (salary * 0.08).toFixed(2)
      default:
        return 0
    }
  }

  // 获取基本工资金额
  const getBasicSalary = () => {
    const values = form.getFieldsValue()
    const basicSalaryItem = salaryItems.find(item => item.itemName === '基本工资')
    if (basicSalaryItem) {
      const amount = values[`item_${basicSalaryItem.itemId}`]
      return amount || 0
    }
    return 0
  }

  // 处理基本工资变化，自动计算三险一金
  const handleBasicSalaryChange = () => {
    const basicSalary = getBasicSalary()
    const formValues = form.getFieldsValue()
    
    salaryItems.forEach(item => {
      if (isAutoCalculated(item.itemName)) {
        const calculatedAmount = calculateInsurance(item.itemName, basicSalary)
        form.setFieldsValue({
          [`item_${item.itemId}`]: parseFloat(calculatedAmount)
        })
      }
    })
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // 构建薪酬项目明细列表
      const items = salaryItems.map(item => {
        const amount = values[`item_${item.itemId}`] || 0
        const isCalculated = isAutoCalculated(item.itemName)
        
        return {
          itemId: item.itemId,
          amount: parseFloat(amount).toFixed(2),
          isCalculated: isCalculated
        }
      }).filter(item => item.amount > 0) // 只提交金额大于0的项目

      const submitData = {
        standardName: values.standardName,
        positionId: values.positionId,
        jobTitle: values.jobTitle,
        formulatorId: values.formulatorId,
        registrarId: values.registrarId,
        items: items
      }
      
      const response = await salaryStandardService.create(submitData)
      if (response.code === 200) {
        message.success('登记成功')
        // 显示生成的薪酬标准编号
        if (response.data?.standardCode) {
          setStandardCode(response.data.standardCode)
        }
        form.resetFields()
        // 重置后重新设置默认值
        if (user?.userId) {
          form.setFieldsValue({ registrarId: user.userId })
        }
        setRegistrationTime(dayjs().format('YYYY-MM-DD HH:mm'))
      } else {
        message.error(response.message || '登记失败')
      }
    } catch (error) {
      console.error('登记失败:', error)
      message.error('登记失败：' + (error.response?.data?.message || error.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.resetFields()
    setStandardCode('')
    setRegistrationTime(dayjs().format('YYYY-MM-DD HH:mm'))
    if (user?.userId) {
      form.setFieldsValue({ registrarId: user.userId })
    }
  }

  return (
    <Card title="薪酬标准登记">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          registrarId: user?.userId
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="薪酬标准编号">
              <Input value={standardCode} placeholder="提交后自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="standardName"
              label="薪酬标准名称"
              rules={[{ required: true, message: '请输入薪酬标准名称' }]}
            >
              <Input placeholder="例如：软件工程师-中级标准" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="formulatorId"
              label="制定人"
              rules={[{ required: true, message: '请选择制定人' }]}
            >
              <Select placeholder="请选择制定人" showSearch optionFilterProp="children">
                {users.map(u => (
                  <Select.Option key={u.userId} value={u.userId}>
                    {u.realName || u.username}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="registrarId"
              label="登记人"
              rules={[{ required: true, message: '请选择登记人' }]}
            >
              <Select placeholder="请选择登记人" showSearch optionFilterProp="children">
                {users.map(u => (
                  <Select.Option key={u.userId} value={u.userId}>
                    {u.realName || u.username}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记时间">
              <Input value={registrationTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="positionId"
              label="适用职位"
              rules={[{ required: true, message: '请选择职位' }]}
            >
              <Select placeholder="请选择职位">
                {positions.map(pos => (
                  <Select.Option key={pos.positionId} value={pos.positionId}>
                    {pos.positionName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="jobTitle"
              label="职称"
              rules={[{ required: true, message: '请选择职称' }]}
            >
              <Select placeholder="请选择职称">
                <Select.Option value="JUNIOR">初级</Select.Option>
                <Select.Option value="INTERMEDIATE">中级</Select.Option>
                <Select.Option value="SENIOR">高级</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <h3>选择薪酬项目</h3>
        </div>

        <Row gutter={16}>
          {salaryItems.map(item => {
            const isAutoCalc = isAutoCalculated(item.itemName)
            const fieldName = `item_${item.itemId}`
            
            return (
              <Col span={8} key={item.itemId} style={{ marginBottom: 16 }}>
                <Form.Item
                  name={fieldName}
                  label={
                    <span>
                      {item.itemName}
                      {isAutoCalc && (
                        <span style={{ color: '#999', fontSize: '12px', marginLeft: 8 }}>
                          (自动计算)
                        </span>
                      )}
                    </span>
                  }
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    min={0}
                    placeholder="请输入金额"
                    disabled={isAutoCalc}
                    onChange={(value) => {
                      if (item.itemName === '基本工资') {
                        handleBasicSalaryChange()
                      }
                    }}
                    formatter={value => value ? `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                    parser={value => value.replace(/¥\s?|(,*)/g, '')}
                  />
                </Form.Item>
                {isAutoCalc && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: -16, marginBottom: 8 }}>
                    {item.itemName === '养老保险' && '计算方式: 基本工资 × 8%'}
                    {item.itemName === '医疗保险' && '计算方式: 基本工资 × 2% + 3元'}
                    {item.itemName === '失业保险' && '计算方式: 基本工资 × 0.5%'}
                    {item.itemName === '住房公积金' && '计算方式: 基本工资 × 8%'}
                  </div>
                )}
              </Col>
            )
          })}
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default SalaryStandardRegister
