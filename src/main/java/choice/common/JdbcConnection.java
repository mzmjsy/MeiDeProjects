package choice.common;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.sql.DataSource;

import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * @author 马振
 */
public class JdbcConnection {
	
	public static final String ORACLE="oracle";
	public static final String SQLSERVER="sqlserver";
	public static final String MYSQL="mysql";
	
	private static DataSource IMS_ds;
	private static DataSource DST_ds;
	private static DataSource YC_ds;
	
	private static int minPoolSize=5;
	private static int maxPoolSize=50;
	private static int initialPoolSize=5;
	private static int maxIdleTime=3600;
	private static int acquireIncrement=4;
	private static int checkoutTimeout=500000;
	private static int maxStatements=500;
	private static int idleConnectionTestPeriod=60;
	private static int acquireRetryAttempts=10;
	private static int acquireRetryDelay=1000;
	private static boolean breakAfterAcquireFailure=false;
	private static boolean testConnectionOnCheckout=false;
	
	static {
		try {
			// 读取配置文件中的jdbc参数信息
			ResourceMap ims_rm = new ResourceMap(ItemPath.getItemPathBSorCS()+"/jdbc");
			String ims_driver = ims_rm.getString("jdbc.driver_ims");
			String ims_url = ims_rm.getString("jdbc.url_ims");
			String ims_user = ims_rm.getString("jdbc.username_ims");
			String ims_pwd = ims_rm.getString("jdbc.password_ims");
			/*
			 * 加载配置文件以后，得到了数据库的 连接参数。利用连接参数初始化连接池 对象。
			 */
			ComboPooledDataSource ims_ds = new ComboPooledDataSource();
			ims_ds.setDriverClass(ims_driver);
			ims_ds.setJdbcUrl(ims_url);
			ims_ds.setUser(ims_user);
			ims_ds.setPassword(ims_pwd);
			ims_ds.setMinPoolSize(minPoolSize);
			ims_ds.setMaxPoolSize(maxPoolSize);
			ims_ds.setInitialPoolSize(initialPoolSize);
			ims_ds.setMaxIdleTime(maxIdleTime);
			ims_ds.setAcquireIncrement(acquireIncrement);
			ims_ds.setCheckoutTimeout(checkoutTimeout);
			ims_ds.setMaxStatements(maxStatements);
			ims_ds.setIdleConnectionTestPeriod(idleConnectionTestPeriod);
			ims_ds.setAcquireRetryAttempts(acquireRetryAttempts);
			ims_ds.setAcquireRetryDelay(acquireRetryDelay);
			ims_ds.setBreakAfterAcquireFailure(breakAfterAcquireFailure);
			ims_ds.setTestConnectionOnCheckout(testConnectionOnCheckout);
			IMS_ds = ims_ds;
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "jdbc", "choice库" + e.toString());
		}
	}
	static {
		try {
			// 读取配置文件中的jdbc参数信息
			ResourceMap dst_rm = new ResourceMap(ItemPath.getItemPathBSorCS() + "/jdbc");
			String dst_driver = dst_rm.getString("jdbc.driver_dst");
			String dst_url = dst_rm.getString("jdbc.url_dst");
			String dst_user = dst_rm.getString("jdbc.username_dst");
			String dst_pwd = dst_rm.getString("jdbc.password_dst");
			/*
			 * 加载配置文件以后，得到了数据库的 连接参数。利用连接参数初始化连接池 对象。
			 */
			ComboPooledDataSource dst_ds = new ComboPooledDataSource();
			dst_ds.setDriverClass(dst_driver);
			dst_ds.setJdbcUrl(dst_url);
			dst_ds.setUser(dst_user);
			dst_ds.setPassword(dst_pwd);
			dst_ds.setMinPoolSize(minPoolSize);
			dst_ds.setMaxPoolSize(maxPoolSize);
			dst_ds.setInitialPoolSize(initialPoolSize);
			dst_ds.setMaxIdleTime(maxIdleTime);
			dst_ds.setAcquireIncrement(acquireIncrement);
			dst_ds.setCheckoutTimeout(checkoutTimeout);
			dst_ds.setMaxStatements(maxStatements);
			dst_ds.setIdleConnectionTestPeriod(idleConnectionTestPeriod);
			dst_ds.setAcquireRetryAttempts(acquireRetryAttempts);
			dst_ds.setAcquireRetryDelay(acquireRetryDelay);
			dst_ds.setBreakAfterAcquireFailure(breakAfterAcquireFailure);
			dst_ds.setTestConnectionOnCheckout(testConnectionOnCheckout);
			DST_ds = dst_ds;
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "jdbc", "德顺通数据库" + e.toString());
		}
	}
	static {
		try {
			ResourceMap yc_rm = new ResourceMap(ItemPath.getItemPathBSorCS()+"/jdbc");
			String yc_driver = yc_rm.getString("jdbc.driver_yc");
			String yc_url = yc_rm.getString("jdbc.url_yc");
			String yc_user = yc_rm.getString("jdbc.username_yc");
			String yc_password = yc_rm.getString("jdbc.password_yc");
			
			ComboPooledDataSource yc_ds = new ComboPooledDataSource();
			yc_ds.setDriverClass(yc_driver);
			yc_ds.setJdbcUrl(yc_url);
			yc_ds.setUser(yc_user);
			yc_ds.setPassword(yc_password);
			yc_ds.setMinPoolSize(minPoolSize);
			yc_ds.setMaxPoolSize(maxPoolSize);
			yc_ds.setInitialPoolSize(initialPoolSize);
			yc_ds.setMaxIdleTime(maxIdleTime);
			yc_ds.setAcquireIncrement(acquireIncrement);
			yc_ds.setCheckoutTimeout(checkoutTimeout);
			yc_ds.setMaxStatements(maxStatements);
			yc_ds.setIdleConnectionTestPeriod(idleConnectionTestPeriod);
			yc_ds.setAcquireRetryAttempts(acquireRetryAttempts);
			yc_ds.setAcquireRetryDelay(acquireRetryDelay);
			yc_ds.setBreakAfterAcquireFailure(breakAfterAcquireFailure);
			yc_ds.setTestConnectionOnCheckout(testConnectionOnCheckout);
			YC_ds = yc_ds;
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "jdbc", "雅昌数据库" + e.getMessage());
		}
	}

	/**
	 * 描述:IMS数据库连接
	 * 作者:马振
	 * 时间:2016年8月26日上午9:32:19
	 * @return Connection
	 */
	public static Connection getImsConnection() {
		Connection conn = null;
		try {
			conn = IMS_ds.getConnection();
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "jdbc", "IMS库" + e.getMessage());
		}
		return conn;
	}

	/**
	 * 描述:德顺通数据库连接
	 * 作者:马振
	 * 时间:2016年8月26日上午9:32:19
	 * @return Connection
	 */
	public static Connection getDstConnection() {
		Connection conn = null;
		try {
			conn = DST_ds.getConnection();
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "jdbc", "德顺通库" + e.getMessage());
		}
		return conn;
	}

	/**
	 * 描述:雅昌数据库连接
	 * 作者:马振
	 * 时间:2020年12月2613日
	 * @return Connection
	 */
	public static Connection getYcConnection() {
		Connection conn = null;
		try {
			conn = YC_ds.getConnection();
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "jdbc", "雅昌库" + e.getMessage());
		}
		return conn;
	}
	
	/**
	 * Description: 归还连接. <br/>
	 * Date: Jan 12, 2017 4:45:56 PM <br/>
	 * 
	 * @author qlc 
	 * @param ps TODO
	 * @param rs TODO
	 * @since JDK 1.7
	 */
	public static void close(Connection conn, PreparedStatement ps, ResultSet rs) {
		try {
			if (rs != null) {
				rs.close();
			}
			if (ps != null) {
				ps.close();
			}
			if (conn != null) {
				conn.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
       	ResourceMap rm = new ResourceMap(ItemPath.getItemPathBSorCS() + "/jdbc");
		String driver = rm.getString("jdbc.driver_yc");
		System.out.println(ItemPath.getItemPathBSorCS() + "jdbc");
		System.out.println(driver);
	}
}