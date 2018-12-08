-- ----------------------------
--  m_type 类型表
-- ----------------------------
DROP TABLE IF EXISTS fylat.m_type;
CREATE TABLE fylat.m_type (
	type_id serial NOT NULL,
	type_name varchar(50) COLLATE default,
	type_nickname varchar(50) COLLATE default
)
WITH (OIDS=FALSE);
--主键
ALTER TABLE fylat.m_type ADD PRIMARY KEY (type_id) NOT DEFERRABLE INITIALLY IMMEDIATE;
--说明
COMMENT ON COLUMN fylat.m_type.type_id IS '类型编号';
COMMENT ON COLUMN fylat.m_type.type_name IS '类型名称';
COMMENT ON COLUMN fylat.m_type.type_nickname IS '类型别称';
--数据
BEGIN;
INSERT INTO fylat.m_type VALUES ('2', 'CO2', '二氧化碳(CO2)');
INSERT INTO fylat.m_type VALUES ('1', 'CLM', '云检测(CLM)');
INSERT INTO fylat.m_type VALUES ('3', 'MRR', '微波降水(MRR)');
INSERT INTO fylat.m_type VALUES ('4', 'VASS', '大气廓线(VASS)');
INSERT INTO fylat.m_type VALUES ('5', 'SNC', '积雪覆盖(SNC)');
INSERT INTO fylat.m_type VALUES ('6', 'SST', '海面温度(SST)');
INSERT INTO fylat.m_type VALUES ('7', 'CLM', '海面风速(CLM)');
COMMIT;


-- ----------------------------
--  m_quailty_test 质检结果表
-- ----------------------------
DROP TABLE IF EXISTS fylat.m_quailty_test;
CREATE TABLE fylat.m_quailty_test (
	qua_id serial NOT NULL,
	qua_image_url varchar(200) COLLATE default,
	qua_name varchar(50) COLLATE default,
	qua_datetime timestamp(6) NULL,
	qua_source varchar(30) COLLATE default,
	qua_type varchar(30) COLLATE default,
	qua_mean_value float8 DEFAULT 0,
	qua_median float8 DEFAULT 0,
	qua_standard_variance float8 DEFAULT 0,
	qua_coefficient_of_variation varchar(20) COLLATE default,
	qua_abnormal_value varchar COLLATE default,
	qua_accuracy float4 DEFAULT 0,
	qua_valid_ratio float4 DEFAULT 0,
	qua_mean_bias float4 DEFAULT 0,
	qua_root_mean_square_error float4 DEFAULT 0,
	qua_r2 float4 DEFAULT 0,
	qua_linear_regression_equation varchar(200) COLLATE default,
	qua_conf_url varchar(200) COLLATE default,
	qua_select_mother varchar(30) COLLATE default
)
WITH (OIDS=FALSE);
--主键
ALTER TABLE fylat.m_quailty_test ADD PRIMARY KEY (qua_id) NOT DEFERRABLE INITIALLY IMMEDIATE;
--说明
COMMENT ON COLUMN fylat.m_quailty_test.qua_id IS '结果查看编号';
COMMENT ON COLUMN fylat.m_quailty_test.qua_image_url IS '结果查看-图片地址';
COMMENT ON COLUMN fylat.m_quailty_test.qua_name IS '结果查看-名称';
COMMENT ON COLUMN fylat.m_quailty_test.qua_datetime IS '结果查看-时间';
COMMENT ON COLUMN fylat.m_quailty_test.qua_source IS '结果查看-检测源';
COMMENT ON COLUMN fylat.m_quailty_test.qua_type IS '结果查看-类型编号';
COMMENT ON COLUMN fylat.m_quailty_test.qua_mean_value IS '算术均值';
COMMENT ON COLUMN fylat.m_quailty_test.qua_median IS '中位数';
COMMENT ON COLUMN fylat.m_quailty_test.qua_standard_variance IS '标准差';
COMMENT ON COLUMN fylat.m_quailty_test.qua_coefficient_of_variation IS '变异系数';
COMMENT ON COLUMN fylat.m_quailty_test.qua_abnormal_value IS '异常';
COMMENT ON COLUMN fylat.m_quailty_test.qua_accuracy IS '准确度';
COMMENT ON COLUMN fylat.m_quailty_test.qua_valid_ratio IS '整体有效率';
COMMENT ON COLUMN fylat.m_quailty_test.qua_mean_bias IS '平均偏差';
COMMENT ON COLUMN fylat.m_quailty_test.qua_root_mean_square_error IS '均方根误差（Root-mean-square error，RMSE';
COMMENT ON COLUMN fylat.m_quailty_test.qua_r2 IS '决定系数（R2）';
COMMENT ON COLUMN fylat.m_quailty_test.qua_linear_regression_equation IS '线性回归方程（Linear Regression Equation）';
COMMENT ON COLUMN fylat.m_quailty_test.qua_conf_url IS '配置文件目录';
COMMENT ON COLUMN fylat.m_quailty_test.qua_select_mother IS '所使用方法名称';


-- ----------------------------
--  m_operation_manage 运行管理表
-- ----------------------------
DROP TABLE IF EXISTS fylat.m_operation_manage;
CREATE TABLE fylat.m_operation_manage (
	ope_id serial NOT NULL,
	ope_step int4,
	ope_process varchar(50) COLLATE default,
	ope_version varchar(30) COLLATE default,
	ope_type int4,
	belong_int varchar(50) COLLATE default
)
WITH (OIDS=FALSE);
ALTER TABLE fylat.m_operation_manage ADD PRIMARY KEY (ope_id) NOT DEFERRABLE INITIALLY IMMEDIATE;

COMMENT ON COLUMN fylat.m_operation_manage.ope_id IS '运行管理-编号';
COMMENT ON COLUMN fylat.m_operation_manage.ope_step IS '运行管理-步骤';
COMMENT ON COLUMN fylat.m_operation_manage.ope_process IS '运行管理-进程';
COMMENT ON COLUMN fylat.m_operation_manage.ope_version IS '运行管理-版本';
COMMENT ON COLUMN fylat.m_operation_manage.ope_type IS '运行管理-类型';
COMMENT ON COLUMN fylat.m_operation_manage.belong_int IS '所属进程';




-- ----------------------------
--  m_operation_result 运行结果表
-- ----------------------------
DROP TABLE IF EXISTS fylat.m_operation_result;
CREATE TABLE fylat.m_operation_result (
	opet_id serial NOT NULL,
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
--主键
ALTER TABLE fylat.m_operation_result ADD PRIMARY KEY (opet_id) NOT DEFERRABLE INITIALLY IMMEDIATE;
--说明
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
--   m_integration_manage 进程表
-- ----------------------------
DROP TABLE IF EXISTS fylat.m_integration_manage;
CREATE TABLE fylat.m_integration_manage (
	int_id serial NOT NULL,
	int_name varchar(100) COLLATE default,
	int_version varchar(20) COLLATE default,
	int_version_explain varchar(200) COLLATE default,
	int_upload_state int2,
	int_download_num int4,
	int_complie_state int2,
	int_state int2,
	int_type varchar(50) COLLATE default,
	int_belong_user varchar(50) COLLATE default,
	int_output_path varchar(200) COLLATE default,
	int_src_path varchar(200) COLLATE default,
	int_project_type varchar(50) COLLATE default
)
WITH (OIDS=FALSE);
--主键
ALTER TABLE fylat.m_integration_manage ADD PRIMARY KEY (int_id) NOT DEFERRABLE INITIALLY IMMEDIATE;
--说明
COMMENT ON COLUMN fylat.m_integration_manage.int_id IS '进程编号';
COMMENT ON COLUMN fylat.m_integration_manage.int_name IS '进程名称 ';
COMMENT ON COLUMN fylat.m_integration_manage.int_version IS '进程版本';
COMMENT ON COLUMN fylat.m_integration_manage.int_version_explain IS '进程版本说明';
COMMENT ON COLUMN fylat.m_integration_manage.int_upload_state IS '上传状态';
COMMENT ON COLUMN fylat.m_integration_manage.int_download_num IS '下载次数';
COMMENT ON COLUMN fylat.m_integration_manage.int_complie_state IS '编译状态';
COMMENT ON COLUMN fylat.m_integration_manage.int_state IS '数据状态';
COMMENT ON COLUMN fylat.m_integration_manage.int_type IS '所属类型';
COMMENT ON COLUMN fylat.m_integration_manage.int_belong_user IS '所属用户';
COMMENT ON COLUMN fylat.m_integration_manage.int_output_path IS '输出产品位置';
COMMENT ON COLUMN fylat.m_integration_manage.int_src_path IS '源码位置';
COMMENT ON COLUMN fylat.m_integration_manage.int_project_type IS '产品类型';

-- ----------------------------
--   m_quality_contrast 质检平台-异源比对
-- ----------------------------
DROP TABLE IF EXISTS fylat.m_quality_contrast;
CREATE TABLE fylat.m_quality_contrast (
	con_id serial NOT NULL,
	con_name varchar(100) COLLATE default,
	con_source_name varchar(100) COLLATE default,
	con_contrast_name varchar(100) COLLATE default,
	con_rate varchar(20) COLLATE default,
	con_content varchar(50) COLLATE default,
	con_image_url varchar COLLATE default
)
WITH (OIDS=FALSE);
--主键
ALTER TABLE fylat.m_quality_contrast ADD PRIMARY KEY (con_id) NOT DEFERRABLE INITIALLY IMMEDIATE;
--说明
COMMENT ON COLUMN fylat.m_quality_contrast.con_id IS '分析数据及参考数据对比表-编号';
COMMENT ON COLUMN fylat.m_quality_contrast.con_name IS '名称';
COMMENT ON COLUMN fylat.m_quality_contrast.con_source_name IS '待分析数据名称';
COMMENT ON COLUMN fylat.m_quality_contrast.con_contrast_name IS '参考数据名称';
COMMENT ON COLUMN fylat.m_quality_contrast.con_rate IS '对比差异率';
COMMENT ON COLUMN fylat.m_quality_contrast.con_content IS '对比内容';
COMMENT ON COLUMN fylat.m_quality_contrast.con_image_url IS '对比图片地址';


-- ----------------------------
--  m_config 进程配置信息表
-- ----------------------------
DROP TABLE IF EXISTS fylat.m_config;
CREATE TABLE fylat.m_config (
	config_id serial NOT NULL,
	config_belong_int int4,
	config_head varchar(100) COLLATE default,
	config_foot varchar(100) COLLATE default,
	config_param varchar(2000) COLLATE default,
	config_path varchar(100) COLLATE default
)
WITH (OIDS=FALSE);
--主键
ALTER TABLE fylat.m_config ADD PRIMARY KEY (config_id) NOT DEFERRABLE INITIALLY IMMEDIATE;
--说明
COMMENT ON COLUMN fylat.m_config.config_id IS '配置文件编号';
COMMENT ON COLUMN fylat.m_config.config_belong_int IS '配置文件所属进程';
COMMENT ON COLUMN fylat.m_config.config_head IS '配置文件头信息';
COMMENT ON COLUMN fylat.m_config.config_foot IS '配置文件头信息';
COMMENT ON COLUMN fylat.m_config.config_param IS '配置项';
COMMENT ON COLUMN fylat.m_config.config_path IS '配置文件位置';

-- ----------------------------
--  m_jobscheduler_manage 工作流表
-- ----------------------------
DROP TABLE fylat.m_jobscheduler_manage;
CREATE TABLE fylat.m_jobscheduler_manage (
job_id serial NOT NULL,
job_user varchar(100),
job_name varchar(100),
job_state int2,
job_type varchar(100),
job_data_starttime varchar(100),
job_data_endtime varchar(100),
job_process varchar(500)
)
WITH (OIDS=FALSE);
--主键
ALTER TABLE fylat.m_jobscheduler_manage ADD PRIMARY KEY (job_id);





-- ----------------------------
--  Table structure for m_data_manage
-- ----------------------------
DROP TABLE IF EXISTS "fylat"."m_data_manage";
CREATE TABLE "fylat"."m_data_manage" (
	"data_id" int4 NOT NULL,
	"data_name" varchar(50) COLLATE "default",
	"data_expand1" varchar(50) COLLATE "default",
	"data_type_id" int4
)
WITH (OIDS=FALSE);
ALTER TABLE "fylat"."m_data_manage" OWNER TO "postgres";

COMMENT ON COLUMN "fylat"."m_data_manage"."data_id" IS '数据管理-编号';
COMMENT ON COLUMN "fylat"."m_data_manage"."data_name" IS '数据管理-名称';
COMMENT ON COLUMN "fylat"."m_data_manage"."data_type_id" IS '类型编号';

-- ----------------------------
--  Primary key structure for table m_type
-- ----------------------------
ALTER TABLE "fylat"."m_type" ADD PRIMARY KEY ("type_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table m_quailty_test
-- ----------------------------
ALTER TABLE "fylat"."m_quailty_test" ADD PRIMARY KEY ("qua_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table m_operation_manage
-- ----------------------------
ALTER TABLE "fylat"."m_operation_manage" ADD PRIMARY KEY ("ope_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table m_operation_result
-- ----------------------------
ALTER TABLE "fylat"."m_operation_result" ADD PRIMARY KEY ("opet_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table m_integration_manage
-- ----------------------------
ALTER TABLE "fylat"."m_integration_manage" ADD PRIMARY KEY ("int_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table m_data_manage
-- ----------------------------
ALTER TABLE "fylat"."m_data_manage" ADD PRIMARY KEY ("data_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

