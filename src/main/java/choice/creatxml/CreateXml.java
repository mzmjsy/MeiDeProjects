package choice.creatxml;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import choice.common.DateFormat;
import choice.common.MapToXml;
import choice.common.ValueUtil;

/**
 * 描述:创建XML字符串
 * 作者:马振
 * 时间:2016年9月6日下午3:57:01
 */
public class CreateXml {
	MapToXml mapToXml = new MapToXml();
	
	public String creatProductSaleXml(String pk_store, Map<String, List<Map<String, String>>> mapListMain, Map<String, List<Map<String, String>>> mapListSub) {
		String xmlStr = null;
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		List<Map<String, String>> listMapMain = mapListMain.get(pk_store);	//根据门店主键获取这个店当前日期的账单list
		try {
			DocumentBuilder builder = factory.newDocumentBuilder();
	        Document document = builder.newDocument();
//	        document.setXmlVersion("1.0");
	        
	        Element packElement = document.createElement("DataPacking");
	        packElement.setAttribute("xmlns", "http://tempuri.org/POSDataSchema.xsd");
	        
			Element posDataElement = document.createElement("POSData");
			posDataElement.setAttribute("StoreID", pk_store);
			posDataElement.setAttribute("CreateDateTime", DateFormat.getNowDateTime());
			posDataElement.setAttribute("POS", "choice");
			posDataElement.setAttribute("TotalChecks", listMapMain.size() + "");
			
			for (int i = 0; i < listMapMain.size(); i++) {
				Map<String, String> mapMain = listMapMain.get(i);
				Element checkElement = document.createElement("Check");
				checkElement.setAttribute("CheckID", mapMain.get("checkid"));
				checkElement.setAttribute("OrderID", mapMain.get("orderid"));
				checkElement.setAttribute("TransactionTypeID", mapMain.get("transactiontypeid"));
				checkElement.setAttribute("OperationDate", mapMain.get("operationdate"));
				checkElement.setAttribute("CheckOpenDateTime", mapMain.get("checkopendatetime"));
				checkElement.setAttribute("CheckCloseDateTime", mapMain.get("checkclosedatetime"));
				checkElement.setAttribute("TotalSales", ValueUtil.IsEmpty(mapMain.get("totalsales")) ? "0" : mapMain.get("totalsales"));
				checkElement.setAttribute("ProductSales", ValueUtil.IsEmpty(mapMain.get("salesnopsf")) ? "0" : mapMain.get("salesnopsf"));
				checkElement.setAttribute("ProductSoldQty", ValueUtil.IsEmpty(mapMain.get("productsoldqty")) ? "0" : mapMain.get("productsoldqty"));
				checkElement.setAttribute("Guests", mapMain.get("guests"));
				checkElement.setAttribute("orderfrom", mapMain.get("orderfrom"));
				checkElement.setAttribute("POSMachID", mapMain.get("vposid"));
			
				List<Map<String, String>> listMapSub = mapListSub.get(mapMain.get("checkid"));	//根据账单号获取每个账单的菜品明细
				for (int j = 0; j < (null == listMapSub ? 0 : listMapSub.size()); j++) {
					Map<String, String> mapSub = listMapSub.get(j);
					Element productElement = document.createElement("Product");
					productElement.setAttribute("Sequence", mapSub.get("sequence"));
					productElement.setAttribute("ProductID", mapSub.get("productid").trim());
					productElement.setAttribute("ProductName", mapSub.get("productname"));
					productElement.setAttribute("Price", ValueUtil.IsEmpty(mapSub.get("price")) ? "0" : mapSub.get("price"));
					productElement.setAttribute("Qty", ValueUtil.IsEmpty(mapSub.get("qty")) ? "0" : mapSub.get("qty"));
					productElement.setAttribute("Sales", ValueUtil.IsEmpty(mapSub.get("sales")) ? "0" : mapSub.get("sales"));
					productElement.setAttribute("IsComboMeal", mapSub.get("iscombomeal"));
					productElement.setAttribute("IsComboChild", mapSub.get("iscombochild"));
					productElement.setAttribute("ComboFatherID", mapSub.get("combofatherid"));
					productElement.setAttribute("ComboFatherSeq", mapSub.get("combofatherseq"));
					productElement.setAttribute("SalesType", mapSub.get("salestype"));
					
					checkElement.appendChild(productElement);
				}
	
				posDataElement.appendChild(checkElement);
			}
			packElement.appendChild(posDataElement);
			document.appendChild(packElement);
			
			TransformerFactory transFactory = TransformerFactory.newInstance();
	        Transformer transFormer = transFactory.newTransformer();
	        DOMSource domSource = new DOMSource(document);
	
	        //export string
	        ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        transFormer.setOutputProperty(OutputKeys.ENCODING, "UTF-8"); 
	        transFormer.transform(domSource, new StreamResult(bos));
	        xmlStr = bos.toString();
		} catch (Exception e) {
	        e.printStackTrace();
        }
		return xmlStr;
	}

	/**
	 * 描述:生成支付方式明细XML
	 * 作者:马振
	 * 时间:2016年9月6日下午4:01:06
	 * @param pk_store
	 * @param mapListMain
	 * @param
	 * @return
	 */
	public Map<String, String> creatPayXml(String pk_store, Map<String, List<Map<String, String>>> mapListMain, Map<String, List<Map<String, String>>> mapListPay) {
		String xmlStr = null;
		Double money = 0.00;
		Double nxianjin = 0.00;
		Map<String, String> map = new HashMap<String, String>();
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		List<Map<String, String>> listMapMain = mapListMain.get(pk_store);	//根据门店主键获取这个店当前日期的账单list
		try {
			DocumentBuilder builder = factory.newDocumentBuilder();
	        Document document = builder.newDocument();
//	        document.setXmlVersion("1.0");
	        
	        Element packElement = document.createElement("PayMentPacking");
	        packElement.setAttribute("xmlns", "http://tempuri.org/PaymentSchema.xsd");
	        
			Element posDataElement = document.createElement("product");
			posDataElement.setAttribute("StoreID", pk_store);
			posDataElement.setAttribute("CreateDate", DateFormat.getNowDateTime());
			
			for (int i = 0; i < listMapMain.size(); i++) {
				Map<String, String> mapMain = listMapMain.get(i);
				
				if (!"".equals(mapMain.get("checkid")) && null != mapMain.get("checkid")) {
					Element checkElement = document.createElement("check");
					checkElement.setAttribute("id", mapMain.get("checkid"));
					checkElement.setAttribute("operationDate", mapMain.get("operationdate"));
					checkElement.setAttribute("TransactionType", mapMain.get("transactiontypeid"));
					checkElement.setAttribute("productsales", ValueUtil.IsEmpty(mapMain.get("salesnopsf")) ? "0" : mapMain.get("salesnopsf"));
					checkElement.setAttribute("productqty", ValueUtil.IsEmpty(mapMain.get("productsoldqty")) ? "0" : mapMain.get("productsoldqty"));
					checkElement.setAttribute("NonProductSales", ValueUtil.IsEmpty(mapMain.get("psf")) ? "0" : mapMain.get("psf"));
					checkElement.setAttribute("nonproductqty", ValueUtil.IsEmpty(mapMain.get("qtynopsf")) ? "0" : mapMain.get("qtynopsf"));
					
					List<Map<String, String>> listMapPay = mapListPay.get(mapMain.get("checkid"));	//根据账单号获取每个账单的支付明细
					for (int j = 0; j < (null == listMapPay ? 0 : listMapPay.size()); j++) {
						Map<String, String> mapPay = listMapPay.get(j);
						Element productElement = document.createElement("payitem");
						productElement.setAttribute("pay_seq", mapPay.get("pay_seq"));
						productElement.setAttribute("Pay_seq_Name", mapPay.get("pay_seq_name"));
						productElement.setAttribute("pay_type", mapPay.get("pay_type"));
						productElement.setAttribute("amount", mapPay.get("amount"));
						productElement.setAttribute("qty", mapPay.get("qty"));
						productElement.setAttribute("pay_account_id", mapPay.get("pay_account_id"));
						
						checkElement.appendChild(productElement);
						
						//统计现金数据
						if ("101".equals(mapPay.get("pay_seq"))) {
							nxianjin = ValueUtil.stringPlusDouble(nxianjin, null == mapPay.get("amount") ? "0" : mapPay.get("amount"));
						}
						
						//统计总金额
						if (!"6".equals(mapPay.get("pay_seq")) && !"23".equals(mapPay.get("pay_seq"))) {
							if ("D".equals(mapPay.get("pay_type"))) {
								money = ValueUtil.stringPlusDouble(money, null == mapPay.get("amount") ? "0" : ("-" + mapPay.get("amount")));
							} else {
								money = ValueUtil.stringPlusDouble(money, null == mapPay.get("amount") ? "0" : mapPay.get("amount"));
							}
						}
					}
					
					posDataElement.appendChild(checkElement);
				}
			}
			packElement.appendChild(posDataElement);
			document.appendChild(packElement);
			
			TransformerFactory transFactory = TransformerFactory.newInstance();
	        Transformer transFormer = transFactory.newTransformer();
	        DOMSource domSource = new DOMSource(document);
	
	        //export string
	        ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        transFormer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
	        transFormer.transform(domSource, new StreamResult(bos));
	        xmlStr = bos.toString();
		} catch (Exception e) {
	        e.printStackTrace();
        }
	
		map.put("xml", xmlStr);
		map.put("xianjin", nxianjin + "");
		map.put("money", money + "");
		return map;
	}
}