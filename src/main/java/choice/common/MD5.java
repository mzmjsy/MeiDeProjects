package choice.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.security.MessageDigest;
import java.util.Date;

public class MD5 {

	protected static MessageDigest messagedigest = null;
	
	static
	{
		try{
			messagedigest = MessageDigest.getInstance("MD5");
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public static String md5(String str) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(str.getBytes());
			byte b[] = md.digest();

			int i;

			StringBuffer buf = new StringBuffer("");
			for (int offset = 0; offset < b.length; offset++) {
				i = b[offset];
				if (i < 0)
					i += 256;
				if (i < 16)
					buf.append("0");
				buf.append(Integer.toHexString(i));
			}
			str = buf.toString();
		} catch (Exception e) {
			e.printStackTrace();

		}
		return str;
	}
	
	/**
	 * 取得大文件的MD5信息摘要；
	 * 适用于上G大的文件
	 * @param file
	 * @return
	 * @throws IOException
	 */
	public static String getFileMD5String(File file){
		FileInputStream in;
		try {
			in = new FileInputStream(file);
			FileChannel ch = in.getChannel();
			MappedByteBuffer byteBuffer = ch.map(FileChannel.MapMode.READ_ONLY, 0, file.length());
			messagedigest.update(byteBuffer);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return bytesToHexString(messagedigest.digest()).toUpperCase();
	}
	
	/**
    * 把字节数组转换成16进制字符串
    * @param bArray
    * @return
    */
	public static String bytesToHexString(byte[] bArray){
	    StringBuffer sb = new StringBuffer(bArray.length);
	    String sTemp;
	    for (int i = 0; i < bArray.length; i++) 
	    {
	    	sTemp = Integer.toHexString(0xFF & bArray[i]);
	    	if (sTemp.length() < 2)
	    		sb.append(0);
	    	sb.append(sTemp.toUpperCase());
	    }
	    return sb.toString();
	}
	
	public static String md5CRM(){
		String dateString = DateFormat.getStringByDate(new Date(), "yyyyMMdd");
		String preString = "crm@"+dateString;
		return md5(preString);
	}
	
	public static String md5BOH(){
		String dateString = DateFormat.getStringByDate(new Date(), "yyyyMMdd");
		String preString = "boh@"+dateString;
		return md5(preString);
	}
	
	public static String md5SCM(){
		String dateString = DateFormat.getStringByDate(new Date(), "yyyyMMdd");
		String preString = "scm@"+dateString;
		return md5(preString);
	}
	
	public static void main(String[] args) {
		System.out.println(md5CRM());
	}
}
