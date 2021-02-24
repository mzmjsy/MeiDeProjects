package choice.constants;

/**
 * 描述：要查询的SQL语句
 * @author 马振
 * 时间：2017年12月20日上午9:33:56
 */
public class SqlStatement {

	public static final String SQL_SELECT_FLAG = "";
	/**
	 * 修改表状态
	 */
	public static final String SQL_UPDATE_FLAG = "update crm_dst_delivery set flag = 'Y' where quality_info_id in (?)";

	/**
	 * 查询信息
	 */
	public static final String SQL_SELECT_INFO = "select * from crm_quality_info where quality_info_id = ?";

	/**
	 * 新增信息
	 */
	public static final String SQL_INSERT_INFO = "INSERT INTO crm_quality_info VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

	/**
	 *	获取要传递的单据
	 */
	public static final String SEL_CRM_DST_PUSH_INFO = "SELECT * FROM CRM_DST_PUSH_INFO_V";

	/**
	 *	往IMS写入调用接口返回的状态
	 */
	public static final String UPD_CRM_DST_DELIVERY = "UPDATE CRM_DST_DELIVERY SET TRANS_ID = ?, VRESULT = ? WHERE DST_DELIVERY_ID = ?";

	/**
	 *	往IMS写入调用接口返回的状态
	 */
	public static final String UPD_CRM_DELIVERY_HEADER = "UPDATE CRM_LG_DELIVERY_HEADER SET CLOSE_BY = 1 WHERE INSTR(?, DELIVERY_CODE) > 0";

	/**
	 *	查询推送记录
	 */
	public static final String SEL_CRM_DST_DELIVERY = "SELECT * FROM CRM_DST_DELIVERY ORDER BY DST_DELIVERY_ID DESC";
}