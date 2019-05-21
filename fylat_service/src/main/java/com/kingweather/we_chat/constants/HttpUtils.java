package com.kingweather.we_chat.constants;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HttpUtils {
    /**
     * 发送POST请求
     *
     * @param url  请求url
     * @param data 请求数据
     * @return 结果
     */
    @SuppressWarnings("deprecation")
    public static String doPost(String url, String data) {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);
        RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(20000).setConnectTimeout(20000)
                .setConnectionRequestTimeout(20000).build();
        httpPost.setConfig(requestConfig);
        String context = "";
        if (!data.isEmpty()) {
            StringEntity body = new StringEntity(data, "utf-8");
            httpPost.setEntity(body);
        }
        // 设置回调接口接收的消息头
        httpPost.addHeader("Content-Type", "application/json");
        CloseableHttpResponse response = null;
        try {
            response = httpClient.execute(httpPost);
            HttpEntity entity = response.getEntity();
            context = EntityUtils.toString(entity, HTTP.UTF_8);
        } catch (Exception e) {
            e.getStackTrace();
        } finally {
            try {
                response.close();
                httpPost.abort();
                httpClient.close();
            } catch (Exception e) {
                e.getStackTrace();
            }
        }
        return context;
    }


    /**
     *   向指定URL发送GET方法的请求，请求参数可有可无
     *
     *   @ url 发送请求的url
     *   @ param1/2 请求参数,可有可无，格式必须是name1=value1&name2=value2
     *   @ return 请求响应内容
     */
    public static String sendGet(String url, String param)  {

        String result = "";
        BufferedReader in = null;

        try{
//            String charset = java.nio.charset.StandardCharsets.UTF_8.name();
            String request = url + "?" + param;

            //打开和URL之间的连接
            URLConnection connection = new URL(request).openConnection();

            /* begin获取响应码 */
            HttpURLConnection httpUrlConnection = (HttpURLConnection)connection;
            httpUrlConnection.setConnectTimeout(300000);
            httpUrlConnection.setReadTimeout(300000);
            httpUrlConnection.connect();
            //获取响应码 =200
            int resCode = httpUrlConnection.getResponseCode();
            //获取响应消息 =OK
            String message = httpUrlConnection.getResponseMessage();

            System.out.println("getResponseCode resCode ="+ resCode);
            System.out.println("getResponseMessage message ="+ message);
            /* end获取响应码 */

            /* begin获取响应headers*/
            System.out.println("响应头：" + result);
            for (Map.Entry<String, List<String>> header : connection.getHeaderFields().entrySet()) {
                System.out.println(header.getKey() + "=" + header.getValue());
            }
            /* end获取响应headers*/

            /* begin获取响应内容 /
            if (resCode == httpUrlConnection.getResponseCode()) {
                int contentLength = httpUrlConnection.getContentLength();
                System.out.println("contentLength--->" + contentLength);
                if(contentLength > 0){
                    in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    String inputLine;
                    while ((inputLine = in.readLine()) != null)
                        result += "\n" + inputLine;
                    System.out.println("响应内容：" + result);
                }
            }
            /* end获取响应内容 */

            /*
            //设置通用的请求属性
            connection.setRequestProperty("Accept-Charset", charset);
            //建立实际的连接
            connection.connect();
            //获取响应头部
            Map<String,List<String>> map = connection.getHeaderFields();
            System.out.println("\n显示响应Header信息...\n");
            //遍历所有的响应头字段并输出
            //方式一、
            for (String key : map.keySet()) {
                System.out.println(key + " : " + map.get(key));
            }
            //方式二、
            for (Map.Entry<String, List<String>> header : connection.getHeaderFields().entrySet()) {
                System.out.println(header.getKey() + "=" + header.getValue());
            }
            */
            //打印response body
            //方式一、定义BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            while ((inputLine = in.readLine()) != null)
                result += "\n" + inputLine;
            System.out.println("result===" + result);
            /*
            //方式二、使用Scanner
            System.out.println("响应内容：");
            InputStream response = connection.getInputStream();

            try(Scanner scanner = new Scanner(response)) {
                String responseBody = scanner.useDelimiter("\\A").next();
                System.out.println(responseBody);
            }*/

        }catch (Exception e){
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        }// 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }

        return result;
    }


    /**
     * 解析出url参数中的键值对
     *
     * @param url url参数
     * @return 键值对
     */
    public static Map<String, String> getRequestParam(String url) {

        Map<String, String> map = new HashMap<String, String>();
        String[] arrSplit = null;

        // 每个键值为一组
        arrSplit = url.split("[&]");
        for (String strSplit : arrSplit) {
            String[] arrSplitEqual = null;
            arrSplitEqual = strSplit.split("[=]");

            // 解析出键值
            if (arrSplitEqual.length > 1) {
                // 正确解析
                map.put(arrSplitEqual[0], arrSplitEqual[1]);
            } else {
                if (arrSplitEqual[0] != "") {
                    map.put(arrSplitEqual[0], "");
                }
            }
        }
        return map;
    }

}
