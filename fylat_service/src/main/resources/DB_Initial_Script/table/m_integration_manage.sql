/*
 集成管理

 Source Server Type    : PostgreSQL
 Source Database       : postgres
 Source Schema         : fylat
 File Encoding         : utf-8

 Date: 10/17/2017 17:28:07 PM
*/

-- ----------------------------
--  创建表 m_integration_manage
-- ----------------------------
CREATE TABLE fylat.m_integration_manage (
	int_id int4 NOT NULL,
	int_name varchar(100) COLLATE default,
	int_version varchar(20) COLLATE default,
	int_version_explain varchar(200) COLLATE default,
	int_upload_state int2,
	int_download_num int4,
	int_complie_state int2,
	int_state int2,
	int_type int4
)
WITH (OIDS=FALSE);
ALTER TABLE fylat.m_integration_manage OWNER TO postgres;

COMMENT ON COLUMN fylat.m_integration_manage.int_id IS '进程编号';
COMMENT ON COLUMN fylat.m_integration_manage.int_name IS '进程名称 ';
COMMENT ON COLUMN fylat.m_integration_manage.int_version IS '进程版本';
COMMENT ON COLUMN fylat.m_integration_manage.int_version_explain IS '进程版本说明';
COMMENT ON COLUMN fylat.m_integration_manage.int_upload_state IS '上传状态';
COMMENT ON COLUMN fylat.m_integration_manage.int_download_num IS '下载次数';
COMMENT ON COLUMN fylat.m_integration_manage.int_complie_state IS '编译状态';
COMMENT ON COLUMN fylat.m_integration_manage.int_state IS '数据状态';
COMMENT ON COLUMN fylat.m_integration_manage.int_type IS '所属类型';

-- ----------------------------
--  添加主键
-- ----------------------------
ALTER TABLE fylat.m_integration_manage ADD PRIMARY KEY (int_id) NOT DEFERRABLE INITIALLY IMMEDIATE;