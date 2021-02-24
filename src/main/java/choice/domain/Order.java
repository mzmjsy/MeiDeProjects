package choice.domain;

import com.alibaba.fastjson.JSONObject;

/**
 * @author mz
 */
public class Order {
    private OrderDetail orderDetail;
    /**
     * IMS推送单据ID
     */
    private String dstDeliveryId;
    /**
     * 推送平台后返回的平台ID
     */
    private String transId;
    /**
     *  计划发货日期
     */
    private String planDeliveryDate;
    /**
     *  客户名称
     */
    private String customerName;
    /**
     *  IMS发货单号
     */
    private String deliveryCode;
    /**
     *  IMS发货总重量
     */
    private String netWeight;
    /**
     *  平台处理运单后返回的状态：1-待审核，2-审核通过，3-审核不通过，4-退回
     */
    private String flag;
    /**
     *  货物单价
     */
    private String unitPrice;
    /**
     *  IMS推送单据信息ID
     */
    private String dstOrderInfoId;
    /**
     *  装车时间接收
     */
    private String loadingTimeArr;
    /**
     *  卸车时间接收
     */
    private String unloadTimeArr;
    /**
     *  发货方名称（货主）
     */
    private String shipment;
    /**
     *  货源类型 1-整车，2-零担
     */
    private String cargoType;
    private String startProvinceName;
    private String startProvinceCode;
    private String startCityName;
    private String startCityCode;
    private String startCountyName;
    private String startCountyCode;
    private String startAddressDetail;
    private String endProvinceName;
    private String endProvinceCode;
    private String endCityName;
    private String endCityCode;
    private String endCountyName;
    private String endCountyCode;
    private String endAddressDetail;
    /**
     *  装车费
     */
    private String loadingFee;
    /**
     *  卸车费
     */
    private String unloadFee;
    /**
     *  安装费（零担）
     */
    private String installFee;
    /**
     *  代收运费（零担）
     */
    private String replaceFreightFee;
    /**
     *  代收手续费（零担）
     */
    private String replaceServiceFee;
    private String otherFee;
    private String freightTotalFee;
    private String dispatchingType;
    private String startTime;
    private String endTime;
    private String loadingComplexity;
    private String unloadComplexity;
    private String remark;
    private String deliveryName;
    private String deliveryMobile;
    private String receiptName;
    private String receiptMobile;
    private String transportRule;
    private String transportMode;
    private String childNum;
    private String receiveCode;
    private String freightFee;
    private String freightPrice;

    public OrderDetail getOrderDetail() {
        return orderDetail;
    }

    public void setOrderDetail(OrderDetail orderDetail) {
        this.orderDetail = orderDetail;
    }

    public String getDstDeliveryId() {
        return dstDeliveryId;
    }

    public void setDstDeliveryId(String dstDeliveryId) {
        this.dstDeliveryId = dstDeliveryId;
    }

    public String getTransId() {
        return transId;
    }

    public void setTransId(String transId) {
        this.transId = transId;
    }

    public String getPlanDeliveryDate() {
        return planDeliveryDate;
    }

    public void setPlanDeliveryDate(String planDeliveryDate) {
        this.planDeliveryDate = planDeliveryDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDeliveryCode() {
        return deliveryCode;
    }

    public void setDeliveryCode(String deliveryCode) {
        this.deliveryCode = deliveryCode;
    }

    public String getNetWeight() {
        return netWeight;
    }

    public void setNetWeight(String netWeight) {
        this.netWeight = netWeight;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getDstOrderInfoId() {
        return dstOrderInfoId;
    }

    public void setDstOrderInfoId(String dstOrderInfoId) {
        this.dstOrderInfoId = dstOrderInfoId;
    }

    public String getLoadingTimeArr() {
        return loadingTimeArr;
    }

    public void setLoadingTimeArr(String loadingTimeArr) {
        this.loadingTimeArr = loadingTimeArr;
    }

    public String getUnloadTimeArr() {
        return unloadTimeArr;
    }

    public void setUnloadTimeArr(String unloadTimeArr) {
        this.unloadTimeArr = unloadTimeArr;
    }

    public String getShipment() {
        return shipment;
    }

    public void setShipment(String shipment) {
        this.shipment = shipment;
    }

    public String getCargoType() {
        return cargoType;
    }

    public void setCargoType(String cargoType) {
        this.cargoType = cargoType;
    }

    public String getStartProvinceName() {
        return startProvinceName;
    }

    public void setStartProvinceName(String startProvinceName) {
        this.startProvinceName = startProvinceName;
    }

    public String getStartProvinceCode() {
        return startProvinceCode;
    }

    public void setStartProvinceCode(String startProvinceCode) {
        this.startProvinceCode = startProvinceCode;
    }

    public String getStartCityName() {
        return startCityName;
    }

    public void setStartCityName(String startCityName) {
        this.startCityName = startCityName;
    }

    public String getStartCityCode() {
        return startCityCode;
    }

    public void setStartCityCode(String startCityCode) {
        this.startCityCode = startCityCode;
    }

    public String getStartCountyName() {
        return startCountyName;
    }

    public void setStartCountyName(String startCountyName) {
        this.startCountyName = startCountyName;
    }

    public String getStartCountyCode() {
        return startCountyCode;
    }

    public void setStartCountyCode(String startCountyCode) {
        this.startCountyCode = startCountyCode;
    }

    public String getStartAddressDetail() {
        return startAddressDetail;
    }

    public void setStartAddressDetail(String startAddressDetail) {
        this.startAddressDetail = startAddressDetail;
    }

    public String getEndProvinceName() {
        return endProvinceName;
    }

    public void setEndProvinceName(String endProvinceName) {
        this.endProvinceName = endProvinceName;
    }

    public String getEndProvinceCode() {
        return endProvinceCode;
    }

    public void setEndProvinceCode(String endProvinceCode) {
        this.endProvinceCode = endProvinceCode;
    }

    public String getEndCityName() {
        return endCityName;
    }

    public void setEndCityName(String endCityName) {
        this.endCityName = endCityName;
    }

    public String getEndCityCode() {
        return endCityCode;
    }

    public void setEndCityCode(String endCityCode) {
        this.endCityCode = endCityCode;
    }

    public String getEndCountyName() {
        return endCountyName;
    }

    public void setEndCountyName(String endCountyName) {
        this.endCountyName = endCountyName;
    }

    public String getEndCountyCode() {
        return endCountyCode;
    }

    public void setEndCountyCode(String endCountyCode) {
        this.endCountyCode = endCountyCode;
    }

    public String getEndAddressDetail() {
        return endAddressDetail;
    }

    public void setEndAddressDetail(String endAddressDetail) {
        this.endAddressDetail = endAddressDetail;
    }

    public String getLoadingFee() {
        return loadingFee;
    }

    public void setLoadingFee(String loadingFee) {
        this.loadingFee = loadingFee;
    }

    public String getUnloadFee() {
        return unloadFee;
    }

    public void setUnloadFee(String unloadFee) {
        this.unloadFee = unloadFee;
    }

    public String getInstallFee() {
        return installFee;
    }

    public void setInstallFee(String installFee) {
        this.installFee = installFee;
    }

    public String getReplaceFreightFee() {
        return replaceFreightFee;
    }

    public void setReplaceFreightFee(String replaceFreightFee) {
        this.replaceFreightFee = replaceFreightFee;
    }

    public String getReplaceServiceFee() {
        return replaceServiceFee;
    }

    public void setReplaceServiceFee(String replaceServiceFee) {
        this.replaceServiceFee = replaceServiceFee;
    }

    public String getOtherFee() {
        return otherFee;
    }

    public void setOtherFee(String otherFee) {
        this.otherFee = otherFee;
    }

    public String getFreightTotalFee() {
        return freightTotalFee;
    }

    public void setFreightTotalFee(String freightTotalFee) {
        this.freightTotalFee = freightTotalFee;
    }

    public String getDispatchingType() {
        return dispatchingType;
    }

    public void setDispatchingType(String dispatchingType) {
        this.dispatchingType = dispatchingType;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getLoadingComplexity() {
        return loadingComplexity;
    }

    public void setLoadingComplexity(String loadingComplexity) {
        this.loadingComplexity = loadingComplexity;
    }

    public String getUnloadComplexity() {
        return unloadComplexity;
    }

    public void setUnloadComplexity(String unloadComplexity) {
        this.unloadComplexity = unloadComplexity;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getDeliveryName() {
        return deliveryName;
    }

    public void setDeliveryName(String deliveryName) {
        this.deliveryName = deliveryName;
    }

    public String getDeliveryMobile() {
        return deliveryMobile;
    }

    public void setDeliveryMobile(String deliveryMobile) {
        this.deliveryMobile = deliveryMobile;
    }

    public String getReceiptName() {
        return receiptName;
    }

    public void setReceiptName(String receiptName) {
        this.receiptName = receiptName;
    }

    public String getReceiptMobile() {
        return receiptMobile;
    }

    public void setReceiptMobile(String receiptMobile) {
        this.receiptMobile = receiptMobile;
    }

    public String getTransportRule() {
        return transportRule;
    }

    public void setTransportRule(String transportRule) {
        this.transportRule = transportRule;
    }

    public String getTransportMode() {
        return transportMode;
    }

    public void setTransportMode(String transportMode) {
        this.transportMode = transportMode;
    }

    public String getChildNum() {
        return childNum;
    }

    public void setChildNum(String childNum) {
        this.childNum = childNum;
    }

    public String getReceiveCode() {
        return receiveCode;
    }

    public void setReceiveCode(String receiveCode) {
        this.receiveCode = receiveCode;
    }

    public String getFreightFee() {
        return freightFee;
    }

    public void setFreightFee(String freightFee) {
        this.freightFee = freightFee;
    }

    public String getFreightPrice() {
        return freightPrice;
    }

    public void setFreightPrice(String freightPrice) {
        this.freightPrice = freightPrice;
    }
}