import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { organizationService } from '../../services/organizationService'

const OrgLevel2 = () => {
  const [data, setData] = useState([])
  const [level1Orgs, setLevel1Orgs] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    const initData = async () => {
      await loadLevel1Orgs()
      await loadData()
    }
    initData()
  }, [])

  const loadLevel1Orgs = async () => {
    try {
      const response = await organizationService.getLevel1List()
      if (response.code === 200) {
        const orgs = response.data || []
        setLevel1Orgs(orgs)
        return orgs
      }
      return []
    } catch (error) {
      console.error('加载一级机构失败:', error)
      return []
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // 需要先加载一级机构，然后加载所有一级机构下的二级机构
      const orgs = level1Orgs.length > 0 ? level1Orgs : await loadLevel1Orgs()
      const allData = []
      for (const org1 of orgs) {
        const response = await organizationService.getLevel2List(org1.orgId)
        if (response.code === 200 && response.data) {
          allData.push(...response.data)
        }
      }
      setData(allData)
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

  const handleDelete = async (orgId) => {
    try {
      const response = await organizationService.delete(orgId)
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
        response = await organizationService.update(editingRecord.orgId, values)
      } else {
        response = await organizationService.createLevel2(values)
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
      title: '机构代码',
      dataIndex: 'orgCode',
      key: 'orgCode'
    },
    {
      title: '机构名称',
      dataIndex: 'orgName',
      key: 'orgName'
    },
    {
      title: '上级机构',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId) => {
        const parent = level1Orgs.find(o => o.orgId === parentId)
        return parent ? parent.orgName : '-'
      }
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
            onConfirm={() => handleDelete(record.orgId)}
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
          新增二级机构
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="orgId"
      />

      <Modal
        title={editingRecord ? '编辑二级机构' : '新增二级机构'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="parentId"
            label="上级机构"
            rules={[{ required: true, message: '请选择上级机构' }]}
          >
            <Select placeholder="请选择一级机构">
              {level1Orgs.map(org => (
                <Select.Option key={org.orgId} value={org.orgId}>
                  {org.orgName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="orgCode"
            label="机构代码"
            rules={[{ required: true, message: '请输入机构代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="orgName"
            label="机构名称"
            rules={[{ required: true, message: '请输入机构名称' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default OrgLevel2

