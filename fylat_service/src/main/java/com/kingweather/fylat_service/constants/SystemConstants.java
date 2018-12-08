package com.kingweather.fylat_service.constants;

import java.util.HashMap;
import java.util.Map;

public class SystemConstants {
    //CLM相关设置
    public static Map<String, String> CML = new HashMap<String, String>() {{
        put("inputFiled", "fy3_mersi_L1b_data,fy3_mersi_GEO_data");
        put("outputFiled", "fy3_mersi_CLM_data,fy3_mersi_CPP_data,fy3_mersi_CTP_data,fy3_mersi_COP_data,fy3_mersi_CLD_data,fy3_intermediate");
        put("prepositionFiled", "oisst_data,oisst_data_path");
        put("specialFiled", "nwp_grib_data1,nwp_grib_data2");
    }};
}
