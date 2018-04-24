import React, {Component} from 'react';
import ReactDom from 'react-dom';

let noNode = typeof window !== "undefined";
if(noNode){
    window.isClient = true;
    window.glo = window;
}

let Main = () => {
    return (
        <div>
            <div>test</div>
            <div>你好，React同构项目，永久持续运行！！！</div>
        </div>
    );
}

if(isClient) {
    ReactDOM.render(<Main />, document.getElementById("react-app"));
} else {
    module.exports = Main;
}