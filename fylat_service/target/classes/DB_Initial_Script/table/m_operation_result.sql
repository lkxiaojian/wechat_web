/*
 运行结果

 Source Server Type    : PostgreSQL
 Source Database       : postgres
 Source Schema         : fylat
 File Encoding         : utf-8

 Date: 10/17/2017 17:28:07 PM
*/

-- ----------------------------
--  创建表 m_operation_result
-- ----------------------------
CREATE TABLE fylat.m_operation_result (
	opet_id int4 NOT NULL,
	opet_username varchar(50) COLLATE default,
	opet_role varchar(50) COLLATE default,
	opet_starttime date,
	opet_endtime date,
	opet_operation_state int2,
	opet_detail varchar(200) COLLATE default,
	opet_result varchar(200) COLLATE default,
	opet_operation int4
)
WITH (OIDS=FALSE);
ALTER TABLE fylat.m_operation_result OWNER TO postgres;

COMMENT ON COLUMN fylat.m_operation_result.opet_id IS '运行管理-结果-编号';
COMMENT ON COLUMN fylat.m_operation_result.opet_username IS '运行管理-结果-用户';
COMMENT ON COLUMN fylat.m_operation_result.opet_role IS '运行管理-结果-角色';
COMMENT ON COLUMN fylat.m_operation_result.opet_starttime IS '运行管理-结果-开始时间';
COMMENT ON COLUMN fylat.m_operation_result.opet_endtime IS '运行管理-结果-结束时间';
COMMENT ON COLUMN fylat.m_operation_result.opet_operation_state IS '运行管理-结果-运行状态';
COMMENT ON COLUMN fylat.m_operation_result.opet_detail IS '运行管理-结果-运行详情';
COMMENT ON COLUMN fylat.m_operation_result.opet_result IS '运行管理-结果-运行结果';
COMMENT ON COLUMN fylat.m_operation_result.opet_operation IS '运行管理-结果-扩展字段1';

-- ----------------------------
--  添加主键
-- ----------------------------
ALTER TABLE fylat.m_operation_result ADD PRIMARY KEY (opet_id) NOT DEFERRABLE INITIALLY IMMEDIATE;