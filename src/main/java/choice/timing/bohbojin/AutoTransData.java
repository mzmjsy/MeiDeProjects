package choice.timing.bohbojin;

import java.sql.Connection;

import choice.common.JdbcConnection;
import choice.service.TransImsToYc;

/**
 * @author 马振
 */
public class AutoTransData {
	String flag;
	Connection conn;
    Connection cons;
    
    /**
     * 描述:ims—雅昌
     * 作者:马振
     * 时间:2020年12月13日
     * @return
     */
    public String transImsToYc(){
    	flag = "1";
    	conn = JdbcConnection.getYcConnection();
    	cons = JdbcConnection.getImsConnection();
    	
    	//IMS数据同步雅昌
    	new TransImsToYc();
    	
    	if (conn != null) {
    		JdbcConnection.close(conn, null, null);
    	}
    	if (cons != null) {
    		JdbcConnection.close(cons, null, null);
    	}
    	return flag;
    }
}