package choice.timing.trans;

import java.sql.Connection;

import choice.common.JdbcConnection;
import choice.service.DeShunTong;

/**
 * @author 马振
 */
public class AutoTransData {
    Connection cons;
    
    /**
     * 描述:IMS—德顺通
     * 作者:马振
     * 时间:2020年12月13日
     */
    public void transImsToDst(){
    	cons = JdbcConnection.getImsConnection();
    	
    	//IMS数据同步雅昌
    	new DeShunTong();

    	if (cons != null) {
    		JdbcConnection.close(cons, null, null);
    	}
    }
}