import React, { Component } from 'react';

class LoginBox extends Component {
  constructor(props) {
    super();
    this.state = {
      userList: [],
    };
    this.socket = props.socket;
    this.id = props.id;
  }

  componentDidMount() {
    this.socket.on('GET_USERLIST', (userList) => {
      this.setState({ userList });
    });
    this.socket.emit('EMIT_USERLIST');
  }
  componentWillUnmount() {
    this.socket.off('GET_USERLIST');
  }
  setTitle = () => {
    this.socket.emit('SET_NAME', { name: this.textInput.value, id: this.id });
    this.socket.emit('INIT', { id: this.id, name: this.name });
    this.props.handlelogin(this.textInput.value); // update app state
    this.textInput.value = '';
  }

  render() {
    return (
      <div className="loginRoot">
        <div className="loginMenu">
          <h1 className="loginHeader">Welcome</h1>
          <input className="loginInput" placeholder="name" ref={(input) => { this.textInput = input; }} />
          <button className="loginStart" onClick={this.setTitle}>START</button>
          <div className="loginOnline">
            <div className="loginOnlineDraw">Online</div>
            <ul className="loginOnlineul">
              {this.state.userList.map(user =>
            (<li className="loginOnlineli" key={user.id}> {user.name} </li>))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginBox;
