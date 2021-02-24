package choice.common;

import java.io.File;
import java.io.FileWriter;
import java.util.Date;
import java.util.regex.Pattern;

/**
 * 日志
 * @author zhb
 */
public class LogUtil {
	public static final String POSXML = "posXml";
	public static final String IMSXML = "imsXml";
	public static final String DSTXML = "dstXml";
	
	public static final String PATH = LogUtil.class.getResource("").getPath().substring(1).replace("WEB-INF/classes/choice/common/", "log");
	
	/**
	 * 日志文件书写
	 * @param 
	 */
	public static String writeToTxt(String logDir, String logType, String content) {
		try {
			String fullLogDir = PATH + File.separator + DateFormat.getStringByDate(new Date(), "yyyy-MM-dd");
			
			File dir = new File(fullLogDir);
		    if (!dir.exists()) {
		    	dir.mkdirs();
		    }
			String filename = fullLogDir + File.separator + logType + ".log";
			File file = new File(filename);
		    if(!file.exists()){
		    	file.createNewFile();//不存在则创建
		    }
            FileWriter writer = new FileWriter(filename, true);
            writer.write(DateFormat.getStringByDate(new Date(), "yyyy-MM-dd HH:mm:ss")+" : "+content+System.getProperty("line.separator"));
            writer.close();
            return filename;
		} catch (Exception e) {
			e.printStackTrace();
		}   
		return null;
	}
	
	public static void main(String[] args) {
		writeToTxt("analysis","dddd","吹个大气球");
	}
}
