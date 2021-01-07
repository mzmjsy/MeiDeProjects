package choice.common;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DateFormat {

	public static SimpleDateFormat YYYY_MM_DD = new SimpleDateFormat("yyyy-MM-dd");
	public static SimpleDateFormat YYYY_MM_DD_HH_mm_ss = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	public static SimpleDateFormat HH_mm_ss = new SimpleDateFormat("HH:mm:ss");
	
	/**
	 * 根据日期和转换格式得到字符串
	 * @param date 日期
	 * @param formatType 转换格式 例如  yyyy-MM-dd
	 * @return
	 */
	public static String getStringByDate(Date date,String formatType){
		return new SimpleDateFormat(formatType).format(null==date?new Date():date);
	}
	
	/**
	 * 根据日期字符串和转换格式得到日期
	 * @param date 日期字符串 例如 20120506
	 * @param formatType 转换格式 例如 yyyyMMdd
	 * @return
	 */
	public static Date getDateByString(String date,String formatType){
		try{
			SimpleDateFormat sdf = new SimpleDateFormat(formatType);
			return sdf.parse(date);
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 根据传入的日期获取指定类型的日期对象
	 * @param date 传入的日期
	 * @param formatType 转换格式
	 * @return
	 */
	public static Date formatDate(Date date,String formatType){
		try{
			SimpleDateFormat sdf = new SimpleDateFormat(formatType);
			String dateString = sdf.format(null == date ? new Date() : date);
			return sdf.parse(dateString);
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 根据传入的日期和类型 得到指定时间  (例如 getDateBefore（new Date(),"day",-1,5） 为得到当前日期之前5天的日期)
	 * @param date 指定日期
	 * @param type 日期类型  year month day
	 * @param beforeOrAfter  之前还是之后  -1为之前 1为之后 
	 * @param number  指定的数字   前5个月  即为5
	 * @return 结果日期
	 */
	public static Date getDateBefore(Date date,String type,int beforeOrAfter,int number){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		if(beforeOrAfter==1){
			if(type.equals("day")){
				calendar.add(Calendar.DATE, number);
			}else if(type.equals("month")){
				calendar.add(Calendar.MONTH, number);
			}else if(type.equals("year")){
				calendar.add(Calendar.YEAR, number);
			}
		}else{
			if(type.equals("day")){
				calendar.add(Calendar.DATE, -number);
			}else if(type.equals("month")){
				calendar.add(Calendar.MONTH, -number);
			}else if(type.equals("year")){
				calendar.add(Calendar.YEAR, -number);
			}
		}
		
		return calendar.getTime();
	}
	
	/**
	 * 得到当月第一天的日期
	 * @return
	 */
	public static Date getFirstDayOfCurrMonth(){
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DATE, 1);
		return calendar.getTime();
	}
	/**
	 * 得到当月最后一天的日期
	 * @return
	 */
	public static Date getEndDayOfCurrMonth(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date); 
		calendar.add(Calendar.MONTH, 1);    //加一个月
        calendar.set(Calendar.DATE, 1);        //设置为该月第一天
        calendar.add(Calendar.DATE, -1);    //再减一天即为上个月最后一天
		return calendar.getTime();
	}
	/**
	 * 得到当年第一天的日期
	 * @return
	 */
	public static Date getFirstDayOfCurrYear(){
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_YEAR, 1);
		return calendar.getTime();
	}
	
	/**
	 * 得到指定年份第一天的日期
	 * @return
	 */
	public static Date getFirstDayOfCurrYear(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_YEAR, 1);
		return calendar.getTime();
	}
	
	/**
	 * 根据传入的日期得到天
	 * @param args
	 */
	public static int getDay(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.DATE);
	}
	
	/**
	 * 根据传入的日期得到月
	 * @param args
	 */
	public static int getMonth(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.MONTH)+1;
	}
	
	/**
	 * 根据传入的日期得到年
	 * @param args
	 */
	public static int getYear(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.YEAR);
	}
	
	/**将Date型日期，转换成指定格式的字符串日期
	 * @param date
	 * @param formatType
	 * @return
	 */
	public static String dateToString(Date date, String formatType) {
		SimpleDateFormat sdf = new SimpleDateFormat(formatType);
		return sdf.format(null == date ? new Date() : date);
	}
	
	/**
	 * 描述：将字符串日期转成Date型
	 * @author 马振
	 * 创建时间：2015-10-16 上午9:11:14
	 * @param dateString
	 * @return
	 */
	public static Date stringToDate(String dateString) {
		Date date = null;
		try {  
		    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
		    date = sdf.parse(dateString);  
		} catch (ParseException e) {  
		    System.out.println(e.getMessage());  
		}  
		
		return date;
	}
	
	/**
	 * 描述：获取上个月第一天和最后一天
	 * @author 马振
	 * 创建时间：2015-11-21 下午4:51:48
	 * @param date
	 * @return
	 */
	public static Map<String, String> getFirstday_Lastday_Month(Date date) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, -1);
        Date theDate = calendar.getTime();
        
        //上个月第一天
        GregorianCalendar gcLast = (GregorianCalendar) Calendar.getInstance();
        gcLast.setTime(theDate);
        gcLast.set(Calendar.DAY_OF_MONTH, 1);
        String day_first = df.format(gcLast.getTime());
        StringBuffer str = new StringBuffer().append(day_first);
        day_first = str.toString();

        //上个月最后一天
        calendar.add(Calendar.MONTH, 1);    //加一个月
        calendar.set(Calendar.DATE, 1);     //设置为该月第一天
        calendar.add(Calendar.DATE, -1);    //再减一天即为上个月最后一天
        String day_last = df.format(calendar.getTime());
        StringBuffer endStr = new StringBuffer().append(day_last);
        day_last = endStr.toString();

        Map<String, String> map = new HashMap<String, String>();
        map.put("first", day_first);
        map.put("last", day_last);
        return map;
    }
	
	/**
	 * 描述:获取当前系统时间
	 * 作者:马振
	 * 时间:2016年9月5日下午4:36:31
	 * @return
	 */
	public static String getNowTime(){
		return HH_mm_ss.format(new Date());
	}
	
	/**
	 * 描述:获取当前系统日期时间
	 * 作者:马振
	 * 时间:2016年9月5日下午6:07:28
	 * @return
	 */
	public static String getNowDateTime(){
		return YYYY_MM_DD_HH_mm_ss.format(new Date());
	}
	
	/**
	 * 描述:获取当前系统日期
	 * 作者:马振
	 * 时间:2016年9月6日上午9:41:11
	 * @return
	 */
	public static String getNowDate(){
		return YYYY_MM_DD.format(new Date());
	}
	
	/**
	 * 描述:获取当前日期len天前后的日期
	 * 作者:马振
	 * 时间:2016年9月6日上午10:11:45
	 * @param len	为正，len天前；为负，len天后
	 * @param time1
	 * @return
	 */
	public static String getLastTime(long len, String time1) {
		String returnT = "";
		long time2;
		SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date date1 = ft.parse(time1);
			len = len * 1000 * 60 * 60 * 24;
			time2 = date1.getTime() - len;
			returnT = ft.format(time2);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return returnT;
	}
	
	/**
	 * 描述:获取两个日期间的所有日期
	 * 作者:马振
	 * 时间:2016年10月11日下午5:03:31
	 * @param start	开始日期
	 * @param end	结束日期
	 * @return
	 */
	public static List<String> getDateList(String start, String end){
        List<String> ret = new ArrayList<String>();   
        SimpleDateFormat YYYY_MM_DD = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();   
        try {
			calendar.setTime(YYYY_MM_DD.parse(start));
			Date tmpDate = calendar.getTime();   
			long endTime = YYYY_MM_DD.parse(end).getTime();   
			while(tmpDate.before(YYYY_MM_DD.parse(end))||tmpDate.getTime() <= endTime){
				ret.add(YYYY_MM_DD.format(calendar.getTime()));   
				calendar.add(Calendar.DATE, 1);   
				tmpDate = calendar.getTime();   
			}          
		} catch (ParseException e) {
			e.printStackTrace();
		}   
        return ret;         
    }
	
	
	/**
	 * 描述：获取当前日期num月之前（后）的数据
	 * @author 马振
	 * 时间：2019年8月27日下午6:55:55
	 * @param dworkdate	当前日期
	 * @param num		负数为num个月之前，正数为num个月之后
	 * @return
	 * @throws ParseException
	 */
	public static String getMonthBefore(String dworkdate, int num) {
        // 获取当前时间
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String str = "";
		try {
			Date date = dateFormat.parse(dworkdate);
	        //得到日历
	        Calendar calendar = Calendar.getInstance(); 
	        //把当前时间赋给日历
	        calendar.setTime(date);
	        //设置为前2月，可根据需求进行修改
	        calendar.add(Calendar.MONTH, num); 
	        date = calendar.getTime();
	        str = dateFormat.format(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
        return str;
	}
	
	//测试
	public static void main(String[] args) {
		String nowTime="2019-05-31";
		String timeBefore=getMonthBefore(nowTime,-3);
		System.out.println("您当前传入时间："+nowTime+"的两个月之前的时间为："+timeBefore);
	}
}