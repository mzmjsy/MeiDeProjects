package choice.common;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;

/**
 * 
* @ClassName: ValueUtil 
* @Description: 获取值得工具类
* @author liuxiao
* @date 2014年6月30日 上午10:52:59 
*
 */
public class ValueUtil {
	/**
     * 
    * @Title: getStringValue 
    * @Description: 获取字符串
    * @param value
    * @return    设定文件 
    * @return String    返回类型
     */
    public static String getStringValue(Object value){
    	if(value == null){
    		return "";
    	}
    	return value.toString();
    }
    /**
     * 
    * @Title: getDoubleValue 
    * @Description: 获取Double类型的值
    * @param value
    * @return    设定文件 
    * @return Double    返回类型
     */
    public static Double getDoubleValue(Object value){
    	if(value != null && !"".equals(value)){
    		return Double.valueOf(value.toString());
    	}
    	return 0D;
    }
    
    public static BigDecimal getBigDecimalValue(Object value){
	if(value!=null && !value.equals("")){
	    return BigDecimal.valueOf(getDoubleValue(value));
	}
	return  BigDecimal.valueOf(0d);
    }
    /**
     * 
    * @Title: getDoubleValue 
    * @Description: 获取int类型的值
    * @param value
    * @return    设定文件 
    * @return Double    返回类型
     */
    public static int getIntValue(Object value){
    	if(value != null && !"".equals(value)){
    		return Integer.valueOf(value.toString());
    	}
    	return 0;
    }
    /**
     * 
     * @Title: getDoubleValue 
     * @Description: 获取int类型的值
     * @param value
     * @return    设定文件 
     * @return Double    返回类型
     */
    public static Float getFloatValue(Object value){
	if(value != null && !"".equals(value)){
	    return Float.parseFloat(value.toString());
	}
	return 0f;
    }
    /**
     * 
    * @Title: checkString 
    * @Description: 检查Object对象是否为“”或者null
    * @param value
    * @return    设定文件 
    * @return boolean    返回类型
     */
    public static boolean checkString(Object value){
    	if(value == null || "".equals(value)){
    		return false;
    	}
    	return true;
    }
    /** 
     * 对double数据进行取精度. 
     * <p> 
     * For example: <br> 
     * double value = 100.345678; <br> 
     * double ret = round(value,4,BigDecimal.ROUND_HALF_UP); <br> 
     * ret为100.3457 <br> 
     *  
     * @param value 
     *            double数据. 
     * @param scale 
     *            精度位数(保留的小数位数). 
     * @param roundingMode 
     *            精度取值方式. 
     * @return 精度计算后的数据. 
     */  
    public static double round(double value, int scale, int roundingMode) {  
        BigDecimal bd = new BigDecimal(value);  
        bd = bd.setScale(scale, roundingMode);  
        double d = bd.doubleValue();  
        bd = null;  
        return d;  
        
    }  
    /** 
     * 对double数据进行取精度. 
     * <p> 
     * For example: <br> 
     * double value = 100.345678; <br> 
     * double ret = round(value,4,BigDecimal.ROUND_HALF_UP); <br> 
     * ret为100.3457 <br> 
     *  
     * @param value 
     *            double数据. 
     * @param scale 
     *            精度位数(保留的小数位数). 
     * @param roundingMode 
     *            精度取值方式. 
     * @return 精度计算后的数据. 
     */  
    public static double roundString(Object _value, int scale, int roundingMode) {  
	Double value = getDoubleValue(_value);
        BigDecimal bd = new BigDecimal(value);  
        bd = bd.setScale(scale, roundingMode);  
        double d = bd.doubleValue();  
        bd = null;  
        return d;  
	
    }  
	public static String formatDoubleLength(double price,int scale){
		String model="#0.";
		int length=scale;
		for(int i=0;i<length;i++){
			model+="0";
		}
		DecimalFormat df = new DecimalFormat(model);
	
		return df.format(price);
		
	}
	
	public static Boolean IsNotEmpty(Object param){
		if(null !=  param && !"".equals( param) && !"null".equals(param) && !"-null".equals(param))
			return true;
		else
			return false;
	}
	/**
	 * 判断参数为空
	 * @param param
	 * @return
	 */
	public static Boolean IsEmpty(Object param){
		if(null ==  param || "".equals(param) || "null".equals(param)){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 描述:数字与字符类型的数字相加
	 * 作者:马振
	 * 时间:2016年11月18日下午2:16:19
	 * @param pl
	 * @param obj
	 * @return
	 */
	public static Double stringPlusDouble(Object pl,Object obj){
		Double t = 0.00;
		try{
			String model = "#0.00";//数字格式
			DecimalFormat df = new DecimalFormat(model);
			df.setRoundingMode(RoundingMode.HALF_UP);//设置五入 默认为HALF_EVEN 2，4，6，8的不进位
			if (IsNotEmpty(pl)) {
				t = Double.parseDouble(pl.toString());
			}
			if (IsNotEmpty(obj)) {
				//如果obj含有两个负号，如：抹零金额为负数  obj的值就为：（--0.01） 所以此处进行截取  负负得正
				if(obj.toString().indexOf("--")!=-1){
					obj = obj.toString().substring(2,obj.toString().length());
				}
				t = t + Double.parseDouble(obj.toString());
			}
			t = Double.parseDouble(df.format(t));
		} catch(Exception e) {
		}
		return t;
	}
	
	/**
	 * 描述:将“,”替换为“','”并且在字符串两端加“'”
	 * 作者:马振
	 * 时间:2016年12月16日下午1:26:17
	 * @param param
	 * @return
	 */
	public static String StringCodeReplace(String param){
		if (IsEmpty(param)) {
			return ""; 
		} else {
			//处理字符串前先将”','“替换成“,”;
			param = param.replace("'", "");
			return "'" + param.replace(",", "','") + "'";
		}
	}
}