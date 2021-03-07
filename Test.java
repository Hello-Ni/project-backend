import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.File;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Hashtable;
import java.util.Random;

public class Test {
    private static double[] d_lon = new double[4];
    private static double[] d_lat = new double[4];
    private static double[] min_lon = { 120.210932963701, 120.25007960515336, 120.19047180397922, 120.1916197152479 };
    private static double[] min_lat = { 22.98982604372313, 23.0033642733271, 23.003946597817745, 22.97173670399503 };
    private static BufferedWriter bw;

    public static void main(String[] args) {
        Location StartP = new Location(23.016915168895718, 120.24472379745201);
        Location EndP = new Location(22.9961948505966, 120.21843858519031);
        CalculationByDistance(StartP, EndP);

        d_lon[0] = 120.23442045462235 - 120.210932963701;
        d_lon[1] = 120.23515629984833 - 120.25007960515336;
        d_lon[2] = 120.20047107913103 - 120.19047180397922;
        d_lon[3] = 120.21984422687223 - 120.1916197152479;
        d_lat[0] = 22.998210246540978 - 22.98982604372313;
        d_lat[1] = 23.021877594528274 - 23.0033642733271;
        d_lat[2] = 23.012044393320124 - 23.003946597817745;
        d_lat[3] = 22.984579865740383 - 22.97173670399503;
        RandomLoc();

    }

    public static double CalculationByDistance(Location StartP, Location EndP) {
        int Radius = 6371;// radius of earth in Km
        double lat1 = StartP.latitude;
        double lat2 = EndP.latitude;
        double lon1 = StartP.longitude;
        double lon2 = EndP.longitude;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.asin(Math.sqrt(a));
        double valueResult = Radius * c;
        double km = valueResult / 1;
        DecimalFormat newFormat = new DecimalFormat("####");
        int kmInDec = Integer.valueOf(newFormat.format(km));
        double meter = valueResult % 1000;
        int meterInDec = Integer.valueOf(newFormat.format(meter));
        System.out.println("Radius Value" + valueResult + "   KM  " + kmInDec + " Meter   " + meterInDec);
        return Radius * c;
    }

    public static void RandomLoc() {
        File file = new File("./data.json");
        try {
            if (!file.exists()) {
                file.createNewFile();
            }
        } catch (Exception e) {
            // TODO: handle exception
        }
        try {
            FileWriter fw = new FileWriter(file);
            bw = new BufferedWriter(fw);
            bw.write("{\n");
            for (int i = 0; i < 4; ++i) {
                bw.write("  \"loc" + Integer.toString(i) + "\"" + ":[\n");
                System.out.println("location" + Integer.toString(i));
                for (int j = 0; j < 3; ++j) {
                    Random random = new Random();
                    BigDecimal db = new BigDecimal(Math.random() * d_lon[i] + min_lon[i]);
                    String lon = db.setScale(6, BigDecimal.ROUND_HALF_UP).toString();
                    db = new BigDecimal(Math.random() * d_lat[i] + min_lat[i]);
                    String lat = db.setScale(6, BigDecimal.ROUND_HALF_UP).toString();
                    String result = "       { \"latitude\":" + lat + "," + "\"lontitude\":" + lon + " },\n";
                    System.out.println(result);
                    bw.write(result);
                }
                bw.write("  ],\n");
            }
            bw.write("}\n");
        } catch (Exception e) {
            // TODO: handle exception
        } finally {
            try {
                if (bw != null)
                    bw.close();

            } catch (Exception e) {
                // TODO: handle exception
            }
        }
    }
}