package com.kingweather.common.util;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * md5工具
 */
public class Md5Utils
{
    public static byte[] encode2bytes(String source)
    {
        byte[] result = null;
        try
        {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.reset();
            try
            {
                md.update(source.getBytes("UTF-8"));
            }
            catch (UnsupportedEncodingException e)
            {
                e.printStackTrace();
            }
            result = md.digest();
        }
        catch (NoSuchAlgorithmException e)
        {
            e.printStackTrace();
        }
        return result;
    }

    public static String encode2hex(String source)
    {
        byte[] data = encode2bytes(source);
        StringBuffer hexString = new StringBuffer();
        for (int i = 0; i < data.length; i++)
        {
            String hex = Integer.toHexString(0xff & data[i]);
            if (hex.length() == 1)
            {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return new String(hexString);
    }

    //    /**
    //     * 验证字符串是否匹配
    //     *
    //     * @param unknown 待验证的字符串
    //     * @param okHex   使用MD5加密过的16进制字符串
    //     * @return 匹配返回true，不匹配返回false
    //     */
    public static boolean validate(String unknown, String okHex)
    {
        return okHex.equals(encode2hex(unknown));
    }


    /*public static void main(String[] args)
    {
       String s =  Md5Utils.encode2hex("11111111");
        System.out.println(s);
    }*/
}
