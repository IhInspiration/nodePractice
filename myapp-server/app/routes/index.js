import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDom from 'react-dom/server';
import { Observable } from 'rxjs/Rx';
import db from '../base/connect';
import TodoList from '../scripts/index/index';
import ObservableTodoStore from '../scripts/index/ObservableTodoStore';

const router = express.Router();
const observableTodoStore = new ObservableTodoStore();

router.get('/', (req, res, next) => {
  if(req.session.username) {
    res.render('templates/index', {
      title: '我的第一个react同构项目',
      testNodemon: "nodemon",
      time: +new Date(),
      bodyContent: ReactDom.renderToString(<TodoList store={observableTodoStore} />)
    });
  } else {
    res.redirect(`/users?redirectUrl=${encodeURIComponent(req.url)}`);
  }

});

const getFilePromise = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname,'../../log/testRx.log'), 'utf8', (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
};

const getRxDataPromise = (data) => {
  return new Promise((resolve, reject) => {
    if(data) {
      db.query("SELECT * FROM rx", (err2, rows) => {
        if (err2) throw err2;
        resolve({data, rows});
      });
    } else {
      reject();
    }
  });
}

const getUserDataPromise = (fileData, rxData) => {
  return new Promise((resolve, reject) => {
    if(rxData.length > 0) {
      reject("rx数据不存在")
      db.query("SELECT username FROM users", (err2, userData) => 
        resolve({fileData, rxData, userData})
      );
    } else {
      reject("rx数据不存在")
    }
  });
}

router.get('/getRxData', (req, res, next) => {
  console.log("文件地址：" + path.resolve(__dirname, '../../'));
  
  const readFile$ = Observable.fromPromise(getFilePromise());

  Observable
    .fromPromise(getFilePromise())
    .switchMap(data => Observable.fromPromise(getRxDataPromise(data)))
    .switchMap(({data, rows}) => Observable.fromPromise(getUserDataPromise(data, rows)))
    .subscribe(resData => {
      res.json({
        status: 0,
        data: {
          ...resData
        }
      })
    }, err => {
      res.json({
        status: 1,
        msg: err
      })
    });
});

module.exports = router;
