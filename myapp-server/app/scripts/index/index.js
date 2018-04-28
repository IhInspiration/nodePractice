import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import "./config.js";
import ObservableTodoStore from './ObservableTodoStore';

const observableTodoStore = new ObservableTodoStore();

@observer
class TodoList extends Component {

    onNewTodo = () => {
        this.props.store.addTodo(prompt('Enter a new todo:','coffee plz'));
    }

    render() {
        const store = this.props.store;
        return (
            <div>
                <div>你好，React同构项目，永久持续运行！！</div>
                {store.report}
                <ul>
                    {
                        store.todos.map(
                            (todo, idx) => <TodoView todo={todo} key={idx} />
                        )
                    }
                </ul>
                {store.pendingRequests > 0 ? <marquee>Loading..</marquee> : null}
                <button onClick={this.onNewTodo}>New Todo</button>
            </div>
        );
    }
}

@observer
class TodoView extends Component {
  render() {
    const todo = this.props.todo;
    return (
      <li onDoubleClick={ this.onRename }>
        <input
          type='checkbox'
          checked={ todo.completed }
          onChange={ this.onToggleCompleted }
        />
        { todo.task }
        { todo.assignee
          ? <small>{ todo.assignee.name }</small>
          : null
        }
      </li>
    );
  }

  onToggleCompleted = () => {
    const todo = this.props.todo;
    todo.completed = !todo.completed;
  }

  onRename = () => {
    const todo = this.props.todo;
    todo.task = prompt('Task name', todo.task) || todo.task;
  }
}

if(isClient) {
    ReactDOM.hydrate(<TodoList store={observableTodoStore}/>, document.getElementById("react-app"));
} else {
    module.exports = TodoList;
}