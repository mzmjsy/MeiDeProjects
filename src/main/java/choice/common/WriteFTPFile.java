package choice.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.net.ftp.FTPClient;

import choice.common.FTPUtil;  
  
public class WriteFTPFile {  
  
    /** 
     * 本地上传文件到FTP服务器 
     *  
     * @param ftpPath 
     *            远程文件路径FTP 
     * @throws IOException 
     */  
    public boolean upload(File file, String workdate,String ftpUserName, String ftpPassword,String ftpHost, int ftpPort) {  
    	boolean flag = true;
        FTPClient ftpClient = null;  
        try {  
            ftpClient = FTPUtil.getFTPClient(ftpHost, ftpPassword,ftpUserName, ftpPort);  
            ftpClient.enterLocalPassiveMode();  
            ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);  
            
            //在指定目录下建营业日文件夹
//            if(!ftpClient.changeWorkingDirectory(workdate)){
//            	ftpClient.makeDirectory(workdate);
//            }
//            ftpClient.changeWorkingDirectory(workdate);
            
            InputStream in = new FileInputStream(file);  
            flag = ftpClient.storeFile(new String(file.getName().getBytes("GBK"),"ISO-8859-1"), in);  
            if (flag) {
        		LogUtil.writeToTxt(LogUtil.POSXML, "ftp","POS数据生成xml【"+file.getName()+"】调用FTP返回成功！");
            } else {
            	LogUtil.writeToTxt(LogUtil.POSXML, "ftp","POS数据生成xml【"+file.getName()+"】调用FTP返回失败，请查看FTP日志！");
            }
            in.close();  
        } catch (Exception e) {
        	flag = false;
    		LogUtil.writeToTxt(LogUtil.POSXML, "ftp","POS数据生成xml【"+file.getName()+"】调用FTP出错，错误信息【"+e.getMessage()+"】");
            e.printStackTrace();  
        }finally{  
            try {  
            	if(null!=ftpClient){
            		ftpClient.disconnect();  
            	}
            } catch (IOException e) {  
                e.printStackTrace();  
            }  
        }  
        return flag;
    }  
}  