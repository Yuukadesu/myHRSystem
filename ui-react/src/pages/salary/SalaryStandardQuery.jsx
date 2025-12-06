import React, { useState, useEffect } from 'react'
import { Table, Form, Input, InputNumber, Select, DatePicker, Button, message, Tag, Card, Row, Col, Typography, Modal, Divider, Space } from 'antd'
import { SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { salaryStandardService } from '../../services/salaryStandardService'
import { salaryItemService } from '../../services/salaryItemService'
import { useAuth } from '../../contexts/AuthContext'
import dayjs from 'dayjs'

const { Title } = Typography

const SalaryStandardQuery = () => {
  const { hasRole } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [updateForm] = Form.useForm()
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [editableItems, setEditableItems] = useState([])
  const [salaryItems, setSalaryItems] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // 判断是否为自动计算的项
  const isAutoCalculated = (itemName) => {
    const autoCalculatedItems = ['养老保险', '医疗保险', '失业保险', '住房公积金']
    return autoCalculatedItems.includes(itemName)
  }

  useEffect(() => {
    loadData()
    if (hasRole(['SALARY_SPECIALIST'])) {
      loadSalaryItems()
    }
  }, [])

  const loadSalaryItems = async () => {
    try {
      const response = await salaryItemService.getList()
      if (response.code === 200) {
        setSalaryItems(response.data || [])
      }
    } catch (error) {
      console.error('加载薪酬项目失败:', error)
    }
  }

  const loadData = async (params = {}) => {
    setLoading(true)
    try {
      const queryParams = {
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
        ...params
      }
      
      const response = await salaryStandardService.query(queryParams)
      if (response.code === 200) {
        setData(response.data?.list || [])
        setPagination(prev => ({
          ...prev,
          current: queryParams.page || 1,
          pageSize: queryParams.size || 10,
          total: response.data?.total || 0
        }))
      } else {
        message.error(response.message || '查询失败')
      }
    } catch (error) {
      console.error('查询失败:', error)
      if (error.response?.status === 403) {
        message.error('权限不足，无法查询薪酬标准')
      } else {
        message.error('查询失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const values = form.getFieldsValue()
    const params = {}
    
    // 薪酬标准编号（模糊查询）
    if (values.standardCode && values.standardCode.trim()) {
      params.standardCode = values.standardCode.trim()
    }
    
    // 关键字（模糊查询，在薪酬标准名称、制定人、变更人、复核人字段匹配）
    if (values.keyword && values.keyword.trim()) {
      params.keyword = values.keyword.trim()
    }
    
    // 登记起始日期
    if (values.startDate) {
      params.startDate = values.startDate.format('YYYY-MM-DD')
    }
    
    // 登记结束日期
    if (values.endDate) {
      params.endDate = values.endDate.format('YYYY-MM-DD')
    }
    
    // 重置到第一页
    setPagination(prev => ({ ...prev, current: 1 }))
    loadData(params)
  }

  const handleTableChange = (newPagination) => {
    const values = form.getFieldsValue()
    const params = {}
    
    // 保持查询条件
    if (values.standardCode && values.standardCode.trim()) {
      params.standardCode = values.standardCode.trim()
    }
    if (values.keyword && values.keyword.trim()) {
      params.keyword = values.keyword.trim()
    }
    if (values.startDate) {
      params.startDate = values.startDate.format('YYYY-MM-DD')
    }
    if (values.endDate) {
      params.endDate = values.endDate.format('YYYY-MM-DD')
    }
    
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }))
    loadData({
      ...params,
      page: newPagination.current,
      size: newPagination.pageSize
    })
  }

  const handleView = async (record) => {
    try {
      // 获取薪酬标准详情
      const detailResponse = await salaryStandardService.getDetail(record.standardId)
      if (detailResponse.code === 200) {
        const detail = detailResponse.data
        setCurrentRecord(detail)
        setViewModalVisible(true)
      } else {
        message.error('获取薪酬标准详情失败')
      }
    } catch (error) {
      console.error('获取详情失败:', error)
      message.error('获取薪酬标准详情失败')
    }
  }

  const handleUpdate = async (record) => {
    // 只能变更待复核或已驳回的标准
    if (record.status !== 'PENDING_REVIEW' && record.status !== 'REJECTED') {
      message.warning('只能变更待复核或已驳回的标准')
      return
    }
    
    try {
      // 获取薪酬标准详情
      const detailResponse = await salaryStandardService.getDetail(record.standardId)
      if (detailResponse.code === 200) {
        const detail = detailResponse.data
        setCurrentRecord(detail)
        setEditableItems(JSON.parse(JSON.stringify(detail.items || []))) // 深拷贝
        updateForm.resetFields()
        updateForm.setFieldsValue({
          standardName: detail.standardName
        })
        setUpdateModalVisible(true)
      } else {
        message.error('获取薪酬标准详情失败')
      }
    } catch (error) {
      console.error('获取详情失败:', error)
      message.error('获取薪酬标准详情失败')
    }
  }

  const handleUpdateSubmit = async () => {
    try {
      const values = await updateForm.validateFields()
      const submitData = {
        standardName: values.standardName,
        items: editableItems.map(item => ({
          itemId: item.itemId,
          amount: item.amount || 0,
          isCalculated: isAutoCalculated(item.itemName)
        }))
      }
      
      const response = await salaryStandardService.update(currentRecord.standardId, submitData)
      if (response.code === 200) {
        message.success('变更成功，等待复核')
        setUpdateModalVisible(false)
        updateForm.resetFields()
        setEditableItems([])
        setCurrentRecord(null)
        // 重新加载数据
        const formValues = form.getFieldsValue()
        const params = {}
        if (formValues.standardCode && formValues.standardCode.trim()) {
          params.standardCode = formValues.standardCode.trim()
        }
        if (formValues.keyword && formValues.keyword.trim()) {
          params.keyword = formValues.keyword.trim()
        }
        if (formValues.startDate) {
          params.startDate = formValues.startDate.format('YYYY-MM-DD')
        }
        if (formValues.endDate) {
          params.endDate = formValues.endDate.format('YYYY-MM-DD')
        }
        loadData(params)
      } else {
        message.error(response.message || '变更失败')
      }
    } catch (error) {
      console.error('变更失败:', error)
      message.error('变更失败：' + (error.message || '未知错误'))
    }
  }

  const columns = [
    {
      title: '标准编号',
      dataIndex: 'standardCode',
      key: 'standardCode'
    },
    {
      title: '标准名称',
      dataIndex: 'standardName',
      key: 'standardName'
    },
    {
      title: '职位',
      dataIndex: 'positionName',
      key: 'positionName'
    },
    {
      title: '职称',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (title) => {
        const titleMap = {
          'JUNIOR': '初级',
          'INTERMEDIATE': '中级',
          'SENIOR': '高级'
        }
        return titleMap[title] || title
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PENDING_REVIEW': '待复核',
          'APPROVED': '已通过',
          'REJECTED': '已驳回'
        }
        const colorMap = {
          'PENDING_REVIEW': 'orange',
          'APPROVED': 'green',
          'REJECTED': 'red'
        }
        return <Tag color={colorMap[status]}>{statusMap[status] || status}</Tag>
      }
    },
    {
      title: '登记时间',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
      render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {hasRole(['SALARY_SPECIALIST']) && (record.status === 'PENDING_REVIEW' || record.status === 'REJECTED') && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              变更
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Title level={4} style={{ marginBottom: '16px', color: '#333' }}>
        <SearchOutlined style={{ color: '#1890ff', marginRight: '8px', fontSize: '16px' }} />
        薪酬标准查询
      </Title>

      {/* 查询表单 */}
      <Card style={{ marginBottom: '16px' }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="standardCode" label="薪酬标准编号">
                <Input placeholder="输入薪酬标准编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="keyword" label="关键字">
                <Input placeholder="输入关键字" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="登记起始日期">
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                  placeholder="年/月/日"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="登记结束日期">
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                  placeholder="年/月/日"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 结果表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="standardId"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange
          }}
        />
      </Card>

      {/* 查看模态框 */}
      <Modal
        title="薪酬标准详情"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false)
          setCurrentRecord(null)
        }}
        width={900}
        footer={
          <Button onClick={() => {
            setViewModalVisible(false)
            setCurrentRecord(null)
          }}>
            关闭
          </Button>
        }
      >
        {currentRecord && (
          <div>
            {/* 基本信息 */}
            <Divider orientation="left">基本信息</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#666', marginBottom: '4px' }}>薪酬标准编号</div>
                  <div>{currentRecord.standardCode}</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#666', marginBottom: '4px' }}>薪酬标准名称</div>
                  <div>{currentRecord.standardName}</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#666', marginBottom: '4px' }}>适用职位</div>
                  <div>{currentRecord.positionName}</div>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#666', marginBottom: '4px' }}>职称</div>
                  <div>
                    {
                      currentRecord.jobTitle === 'JUNIOR' ? '初级' :
                      currentRecord.jobTitle === 'INTERMEDIATE' ? '中级' :
                      currentRecord.jobTitle === 'SENIOR' ? '高级' : currentRecord.jobTitle
                    }
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#666', marginBottom: '4px' }}>制定人</div>
                  <div>{currentRecord.formulatorName || '-'}</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#666', marginBottom: '4px' }}>登记时间</div>
                  <div>
                    {currentRecord.registrationTime ? dayjs(currentRecord.registrationTime).format('YYYY-MM-DD HH:mm') : '-'}
                  </div>
                </div>
              </Col>
            </Row>

            {/* 薪酬项目明细 */}
            {currentRecord.items && currentRecord.items.length > 0 && (
              <>
                <Divider orientation="left">薪酬项目明细</Divider>
                <Table
                  dataSource={currentRecord.items}
                  rowKey={(record, index) => `${record.itemId}-${index}`}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: '项目编号',
                      dataIndex: 'itemCode',
                      key: 'itemCode'
                    },
                    {
                      title: '项目名称',
                      dataIndex: 'itemName',
                      key: 'itemName'
                    },
                    {
                      title: '项目类型',
                      dataIndex: 'itemType',
                      key: 'itemType',
                      render: (type) => {
                        const typeMap = {
                          'INCOME': '收入',
                          'DEDUCTION': '扣除'
                        }
                        return typeMap[type] || type
                      }
                    },
                    {
                      title: '金额',
                      dataIndex: 'amount',
                      key: 'amount',
                      render: (amount) => amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
                    }
                  ]}
                />
              </>
            )}

            {/* 复核信息（如果已复核） */}
            {currentRecord.reviewerName && (
              <>
                <Divider orientation="left">复核信息</Divider>
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ color: '#666', marginBottom: '4px' }}>复核人</div>
                      <div>{currentRecord.reviewerName}</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ color: '#666', marginBottom: '4px' }}>复核时间</div>
                      <div>
                        {currentRecord.reviewTime ? dayjs(currentRecord.reviewTime).format('YYYY-MM-DD HH:mm') : '-'}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ color: '#666', marginBottom: '4px' }}>状态</div>
                      <div>
                        <Tag 
                          color={
                            currentRecord.status === 'APPROVED' ? 'green' :
                            currentRecord.status === 'REJECTED' ? 'red' : 'orange'
                          }
                        >
                          {
                            currentRecord.status === 'APPROVED' ? '已通过' :
                            currentRecord.status === 'REJECTED' ? '已驳回' : '待复核'
                          }
                        </Tag>
                      </div>
                    </div>
                  </Col>
                </Row>
                {currentRecord.reviewComments && (
                  <Row gutter={16}>
                    <Col span={24}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ color: '#666', marginBottom: '4px' }}>复核意见</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{currentRecord.reviewComments}</div>
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 变更模态框 */}
      <Modal
        title="变更薪酬标准"
        open={updateModalVisible}
        onOk={handleUpdateSubmit}
        onCancel={() => {
          setUpdateModalVisible(false)
          updateForm.resetFields()
          setEditableItems([])
          setCurrentRecord(null)
        }}
        width={900}
        okText="提交变更"
        cancelText="取消"
      >
        {currentRecord && (
          <Form form={updateForm} layout="vertical">
            {/* 基本信息 */}
            <Divider orientation="left">基本信息</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="薪酬标准编号">
                  <Input value={currentRecord.standardCode} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="standardName"
                  label="薪酬标准名称"
                  rules={[{ required: true, message: '请输入薪酬标准名称' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="适用职位">
                  <Input value={currentRecord.positionName} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="职称">
                  <Input 
                    value={
                      currentRecord.jobTitle === 'JUNIOR' ? '初级' :
                      currentRecord.jobTitle === 'INTERMEDIATE' ? '中级' :
                      currentRecord.jobTitle === 'SENIOR' ? '高级' : currentRecord.jobTitle
                    } 
                    disabled 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="制定人">
                  <Input value={currentRecord.formulatorName || '-'} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="登记时间">
                  <Input 
                    value={currentRecord.registrationTime ? dayjs(currentRecord.registrationTime).format('YYYY-MM-DD HH:mm') : '-'} 
                    disabled 
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 薪酬项目明细 */}
            {editableItems && editableItems.length > 0 && (
              <>
                <Divider orientation="left">薪酬项目明细</Divider>
                <Table
                  dataSource={editableItems}
                  rowKey={(record, index) => `${record.itemId}-${index}`}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: '项目编号',
                      dataIndex: 'itemCode',
                      key: 'itemCode'
                    },
                    {
                      title: '项目名称',
                      dataIndex: 'itemName',
                      key: 'itemName'
                    },
                    {
                      title: '项目类型',
                      dataIndex: 'itemType',
                      key: 'itemType',
                      render: (type) => {
                        const typeMap = {
                          'INCOME': '收入',
                          'DEDUCTION': '扣除'
                        }
                        return typeMap[type] || type
                      }
                    },
                    {
                      title: '金额',
                      dataIndex: 'amount',
                      key: 'amount',
                      render: (amount, record, index) => {
                        if (isAutoCalculated(record.itemName)) {
                          // 自动计算的项，只显示
                          return amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
                        } else {
                          // 非自动计算的项，可编辑
                          return (
                            <InputNumber
                              style={{ width: '100%' }}
                              value={amount}
                              min={0}
                              precision={2}
                              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/¥\s?|(,*)/g, '')}
                              onChange={(value) => {
                                const newItems = [...editableItems]
                                newItems[index].amount = value || 0
                                setEditableItems(newItems)
                              }}
                            />
                          )
                        }
                      }
                    }
                  ]}
                />
              </>
            )}
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default SalaryStandardQuery
