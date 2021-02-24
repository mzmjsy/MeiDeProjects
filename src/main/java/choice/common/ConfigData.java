package choice.common;

/**
 * @author mz
 */
public class ConfigData {
    private static final ResourceMap RM = new ResourceMap(ItemPath.getItemPath() + "config");
    /**
     * 接口URL
     */
    public static String HTTP_URL = RM.getString("httpUrl");
    /**
     * 加密公钥
     */
    public static String PUBLICK_KEY = RM.getString("publicKey");
    /**
     * 玫德登录平台总账户
     */
    public static String MD = RM.getString("md");
    /**
     * 庚辰登录平台总账户
     */
    public static String GC = RM.getString("gc");
    /**
     * 车牌号颜色
     */
    public static String TRUCKPLATECOLOR = RM.getString("truckPlateColor");
    /**
     * 物料类型
     */
    public static String CATEGORYID = RM.getString("categoryId");
    /**
     * 单位名称
     */
    public static String UNIT = RM.getString("unit");
    /**
     * 货源类型
     */
    public static String CARGOTYPE = RM.getString("cargoType");
    /**
     * 货损类型 1-吨,2-千分比
     */
    public static String DAMAGETYPE = RM.getString("damageType");
    /**
     * 货损量
     */
    public static String DAMAGE = RM.getString("damage");
}