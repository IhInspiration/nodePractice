import React, { Component } from 'react';

class User extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: '',
      password: ''
    }
  }

  handleChange = name => {
    return e => {
      this.setState({
        [name]: e.target.value
      })
    }
  }

  login = () => {
    fetch('/users/login', {
      method: 'post',
      body: JSON.stringify({...this.state})
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    const { user, password } = this.state;
    return (
      <div>
          <label>用户名:</label><input type="text" name="username" value={user} onChange={this.handleChange('user')} />
          <label>密码:</label><input type="password" name="password" value={password} onChange={this.handleChange('password')} />
          <button onClick={this.login}>登录</button>
      </div>
    );
  }
}

export default User;