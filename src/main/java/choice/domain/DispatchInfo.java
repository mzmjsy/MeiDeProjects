package choice.domain;

/**
 * @author mz
 */
public class DispatchInfo {
    /**
     *  车牌号
     */
    private String truckNo;
    /**
     *  车牌颜色
     */
    private String truckPlateColor;


    public String getTruckNo() {
        return truckNo;
    }

    public void setTruckNo(String truckNo) {
        this.truckNo = truckNo;
    }

    public String getTruckPlateColor() {
        return truckPlateColor;
    }

    public void setTruckPlateColor(String truckPlateColor) {
        this.truckPlateColor = truckPlateColor;
    }
}