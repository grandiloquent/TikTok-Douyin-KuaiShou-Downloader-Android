package cn.kpkpkp;

import android.app.DownloadManager;
import android.app.DownloadManager.Request;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.webkit.JavascriptInterface;

import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;

public class WebAppInterface {

    private MainActivity mContext;

    public WebAppInterface(MainActivity context) {
        mContext = context;
    }

    public void check(String uri) {
        try {
            HttpURLConnection c = (HttpURLConnection) new URL(uri).openConnection();
            c.addRequestProperty("User-Agent",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36");
            c.addRequestProperty("Referer", "https://www.ixigua.com/embed/?group_id=7187727505476977210&autoplay=0&wid_try=1");
            c.addRequestProperty("Cookie", "MONITOR_WEB_ID=08ba8ce2-7ae9-4ca7-b286-768b36bb67bb; ttwid=1%7C4Sq4ClTk2TuXZrHMYMak2LaZIKO4AfMX6UQ1Bt071zg%7C1614514848%7C163163a1f5ccaec792b69a9525fb9c1e993f07db8963d4e5a515711478920169; ixigua-a-s=0; SEARCH_CARD_MODE=6934288451864888839_1");
            Log.e("B5aOx2", String.format("check, %s", c.getResponseCode()));
        } catch (Exception e) {
        }
    }

    @JavascriptInterface
    public void downloadFile(String fileName, String uri) {
        new Thread(() -> {
            check(uri);
        }).start();
        try {
            DownloadManager dm = (DownloadManager) mContext
                    .getSystemService(Context.DOWNLOAD_SERVICE);
            Request request = new Request(Uri.parse(uri));
//            request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI | DownloadManager.Request.NETWORK_MOBILE)
//                    .setAllowedOverRoaming(false)
//                    .setTitle(fileName)
//                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_ONLY_COMPLETION)
//                    .setVisibleInDownloadsUi(false);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
            dm.enqueue(request);
        } catch (Exception ignored) {
            Log.e("B5aOx2", String.format("downloadFile, %s", ignored.getMessage()));
        }

    }

    @JavascriptInterface
    public String readText() {
        ClipboardManager clipboard = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clipData = clipboard.getPrimaryClip();
        if (clipData.getItemCount() > 0) {
            CharSequence sequence = clipboard.getPrimaryClip().getItemAt(0).getText();
            if (sequence != null)
                return sequence.toString();
        }
        return null;
    }

    @JavascriptInterface
    public void writeText(String text) {
        ClipboardManager clipboard = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("demo", text);
        clipboard.setPrimaryClip(clip);
    }

    @JavascriptInterface
    public void share(String path) {
        try {
            mContext.startActivity(Shared.buildSharedIntent(mContext, new File(path)));
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public void refreshThumbnails() {
        Thread thread = mContext.generateVideoThumbnails();
        thread.start();
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}