package choice.common;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.activation.DataHandler;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;

@SuppressWarnings("resource")
public class FileUtils {
	public static Logger log = Logger.getLogger(FileUtils.class);
	
	//POS数据生成XML路径
	static String path = new ResourceMap(ItemPath.getItemPathBSorCS() + "/time").getString("xmlstoragepath");	
	
	/**
	 * 获取文件列表
	 * 
	 * @param String
	 *            fileDir 获取文件的目录
	 * @return 文件数组
	 */
	public static File[] getFileList(String fileDir) {
		File dir = new File(fileDir);
		for (String children : dir.list()) {
			System.out.println(children);
		}
		return dir.listFiles();
	}

	/**
	 * 读取源文件字符数组
	 * 
	 * @param File
	 *            file 获取字符数组的文件
	 * @return 字符数组
	 */
	public static byte[] readFileByte(File file) {
		FileInputStream fis = null;
		FileChannel fc = null;
		byte[] data = null;
		try {
			fis = new FileInputStream(file);
			fc = fis.getChannel();
			data = new byte[(int) (fc.size())];
			fc.read(ByteBuffer.wrap(data));

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fc != null) {
				try {
					fc.close();
				} catch (IOException e) {

					e.printStackTrace();
				}
			}
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

		}
		return data;
	}

	/**
	 * 读取源文件字符数组
	 * 
	 * @param filename
	 *            String 文件路径
	 * @throws IOException
	 * @return byte[] 文件内容
	 */
	public static byte[] readFileByte(String filename) throws IOException {

		if (filename == null || filename.equals("")) {
			throw new NullPointerException("无效的文件路径");
		}
		File file = new File(filename);
		long len = file.length();
		byte[] bytes = new byte[(int) len];

		BufferedInputStream bufferedInputStream = new BufferedInputStream(
				new FileInputStream(file));
		int r = bufferedInputStream.read(bytes);
		if (r != len)
			throw new IOException("读取文件不正确");
		bufferedInputStream.close();

		return bytes;

	}

	/**
	 * 字符数组写入文件
	 * 
	 * @param byte[] bytes 被写入的字符数组
	 * @param File
	 *            file 被写入的文件
	 * @return 字符数组
	 */
	public static String writeByteFile(byte[] bytes, File file) {
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(file);
			fos.write(bytes);
		} catch (FileNotFoundException e) {
			e.printStackTrace();

		} catch (IOException e) {
			e.printStackTrace();

		} finally {
			if (fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return "success";
	}

	/**
	 * 移动指定文件夹内的全部文件,(剪切移动)
	 * 
	 * @param fromDir
	 *            要移动的文件目录
	 * @param toDir
	 *            目标文件目录
	 *@param errDir
	 *            出错文件目录
	 * @throws Exception
	 */
	public static void moveFile(String fromDir, String toDir, String errDir) {
		try {
			// 目标文件目录
			File destDir = new File(toDir);
			if (!destDir.exists()) {
				destDir.mkdirs();
			}
			// 开始文件移动
			for (File file : new File(fromDir).listFiles()) {
				if (file.isDirectory()) {
					moveFile(file.getAbsolutePath(), toDir + File.separator + file.getName(), errDir);
					file.delete();
					LogUtil.writeToTxt(LogUtil.POSXML, "move", "文件夹" + file.getName() + "删除成功!");
				} else {
					File moveFile = new File(toDir + File.separator + file.getName());
					if (moveFile.exists()) {
						moveFileToErrDir(moveFile, errDir);// 转移到错误目录
					}
					file.renameTo(moveFile);
					LogUtil.writeToTxt(LogUtil.POSXML, "move", "文件" + moveFile.getName() + "转移成功！");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}
	}

	private static void moveFileToErrDir(File moveFile, String errDir) {
		int i = 0;
		String errFile = errDir + File.separator + "rnError"
				+ moveFile.getName();
		while (new File(errFile).exists()) {
			i++;
			errFile = errDir + File.separator + i + "rnError"
					+ moveFile.getName();
		}
		moveFile.renameTo(new File(errFile));
	}

	/**
	 * 从输入流获取字节数组
	 * 
	 * @param
	 */
	public static byte[] getFileByte(InputStream in) {
		ByteArrayOutputStream out = new ByteArrayOutputStream(4096);
		try {
			copy(in, out);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return out.toByteArray();

	}

	/**
	 * 从输入流输出到输出流
	 * 
	 */
	private static void copy(InputStream in, OutputStream out)
			throws IOException {

		try {
			byte[] buffer = new byte[4096];
			int nrOfBytes = -1;
			while ((nrOfBytes = in.read(buffer)) != -1) {
				out.write(buffer, 0, nrOfBytes);
			}
			out.flush();
		} catch (IOException e) {

		} finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (IOException ex) {
			}
			try {
				if (out != null) {
					out.close();
				}
			} catch (IOException ex) {
			}
		}

	}

	// DataHandler写入文件
	public static boolean writeDataHandlerToFile(DataHandler attachinfo,String filename
			) {
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(filename);
			writeInputStreamToFile(attachinfo.getInputStream(), fos);
			fos.close();
		} catch (Exception e) {
			return false;
		} finally {
			if (fos != null) {
				try {
					fos.close();
				} catch (Exception e) {
				}
			}
		}
		return true;
	}

	private static void writeInputStreamToFile(InputStream is, OutputStream os)
			throws Exception {
		int n = 0;
		byte[] buffer = new byte[8192];
		while ((n = is.read(buffer)) > 0) {
			os.write(buffer, 0, n);
		}
	}

	/**
	 * 删除文件夹
	 * @param filepath
	 * @throws IOException
	 */
	 public void delFile(String filepath) throws IOException {
        File f = new File(filepath);// 定义文件路径
        if (f.exists() && f.isDirectory()) {// 判断是文件还是目录
            if (f.listFiles().length == 0) {// 若目录下没有文件则直接删除
                f.delete();
            } else {// 若有则把文件放进数组，并判断是否有下级目录
                File delFile[] = f.listFiles();
                int i = f.listFiles().length;
                for (int j = 0; j < i; j++) {
                    if (delFile[j].isDirectory()) {
                    	delFile(delFile[j].getAbsolutePath());// 递归调用del方法并取得子目录路径
                    }
                    delFile[j].delete();// 删除文件
                }
            }
        }
    }
	 /**
	 * 根据byte数组，生成文件
	 * @throws Exception 
	 */
	public static void generateFile(byte[] bfile, String filePath,String fileName) throws Exception {
		BufferedOutputStream bos = null;
		FileOutputStream fos = null;
		File file = null;
		try {
			File dir = new File(filePath);
			if(!dir.exists() && !dir.isDirectory()){//判断文件目录是否存在
				dir.mkdirs();
			}
			file = new File(filePath+"\\"+fileName);
			fos = new FileOutputStream(file);
			bos = new BufferedOutputStream(fos);
			bos.write(bfile);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		} finally {
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if (fos != null) {
				try {
					fos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
	}
	
	public static String getFileContent(File file){
		StringBuffer sb = new StringBuffer();;
		try {
			FileReader fr = new FileReader(file.getAbsolutePath());
			BufferedReader br = new BufferedReader(fr);
			String str;
			while((str=br.readLine()) !=null){
				sb.append(str);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		String result = sb.toString();
		return result;
	}
	
	/**
	 * 获取目录下的所有sql
	 * @param paths
	 * @return
	 */
	public static List<String> getSql(String paths){
		List<String> list = new ArrayList<String>();
		File[] fileArray = getFileList(paths);
		for(File file :fileArray){
			if(file.getName().indexOf(".sql")!=-1){
				list.add(getFileContent(file));
			}
		}
		return list;
	}
	
	/**
	 * 描述:生成xml
	 * 作者:马振
	 * 时间:2016年9月5日下午4:46:53
	 * @param flag		文件标识
	 * @param date		日期
	 * @param storeCode	门店编码
	 * @param content	生成的XML字符串
	 */
	public static void createPdFile(String flag, String date, String storeCode, String content, String whether) {
		try {
			String url = path + date + "/" + whether;
			//如果是linux系统
			if("/".equals(File.separator)){
				path = "/" + path;
			}
			
			//若根据门店统计，则将XML放到相应门店下
//			if ("hand".equals(whether)) {
//				url = path + "hand/" + date;
//			}

			//判断该文件夹是否存在，若不存在则创建
			File dir = new File(url);
			if (!dir.exists()) {
		    	dir.mkdirs();
		    }
			
			String nowTime = DateFormat.getNowTime();	//获取当前系统时间(时分秒)
			String filename = url + "/" + flag + "_" + storeCode + "_" + date + "_" + nowTime.replace(":", "") + ".xml";
			File file = new File(filename);
		    
			//判断该文件是否存在，若不存在则创建
			if(!file.exists()){
		    	file.createNewFile();
		    }
			BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file, true), "UTF-8"));
			
//            FileWriter writer = new FileWriter(filename, true);
            String str = unicodeToCn(content);
            /*int len = str.length();
			for(int i = 0; i <= len;){
				int end = i + 1000;
				String tmp = (i >= len || end >= len) ? str.substring(i) : str.substring(i, end);
				writer.write(tmp);
				i = end;
				tmp = null;
			}*/
			writer.write(str);
            writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}   
	}
	
	/**
	 * 描述:将生产的xml字符串格式化成xml格式
	 * 作者:马振
	 * 时间:2016年9月5日下午4:47:54
	 * @param str	XML字符串
	 * @return
	 */
	public static String formatXml(String str) {
		Document document = null;
		StringWriter writer = new StringWriter();
		try {
			document = DocumentHelper.parseText(str);
		
			// 格式化输出格式
			OutputFormat format = OutputFormat.createPrettyPrint();
			format.setEncoding("UTF-8");
			
			// 格式化输出流
			XMLWriter xmlWriter = new XMLWriter(writer, format);
			
			// 将document写入到输出流
			xmlWriter.write(document);
			xmlWriter.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return writer.toString();
//		return str;
	}
	
	/**
	 * 描述： 获取文件夹下所有文件个数
	 * @author 马振
	 * 创建时间：2016年4月28日下午4:49:40
	 * @param date
	 * @return
	 */
	public static int getFilNumber(String filePath) {
		File file = new File(filePath);
		String[] str = file.list();
		return null == str ? 0 : str.length;
	}
	
	/**
	 * 描述:将Unicode转换成中文
	 * 作者:马振
	 * 时间:2016年9月6日下午1:48:04
	 * @param unicode
	 * @return
	 */
	public static String unicodeToCn(String unicode) {
//		// 以 \ u 分割
		String[] strs = unicode.split("\\\\u");
		StringBuilder sbd = new StringBuilder();
		sbd.append(strs[0]);
//		String returnStr = strs[0];
		// 由于unicode字符串以 \ u 开头，因此分割出的第一个字符是""。
		for (int i = 1; i < strs.length; i++) {
			String str = strs[i];
			if (str.length() > 4) {
				sbd.append((char) Integer.valueOf(str.substring(0, 4), 16).intValue());
				sbd.append(str.substring(4, str.length()));
			} else {
				sbd.append((char) Integer.valueOf(str, 16).intValue());
			}
			str = null;
		}
		strs = null;
		return sbd.toString();
//		return unicode;
	}
	
	public static String unicodeToCn2(String unicode) {
		StringBuffer sb = new StringBuffer();
		Matcher m = Pattern.compile("\\\\u[0-9a-fA-F]{4}").matcher(unicode);
		while(m.find()){
			char c = (char) Integer.valueOf(m.group().substring(2), 16).intValue();
			m.appendReplacement(sb, String.valueOf(c));
		}
		m.appendTail(sb);
		m = null;
		return sb.toString();
	}
	
	/**
	 * 描述:按时间获取最早、最晚的一个文件
	 * 作者:马振
	 * 时间:2016年10月25日上午11:26:52
	 * @param url
	 * @return
	 */
	public static Map<String, File> getFilePathName(String url) {
        TreeMap<Long, File> tm = new TreeMap<Long, File>();
        Map<String, File> map = new HashMap<String, File>();
        
        File file = new File(url);
        File subFile[] = file.listFiles();
        int fileNum = subFile.length;

        for (int i = 0; i < fileNum; i++) {
             Long tempLong = new Long(subFile[i].lastModified());
             tm.put(tempLong, subFile[i]);
        }
        
        map.put("first", tm.get(tm.firstKey()));//最早的一个文件的路径
        map.put("last", tm.get(tm.lastKey()));	//最晚的一个文件的路径
        return map;
	}
	
	/**
	 * 描述:复制一个文件夹下的文件到另一个文件件夹中
	 * 作者:马振
	 * 时间:2017年1月4日下午7:31:34
	 * @param oldPath
	 * @param newPath
	 */
	public static void copyFolder(String oldPath, String newPath) { 
		try { 
			//如果文件夹不存在 则建立新文件夹 
			File newPathDir = new File(newPath);
			if (!newPathDir.exists()) {
				newPathDir.mkdirs();
			}
			
			File a = new File(oldPath); 
			String[] file = a.list(); 
			File temp = null; 
			for (int i = 0; i < file.length; i++) { 
				if(oldPath.endsWith(File.separator)){ 
					temp = new File(oldPath + file[i]); 
				} else { 
					temp = new File(oldPath + File.separator+file[i]); 
				} 

				if (temp.isFile()) { 
					FileInputStream input = new FileInputStream(temp); 
					FileOutputStream output = new FileOutputStream(newPath + File.separator + (temp.getName()).toString()); 
					byte[] b = new byte[1024 * 5]; 
					int len; 
					while ((len = input.read(b)) != -1) { 
						output.write(b, 0, len); 
					} 
					output.flush(); 
					output.close(); 
					input.close(); 
				} 
				if (temp.isDirectory()) {//如果是子文件夹 
					copyFolder(oldPath + File.separator + file[i], newPath + File.separator + file[i]); 
				} 
				
				LogUtil.writeToTxt(LogUtil.POSXML, "move", "转移文件" + temp.getName() + "到FTP传递失败文件夹中成功！");
			} 
		} catch (Exception e) { 
			LogUtil.writeToTxt(LogUtil.POSXML, "move", "转移文件到FTP传递失败文件夹时失败！");
			e.printStackTrace(); 
		} 
	}
	
	public static Properties loadPropertiesFile(String fullFile) {
		String webRootPath = null;
		if (null == fullFile || fullFile.equals("")){
			throw new IllegalArgumentException("Properties file path can not be null" + fullFile);
		}
		webRootPath = ItemPath.getItemPath();
		InputStream inputStream = null;
		Properties p = null;
		try {
			inputStream = new FileInputStream(new File(webRootPath + File.separator + fullFile));
			p = new Properties();
			p.load(inputStream);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (null != inputStream){
					inputStream.close();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return p;
	}
	
	public static void main(String[] args) {
		copyFolder("E:/choice/BOHzip/20170712/errorFill","E:/choice/BOHzip/20170712/hand");
	}
}