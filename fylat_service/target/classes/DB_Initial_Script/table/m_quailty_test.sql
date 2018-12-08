/*
 目视检测表（原'质量检测'）

 Source Server Type    : PostgreSQL
 Source Database       : postgres
 Source Schema         : fylat
 File Encoding         : utf-8

 Date: 10/17/2017 17:28:07 PM
*/

-- ----------------------------
--  创建表 m_quailty_test
-- ----------------------------
CREATE TABLE fylat.m_quailty_test (
	qua_id int4 NOT NULL,
	qua_image_url varchar(200) COLLATE default,
	qua_name varchar(50) COLLATE default,
	qua_time date,
	qua_count int4,
	qua_slope float8,
	qua_intercept float8,
	qua_standar_error float8,
	qua_absolute_error float8,
	qua_relative_error float8,
	qua_source varchar(30) COLLATE default,
	qua_type int4
)
WITH (OIDS=FALSE);
ALTER TABLE fylat.m_quailty_test OWNER TO postgres;

COMMENT ON COLUMN fylat.m_quailty_test.qua_id IS '结果查看编号';
COMMENT ON COLUMN fylat.m_quailty_test.qua_image_url IS '结果查看-图片地址';
COMMENT ON COLUMN fylat.m_quailty_test.qua_name IS '结果查看-名称';
COMMENT ON COLUMN fylat.m_quailty_test.qua_time IS '结果查看-时间';
COMMENT ON COLUMN fylat.m_quailty_test.qua_count IS '结果查看-数量';
COMMENT ON COLUMN fylat.m_quailty_test.qua_slope IS '结果查看-倾斜';
COMMENT ON COLUMN fylat.m_quailty_test.qua_intercept IS '结果查看-截距';
COMMENT ON COLUMN fylat.m_quailty_test.qua_standar_error IS '结果查看-标准误差';
COMMENT ON COLUMN fylat.m_quailty_test.qua_absolute_error IS '结果查看-绝对误差';
COMMENT ON COLUMN fylat.m_quailty_test.qua_relative_error IS '结果查看-相对误差';
COMMENT ON COLUMN fylat.m_quailty_test.qua_source IS '结果查看-检测源';
COMMENT ON COLUMN fylat.m_quailty_test.qua_type IS '结果查看-类型编号';

-- ----------------------------
--  添加主键
-- ----------------------------
ALTER TABLE fylat.m_quailty_test ADD PRIMARY KEY (qua_id) NOT DEFERRABLE INITIALLY IMMEDIATE;