import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import url from 'url';

class User extends Component {

  constructor(props) {
    super(props);

    this.state = {
      login: {
        username: '',
        password: ''
      },
      register: {
        username: '',
        password: ''
      }
    }
  }

  handleChange = name => {
    return e => {
      this.setState({
        login: {
          ...this.state.login,
          [name]: e.target.value
        }
      })
    }
  }

  handleRegisterChange = name => {
    return e => {
      this.setState({
        register: {
          ...this.state.register,
          [name]: e.target.value
        }
      })
    }
  }

  login = () => {
    fetch('/users/login', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'same-origin',
      body: JSON.stringify({...this.state.login})
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      if(json.status === 0) {
        alert(json.msg);
        const { redirectUrl } = url.parse(location.href, true).query;
        window.location.href = redirectUrl && '/';
      } else {
        alert(json.msg);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  register = () => {
    fetch('/users/register', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'same-origin',
      body: JSON.stringify({...this.state.register})
    })
    .then(res => res.json())
    .then(json => {
      alert(json.msg);
    }).catch(err => {
      console.log(err);
    })
  }
  
  render() {
    const { login, register } = this.state;

    return (
      <div>
          <h2>登录</h2>
          <label>用户名:</label><input type="text" value={login.user} onChange={this.handleChange('username')} />
          <label>密码:</label><input type="password" value={login.password} onChange={this.handleChange('password')} />
          <button onClick={this.login}>登录</button>
          <h2>注册</h2>
          <label>用户名</label><input type="text" value={register.user} onChange={this.handleRegisterChange('username')} />
          <label>密码</label><input type="password" value={register.password} onChange={this.handleRegisterChange('password')} />
          <button onClick={this.register}>注册</button>
      </div>
    );
  }
}

ReactDOM.hydrate(<User />, document.getElementById("react-app"));