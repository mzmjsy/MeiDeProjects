package choice.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import choice.common.JdbcConnection;
import choice.common.LogUtil;
import choice.constants.SqlStatement;
import choice.domain.QualityInfo;
import org.apache.cxf.endpoint.Client;
import org.apache.cxf.jaxws.endpoint.dynamic.JaxWsDynamicClientFactory;

/** 
 * @author Administrator
 * 描述:同步IMS数据到雅昌
 * 作者:马振
 * 时间:2020年12月2613日
 */
public class TransImsToYc {
	PreparedStatement pstMain;
	PreparedStatement pstKq;
    String flag;
    
    /**
     * 编码接口
     */
    public TransImsToYc(){

    	//数据同步
    	String flag = this.insertYc();

    	if ("Y".equals(flag)) {
			System.out.println("【数据同步成功】");
		} else {
			System.out.println("【数据同步失败：" + flag + "】");
		}
		LogUtil.writeToTxt(LogUtil.IMSXML, "ims", "【数据同步失败：" + flag + "】");
    }
    
    /**
     * 描述:
     * 作者:马振
     * 时间:2016年8月26日上午10:05:11
     * @return
     */
    private List<QualityInfo> getImsData() {
		flag = "1";
		List<QualityInfo> listQualityInfo = new ArrayList<QualityInfo>();

		//查询IMS库
		String str = SqlStatement.SQL_SELECT_FLAG;

		Connection conn = null;
		PreparedStatement pst = null;
		ResultSet rs = null;
		try {
			conn = JdbcConnection.getImsConnection();
			pst = conn.prepareStatement(str);
			rs = pst.executeQuery();
			while (rs.next()) {
				QualityInfo qualityInfo = new QualityInfo();
				qualityInfo.setQualityInfoId(rs.getString("quality_info_id"));
				qualityInfo.setProductClass(rs.getString("product_class"));
				qualityInfo.setGongBu(rs.getString("gong_bu"));
				qualityInfo.setInfoName(rs.getString("info_name"));
				qualityInfo.setRemark(rs.getString("remark"));
				qualityInfo.setSrcUrl(rs.getString("src_url"));
				qualityInfo.setAttribute1(rs.getString("attribute1"));
				qualityInfo.setAttribute2(rs.getString("attribute2"));
				qualityInfo.setAttribute3(rs.getString("attribute3"));
				qualityInfo.setAttribute4(rs.getString("attribute4"));
				qualityInfo.setAttribute5(rs.getString("attribute5"));
				qualityInfo.setAttribute6(rs.getString("attribute6"));
				qualityInfo.setAttribute7(rs.getString("attribute7"));
				qualityInfo.setAttribute8(rs.getString("attribute8"));
				qualityInfo.setAttribute9(rs.getString("attribute9"));
				qualityInfo.setAttribute10(rs.getString("attribute10"));
				listQualityInfo.add(qualityInfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "ims", "查询IMS数据库错误信息：" + e.getMessage());
		} finally {
			JdbcConnection.close(conn, pst, rs);
		}

		return listQualityInfo;
	}

	/**
	 * 修改标识
	 * @param qualityInfoIds
	 * @return
	 */
	private void updateFlag(String qualityInfoIds) {
		Connection conn = null;
		PreparedStatement pst = null;
		try {
			conn = JdbcConnection.getImsConnection();
			String sql = SqlStatement.SQL_UPDATE_FLAG;
			pst = conn.prepareStatement(sql);
			pst.setString(1, qualityInfoIds);

			pst.addBatch();
			pst.executeBatch();
			conn.commit();
			pst.clearBatch();
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.writeToTxt(LogUtil.IMSXML, "ims", "修改ims库中flag标识错误信息：" + e.getMessage());
		} finally {
			JdbcConnection.close(conn, pst, null);
		}
	}

	/**
	 * 插入数据
	 * @return
	 */
	private String insertYc() {
    	String flag = "Y";
		Connection conn = null;
		PreparedStatement pst = null;
		PreparedStatement pstIn = null;
		ResultSet rss = null;

		try {
			conn = JdbcConnection.getYcConnection();
			conn.setAutoCommit(false);
			String quSql = SqlStatement.SQL_SELECT_INFO;
			String inSql = SqlStatement.SQL_INSERT_INFO;

			pst = conn.prepareStatement(quSql);
			pstIn = conn.prepareStatement(inSql);

			List<QualityInfo> listQualityInfo = this.getImsData();
			String qualityInfoIds = "";

			for (int i = 0; i < listQualityInfo.size(); i++) {
				QualityInfo qualityInfo = listQualityInfo.get(i);
				pst.setString(1, qualityInfo.getQualityInfoId());
				rss = pst.executeQuery();

				//若查询语句有结果集，则crm_quality_info中存在该数据，不新增
				if (!rss.next()) {
					pstIn.setString(1, qualityInfo.getQualityInfoId());
					pstIn.setString(2, qualityInfo.getProductClass());
					pstIn.setString(3, qualityInfo.getGongBu());
					pstIn.setString(4, qualityInfo.getInfoName());
					pstIn.setString(5, qualityInfo.getSrcUrl());
					pstIn.setString(6, qualityInfo.getRemark());
					pstIn.setString(7, qualityInfo.getAttribute1());
					pstIn.setString(8, qualityInfo.getAttribute2());
					pstIn.setString(9, qualityInfo.getAttribute3());
					pstIn.setString(10, qualityInfo.getAttribute4());
					pstIn.setString(11, qualityInfo.getAttribute5());
					pstIn.setString(12, qualityInfo.getAttribute6());
					pstIn.setString(13, qualityInfo.getAttribute7());
					pstIn.setString(14, qualityInfo.getAttribute8());
					pstIn.setString(15, qualityInfo.getAttribute9());
					pstIn.setString(16, qualityInfo.getAttribute10());
					pstIn.setString(17, qualityInfo.getCreateDate());
					pstIn.setString(18, "Y");
					pstIn.addBatch();
					pstIn.executeBatch();
					conn.commit();
					pstIn.clearBatch();

					qualityInfoIds = qualityInfoIds + "," + qualityInfo.getQualityInfoId();
				}
			}

			this.updateFlag(qualityInfoIds.substring(0, (qualityInfoIds.length() - 1)));
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
			flag = e.getMessage();
			LogUtil.writeToTxt(LogUtil.IMSXML, "ims", flag);
		} finally {
			JdbcConnection.close(conn, pst, rss);
			JdbcConnection.close(null, pstIn, null);
		}

		return flag;
	}

    public static void client(String param) {

    }
}