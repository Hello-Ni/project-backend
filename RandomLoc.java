import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.util.Random;

public class RandomLoc {
    public static void main(String[] args) {

        randomLonLat(120.1236537811584, 120.54355740408135, 22.938130677113588, 23.33482567148375);
    }

    public static void randomLonLat(double MinLon, double MaxLon, double MinLat, double MaxLat) {
        File file = new File("./public/location3.json");
        int num = 100000;
        try {
            if (!file.exists())
                file.createNewFile();
        } catch (Exception e) {
            // TODO: handle exception
        }
        try {
            FileWriter fw = new FileWriter(file);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write("[\n");
            Random random = new Random();
            for (int i = 0; i < num; ++i) {
                BigDecimal db = new BigDecimal(Math.random() * (MaxLon - MinLon) + MinLon);
                String lon = db.setScale(6, BigDecimal.ROUND_HALF_UP).toString();
                db = new BigDecimal(Math.random() * (MaxLat - MinLat) + MinLat);
                String lat = db.setScale(6, BigDecimal.ROUND_HALF_UP).toString();
                if (i == num - 1)
                    bw.write("  { \"lng\": " + lon + ", \"lat\": " + lat + " }\n");
                else
                    bw.write("  { \"lng\": " + lon + ", \"lat\": " + lat + " },\n");
            }
            bw.write("]\n");
            bw.close();
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

}
