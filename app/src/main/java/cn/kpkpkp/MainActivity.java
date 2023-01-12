package cn.kpkpkp;

import android.Manifest.permission;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ClipData;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy.Type;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.zip.GZIPInputStream;

public class MainActivity extends Activity {
    public static final int ITEM_ID_REFRESH = 1;
    public static final String KEY_DIRECTORY = "key_directory";
    public static final String KEY_PORT = "key_port";

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
        mWebView.addJavascriptInterface(new WebAppInterface(this), "NativeAndroid");
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
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case ITEM_ID_REFRESH:
                refresh();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
