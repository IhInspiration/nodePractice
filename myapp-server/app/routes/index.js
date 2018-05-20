var express = require('express');
var router = express.Router();
import React from 'react';
import ReactDom from 'react-dom/server';
import TodoList from '../scripts/index/index';
import ObservableTodoStore from '../scripts/index/ObservableTodoStore';

const observableTodoStore = new ObservableTodoStore();

router.get('/', function(req, res, next) {

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

module.exports = router;
