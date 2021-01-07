package choice.common;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 关闭数据源
 * @author zhb
 *
 */
public class DataClose {
	/**
	 * 关闭rs,pst
	 * @param rs
	 * @param pst
	 * @return
	 */
	public String dataclose(ResultSet rs,PreparedStatement pst){
		try {
			if(rs!=null){
				rs.close();
			}	
		} catch (SQLException e) {
			e.printStackTrace();
		}
	    try {
	    	if(pst!=null){
	    		pst.close();
	    	}	
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "1";
	}
	/**
	 * 关闭pst
	 * @param pst
	 * @return
	 */
	public String dataclosepst(PreparedStatement pst){
	    try {
	    	if(pst!=null){
	    		pst.close();
	    	}	
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "1";
	}
	/**
	 * 关闭conn
	 * @param conn
	 * @return
	 */
	public String datacloses(Connection conn){
		try {
	    	if(conn!=null){
	    		conn.close();
	    	}	
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "1";
	}
}
