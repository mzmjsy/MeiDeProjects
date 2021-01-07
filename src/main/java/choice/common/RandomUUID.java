package choice.common;

import java.util.Random;
import java.util.UUID;

/**
 * 描述：获取UUID
 * @author 马振
 * 创建时间：2015-9-15 上午8:55:18
 */
public class RandomUUID {
	
	/**
	 * 描述：获取20位UUID
	 * @author 马振
	 * 创建时间：2015-9-15 上午8:55:31
	 * @return
	 */
	public static String returnUUID (){
		UUID uuid = UUID.randomUUID();
		String returnvalue = uuid.toString().replace("-", "").substring(0, 20).toUpperCase();
		return returnvalue;
	}
	
	/**
	 * 描述:获取两个数字之间的随机数
	 * 作者:马振
	 * 时间:2017年3月20日上午11:38:19
	 * @param max	最大数
	 * @param min	最小数
	 * @return
	 */
	public static int returnRandom (int max, int min){
        Random random = new Random();
		return random.nextInt(max) % (max - min + 1) + min;
	}
}