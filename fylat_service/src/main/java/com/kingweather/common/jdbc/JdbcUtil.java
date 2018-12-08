package com.kingweather.common.jdbc;

import com.kingweather.common.util.Page;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.*;


@Component
public class JdbcUtil {

    @Resource
    private JdbcTemplate jdbcTemplate;

    /**
     * 获取分页数据
     *
     * @param pageNo   开始索引
     * @param pageSize 分页大小
     * @param countSql 获取数据条数的sql
     * @param sql      获取数据的sql
     * @param args     查询参数
     * @return 分页后的数据
     */
    public Page<Map<String, Object>> queryForPage(int pageNo, int pageSize,
                                                  String countSql, String sql, Object... args) {
        Page<Map<String, Object>> page = new Page<Map<String, Object>>(pageSize);
        if (sql != null && sql.length() > 0) {
            Number number = jdbcTemplate.queryForObject(countSql, args, Long.class);
            page.setTotalCount(number != null ? number.longValue() : 0);
            //			page.setPageNo(pageNo);
            //			page.setPageSize(pageSize);
            int startPoint = (pageNo - 1) * pageSize;
            page.setResult(jdbcTemplate.queryForList(sql + " limit " + pageSize + " offset " + startPoint, args));
        }
        return page;
    }


    public void createTable(String tableName, Set<String> fieldSet) {
        StringBuilder sb = new StringBuilder();
        for (String str : fieldSet) {
            if (!"POIID_MD5".equals(str)) {
                sb.append(str);
                sb.append(" TEXT,");
            }
        }
        String csql = "CREATE TABLE IF NOT EXISTS " + tableName + " (POIID_MD5 CHAR(32)," + sb.toString() + " PRIMARY KEY (POIID_MD5))";
        String csql2 = "CREATE TABLE IF NOT EXISTS " + tableName + "_INFO (POIID_MD5 CHAR(32)," + sb.toString() + " PRIMARY KEY (POIID_MD5))";
        String dSql1 = "TRUNCATE TABLE " + tableName;
        String dSql2 = "TRUNCATE TABLE " + tableName + "_INFO";
        jdbcTemplate.update(csql);
        jdbcTemplate.update(csql2);
        jdbcTemplate.update(dSql1);
        jdbcTemplate.update(dSql2);

    }

    @Deprecated
    public boolean batchUpdateBy(String tableName, List<Map<String, Object>> list) {
        boolean result = false;
        if (list != null && list.size() > 0) {
            Map<String, Object> dataMap = list.get(0);
            Set<String> keySet = dataMap.keySet();
            int size = keySet.size();
            if (size > 0) {
                String sz = keySet.toString();
                String ss = sz.substring(1, sz.length() - 1);
                String[] a = new String[size];
                Arrays.fill(a, "?");
                String sx = Arrays.asList(a).toString();
                String vv = sx.substring(1, sx.length() - 1);
                String sql = "INSERT INTO " + tableName + " (" + ss + ") VALUES (" + vv + ")";
                List<Object[]> osList = new ArrayList<Object[]>();
                for (Map<String, Object> map : list) {
                    Object[] os = map.values().toArray();
                    osList.add(os);
                }
                int updateSize = jdbcTemplate.batchUpdate(sql, osList).length;
                if (updateSize == osList.size()) {
                    result = true;
                }
            }
        }
        return result;
    }

   /* public void batchUpdateByTableName(String tableName, List<Map<String, Object>> list) {
        if (list != null && list.size() > 0) {
            SimpleJdbcInsert insertActor = new SimpleJdbcInsert(getjdbcTemplate()).withTableName(tableName);
            Set<String> set = new HashSet<String>(list.get(0).keySet());
            insertActor.usingColumns(set.toArray(new String[set.size()]));
            MapSqlParameterSource[] batch = new MapSqlParameterSource[list.size()];
            for (int i = 0; i < batch.length; i++) {
                batch[i] = new MapSqlParameterSource().addValues(list.get(i));
            }
            insertActor.executeBatch(batch);
        }
    }

    public int insertByTableName(String tableName, String key, Map<String, Object> map) {
        Set<String> set = new HashSet<String>(map.keySet());
        SimpleJdbcInsert insertActor = new SimpleJdbcInsert(getjdbcTemplate());
        insertActor.withTableName(tableName);
        insertActor.usingColumns(set.toArray(new String[map.size()]));
        insertActor.usingGeneratedKeyColumns(key);
        return insertActor.executeAndReturnKey(map).intValue();
    }

    public int insertByTableName(String tableName, String key, MapSqlParameterSource parameter) {
        Set<String> set = new HashSet<String>(parameter.getValues().keySet());
        SimpleJdbcInsert insertActor = new SimpleJdbcInsert(getjdbcTemplate());
        insertActor.withTableName(tableName);
        insertActor.usingColumns(set.toArray(new String[set.size()]));
        insertActor.usingGeneratedKeyColumns(key);
        return insertActor.executeAndReturnKey(parameter).intValue();
    }


    public List<Map<String, Object>> insert(String queryString, final Object... args) {
        try {
            final String strSql = queryString;
            KeyHolder keyHolder = new GeneratedKeyHolder();
            update(new PreparedStatementCreator() {
                public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
                    PreparedStatement ps = conn.prepareStatement(strSql, Statement.RETURN_GENERATED_KEYS);
                    PreparedStatementSetter pss = newArgPreparedStatementSetter(args);
                    try {
                        if (pss != null) {
                            pss.setValues(ps);
                        }
                    } finally {
                        if (pss instanceof ParameterDisposer) {
                            ((ParameterDisposer) pss).cleanupParameters();
                        }
                    }
                    return ps;
                }

            }, keyHolder);
            List<Map<String, Object>> list = keyHolder.getKeyList();
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("insert exception:" + e);
        }
    }*/
}
