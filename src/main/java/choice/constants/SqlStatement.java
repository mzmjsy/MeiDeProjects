package choice.constants;

/**
 * 描述：要查询的SQL语句
 * @author：马振
 * 时间：2017年12月20日上午9:33:56
 */
public class SqlStatement {

	/**
	 *
	 */
	public static final String SQL_SELECT_FLAG = "select * from crm_quality_info where flag = 'N'";

	/**
	 * 修改表状态
	 */
	public static final String SQL_UPDATE_FLAG = "update crm_quality_info set flag = 'Y' where quality_info_id in (?)";

	/**
	 * 查询信息
	 */
	public static final String SQL_SELECT_INFO = "select * from crm_quality_info where quality_info_id = ?";

	/**
	 * 新增信息
	 */
	public static final String SQL_INSERT_INFO = "INSERT INTO crm_quality_info VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
}