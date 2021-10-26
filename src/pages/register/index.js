import React, { Component } from "react"
import ajax, { ErrorCode } from "@utils/ajax"
import { Toast } from 'antd-mobile';
import './index.scss'
import Cookies from 'js-cookie';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.handleEditPhone = this.handleEditPhone.bind(this);
    this.sendSmsClick = this.sendSmsClick.bind(this);
    this.state = {
      userPhone: '',
      userPsd: '',
      isLoading: false,
    }
  }
  componentDidMount() {
  }

  handleEditChange(type, event) {
    let value = event.target.value
    switch (type) {
      case 'userPhone':
        this.handleEditPhone(value);
        break
      case 'userPsd':
        this.verificationPsd(value);
        break
      default:
        break
    }

  }
  verificationPsd(value) {
    this.setState({ userPsd: value });
  }
  handleEditPhone(val) {
    var length = val.length;
    if (length > 11) {
      this.setState({ userPhone: val.substring(0, 11) });
      event.target.value = val.substring(0, 11);
    } else {
      this.setState({ userPhone: val });
    }
  }
  async sendSmsClick(event) {
    if (!(/^[1][358][0-9]{9}$/).test(this.state.userPhone)) {
      Toast.info("请输入正确的手机号");
      return;
    }
    if (this.state.userPsd.length === null||this.state.userPsd.length<8) {
      Toast.info("请输入正确密码");
      return;
    }
    Toast.loading('加载中', 6000);
    
    ajax.post('/v1/register', {
      phone:this.state.userPhone,
      passwd:this.state.userPsd,
    }).then((res) => {
      Toast.hide();
      if (res.code !== ErrorCode.succ) {
        Toast.info(res.msg)
        return
      }
      Cookies.set('token',res.obj.value)
      this.props.history.replace({ pathname: "/console"})
    }, (err) => {
      Toast.hide();
      Toast.info(err.msg)
    })
    
    event.preventDefault();

  }
  render() {
    return (
      <div className="login_info">
        <div className="login_text">注册</div>
        <div className="login_edit_top"></div>
        <div className="login_edit_box">
          <input type="number" maxLength="11" autoFocus placeholder="请输入手机号"
            className="login_edit" onChange={this.handleEditChange.bind(this, 'userPhone')}></input>
        </div>
        <div className="login_edit_box">
          <input type="password" placeholder="请输入密码" maxLength="20" className="login_edit" onChange={this.handleEditChange.bind(this, 'userPsd')}></input>
        </div>
        <div className="login_btn" onClick={this.sendSmsClick}>注册</div>
      </div>
    )
  }
}
export default LoginPage;