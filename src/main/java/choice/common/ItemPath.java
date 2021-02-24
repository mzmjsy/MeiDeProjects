package choice.common;

import com.alibaba.fastjson.JSONPath;
import com.alibaba.fastjson.parser.JSONToken;

import java.security.spec.RSAOtherPrimeInfo;

/**
 * 获取工程目录
 * @author zhb
 */
public class ItemPath {
	public static String getItemRootPath() {
		String path2 = ItemPath.class.getProtectionDomain().getCodeSource()
	     .getLocation().getPath();
		String path = path2.replace("WEB-INF/classes/com/choice/common/ItemPath.class", "");
		
	   return path;
	}
	public static String getItemWebInfPath() {
		String path2 = ItemPath.class.getProtectionDomain().getCodeSource()
	     .getLocation().getPath();
		String path = path2.replace("classes/com/choice/common/ItemPath.class", "");
		
	   return path;
	}
	
	/**
	 *WEB-INF目录下
	 * @author zhb
	 * @return
	 */
	public static String getItemWebInfPath1() {
		String path2 = ItemPath.class.getProtectionDomain().getCodeSource()
				.getLocation().getPath();
		String path = path2.replace("classes/", "");
		
		return path;
	}
	
	public static String getItemPath() {
		String path = ItemPath.class.getProtectionDomain().getCodeSource().getLocation().getPath().replaceAll("classes.*", "");
	    return path;
	}
	/**
	 * BSorCS通用程序路径
	 * @return
	 */
	public static String getItemPathBSorCS() {
		String path = ItemPath.class.getProtectionDomain().getCodeSource().getLocation().getPath().replaceAll("classes.*", "");
		if(".jar".equals(path.substring(path.length()-4, path.length()))){
			path=path.substring(0, path.length()-4);
		}
	   return path;
	}
}
