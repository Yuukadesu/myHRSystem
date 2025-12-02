import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { salaryItemService } from '../../services/salaryItemService'

const SalaryItem = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await salaryItemService.getList()
      if (response.code === 200) {
        setData(response.data || [])
      }
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (itemId) => {
    try {
      const response = await salaryItemService.delete(itemId)
      if (response.code === 200) {
        message.success('删除成功')
        loadData()
      } else {
        message.error(response.message || '删除失败')
      }
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      let response
      if (editingRecord) {
        response = await salaryItemService.update(editingRecord.itemId, values)
      } else {
        response = await salaryItemService.create(values)
      }
      
      if (response.code === 200) {
        message.success(editingRecord ? '更新成功' : '创建成功')
        setModalVisible(false)
        loadData()
      } else {
        message.error(response.message || '操作失败')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const columns = [
    {
      title: '项目代码',
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
      title: '计算规则',
      dataIndex: 'calculationRule',
      key: 'calculationRule'
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status === 'ACTIVE' ? '启用' : '禁用'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.itemId)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增薪酬项目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="itemId"
      />

      <Modal
        title={editingRecord ? '编辑薪酬项目' : '新增薪酬项目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="itemCode"
            label="项目代码"
            rules={[{ required: true, message: '请输入项目代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="itemName"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="itemType"
            label="项目类型"
            rules={[{ required: true, message: '请选择项目类型' }]}
          >
            <Select>
              <Select.Option value="INCOME">收入</Select.Option>
              <Select.Option value="DEDUCTION">扣除</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="calculationRule"
            label="计算规则"
          >
            <Input.TextArea rows={3} placeholder="可选，如：基本工资 * 1.2" />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="排序"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SalaryItem

