-- 创建user表
CREATE TABLE IF NOT EXISTS users(
  id INT(11) NOT NULL AUTO_INCREMENT,
  username varchar(20) NOT NULL,
  password char(32) NOT NULL,
  PRIMARY KEY(id)
);

-- 创建RX表结构
CREATE TABLE IF NOT EXISTS rx(
  id INT NOT NULL AUTO_INCREMENT,
  column_char CHAR(32) NOT NULL,
  column_varchar VARCHAR(255),
  column_num INT,
  PRIMARY KEY(id)
);