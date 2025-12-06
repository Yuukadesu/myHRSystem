import React, { useState, useEffect } from 'react'
import { Table, Button, message, Card, Typography, InputNumber, Space, Tag } from 'antd'
import { DollarOutlined, EditOutlined, ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'
import { salaryIssuanceService } from '../../services/salaryIssuanceService'
import dayjs from 'dayjs'
import './SalaryIssuanceRegister.css'

const { Title } = Typography

const SalaryIssuanceRegister = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [employeeDetails, setEmployeeDetails] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 不限制月份，查询所有待登记和待复核的记录
      const response = await salaryIssuanceService.getPendingRegistrationList({})
      if (response.code === 200) {
        setData(response.data || [])
      } else {
        message.error(response.message || '加载数据失败')
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      message.error('加载数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (record) => {
    setLoading(true)
    try {
      // 获取用于登记的员工明细列表
      // 使用记录的月份，如果没有则使用当前月份
      const issuanceMonth = record.issuanceMonth 
        ? dayjs(record.issuanceMonth).format('YYYY-MM')
        : dayjs().format('YYYY-MM')
      const response = await salaryIssuanceService.getRegistrationDetails(record.thirdOrgId, issuanceMonth)
      
      if (response.code !== 200 || !response.data) {
        message.error(response.message || '获取员工明细失败')
        return
      }

      const details = response.data.map(detail => ({
        employeeId: detail.employeeId,
        employeeNumber: detail.employeeNumber,
        employeeName: detail.employeeName,
        positionName: detail.positionName,
        basicSalary: parseFloat(detail.basicSalary) || 0,
        performanceBonus: parseFloat(detail.performanceBonus) || 0,
        transportationAllowance: parseFloat(detail.transportationAllowance) || 0,
        mealAllowance: parseFloat(detail.mealAllowance) || 0,
        pensionInsurance: parseFloat(detail.pensionInsurance) || 0,
        medicalInsurance: parseFloat(detail.medicalInsurance) || 0,
        unemploymentInsurance: parseFloat(detail.unemploymentInsurance) || 0,
        housingFund: parseFloat(detail.housingFund) || 0,
        awardAmount: parseFloat(detail.awardAmount) || 0,
        deductionAmount: parseFloat(detail.deductionAmount) || 0,
        totalIncome: parseFloat(detail.totalIncome) || 0,
        totalDeduction: parseFloat(detail.totalDeduction) || 0,
        netPay: parseFloat(detail.netPay) || 0
      }))
      
      if (details.length === 0) {
        message.warning('该机构下没有符合条件的员工')
        return
      }

      setEmployeeDetails(details)
      setCurrentRecord(record)
      setShowDetail(true)
    } catch (error) {
      console.error('加载员工明细失败:', error)
      message.error('加载员工明细失败：' + (error.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = (detail) => {
    // 总收入 = 基本工资 + 绩效奖金 + 交通补贴 + 餐费补贴 + 奖励金额
    detail.totalIncome = 
      (detail.basicSalary || 0) +
      (detail.performanceBonus || 0) +
      (detail.transportationAllowance || 0) +
      (detail.mealAllowance || 0) +
      (detail.awardAmount || 0)

    // 总扣除 = 养老保险 + 医疗保险 + 失业保险 + 住房公积金 + 应扣金额
    detail.totalDeduction =
      (detail.pensionInsurance || 0) +
      (detail.medicalInsurance || 0) +
      (detail.unemploymentInsurance || 0) +
      (detail.housingFund || 0) +
      (detail.deductionAmount || 0)

    // 实发金额 = 总收入 - 总扣除
    detail.netPay = detail.totalIncome - detail.totalDeduction
  }

  const handleAmountChange = (index, field, value) => {
    const newDetails = [...employeeDetails]
    newDetails[index][field] = value || 0
    calculateTotals(newDetails[index])
    setEmployeeDetails(newDetails)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // 使用记录的月份，如果没有则使用当前月份
      const issuanceMonth = currentRecord.issuanceMonth 
        ? dayjs(currentRecord.issuanceMonth).format('YYYY-MM')
        : dayjs().format('YYYY-MM')
      
      const submitData = {
        thirdOrgId: currentRecord.thirdOrgId,
        issuanceMonth: issuanceMonth,
        details: employeeDetails.map(detail => ({
          employeeId: detail.employeeId,
          awardAmount: detail.awardAmount || 0,
          deductionAmount: detail.deductionAmount || 0
        }))
      }
      
      const response = await salaryIssuanceService.create(submitData)
      if (response.code === 200) {
        message.success('登记成功')
        setShowDetail(false)
        setCurrentRecord(null)
        setEmployeeDetails([])
        loadData()
      } else {
        message.error(response.message || '登记失败')
      }
    } catch (error) {
      console.error('登记失败:', error)
      message.error('登记失败：' + (error.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '薪酬单号',
      dataIndex: 'salarySlipNumber',
      key: 'salarySlipNumber',
      render: (text) => text ? <a style={{ color: '#1890ff' }}>{text}</a> : '-'
    },
    {
      title: '机构名称',
      dataIndex: 'orgFullPath',
      key: 'orgFullPath'
    },
    {
      title: '总人数',
      dataIndex: 'totalEmployees',
      key: 'totalEmployees'
    },
    {
      title: '基本薪酬总额',
      dataIndex: 'totalBasicSalary',
      key: 'totalBasicSalary',
      render: (amount) => amount ? `¥${parseFloat(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PENDING_REGISTRATION': '待登记',
          'PENDING_REVIEW': '待复核'
        }
        const colorMap = {
          'PENDING_REGISTRATION': 'blue',
          'PENDING_REVIEW': 'orange'
        }
        return <Tag color={colorMap[status]}>{statusMap[status] || status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleRegister(record)}
        >
          登记
        </Button>
      )
    }
  ]

  // 详情页表格列
  const detailColumns = [
    {
      title: '员工编号',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      width: 100
    },
    {
      title: '姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 100
    },
    {
      title: '职位',
      dataIndex: 'positionName',
      key: 'positionName',
      width: 120
    },
    {
      title: '基本工资',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '绩效奖金',
      dataIndex: 'performanceBonus',
      key: 'performanceBonus',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '交通补贴',
      dataIndex: 'transportationAllowance',
      key: 'transportationAllowance',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '餐费补贴',
      dataIndex: 'mealAllowance',
      key: 'mealAllowance',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '养老保险',
      dataIndex: 'pensionInsurance',
      key: 'pensionInsurance',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '医疗保险',
      dataIndex: 'medicalInsurance',
      key: 'medicalInsurance',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '失业保险',
      dataIndex: 'unemploymentInsurance',
      key: 'unemploymentInsurance',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '住房公积金',
      dataIndex: 'housingFund',
      key: 'housingFund',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '奖励金额',
      dataIndex: 'awardAmount',
      key: 'awardAmount',
      width: 150,
      render: (amount, record, index) => (
        <InputNumber
          style={{ width: '100%' }}
          value={amount}
          min={0}
          precision={2}
          formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/¥\s?|(,*)/g, '')}
          onChange={(value) => handleAmountChange(index, 'awardAmount', value)}
        />
      )
    },
    {
      title: '应扣金额',
      dataIndex: 'deductionAmount',
      key: 'deductionAmount',
      width: 150,
      render: (amount, record, index) => (
        <InputNumber
          style={{ width: '100%' }}
          value={amount}
          min={0}
          precision={2}
          formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/¥\s?|(,*)/g, '')}
          onChange={(value) => handleAmountChange(index, 'deductionAmount', value)}
        />
      )
    },
    {
      title: '实发金额',
      dataIndex: 'netPay',
      key: 'netPay',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    }
  ]

  // 计算总计
  const calculateTotal = (field) => {
    return employeeDetails.reduce((sum, detail) => sum + (parseFloat(detail[field]) || 0), 0)
  }

  // 总计行数据
  const totalRow = {
    employeeNumber: '总计',
    employeeName: '-',
    positionName: '',
    basicSalary: calculateTotal('basicSalary'),
    performanceBonus: calculateTotal('performanceBonus'),
    transportationAllowance: calculateTotal('transportationAllowance'),
    mealAllowance: calculateTotal('mealAllowance'),
    pensionInsurance: calculateTotal('pensionInsurance'),
    medicalInsurance: calculateTotal('medicalInsurance'),
    unemploymentInsurance: calculateTotal('unemploymentInsurance'),
    housingFund: calculateTotal('housingFund'),
    awardAmount: calculateTotal('awardAmount'),
    deductionAmount: calculateTotal('deductionAmount'),
    netPay: calculateTotal('netPay')
  }

  if (showDetail) {
    return (
      <div style={{ padding: '24px' }}>
        {/* 页面标题 */}
        <Title level={4} style={{ marginBottom: '16px', color: '#333' }}>
          <DollarOutlined style={{ color: '#1890ff', marginRight: '8px', fontSize: '16px' }} />
          薪酬发放登记
        </Title>

        {/* 详情表格 */}
        <Card>
          <Table
            columns={detailColumns}
            dataSource={[...employeeDetails, totalRow]}
            rowKey={(record, index) => record.employeeId || `total-${index}`}
            pagination={false}
            scroll={{ x: 1500 }}
            loading={loading}
            rowClassName={(record, index) => {
              if (index === employeeDetails.length) {
                return 'total-row'
              }
              return ''
            }}
          />
        </Card>

        {/* 操作按钮 */}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setShowDetail(false)
                setCurrentRecord(null)
                setEmployeeDetails([])
              }}
            >
              返回列表
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSubmit}
              loading={loading}
            >
              提交薪酬发放登记
            </Button>
          </Space>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Title level={4} style={{ marginBottom: '16px', color: '#333' }}>
        <DollarOutlined style={{ color: '#1890ff', marginRight: '8px', fontSize: '16px' }} />
        薪酬发放登记
      </Title>

      {/* 列表表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="thirdOrgId"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`
          }}
        />
      </Card>
    </div>
  )
}

export default SalaryIssuanceRegister
