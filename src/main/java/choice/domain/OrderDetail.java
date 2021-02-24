package choice.domain;

/**
 * @author mz
 */
public class OrderDetail {

    /**
     *  物料名称
     */
    private String materialName;
    /**
     *  物料类型 0400-钢铁
     */
    private String categoryId;
    private String freightPrice;
    private String freightFee;
    private String damage;
    private String damageType;
    /**
     *  承运量
     */
    private String amount;
    /**
     *  单位名称
     */
    private String unit;
    /**
     *  货物单价
     */
    private String unitPrice;


    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getFreightPrice() {
        return freightPrice;
    }

    public void setFreightPrice(String freightPrice) {
        this.freightPrice = freightPrice;
    }

    public String getFreightFee() {
        return freightFee;
    }

    public void setFreightFee(String freightFee) {
        this.freightFee = freightFee;
    }

    public String getDamage() {
        return damage;
    }

    public void setDamage(String damage) {
        this.damage = damage;
    }

    public String getDamageType() {
        return damageType;
    }

    public void setDamageType(String damageType) {
        this.damageType = damageType;
    }
}