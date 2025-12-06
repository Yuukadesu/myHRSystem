import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Tag, Card, Row, Col, Divider, Typography } from 'antd'
import { EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { salaryStandardService } from '../../services/salaryStandardService'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Title } = Typography

const SalaryStandardReview = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [originalItems, setOriginalItems] = useState([]) // 保存原始明细，用于判断是否有修改
  const [editableItems, setEditableItems] = useState([]) // 可编辑的明细
  const [action, setAction] = useState(null) // 'review' 或 'view'
  const [form] = Form.useForm()
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
  }, [pagination.current, pagination.pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await salaryStandardService.getPendingReviewList({
        page: pagination.current,
        size: pagination.pageSize
      })
      if (response.code === 200) {
        setData(response.data?.list || [])
        setPagination(prev => ({
          ...prev,
          total: response.data?.total || 0
        }))
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

  const handleReview = async (record) => {
    try {
      // 获取薪酬标准详情
      const detailResponse = await salaryStandardService.getDetail(record.standardId)
      if (detailResponse.code === 200) {
        const detail = detailResponse.data
        setCurrentRecord(detail)
        setAction('review')
        // 保存原始明细和可编辑明细
        const items = detail.items || []
        setOriginalItems(JSON.parse(JSON.stringify(items))) // 深拷贝
        setEditableItems(JSON.parse(JSON.stringify(items))) // 深拷贝
        form.resetFields()
        form.setFieldsValue({
          reviewComments: detail.reviewComments || ''
        })
        setReviewModalVisible(true)
      } else {
        message.error('获取薪酬标准详情失败')
      }
    } catch (error) {
      console.error('获取详情失败:', error)
      message.error('获取薪酬标准详情失败')
    }
  }

  const handleView = async (record) => {
    try {
      // 获取薪酬标准详情
      const detailResponse = await salaryStandardService.getDetail(record.standardId)
      if (detailResponse.code === 200) {
        const detail = detailResponse.data
        setCurrentRecord(detail)
        setAction('view')
        setEditableItems([])
        setOriginalItems([])
        form.resetFields()
        form.setFieldsValue({
          reviewComments: detail.reviewComments || ''
        })
        setReviewModalVisible(true)
      } else {
        message.error('获取薪酬标准详情失败')
      }
    } catch (error) {
      console.error('获取详情失败:', error)
      message.error('获取薪酬标准详情失败')
    }
  }

  // 检查明细是否有修改
  const hasItemsChanged = () => {
    if (originalItems.length !== editableItems.length) return true
    return originalItems.some((original, index) => {
      const edited = editableItems[index]
      return !edited || original.amount !== edited.amount
    })
  }

  const handleApprove = async () => {
    try {
      const values = await form.validateFields()
      
      // 如果明细有修改，先更新明细
      if (hasItemsChanged()) {
        const updateData = {
          items: editableItems.map(item => ({
            itemId: item.itemId,
            amount: item.amount || 0,
            isCalculated: isAutoCalculated(item.itemName) // 自动计算的项设为true，其他为false
          }))
        }
        const updateResponse = await salaryStandardService.update(
          currentRecord.standardId,
          updateData
        )
        if (updateResponse.code !== 200) {
          message.error(updateResponse.message || '更新薪酬项目明细失败')
          return
        }
      }
      
      // 提交复核通过
      const response = await salaryStandardService.approveReview(
        currentRecord.standardId,
        values.reviewComments || ''
      )
      
      if (response.code === 200) {
        message.success('复核通过')
        setReviewModalVisible(false)
        form.resetFields()
        setEditableItems([])
        setOriginalItems([])
        loadData()
      } else {
        message.error(response.message || '操作失败')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleReject = async () => {
    try {
      const values = await form.validateFields()
      
      // 如果明细有修改，先更新明细
      if (hasItemsChanged()) {
        const updateData = {
          items: editableItems.map(item => ({
            itemId: item.itemId,
            amount: item.amount || 0,
            isCalculated: isAutoCalculated(item.itemName) // 自动计算的项设为true，其他为false
          }))
        }
        const updateResponse = await salaryStandardService.update(
          currentRecord.standardId,
          updateData
        )
        if (updateResponse.code !== 200) {
          message.error(updateResponse.message || '更新薪酬项目明细失败')
          return
        }
      }
      
      // 提交复核驳回
      const response = await salaryStandardService.rejectReview(
        currentRecord.standardId,
        values.reviewComments || '' // 复核意见作为驳回原因
      )
      
      if (response.code === 200) {
        message.success('已驳回')
        setReviewModalVisible(false)
        form.resetFields()
        setEditableItems([])
        setOriginalItems([])
        loadData()
      } else {
        message.error(response.message || '操作失败')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleTableChange = (newPagination) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }))
  }

  const columns = [
    {
      title: '薪酬标准编号',
      dataIndex: 'standardCode',
      key: 'standardCode',
      render: (text) => <a style={{ color: '#1890ff' }}>{text}</a>
    },
    {
      title: '薪酬标准名称',
      dataIndex: 'standardName',
      key: 'standardName'
    },
    {
      title: '适用职位',
      dataIndex: 'positionName',
      key: 'positionName'
    },
    {
      title: '制定人',
      dataIndex: 'formulatorName',
      key: 'formulatorName'
    },
    {
      title: '登记时间',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
      render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PENDING_REVIEW': { text: '待复核', color: 'orange' },
          'APPROVED': { text: '已通过', color: 'blue' },
          'REJECTED': { text: '已驳回', color: 'red' }
        }
        const statusInfo = statusMap[status] || { text: status, color: 'default' }
        return (
          <Tag color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'PENDING_REVIEW') {
          return (
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleReview(record)}
            >
              复核
            </Button>
          )
        } else {
          return (
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            >
              查看
            </Button>
          )
        }
      }
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Title level={4} style={{ marginBottom: '16px', color: '#333' }}>
        <CheckCircleOutlined style={{ color: '#1890ff', marginRight: '8px', fontSize: '16px' }} />
        薪酬标准复核
      </Title>

      {/* 表格 */}
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

      {/* 复核/查看模态框 */}
      <Modal
        title={action === 'review' ? '薪酬标准复核' : '薪酬标准详情'}
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false)
          form.resetFields()
          setEditableItems([])
          setOriginalItems([])
        }}
        width={900}
        footer={
          action === 'review' ? (
            <Space>
              <Button onClick={() => setReviewModalVisible(false)}>
                取消
              </Button>
              <Button danger onClick={handleReject}>
                驳回
              </Button>
              <Button type="primary" onClick={handleApprove}>
                通过
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setReviewModalVisible(false)}>
              关闭
            </Button>
          )
        }
      >
        {currentRecord && (
          <Form form={form} layout="vertical">
            {/* 基本信息 */}
            <Divider orientation="left">基本信息</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="薪酬标准编号">
                  <Input value={currentRecord.standardCode} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="薪酬标准名称">
                  <Input value={currentRecord.standardName} disabled />
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
            {(action === 'review' ? editableItems : currentRecord.items) && 
             (action === 'review' ? editableItems : currentRecord.items).length > 0 && (
              <>
                <Divider orientation="left">薪酬项目明细</Divider>
                <Table
                  dataSource={action === 'review' ? editableItems : currentRecord.items}
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
                        if (action === 'review' && !isAutoCalculated(record.itemName)) {
                          // 复核模式下，非自动计算的项可编辑
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
                        } else {
                          // 查看模式或自动计算的项，只显示
                          return amount ? `¥${parseFloat(amount).toFixed(2)}` : '-'
                        }
                      }
                    }
                  ]}
                />
              </>
            )}

            {/* 复核意见 */}
            <Divider orientation="left">复核意见</Divider>
            <Form.Item
              name="reviewComments"
              label="复核意见"
              rules={action === 'review' ? [] : []}
            >
              <TextArea 
                rows={8} 
                placeholder={action === 'review' ? '请输入复核意见（可选）' : '暂无复核意见'} 
                disabled={action === 'view'}
                style={{ fontSize: '14px' }}
              />
            </Form.Item>

            {/* 复核信息（如果已复核） */}
            {currentRecord.reviewerName && (
              <>
                <Divider orientation="left">复核信息</Divider>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="复核人">
                      <Input value={currentRecord.reviewerName} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="复核时间">
                      <Input 
                        value={currentRecord.reviewTime ? dayjs(currentRecord.reviewTime).format('YYYY-MM-DD HH:mm') : '-'} 
                        disabled 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="状态">
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
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default SalaryStandardReview
