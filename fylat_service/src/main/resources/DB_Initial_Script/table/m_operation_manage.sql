/*
 运行管理

 Source Server Type    : PostgreSQL
 Source Database       : postgres
 Source Schema         : fylat
 File Encoding         : utf-8

 Date: 10/17/2017 17:28:07 PM
*/

-- ----------------------------
--  创建表 m_operation_manage
-- ----------------------------
CREATE TABLE fylat.m_operation_manage (
	ope_id int4 NOT NULL,
	ope_step int4,
	ope_process varchar(50) COLLATE default,
	ope_version varchar(30) COLLATE default,
	ope_input_param varchar(100) COLLATE default,
	ope_evn_param varchar(100) COLLATE default,
	ope_type int4
)
WITH (OIDS=FALSE);
ALTER TABLE fylat.m_operation_manage OWNER TO postgres;

COMMENT ON COLUMN fylat.m_operation_manage.ope_id IS '运行管理-编号';
COMMENT ON COLUMN fylat.m_operation_manage.ope_step IS '运行管理-步骤';
COMMENT ON COLUMN fylat.m_operation_manage.ope_process IS '运行管理-进程';
COMMENT ON COLUMN fylat.m_operation_manage.ope_version IS '运行管理-版本';
COMMENT ON COLUMN fylat.m_operation_manage.ope_input_param IS '运行管理-输入参数';
COMMENT ON COLUMN fylat.m_operation_manage.ope_evn_param IS '运行管理-环境参数';
COMMENT ON COLUMN fylat.m_operation_manage.ope_type IS '运行管理-类型';

-- ----------------------------
--  添加主键
-- ----------------------------
ALTER TABLE fylat.m_operation_manage ADD PRIMARY KEY (ope_id) NOT DEFERRABLE INITIALLY IMMEDIATE;