
import express from 'express';
import Users from '../scripts/users/index';
import React from 'react';
import ReactDom from 'react-dom/server';
import md5 from 'md5';
import db from '../base/connect';

const router = express.Router();

router.get('/', function(req, res, next) {
  if(req.session.username) {
    res.redirect('/');
  } else {
    res.render('templates/users', {
      title: '登录页面',
      time: +new Date(),
      bodyContent: ReactDom.renderToString(<Users />)
    });
  }
});

router.post('/register', function(req, res, next) {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, rows) => {
      if(err) throw err;
      if(rows.length > 0) {
        res.json({
          status: 1,
          msg: "用户已存在"
        })
      } else {
        db.query(
          "INSERT INTO users (username, password)" +
          "VALUES (?, ?)",
          [username, md5(password)],
          (err, results) => {
            if (err) throw err;
            console.log(JSON.stringify(results));
            res.json({
              staus: 0,
              msg: "用户注册成功"
            })
          }
        )
      }
    }
  );
});

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, rows) => {
      if(err) throw err;
      if(rows.length > 0) {
        if(md5(password) === rows[0].password) {
          console.log(`用户${username}登录成功`);
          req.session.username = username;
          res.json({
            status: 0,
            msg: '登录成功'
          });
        } else {
          res.json({
            status: 2,
            msg: "密码错误"
          })
        }
      } else {
        res.json({
          status: 1,
          msg: "用户不存在，登录失败"
        });
      }
    }
  )
});

module.exports = router;