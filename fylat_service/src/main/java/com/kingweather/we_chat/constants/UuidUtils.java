package com.kingweather.we_chat.constants;

import org.mozilla.universalchardet.UniversalDetector;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

public class UuidUtils {

    public static String getUUid() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }


    public static String guessEncoding(byte[] bytes) {
        UniversalDetector detector = new UniversalDetector(null);
        detector.handleData(bytes, 0, bytes.length);
        detector.dataEnd();
        String encoding = detector.getDetectedCharset();
        detector.reset();
        if (null != encoding) {
            try {
                return new String(bytes, encoding);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        } else {
            return new String(bytes);
        }

        return "";
    }
}
