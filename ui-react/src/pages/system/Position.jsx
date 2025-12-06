import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { positionService } from '../../services/positionService'
import { organizationService } from '../../services/organizationService'

const Position = () => {
  const [data, setData] = useState([])
  const [thirdOrgs, setThirdOrgs] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadThirdOrgs()
    loadData()
  }, [])

  const loadThirdOrgs = async () => {
    try {
      // 加载所有三级机构
      const level1Response = await organizationService.getLevel1List()
      if (level1Response.code === 200) {
        const allOrgs = []
        for (const org1 of level1Response.data || []) {
          const level2Response = await organizationService.getLevel2List(org1.orgId)
          if (level2Response.code === 200 && level2Response.data) {
            for (const org2 of level2Response.data) {
              const level3Response = await organizationService.getLevel3List(org2.orgId)
              if (level3Response.code === 200 && level3Response.data) {
                allOrgs.push(...level3Response.data)
              }
            }
          }
        }
        setThirdOrgs(allOrgs)
      }
    } catch (error) {
      console.error('加载三级机构失败:', error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await positionService.getList()
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

  const handleDelete = async (positionId) => {
    try {
      const response = await positionService.delete(positionId)
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
        response = await positionService.update(editingRecord.positionId, values)
      } else {
        response = await positionService.create(values)
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
      title: '职位名称',
      dataIndex: 'positionName',
      key: 'positionName'
    },
    {
      title: '所属机构',
      dataIndex: 'thirdOrgId',
      key: 'thirdOrgId',
      render: (thirdOrgId) => {
        const org = thirdOrgs.find(o => o.orgId === thirdOrgId)
        return org ? org.orgName : '-'
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
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
            onConfirm={() => handleDelete(record.positionId)}
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
          新增职位
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="positionId"
      />

      <Modal
        title={editingRecord ? '编辑职位' : '新增职位'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="thirdOrgId"
            label="所属机构"
            rules={[{ required: true, message: '请选择所属机构' }]}
          >
            <Select placeholder="请选择三级机构">
              {thirdOrgs.map(org => (
                <Select.Option key={org.orgId} value={org.orgId}>
                  {org.orgName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="positionName"
            label="职位名称"
            rules={[{ required: true, message: '请输入职位名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Position

