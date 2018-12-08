/*
 类型表

 Source Server Type    : PostgreSQL
 Source Database       : postgres
 Source Schema         : fylat
 File Encoding         : utf-8

 Date: 10/17/2017 17:28:07 PM
*/

-- ----------------------------
--  创建表 m_type
-- ----------------------------
CREATE TABLE fylat.m_type (
	type_id int4 NOT NULL DEFAULT 0,
	type_name varchar(50) COLLATE default,
	type_nickname varchar(50) COLLATE default
)
WITH (OIDS=FALSE);
ALTER TABLE fylat.m_typ OWNER TO postgres;

COMMENT ON COLUMN fylat.m_type.type_id IS '类型编号';
COMMENT ON COLUMN fylat.m_type.type_name IS '类型名称';
COMMENT ON COLUMN fylat.m_type.type_nickname IS '类型别称';

-- ----------------------------
--  添加主键
-- ----------------------------
ALTER TABLE fylat.m_type ADD PRIMARY KEY (type_id) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  添加必要数据
-- ----------------------------
BEGIN;
INSERT INTO fylat.m_type VALUES ('2', 'CO2', '二氧化碳(CO2)');
INSERT INTO fylat.m_type VALUES ('1', 'CLM', '云检测(CLM)');
INSERT INTO fylat.m_type VALUES ('3', 'MRR', '微波降水(MRR)');
INSERT INTO fylat.m_type VALUES ('4', 'VASS', '大气廓线(VASS)');
INSERT INTO fylat.m_type VALUES ('5', 'SNC', '积雪覆盖(SNC)');
INSERT INTO fylat.m_type VALUES ('6', 'SST', '海面温度(SST)');
INSERT INTO fylat.m_type VALUES ('7', 'CLM', '海面风速(CLM)');
COMMIT;

