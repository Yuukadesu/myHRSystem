import React, { useState, useEffect } from 'react'
import { Table, Form, Input, DatePicker, Button, message, Space, Tag, Card, Typography, Modal } from 'antd'
import { SearchOutlined, ReloadOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { salaryIssuanceService } from '../../services/salaryIssuanceService'
import dayjs from 'dayjs'
import './SalaryIssuanceQuery.css'

const { Title } = Typography

const SalaryIssuanceQuery = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
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

  const loadData = async (params = {}, page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const queryParams = {
        page: page,
        size: pageSize,
        ...params
      }
      
      const response = await salaryIssuanceService.query(queryParams)
      if (response.code === 200) {
        setData(response.data?.list || [])
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.data?.total || 0
        })
      } else {
        message.error(response.message || '查询失败')
      }
    } catch (error) {
      console.error('查询失败:', error)
      message.error('查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const values = form.getFieldsValue()
    const params = {}
    
    if (values.salarySlipNumber) params.salarySlipNumber = values.salarySlipNumber
    if (values.keyword) params.keyword = values.keyword
    if (values.startDate) params.startDate = values.startDate.format('YYYY-MM-DD')
    if (values.endDate) params.endDate = values.endDate.format('YYYY-MM-DD')
    
    setPagination({ ...pagination, current: 1 })
    loadData(params, 1, pagination.pageSize)
  }

  const handleReset = () => {
    form.resetFields()
    setPagination({ ...pagination, current: 1 })
    loadData({}, 1, pagination.pageSize)
  }

  const handleViewDetail = async (record) => {
    setLoading(true)
    try {
      const detailResponse = await salaryIssuanceService.getDetail(record.issuanceId)
      if (detailResponse.code === 200 && detailResponse.data) {
        const details = (detailResponse.data.details || []).map(detail => ({
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
        
        setEmployeeDetails(details)
        setCurrentRecord(record)
        setDetailModalVisible(true)
      } else {
        message.error('获取详情失败')
      }
    } catch (error) {
      console.error('加载详情失败:', error)
      message.error('加载详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = (newPagination) => {
    const values = form.getFieldsValue()
    const params = {}
    
    if (values.salarySlipNumber) params.salarySlipNumber = values.salarySlipNumber
    if (values.keyword) params.keyword = values.keyword
    if (values.startDate) params.startDate = values.startDate.format('YYYY-MM-DD')
    if (values.endDate) params.endDate = values.endDate.format('YYYY-MM-DD')
    
    loadData(params, newPagination.current, newPagination.pageSize)
  }

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
    totalIncome: calculateTotal('totalIncome'),
    totalDeduction: calculateTotal('totalDeduction'),
    netPay: calculateTotal('netPay')
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
      title: '发放时间',
      dataIndex: 'issuanceTime',
      key: 'issuanceTime',
      render: (time) => time ? dayjs(time).format('YYYY-MM-DD') : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PENDING_REVIEW': '待复核',
          'EXECUTED': '已执行',
          'PAID': '已付款'
        }
        const colorMap = {
          'PENDING_REVIEW': 'orange',
          'EXECUTED': 'green',
          'PAID': 'blue'
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
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看明细
        </Button>
      )
    }
  ]

  // 明细表格列
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
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '应扣金额',
      dataIndex: 'deductionAmount',
      key: 'deductionAmount',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    },
    {
      title: '实发金额',
      dataIndex: 'netPay',
      key: 'netPay',
      width: 120,
      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Title level={4} style={{ marginBottom: '16px', color: '#333' }}>
        <SearchOutlined style={{ color: '#1890ff', marginRight: '8px', fontSize: '16px' }} />
        薪酬发放查询
      </Title>

      {/* 查询条件 */}
      <Card style={{ marginBottom: '16px' }}>
        <Form form={form} layout="inline">
          <Form.Item name="salarySlipNumber" label="薪酬单号">
            <Input style={{ width: 200 }} placeholder="输入薪酬单号" />
          </Form.Item>
          <Form.Item name="keyword" label="关键字">
            <Input style={{ width: 200 }} placeholder="输入关键字" />
          </Form.Item>
          <Form.Item name="startDate" label="发放起始日期">
            <DatePicker style={{ width: 200 }} placeholder="年/月/日" />
          </Form.Item>
          <Form.Item name="endDate" label="发放结束日期">
            <DatePicker style={{ width: 200 }} placeholder="年/月/日" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置条件
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 查询结果表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="issuanceId"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 查看明细弹窗 */}
      <Modal
        title={
          <div>
            <EyeOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            薪酬发放明细 - {currentRecord?.salarySlipNumber}
          </div>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false)
          setCurrentRecord(null)
          setEmployeeDetails([])
        }}
        footer={[
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setDetailModalVisible(false)
              setCurrentRecord(null)
              setEmployeeDetails([])
            }}
          >
            返回
          </Button>
        ]}
        width={1400}
      >
        <Table
          columns={detailColumns}
          dataSource={[...employeeDetails, totalRow]}
          rowKey={(record, index) => record.employeeId || `total-${index}`}
          pagination={false}
          scroll={{ x: 1400 }}
          loading={loading}
          rowClassName={(record, index) => {
            if (index === employeeDetails.length) {
              return 'total-row'
            }
            return ''
          }}
        />
      </Modal>
    </div>
  )
}

export default SalaryIssuanceQuery
