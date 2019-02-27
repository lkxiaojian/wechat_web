package com.kingweather.common.util;

import java.sql.Timestamp;
import java.text.FieldPosition;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public final class DateUtil {
    private static SimpleDateFormat _formatter = new SimpleDateFormat(
            "dd'/'MM'/'yyyy", Locale.SIMPLIFIED_CHINESE);
    private static SimpleDateFormat _formatterDateTime = new SimpleDateFormat(
            "dd'/'MM'/'yyyy' 'HH':'mm", Locale.SIMPLIFIED_CHINESE);
    private static SimpleDateFormat _formatterDateTime2 = new SimpleDateFormat(
            "yyyy'/'MM'/'dd' 'HH':'mm':'ss", Locale.SIMPLIFIED_CHINESE);
    private static SimpleDateFormat _formatterDateTime3 = new SimpleDateFormat(
            "yyyy'/'MM'/'dd", Locale.SIMPLIFIED_CHINESE);

    /**
     * Creates a new DateUtil object
     */
    private DateUtil() {
    }

    public static String[] between(int amount) {
        String endtime = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd HH:mm");
        Calendar c = Calendar.getInstance();
        c.add(Calendar.HOUR_OF_DAY, -amount);
        String begintime = DateUtil.formatDateTime(c.getTime(), "yyyy-MM-dd HH:mm");
        return new String[]{begintime, endtime};
    }

    public static String[] between(String timeStr) {
        String endtime = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd HH:mm");
        Calendar c = Calendar.getInstance();
        String timeNumStr = timeStr.split("[^\\d]")[0];
        int timeNum = Integer.parseInt(timeNumStr);
        String timeUnit = timeStr.replaceAll(timeNumStr, "");
        if ("h".equals(timeUnit)) {
            c.add(Calendar.HOUR_OF_DAY, -timeNum);
        } else if ("d".equals(timeUnit)) {
            c.add(Calendar.DAY_OF_MONTH, -timeNum);
        } else if ("m".equals(timeUnit)) {
            c.add(Calendar.MONTH, -timeNum);
        }
        String begintime = DateUtil.formatDateTime(c.getTime(), "yyyy-MM-dd HH:mm");
        return new String[]{begintime, endtime};
    }

    /**
     * Returns the date of the day in form of a String
     *
     * @return The Date of the day in a "JJ/MM/AAAA" format
     */
    private static synchronized String getCurrentDateString(
            SimpleDateFormat formatter) {
        return formatDateTime(new Date(), formatter);
    }

    private static synchronized String formatDateTime(
            Date targetDate, java.text.DateFormat formatter) {
        if (targetDate == null)
            return "";
        return formatter.format(targetDate);
    }

    public static synchronized String getCurrentDateString() {
        return getCurrentDateString(_formatter);
    }

    public static synchronized String getCurrentTimeString() {
        Date nowdate = new Date();
        //转换时间格式
        SimpleDateFormat simpleDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String format = simpleDate.format(nowdate);
        return format;
    }


    public static synchronized String getCurrentTimeString(String time) {
        //转换时间格式
        SimpleDateFormat simpleDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String format = simpleDate.format(time);
        try {
            return String.valueOf(simpleDate.parse(time).getTime() / 1000);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 取几天的时间
     *
     * @param day
     * @return
     */

    public static synchronized String getbeforeCurrentDateString(int day) {
        //当前时间
        Date dNow = new Date();
        Date dBefore = new Date();
        //得到日历
        Calendar calendar = Calendar.getInstance();
        //把当前时间赋给日历
        calendar.setTime(dNow);
        //设置为前一天
        calendar.add(Calendar.DAY_OF_MONTH, -day);
        //得到前一天的时间
        dBefore = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //设置时间格式
        String defaultStartDate = sdf.format(dBefore);    //格式化前一天
        return defaultStartDate;
    }


    /**
     * 取几天的时间
     *
     * @param day
     * @return
     */

    public static synchronized String getbeforeDayCurrentDateString(int day) {
        //当前时间
        Date dNow = new Date();
        Date dBefore = new Date();
        //得到日历
        Calendar calendar = Calendar.getInstance();
        //把当前时间赋给日历
        calendar.setTime(dNow);
        //设置为前一天
        calendar.add(Calendar.DAY_OF_MONTH, -day);
        //得到前一天的时间
        dBefore = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); //设置时间格式
        String defaultStartDate = sdf.format(dBefore);    //格式化前一天
        return defaultStartDate;
    }

    /**
     * 取几个小时前的数据
     *
     * @param day
     * @return
     */
    public static synchronized String getbeforeCurrentHourDateString(int day) {
        //当前时间
        Date dNow = new Date();
        Date dBefore = new Date();
        //得到日历
        Calendar calendar = Calendar.getInstance();
        //把当前时间赋给日历
        calendar.setTime(dNow);
        //设置为前一天
        calendar.add(Calendar.HOUR_OF_DAY, -day);
        //得到前一天的时间
        dBefore = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String defaultStartDate = sdf.format(dBefore);
        return defaultStartDate;
    }


    public static synchronized String getCurrentDateString(String formatStr) {
        return formatDateTime(new Date(), formatStr);
    }

    public static synchronized String formatDateTime(Date targetDate,
                                                     String formatStr) {
        java.text.DateFormat dateFormater = new SimpleDateFormat(
                formatStr, Locale.SIMPLIFIED_CHINESE);
        return formatDateTime(targetDate, dateFormater);
    }

    /**
     * ȡ��}������֮��,����Сʱ��
     *
     * @param startday
     * @param endday
     * @return
     */
    public static int getIntervalHours(Date startday, Date endday) {
        if (startday.after(endday)) {
            Date cal = startday;
            startday = endday;
            endday = cal;
        }
        long sl = startday.getTime();
        long el = endday.getTime();
        long ei = el - sl;
        return (int) (ei / (1000 * 60 * 60));
    }

    /**
     * Converts a String date in a "jj/mm/aaaa" format in a java.sql.Date type
     * date
     *
     * @param strDate The String Date to convert, in a date in the "jj/mm/aaaa"
     *                format
     * @return The date in form of a java.sql.Date type date
     */
    public static synchronized java.sql.Date getDateSql(String strDate) {
        ParsePosition pos = new ParsePosition(0);
        Date date = _formatter.parse(strDate, pos);

        if (date != null) {
            return new java.sql.Date(date.getTime());
        }

        return null;
    }

    /**
     * Converts a String date in a "jj/mm/aaaa" format in a java.util.Date type
     * date
     *
     * @param strDate The String Date to convert, in a date in the "jj/mm/aaaa"
     *                format
     * @return The date in form of a java.sql.Date tyep date
     */
    public static synchronized Date getDate(String strDate) {
        ParsePosition pos = new ParsePosition(0);
        Date date = _formatter.parse(strDate, pos);

        return date;
    }

    public static synchronized Date getDate(String strDate, String pattern) throws ParseException {
        _formatter.applyPattern(pattern);
        Date date = _formatter.parse(strDate);
        return date;
    }

    /**
     * Converts a String date in a "jj/mm/aaaa" format in a java.sql.Timestamp
     * type date
     *
     * @param strDate The String Date to convert, in a date in the "jj/mm/aaaa"
     *                format
     * @return The date in form of a java.sql.Date tyep date
     */
    public static synchronized java.sql.Timestamp getTimestamp(String strDate) {
        ParsePosition pos = new ParsePosition(0);
        Date date = _formatter.parse(strDate, pos);

        if (date != null) {
            return (new java.sql.Timestamp(date.getTime()));
        }

        return null;
    }


    /**
     * Converts a String date in a "yyyy'/'MM'/'dd' 'HH':'mm'：'ss" format in a java.sql.Timestamp
     * type date
     *
     * @param strDate The String Date to convert, in a date in the "yyyy'/'MM'/'dd' 'HH':'mm'：'ss"
     *                format
     * @return The date in form of a java.sql.Date tyep date
     */
    public static synchronized java.sql.Timestamp getTimestamp2(String strDate) {
        ParsePosition pos = new ParsePosition(0);
        Date date = _formatterDateTime2.parse(strDate, pos);

        if (date != null) {
            return (new java.sql.Timestamp(date.getTime()));
        }

        return null;
    }

    /**
     * Converts a String date in a "yyyy'/'MM'/'dd" format in a java.sql.Timestamp
     * type date
     *
     * @param strDate The String Date to convert, in a date in the "yyyy'/'MM'/'dd"
     *                format
     * @return The date in form of a java.sql.Date tyep date
     */
    public static synchronized java.sql.Timestamp getTimestamp3(String strDate) {
        ParsePosition pos = new ParsePosition(0);
        Date date = _formatterDateTime3.parse(strDate, pos);

        if (date != null) {
            return (new java.sql.Timestamp(date.getTime()));
        }

        return null;
    }

    /**
     * Converts a java.sql.Date type date in a String date with a "jj/mm/aaaa"
     * format
     *
     * @param date java.sql.Date date to convert
     * @return strDate The date converted to String in a "jj/mm/aaaa" format or
     * an empty String if the date is null
     */
    public static synchronized String getDateString(java.sql.Date date) {
        if (date != null) {
            StringBuffer strDate = new StringBuffer();
            _formatter.format(date, strDate, new FieldPosition(0));

            return strDate.toString();
        }

        return "";
    }

    // /////////////////////////////////////////////////////////////////////////
    // methodes using the java.sql.Timestamp type

    /**
     * Converts une java.sql.Timestamp date in a String date in a "jj/mm/aaaa"
     * format
     *
     * @param date java.sql.Timestamp date to convert
     * @return strDate The String date in a "jj/mm/aaaa" format or the emmpty
     * String if the date is null
     */
    public static synchronized String getDateString(java.sql.Timestamp date) {
        if (date != null) {
            StringBuffer strDate = new StringBuffer();
            _formatter.format(date, strDate, new FieldPosition(0));

            return strDate.toString();
        }

        return "";
    }

    // /////////////////////////////////////////////////////////////////////////
    // methodes using the java.util.Date type

    /**
     * Converts a java.util.Date date in a String date in a "jj/mm/aaaa" format
     *
     * @param date java.util.Date date to convert
     * @return strDate A String date in a "jj/mm/aaaa" format or an empty String
     * if the date is null
     */
    public static synchronized String getDateString(Date date) {
        if (date != null) {
            StringBuffer strDate = new StringBuffer();
            _formatter.format(date, strDate, new FieldPosition(0));

            return strDate.toString();
        }

        return "";
    }

    // /////////////////////////////////////////////////////////////////////////
    // methods using a long value

    /**
     * Converts a long value to a String date in a "jj/mm/aaaa hh:mm" format
     *
     * @param lTime The long value to convert
     * @return The formatted string
     */
    public static synchronized String getDateTimeString(long lTime) {
        StringBuffer strDate = new StringBuffer();
        _formatterDateTime.format(new Date(lTime), strDate,
                new FieldPosition(0));

        return strDate.toString();
    }

    public static synchronized Date strToDate(String strDate) {
        try {
            SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd");
            if (strDate.length() > 10) {
                ft = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            }
            Date d = ft.parse(strDate);
            return new java.sql.Date(d.getTime());
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return new Date(Calendar.getInstance().getTime().getTime());
        }
    }

    public static synchronized Date strToDate(String strDate, String formatStr) {
        try {
            SimpleDateFormat ft = new SimpleDateFormat(formatStr);
            Date d = ft.parse(strDate);
            return new Date(d.getTime());
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return new Date(Calendar.getInstance().getTime().getTime());
        }
    }

    /**
     * 时间差
     *
     * @param startDate
     * @param endDate
     * @return
     */
    public static String getDateDifference(Date startDate, Date endDate) {
        if (startDate == null || endDate == null) {
            return "";
        }
        long between = (endDate.getTime() - startDate.getTime()) / 1000; // 除以1000是为了转换成秒
        if (between == 0)
            between = 1;
        long day1 = between / (24 * 3600);
        long hour1 = between % (24 * 3600) / 3600;
        long minute1 = between % 3600 / 60;
        long second1 = between % 60;
        StringBuffer dataString = new StringBuffer("");
        if (day1 > 0) {
            dataString.append(day1 + "天");
        }
        if (hour1 > 0) {
            dataString.append(hour1 + "小时");
        }
        if (minute1 > 0) {
            dataString.append(minute1 + "分");
        }
        if (second1 > 0) {
            dataString.append(second1 + "秒");
        }
        return dataString.toString();
    }

	/*public static void main(String[] arg) {
		Date date = new Date();
		Date date1 = new Date();
		date1 = DateUtil.strToDate("2016-12-01 00:00:00.0", "yyyy-MM-dd HH:mm:ss.S");
		System.out.println(DateUtil.formatDateTime(date1, "yyyy年MM月dd日 HH:mm"));
//		String d =DateUtil.formatDateTime(new Date(), "yyyyMMddHHmm");
//		System.out.println(Long.toHexString(Long.parseLong(d)));
//		System.out.println(Long.parseLong("2eeaa584f9",16));
//		Random r = new Random();
//		int l = r.nextInt(1000000);
//		System.out.println(l);

		//System.out.println(DateUtil.between(1)[0]+","+DateUtil.between(1)[1]);
		
	}*/
}
