package choice.common;

import java.io.IOException;
import java.net.SocketException;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;  

public class FTPUtil {  
      
    /** 
     * 获取FTPClient对象 
     * @param ftpHost FTP主机服务器 
     * @param ftpPassword FTP 登录密码 
     * @param ftpUserName FTP登录用户名 
     * @param ftpPort FTP端口 默认为21 
     * @return 
     * @throws IOException 
     * @throws SocketException 
     */  
    public static FTPClient getFTPClient(String ftpHost, String ftpPassword,  
            String ftpUserName, int ftpPort) throws SocketException, IOException {  
        FTPClient ftpClient = null;  
        ftpClient = new FTPClient();  
        ftpClient.connect(ftpHost, ftpPort);// 连接FTP服务器  
        ftpClient.login(ftpUserName, ftpPassword);// 登陆FTP服务器  
        if (!FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {  
            LogUtil.writeToTxt(LogUtil.POSXML, "ftp","未连接到FTP，用户名或密码错误！");
            ftpClient.disconnect();  
        } else {  
            LogUtil.writeToTxt(LogUtil.POSXML, "ftp","FTP连接成功！");
        }  
        return ftpClient;  
    }  
} 