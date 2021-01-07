package choice.common;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

public class ZipUtil {

	/**
	 * 描述:压缩成zip
	 * 作者:马振
	 * 时间:2016年9月21日上午9:35:57
	 * @param zipPath	放置压缩后zip文件的路径
	 * @param zipFilep	zip文件路径+名称
	 * @param path		要压缩的文件路径
	 * @throws Exception
	 */
	public static void zip(String zipPath, String zipFilep, String path)throws Exception  {
		try {
			//若path下的文件不为0，则压缩文件
			File zp = new File(zipPath);
			if (!zp.exists()) {
				zp.mkdirs();
		    }
			
			File zipFile = new File(zipFilep);
			if (!zipFile.exists()) {
				zipFile.createNewFile();
			}
			
			File ph = new File(path);
			if (!ph.exists()) {
				ph.mkdirs();
			}
		
			FileOutputStream fileOutputStream = new FileOutputStream(zipFile);
			ZipOutputStream out = new ZipOutputStream(fileOutputStream);
			write(out, path, "");
			out.close();
			fileOutputStream.close();
			System.out.println(zipFilep + "文件生成成功！");
		} catch (Exception e) {
			LogUtil.writeToTxt(LogUtil.POSXML, "ziplog", "生成" + zipFilep + "出现异常" + e.getStackTrace());
			e.printStackTrace();
		}
	}

	/**
	 * 功能：写压缩流
	 * 
	 * @param out
	 *            压缩输出流
	 * @param path
	 *            压缩路径
	 * @param base
	 *            压缩式的基础目录
	 * @throws java.lang.Exception
	 */

	private static void write(ZipOutputStream out, String path, String base) throws Exception {
		File file = new File(path);
		if (file.isDirectory()) {// 文件夹，递归
			base = base.length() == 0 ? "" : base + File.separator;
			File[] tempFiles = file.listFiles();
			for (int i = 0; i < tempFiles.length; i++) {
				write(out, tempFiles[i].getPath(), base
						+ tempFiles[i].getName());
			}
		} else {// 文件，压缩
			
			if(base.equals("")){
				base = file.getName();
			}
			
			byte[] buff = new byte[2048];
			int bytesRead = -1;
			ZipEntry entry = new ZipEntry(base);
			out.putNextEntry(entry);
			FileInputStream in2 = new FileInputStream(file);
			InputStream in = new BufferedInputStream(in2);
			while (-1 != (bytesRead = in.read(buff, 0, buff.length))) {
				out.write(buff, 0, bytesRead);
			}
			in.close();
			in2.close();
			out.flush();
		}
	}

	/**
	 * 功能：解压缩
	 * 
	 * @param zipFilename
	 *            zip文件
	 * @param destPath
	 *            解压缩路径
	 * @throws java.lang.Exception
	 */
	public static void unZip(String zipFilename, String destPath){
		ZipFile zip=null;
		try{
			zip = new ZipFile(zipFilename);
			Enumeration<? extends ZipEntry> enu = zip.entries();// 得到压缩文件夹中的所有文件
			while (enu.hasMoreElements()) {
				ZipEntry entry = (ZipEntry) enu.nextElement();
				String file = destPath + entry.getName();
				write(zip, entry, file);
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if(zip!=null){
				try {
					zip.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
			
		}
		//System.out.println("解压文件结束！");
	}

	/**
	 * 功能：将解压缩之后的文件写入目录
	 * 
	 * @param zip
	 *            压缩文件
	 * @param entry
	 *            压缩文件实体——压缩文件中的文件
	 * @param fileLocation
	 *            解压缩之后的文件路径
	 * @throws Exception
	 */
	private static void write(ZipFile zip, ZipEntry entry, String file)
			throws Exception {
		if (entry.isDirectory()) {
			File f = new File(file);
			f.mkdirs();
		} else {
			File f = new File(file);
			createDir(f);
			FileOutputStream fos = new FileOutputStream(f);
			byte[] buffer = new byte[8196];
			InputStream is = zip.getInputStream(entry);
			for (int len = is.read(buffer, 0, buffer.length); len != -1; len = is
					.read(buffer, 0, 8196)) {
				fos.write(buffer, 0, len);
			}
			
			is.close();
			fos.close();
		}
	}

	/**
	 * 功能：创建目录
	 * 
	 * @param file
	 *            文件或目录
	 */
	private static void createDir(File file) {
		if (file.isDirectory() && !file.exists()) {
			file.mkdirs();
		} else {
			String path = file.getPath();
			int i = path.lastIndexOf(File.separator);
			path = path.substring(0, i);
			new File(path).mkdirs();
		}
	}

	/**
	 * 描述:获取path路径下的zip中的文件个数
	 * 作者:马振
	 * 时间:2017年1月8日下午1:34:46
	 * @param path
	 * @return
	 */
	public static int zipNum(String path) {
		int num = 0;
		try {
			ZipFile zf = new ZipFile(path);
			num = zf.size();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return num;
	}
	
	/**
	 * 功能：测试样例
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			zip("E:/choice/BOHzip/20170102/other","E:/choice/BOHzip/20170102/other/2000.zip","E:/choice/BOHxml/20170102/other");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}