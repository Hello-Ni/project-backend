import java.lang.Math;

public class CalculateLoc {
    public static void main(String[] args) {
        // System.out.println(getDistance(120.196628, 23.0012761, 120.209288,
        // 22.9984748));
        getRect(22.998115827971024, 120.20267933582016);
    }

    public static void getRect(double Lat, double lng) {
        double r = 6371;
        double dis = 0.5;// 0.5km
        double dlng = 2 * Math.asin(Math.sin(dis / (2 * r)) / Math.cos(Lat * Math.PI / 180));
        dlng = dlng * 180 / Math.PI;// 角度轉為弧度
        double dlat = dis / r;
        dlat = dlat * 180 / Math.PI;
        double left = lng - dlng;
        double right = lng + dlng;
        double top = Lat + dlat;
        double btm = Lat - dlat;
        System.out.println(left + " " + right + " " + top + " " + btm);

    }

    public static double getDistance(double LonA, double LatA, double LonB, double LatB) {
        double MLonA = LonA;
        double MLatA = LatA;
        double MLonB = LonB;
        double MLatB = LatB;
        double R = 6371.004;
        double C = Math.sin(rad(LatA)) * Math.sin(rad(LatB))
                + Math.cos(rad(LatA)) * Math.cos(rad(LatB)) * Math.cos(rad(MLonA - MLonB));
        return (R * Math.acos(C));
    }

    private static double rad(double d) {
        return d * Math.PI / 180.0;
    }
}
