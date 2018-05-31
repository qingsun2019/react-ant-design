import React, { Component } from 'react'
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
} from 'antd'
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar'
import PageHeaderLayout from '../../layouts/pageHeaderLayout'
import TableForm from './tableForm'
import Debounce from 'lodash-decorators/debounce'

import styles from './style.less'

const {Option} = Select
const {RangePicker} = DatePicker
const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
}
const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
]

class AdvancedForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      width: '100%',
      submitting: false,
    }
    this.resizeFooterToolBar = this.resizeFooterToolBar.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.resizeFooterToolBar)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeFooterToolBar)

  }

  @Debounce(100)
  resizeFooterToolBar () {
    const sider = document.querySelectorAll('.ant-layout-sider')[0]
    if (!sider) return
    const width = `calc(100% - ${sider.style.width})`
    if (this.state.width !== width) {
      this.setState({
        width: width,
      })
    }
  }

  render () {
    let {form} = this.props
    let {submitting, width} = this.state
    let {getFieldDecorator, validateFieldsAndScroll, getFieldsError} = form
    let validate = () => {
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    }
    let errors = getFieldsError()
    let getErrorInfo = () => {
      let errorCount = Object.keys(errors).filter(key => errors[key]).length
      if (!errors || errorCount === 0) {
        return null
      }
      let scrollToField = (fieldKey) => {
        let labelNode = document.querySelector(`label[for='${fieldKey}']`)
        if (labelNode) {
          labelNode.scrollIntoView(true)
        }
      }
      let errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => {
            scrollToField(key)
          }}>
            <Icon type='cross-circle-o' className={styles.errorIcon}/>
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        )
      })
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle"/>
          </Popover>
          {errorCount}
        </span>
      )
    }
    return (
      <PageHeaderLayout
        title="高级表单"
        content="高级表单常见于一次性输入和提交大批量数据的场景。"
        wrapperClassName={styles.advancedForm}>
        <Card title="仓库管理" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  {
                    getFieldDecorator('name', {
                      rules: [{required: true, message: '请输入仓库名称'}],
                    })(<Input placeholder="请输入仓库名称"/>)
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 8}} md={{span: 12}} sm={24}
                   xl={{span: 6, offset: 2}}>
                <Form.Item label={fieldLabels.url}>
                  {
                    getFieldDecorator('url', {
                      rules: [{required: true, message: '请选择'}],
                    })(<Input
                      style={{width: '100%'}}
                      addonBefore="http://"
                      addonAfter=".com"
                      placeholder="请输入"/>)
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 10}} md={{span: 24}} sm={24}
                   xl={{span: 8, offset: 2}}>
                <Form.Item label={fieldLabels.owner}>
                  {
                    getFieldDecorator('owner', {
                      rules: [{required: true, message: '请选择管理员'}],
                    })(
                      <Select placeholder="请选择管理员">
                        <Option value="xiao">付晓晓</Option>
                        <Option value="mao">周毛毛</Option>
                      </Select>,
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver}>
                  {
                    getFieldDecorator('approver', {
                      rules: [{required: true, message: '请选择审批员'}],
                    })(
                      <Select placeholdler="请选择审批员">
                        <Option value="xiao">付晓晓</Option>
                        <Option value="mao">周毛毛</Option>
                      </Select>,
                    )
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 8}} md={{span: 12}} sm={24}
                   xl={{span: 6, offset: 2}}>
                <Form.Item label={fieldLabels.dateRange}>
                  {
                    getFieldDecorator('dateRange', {
                      rules: [{required: true, message: '请选择生效日期'}],
                    })(
                      <RangePicker placeholder={['开始日期', '结束日期']}
                                   style={{width: '100%'}}/>,
                    )
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 10}} md={{span: 24}} sm={24}
                   xl={{span: 8, offset: 2}}>
                <Form.Item label={fieldLabels.type}>
                  {
                    getFieldDecorator('type', {
                      rules: [{required: true, message: '请选择仓库类型'}],
                    })(
                      <Select placeholdler="请选择仓库类型">
                        <Option value="private">私密</Option>
                        <Option value="public">公开</Option>
                      </Select>,
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="任务管理" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name2}>
                  {
                    getFieldDecorator('name2', {
                      rules: [{required: true, message: '请输入'}],
                    })(<Input placeholder="请输入"/>)
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 8}} md={{span: 12}} sm={24}
                   xl={{span: 6, offset: 2}}>
                <Form.Item label={fieldLabels.url2}>
                  {
                    getFieldDecorator('url2', {
                      rules: [{required: true, message: '请选择'}],
                    })(<Input
                      style={{width: '100%'}}
                      addonBefore="http://"
                      addonAfter=".com"
                      placeholder="请输入"/>)
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 10}} md={{span: 24}} sm={24}
                   xl={{span: 8, offset: 2}}>
                <Form.Item label={fieldLabels.owner2}>
                  {
                    getFieldDecorator('owner2', {
                      rules: [{required: true, message: '请选择管理员'}],
                    })(
                      <Select placeholder="请选择管理员">
                        <Option value="xiao">付晓晓</Option>
                        <Option value="mao">周毛毛</Option>
                      </Select>,
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver2}>
                  {
                    getFieldDecorator('approver2', {
                      rules: [{required: true, message: '请选择审批员'}],
                    })(
                      <Select placeholdler="请选择审批员">
                        <Option value="xiao">付晓晓</Option>
                        <Option value="mao">周毛毛</Option>
                      </Select>,
                    )
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 8}} md={{span: 12}} sm={24}
                   xl={{span: 6, offset: 2}}>
                <Form.Item label={fieldLabels.dateRange2}>
                  {
                    getFieldDecorator('dateRange2', {
                      rules: [{required: true, message: '请选择生效日期'}],
                    })(
                      <RangePicker placeholder={['开始日期', '结束日期']}
                                   style={{width: '100%'}}/>,
                    )
                  }
                </Form.Item>
              </Col>
              <Col lg={{span: 10}} md={{span: 24}} sm={24}
                   xl={{span: 8, offset: 2}}>
                <Form.Item label={fieldLabels.type2}>
                  {
                    getFieldDecorator('type2', {
                      rules: [{required: true, message: '请选择仓库类型'}],
                    })(
                      <Select placeholdler="请选择仓库类型">
                        <Option value="private">私密</Option>
                        <Option value="public">公开</Option>
                      </Select>,
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="成员管理" className={styles.card} bordered={false}>
          {
            getFieldDecorator('members', {
              initialValue: tableData,
            })(<TableForm/>)
          }
        </Card>
        <FooterToolbar style={{width: width}}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    )
  }
}

AdvancedForm = Form.create()(AdvancedForm)

export default AdvancedForm