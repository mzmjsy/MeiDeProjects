package choice.service;

import choice.common.*;
import choice.constants.SqlStatement;
import choice.domain.DispatchInfo;
import choice.domain.Order;
import choice.domain.OrderDetail;
import com.alibaba.fastjson.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * @author mz
 */
public class DeShunTong {

    public DeShunTong () {
//        this.transImsToDeShunTong();
    }

    public void transImsToDeShunTong () {
        List<JSONObject> listJsonObject = this.getPushDelivery();
        for (JSONObject object : listJsonObject) {
            String content = object.toJSONString();
            String body = null;
            try {
                body = Encryption.publicEncrypt(content, ConfigData.PUBLICK_KEY);
            } catch (Exception e) {
                e.printStackTrace();
            }
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("body", body);
            JSONObject res = HttpUtil.post(ConfigData.HTTP_URL, jsonObject.toString());

            //回写接口返回状态
            this.updateResult(res.getString("data").replace("{", "").replace("}", ""), res.toJSONString(), object.getString("insideTransNo"));

            //回写发货单
            if ("200".equals(res.getString("code"))) {
                this.updateDeliveryHeader(object.getString("deliveryCode"));
            }
        }
    }

    /**
     * 组合需要传递的单据数据
     * @return listJsonObject
     */
    private List<JSONObject> getPushDelivery() {
        List<JSONObject> listJsonObject = new ArrayList<JSONObject>();
        Connection conn = null;
        PreparedStatement pst = null;
        ResultSet rss = null;
        try {
            conn = JdbcConnection.getImsConnection();
            String sql = SqlStatement.SEL_CRM_DST_PUSH_INFO;
            pst = conn.prepareStatement(sql);
            rss = pst.executeQuery();

            while (rss.next()) {
                String truckNo = rss.getString("VEHICLE_BRAND");
                String planDeliveryDate = rss.getString("PLAN_DELIVERY_DATE");
                String address = rss.getString("ENDADDRESSDETAIL");
                DispatchInfo dispatchInfo = new DispatchInfo();
                dispatchInfo.setTruckNo(truckNo);
                dispatchInfo.setTruckPlateColor(ConfigData.TRUCKPLATECOLOR);

                //货物信息
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setMaterialName(rss.getString("ATTR5"));
                orderDetail.setCategoryId(ConfigData.CATEGORYID);
                orderDetail.setFreightPrice(rss.getString("FREIGHTPRICE"));
                orderDetail.setFreightFee(rss.getString("FREIGHTTOTALFEE"));
                orderDetail.setDamage(ConfigData.DAMAGE);
                orderDetail.setDamageType(ConfigData.DAMAGETYPE);
                orderDetail.setAmount(rss.getString("NET_WEIGHT"));
                orderDetail.setUnit(ConfigData.UNIT);
                orderDetail.setUnitPrice(rss.getString("UNIT_PRICE"));

                //单据信息
                Order order = new Order();
                order.setOrderDetail(orderDetail);
                order.setShipment(rss.getString("SHIPMENT"));
                order.setCustomerName(rss.getString("CUSTOMERNAME"));
                order.setCargoType(ConfigData.CARGOTYPE);
                order.setStartProvinceName(rss.getString("STARTPROVINCENAME"));
                order.setStartProvinceCode(rss.getString("STARTPROVINCECODE"));
                order.setStartCityName(rss.getString("STARTCITYNAME"));
                order.setStartCityCode(rss.getString("STARTCITYCODE"));
                order.setStartCountyName(rss.getString("STARTCOUNTYNAME"));
                order.setStartCountyCode(rss.getString("STARTCOUNTYCODE"));
                order.setStartAddressDetail(rss.getString("STARTADDRESSDETAIL"));
                order.setEndProvinceName(rss.getString("ENDPROVINCENAME"));
                order.setEndProvinceCode(rss.getString("ENDPROVINCECODE"));
                order.setEndCityName(rss.getString("ENDCITYNAME"));
                order.setEndCityCode(rss.getString("ENDCITYCODE"));
                order.setEndCountyName(rss.getString("ENDCOUNTYNAME"));
                order.setEndCountyCode(rss.getString("ENDCOUNTYCODE"));
                order.setEndAddressDetail(address);
                order.setFreightFee(rss.getString("FREIGHTTOTALFEE"));
                order.setFreightTotalFee(rss.getString("FREIGHTTOTALFEE"));
                order.setReceiptName(rss.getString("RECEIPTNAME"));
                order.setReceiptMobile(rss.getString("RECEIPTMOBILE"));
                order.setTransportRule(rss.getString("TRANSPORTRULE"));
                order.setTransportMode(rss.getString("TRANSPORTMODE"));
                order.setLoadingFee(rss.getString("LOADINGFEE"));
                order.setUnloadFee(rss.getString("UNLOADFEE"));

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("order", order);
                jsonObject.put("dispatchInfo", dispatchInfo);
                jsonObject.put("freightFee", rss.getString("FREIGHTTOTALFEE"));
                jsonObject.put("unitPrice", rss.getString("UNIT_PRICE"));
                jsonObject.put("freightPrice", rss.getString("FREIGHTPRICE"));
                jsonObject.put("insideTransNo", rss.getString("DST_DELIVERY_ID"));
                jsonObject.put("userAccount", rss.getString("USERACCOUNT"));
                jsonObject.put("deliveryCode", rss.getString("DELIVERY_CODE"));

                listJsonObject.add(jsonObject);
                LogUtil.writeToTxt(LogUtil.DSTXML, "dst", "传输数据：车牌号【" + truckNo + "】，计划发货日期：【" + planDeliveryDate + "】，收货地址：" + address);
            }
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.writeToTxt(LogUtil.DSTXML, "dst", "传输数据错误信息：" + e.getMessage());
        } finally {
            JdbcConnection.close(conn, pst, rss);
        }

        return listJsonObject;
    }

    /**
     * 修改标识
     * @param result    返回的信息
     * @param dstDeliveryId 处理的运单ID
     */
    private void updateResult(String transId, String result, String dstDeliveryId) {
        Connection conn = null;
        PreparedStatement pst = null;
        try {
            conn = JdbcConnection.getImsConnection();
            String sql = SqlStatement.UPD_CRM_DST_DELIVERY;
            pst = conn.prepareStatement(sql);
            pst.setString(1, transId);
            pst.setString(2, result);
            pst.setString(3, dstDeliveryId);

            pst.addBatch();
            pst.executeBatch();
            conn.commit();
            pst.clearBatch();
            LogUtil.writeToTxt(LogUtil.DSTXML, "dst", "修改CRM_DST_DELIVERY表ID：【" + dstDeliveryId
                    + "】，调用接口返回数据：" + result);
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.writeToTxt(LogUtil.DSTXML, "dst", "修改CRM_DST_DELIVERY表ID：【" + dstDeliveryId
                    + "】，错误信息：" + e.getMessage());
        } finally {
            JdbcConnection.close(conn, pst, null);
        }
    }

    /**
     * 修改发货单表是否推送平台
     * @param deliveryCode 处理的发货单号
     */
    private void updateDeliveryHeader(String deliveryCode) {
        Connection conn = null;
        PreparedStatement pst = null;
        try {
            conn = JdbcConnection.getImsConnection();
            String sql = SqlStatement.UPD_CRM_DELIVERY_HEADER;
            pst = conn.prepareStatement(sql);
            pst.setString(1, deliveryCode);

            pst.addBatch();
            pst.executeBatch();
            conn.commit();
            pst.clearBatch();
            LogUtil.writeToTxt(LogUtil.DSTXML, "dst", "修改CRM_LG_DELIVERY_HEADER表，发货单号：" + deliveryCode);
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.writeToTxt(LogUtil.DSTXML, "dst", "修改CRM_LG_DELIVERY_HEADER表，发货单号：【"
                    + deliveryCode + "】，错误信息：" + e.getMessage());
        } finally {
            JdbcConnection.close(conn, pst, null);
        }
    }
}