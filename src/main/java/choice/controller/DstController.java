package choice.controller;

import choice.common.JdbcConnection;
import choice.constants.SqlStatement;
import choice.domain.DstDelivery;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * @author mz
 */
@Controller
@RequestMapping("dstDelivery")
public class DstController {
    private PreparedStatement pst;
    private ResultSet rss;
	
	/**
	 * 描述:
	 * 作者:
	 * 时间:
	 */
	@RequestMapping(value = "/listContent",method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public List<JSONObject> listDstDelivery() throws Exception{
    	Connection conn = JdbcConnection.getImsConnection();
    	List<JSONObject> listDstDelivery = new ArrayList<JSONObject>();

		String sql = SqlStatement.SEL_CRM_DST_DELIVERY;
		try {
    		pst = conn.prepareStatement(sql);
    		rss = pst.executeQuery();
    		while (rss.next()) {
    			DstDelivery dstDelivery = new DstDelivery();
				dstDelivery.setDstDeliveryId(rss.getString("DST_DELIVERY_ID"));
				dstDelivery.setTransId(rss.getString("TRANS_ID"));
				dstDelivery.setVehicleBrand(rss.getString("VEHICLE_BRAND"));
				dstDelivery.setPlanDeliveryDate(rss.getString("PLAN_DELIVERY_DATE"));
				dstDelivery.setCustomerName(rss.getString("CUSTOMER_NAME"));
				dstDelivery.setInceptAddress(rss.getString("INCEPT_ADDRESS"));
				dstDelivery.setAttr5(rss.getString("ATTR5"));
				dstDelivery.setDeliveryCode(rss.getString("DELIVERY_CODE"));
				dstDelivery.setNetWeight(rss.getString("NET_WEIGHT"));
				dstDelivery.setFlag(rss.getString("FLAG"));
				dstDelivery.setUnitPrice(rss.getString("UNIT_PRICE"));
				dstDelivery.setResult(rss.getString("VRESULT"));
				dstDelivery.setIsInternationalTrade(rss.getString("IS_INTERNATIONAL_TRADE"));
				dstDelivery.setPmvNum(rss.getString("PMV_NUM"));
				dstDelivery.setCreatingDate(rss.getString("CREATING_DATE"));

				listDstDelivery.add(JSONObject.fromObject(dstDelivery));
    		}
    	} catch (Exception e) {
    		e.printStackTrace();
    	} finally{
    		JdbcConnection.close(conn, pst, rss);
		}

		return listDstDelivery;
	}
}