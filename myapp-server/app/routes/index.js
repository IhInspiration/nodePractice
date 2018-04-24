var express = require('express');
var router = express.Router();
import React from 'react';
import ReactDom from 'react-dom/server';
import Main from '../scripts/index';

router.get('/', function(req, res, next) {
  res.render('templates/index', {
    title: '我的第一个react同构项目',
    testNodemon: "nodemon",
    bodyContent: ReactDom.renderToString(<Main />)
  });
});

module.exports = router;
