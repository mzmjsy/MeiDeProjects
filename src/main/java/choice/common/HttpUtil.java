package choice.common;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;

/**
 * @author 马振
 */
public class HttpUtil {
    /**
     *
     * @param url 接口URL
     * @param body 传递的内容
     * @return 返回信息
     */
    public static JSONObject post(String url, String body){
        JSONObject result = null;
        CloseableHttpClient client = null;
        CloseableHttpResponse response = null;
        try {
            client = HttpClients.createDefault();
            HttpPost httpPost = new HttpPost(url);
            StringEntity stringEntity = new StringEntity(body, StandardCharsets.UTF_8);
            httpPost.setEntity(stringEntity);
            httpPost.setHeader("Content-Type", "application/json;charset=UTF-8");
            response = client.execute(httpPost);
            HttpEntity entity = response.getEntity();
            result = JSONObject.parseObject(EntityUtils.toString(entity));
        } catch (Exception e) {
            e.printStackTrace();
        } finally{
            if (response != null){
                try {
                    response.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(client != null){
                try {
                    client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return result;
    }

    /**
     * get调用方法
     * @param url   url地址
     * @param body  参数
     * @return      返回值
     */
    public static JSONObject get(String url, String body){
        JSONObject result = null;
        CloseableHttpClient client = null;
        CloseableHttpResponse response = null;
        try {
            client = HttpClients.createDefault();
            HttpGet httpGet = new HttpGet(url + "?" + body);
            httpGet.setHeader("Content-Type", "application/json;charset=UTF-8");
            response = client.execute(httpGet);
            HttpEntity entity = response.getEntity();
            result = JSONObject.parseObject(EntityUtils.toString(entity));
        } catch (Exception e) {
            e.printStackTrace();
        } finally{
            if (response != null){
                try {
                    response.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(client != null){
                try {
                    client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return result;
    }
}