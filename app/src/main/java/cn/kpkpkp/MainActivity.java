package cn.kpkpkp;

import android.Manifest.permission;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


public class MainActivity extends Activity {
    public static final int ITEM_ID_REFRESH = 1;
    public static final String KEY_DIRECTORY = "key_directory";
    public static final String KEY_PORT = "key_port";
    public static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36";
    private static final int ITEM_ID_OPEN = 2;

    static {
        System.loadLibrary("nativelib");
    }

    WebView mWebView;

    SharedPreferences mSharedPreferences;

    public String getStringValue(String key) {
        return mSharedPreferences.getString(key, "");
    }

    public native static boolean startServer(
            MainActivity context,
            String ip, int port);

    private void initialize() {
        mSharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        if (mSharedPreferences.getString(KEY_DIRECTORY, null) == null) {
            mSharedPreferences.edit().putString(KEY_DIRECTORY, getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath()).apply();
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                File dir = new File(Shared.substringBeforeLast(mSharedPreferences.getString(KEY_DIRECTORY, null), "/Android/"), "" +
                        "Download");
                File parent = new File(dir, ".images");
                if (!parent.exists()) {
                    parent.mkdirs();
                }
                File[] files = dir.listFiles(file -> file.isFile() && file.getName().endsWith(".mp4"));
                for (File file : files) {
                    String output = parent + "/" + Shared.md5(file.getAbsolutePath());
                    if (new File(output).exists()) continue;
                    try {
                        FileOutputStream fileOutputStream = new FileOutputStream(output);
                        Bitmap bitmap = Shared.createVideoThumbnail(file.getAbsolutePath());
                        bitmap.compress(CompressFormat.JPEG, 75, fileOutputStream);
                        bitmap.recycle();
                        fileOutputStream.close();
                    } catch (Exception ignored) {
                    }

                }
            }
        }).start();
        int port = mSharedPreferences.getInt(KEY_PORT, 10808);
        String tempHost = Shared.getDeviceIP(this);
        String host = tempHost == null ? "0.0.0.0" : tempHost;
        initializeWebView();
        new Thread(() -> {
            runOnUiThread(() -> {
                mWebView.loadUrl("http://" + host + ":" + port);
            });
            startServer(this, host, port);

        }).start();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeWebView() {
        mWebView = new WebView(this);
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAppCacheEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(USER_AGENT);
        mWebView.addJavascriptInterface(new WebAppInterface(this), "NativeAndroid");
        mWebView.setWebViewClient(new CustomWebViewClient(this));
        mWebView.setWebChromeClient(new CustomWebChromeClient(this));
        setContentView(mWebView);
    }

    private void refresh() {
        mWebView.clearCache(true);
        mWebView.reload();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        List<String> needPermissions = Arrays.stream(new String[]{
                        permission.INTERNET,
                        permission.ACCESS_WIFI_STATE,
                        permission.READ_EXTERNAL_STORAGE,
                }).filter(permission -> checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED)
                .collect(Collectors.toList());
        if (VERSION.SDK_INT <= 28 && checkSelfPermission(permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            needPermissions.add(permission.WRITE_EXTERNAL_STORAGE);
        } else if (VERSION.SDK_INT >= VERSION_CODES.P && (checkSelfPermission(permission.FOREGROUND_SERVICE) != PackageManager.PERMISSION_GRANTED)) {
            needPermissions.add(permission.FOREGROUND_SERVICE);
        }
        if (needPermissions.size() > 0) {
            requestPermissions(needPermissions.toArray(new String[0]), ITEM_ID_REFRESH);
            return;
        }
        initialize();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, ITEM_ID_REFRESH, 0, R.string.refresh);
        menu.add(0, ITEM_ID_OPEN, 0, R.string.open);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case ITEM_ID_REFRESH:
                refresh();
                break;
            case ITEM_ID_OPEN:
                open();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void open() {
        CharSequence strings = Shared.getText(this);
        if (strings == null) return;
        List<String> patterns = new ArrayList<>();
        // Pattern pattern=Pattern.compile("https://m.toutiao.com/is/[^/]+/");
        patterns.add("https://m.toutiao.com/is/[^/]+/");
        String url = Shared.matches(strings.toString(), patterns);
        if (url == null) return;
        mWebView.loadUrl(url);
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
            return;
        }
        super.onBackPressed();
    }
}
