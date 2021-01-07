package choice.common;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CodeHelper {
	
	/**
	 * 部门编号的每一分段长度，如为4则code将类似1234-5678
	 */
	public static int CODE_LENGTH = 4;
	
	public static String createUUID(){
		return String.valueOf(UUID.randomUUID()).replaceAll("-", "");
	}
	/**
	 * in 中字段过滤
	 * @param ins
	 * @return
	 */
	public static String replaceCode(String ins){
		if(null==ins || "".equals(ins)){
			return ins;
		}
		return  "'"+ins.replace(",","','")+"'";
	}
	
	/**
	 * in 中字段过滤
	 * @param ins
	 * @return
	 */
	public static List<String> replaceCode(List<String> ins){
		if(null==ins || "".equals(ins)){
			return ins;
		}
		List<String> inss = new ArrayList<String>();
		for(int i=0; i<ins.size();i++) {
			inss.add(i, "'"+ins.get(i)+"'");
		}
		
		return  inss;
//		ins.replace(",","','");
	}
	/**
	 * 清理dayNum天数之外的XML文件(不包含文件夹),path为路径，例：D:\choice\workspace\ChoiceMTI_Webservice\qjc;dayNum为天数
	 * @return
	 */
	public static String clearXMLFile(String path,int dayNum){
		//获取上月同日字符串
		int dateTime = Integer.parseInt(computeYearMonthDay("",-dayNum));
		//默认路径
		if(null==path||"".equals(path))
		    path=System.getProperty("user.dir")+"/qjc";
        File dir = new File(path);
	    if(!dir.exists())
	    	return "目录"+path+"不存在,无需清理";
	    String[] children = dir.list();
	    if(0==children.length)
	    	return "目录"+path+"为空,无需清理";   
	    //计数
	    int number=0;
	    //递归删除目录中的子目录
        for (int i=0; i<children.length; i++) {
        	//获取XML文件的日期字符串
    		Pattern pattern = Pattern.compile("[0-9]{8,}");
    		Matcher matcher = pattern.matcher(children[i]);
    		StringBuffer buffer = new StringBuffer();   		
    		while(matcher.find())              
    		    buffer.append(matcher.group());
    		//删除一个月之外的数据，和名字里没有日期的任何文件(不包括文件夹)
    		if(0!=buffer.length()&&Integer.parseInt(buffer.toString().substring(0, 8))>dateTime){
    		    continue;   		    	
    		}else{
    			boolean success = new File(path, children[i]).delete();
    			if(success)
    				number++;
    			System.out.println(success?children[i]+"删除成功":children[i]+"删除失败");
    		}
        }
	    return path+"目录清理完成,共删除"+number+"个文件";
		//return "1";
	}
	/**
	 * 清理dayNum天数之外的日志文件,path为日志路径地址,例如：D:\choice\workspace\ChoiceMTI_Webservice\operationLog;dayNum为天数
	 * @return
	 */
	public static String clearLogFile(String path,int dayNum){
		//获取上月同日字符串
		int dateTime = Integer.parseInt(computeYearMonthDay("",-dayNum));
        File dir = new File(path);
	    if(!dir.exists())
	    	return "目录"+path+"不存在,无需清理";
	    String[] children = dir.list();
	    if(0==children.length)
	    	return "目录"+path+"为空,无需清理";
	    int number = 0;//计数
       //递归删除目录中的子目录
        for (int i=0; i<children.length; i++) {
    		Pattern pattern = Pattern.compile("[0-9]+");
    		Matcher matcher = pattern.matcher(children[i]);
    		StringBuffer buffer = new StringBuffer();   		
    		while(matcher.find())              
    		    buffer.append(matcher.group());
    		if(8==buffer.length()&&Integer.parseInt(buffer.toString())>dateTime){
    		    continue;   		    	
    		}else{
    			boolean success = deleteDir(new File(path+"\\"+children[i]));
    			if(success)
    				number++;
    			System.out.println(success?children[i]+"删除成功":children[i]+"删除失败");
    		}
        }
	    return path+"目录清理完成,共删除"+number+"个文件";
	}
	/**
	 * 获取与日期yyyymmdd相距flag的日期;yyyymmdd设为空，该值则取当天的日期,例如"20151126"
	 * @param param
	 * @return
	 */
	public static String computeYearMonthDay(String yyyymmdd,int flag){
		
	    SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
	    Date toady = new Date();
	    if(null!=yyyymmdd&&!"".equals(yyyymmdd)&&yyyymmdd.length()==8)
			try {
				toady = format.parse(yyyymmdd);
			} catch (ParseException e) {
				e.printStackTrace();
			}
	    Calendar cal = Calendar.getInstance();
	    cal.setTime(toady);
	    cal.add(Calendar.DAY_OF_MONTH, flag);	
	    Date date = cal.getTime();
		return format.format(date);		
	}
	/**
	 * 删除文件夹,以及子文件
	 * @param dir
	 * @return
	 */
    private static boolean deleteDir(File dir) {
        if (dir.isDirectory()) {
            String[] children = dir.list();
         //递归删除目录中的子目录下
            for (int i=0; i<children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }
        // 目录此时为空，可以删除
        return dir.delete();
    }
    /**
     * 测试
     * @param args
     */
	public static void main(String[] args) {
		System.out.println(CodeHelper.clearXMLFile("",-5));
}
	
}
