import React, { Component } from 'react'
import { History } from 'history'
import { Link } from 'react-router-dom'
import { Button, Col, Form, Input, Popover, Progress, Row, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { stringify } from 'qs'
import styles from './index.less'

const FormItem = Form.Item
const { Option } = Select
const InputGroup = Input.Group

// 密码状态
const passwordStatusMap: any = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>
}

const passwordProgressMap: any = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
}

interface RegisterProps extends FormComponentProps {
  history: History,
  userInfo: string,
  setUserInfo: Function
}

interface RegisterState {
  count: number,
  confirmDirty: boolean,
  visible: boolean,
  help: string,
  prefix: string,
  submitting: boolean
}

class Register extends Component<RegisterProps, RegisterState> {
  interval: any

  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    submitting: false
  }

  componentWillUnmount (): void {
    clearInterval(this.interval)
  }

  // 倒计时
  onGetCaptcha = () => {
    let count: number = 59
    this.setState({ count: count })
    this.interval = setInterval(() => {
      count -= 1
      this.setState({ count: count })
      if (count === 0) {
        clearInterval(this.interval)
      }
    }, 1000)
  }

  // 密码状态
  getPasswordStatus = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'poor'
  }

  // 验证密码
  checkPassword = (rule: any, value: { length: number; }, callback: { (arg0: string): void; (arg0: string): void; (): void; }) => {
    // value默认是undefined，!value是true，!!value则是false
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value
      })
      callback('error')
    } else {
      this.setState({
        help: ''
      })
      if (!this.state.visible) {
        this.setState({
          visible: !!value
        })
      }
      if (value.length < 6) {
        callback('error')
      } else {
        const { form } = this.props
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback()
      }
    }
  }

  // 两次密码匹配
  checkConfirm = (rule: any, value: any, callback: { (arg0: string): void; (): void; }) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配')
    } else {
      callback()
    }
  }

  // 区号改变
  changePrefix = (value: string) => {
    this.setState({
      prefix: value
    })
  }

  // 提交
  handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    const { history } = this.props
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          history.push({
            pathname: '/user/register-result',
            search: stringify({
              ...values,
              prefix: this.state.prefix
            })
          })
        }
      })
  }

  // 渲染进度条
  renderPasswordProgress = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    const passwordStatus = this.getPasswordStatus()
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null
  }

  render () {
    const { form } = this.props
    const { count, help, visible, prefix, submitting } = this.state
    const { getFieldDecorator } = form
    return <div className={styles.main}>
      <h3>注册</h3>
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('mail', {
            rules: [
              {
                required: true,
                message: '请输入邮箱地址！'
              },
              {
                type: 'email',
                message: '邮箱地址格式错误！'
              }
            ]
          })(<Input size='large' autoComplete='off' placeholder='邮箱'/>)}
        </FormItem>
        <FormItem help={help}>
          <Popover
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
                <div style={{ marginTop: '10px' }}>
                  请至少输入 6 个字符。请不要使用容易被猜到的密码。
                </div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement='right'
            visible={visible}
          >
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword
                  }
                ]
              })(<Input size='large' autoComplete='off' type='password'
                placeholder='至少6位密码，区分大小写'/>)
            }
          </Popover>
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！'
                },
                {
                  validator: this.checkConfirm
                }
              ]
            })(<Input size='large' type='password' autoComplete='off'
              placeholder='确认密码'/>)
          }
        </FormItem>
        <FormItem>
          <InputGroup compact>
            <Select
              size='large'
              value={prefix}
              onChange={this.changePrefix}
              style={{ width: '20%' }}
            >
              <Option value='86'>+86</Option>
              <Option value='87'>+87</Option>
            </Select>
            {
              getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号！'
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！'
                  }
                ]
              })(<Input size='large' autoComplete='off' style={{ width: '80%' }}
                placeholder='11位手机号'/>)
            }
          </InputGroup>
        </FormItem>
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>
              {
                getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！'
                    }
                  ]
                })(<Input size='large' autoComplete='off' placeholder='验证码'/>)
              }
            </Col>
            <Col span={8}>
              <Button
                size='large'
                disabled={!!count}
                className={styles.getCaptcha}
                onClick={this.onGetCaptcha}
              >{count ? `${count} s` : '获取验证码'}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button
            size='large'
            loading={submitting}
            className={styles.submit}
            type='primary'
            htmlType='submit'
          >注册</Button>
          <Link className={styles.login} to='/user/login'>使用已有账户登录</Link>
        </FormItem>
      </Form>
    </div>
  }
}

export default Form.create()(Register)
