/*
 数据管理

 Source Server Type    : PostgreSQL
 Source Database       : postgres
 Source Schema         : fylat
 File Encoding         : utf-8

 Date: 10/17/2017 17:28:07 PM
*/

-- ----------------------------
--  创建表 m_data_manage
-- ----------------------------
CREATE TABLE fylat.m_data_manage (
	data_id int4 NOT NULL,
	data_name varchar(50) COLLATE default,
	data_expand1 varchar(50) COLLATE default,
	data_type_id int4
)
WITH (OIDS=FALSE);
ALTER TABLE fylat.m_data_manage OWNER TO postgres;

COMMENT ON COLUMN fylat.m_data_manage.data_id IS '数据管理-编号';
COMMENT ON COLUMN fylat.m_data_manage.data_name IS '数据管理-名称';
COMMENT ON COLUMN fylat.m_data_manage.data_type_id IS '类型编号';

-- ----------------------------
--  添加主键
-- ----------------------------
ALTER TABLE fylat.m_data_manage ADD PRIMARY KEY (data_id) NOT DEFERRABLE INITIALLY IMMEDIATE;