package choice.common;

import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 日志
 * @author zhb
 */
public class OperateLog {
	
	private static SimpleDateFormat YYYY_MM_DD = new SimpleDateFormat("yyyy-MM-dd");
	
	private static SimpleDateFormat YYYY_MM_DD_HH_mm_ss = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	/**
	 * 日志文件书写
	 * @param writeStr
	 */
	public static void writeToTxt(String content) {
		try {
			File dir = new File(LogUtil.PATH + File.separator + YYYY_MM_DD.format(new Date()) + File.separator);
		    if(!dir.exists()){
		    	dir.mkdirs();
		    }
			String filename = LogUtil.PATH + File.separator + YYYY_MM_DD.format(new Date()) + File.separator + "operationLog_" + YYYY_MM_DD.format(new Date()) + ".log";
			File file = new File(filename);
		    if(!file.exists()){
		    	file.createNewFile();//不存在则创建
		    }
		    
            FileWriter writer = new FileWriter(filename, true);
            
            writer.write(YYYY_MM_DD_HH_mm_ss.format(new Date()) + ":" + content + "\n");
            writer.close();

		} catch (Exception e) {
			e.printStackTrace();
		}   
	}
}