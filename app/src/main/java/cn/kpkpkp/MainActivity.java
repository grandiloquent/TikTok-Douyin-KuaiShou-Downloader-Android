package cn.kpkpkp;

import android.Manifest.permission;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class MainActivity extends Activity {
    public static final String KEY_PORT = "key_port";

    static {
        System.loadLibrary("nativelib");
    }

    public native static boolean startServer(
            Context context,
            String ip, int port, String directory);

    WebView mWebView;

    private void initializeWebView() {
        mWebView = new WebView(this);
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        setContentView(mWebView);
    }

    private void initialize() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        int port = preferences.getInt(KEY_PORT, 10808);
        String tempHost = Shared.getDeviceIP(this);
        String host = tempHost == null ? "0.0.0.0" : tempHost;
        initializeWebView();
        new Thread(() -> {
            runOnUiThread(() -> {
                mWebView.loadUrl("http://" + host + ":" + port);
            });
            startServer(this, host, port,
                    getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath());

        }).start();
        Log.e("B5aOx2", String.format("initialize, %s", "http://" + host + ":" + port));

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
            requestPermissions(needPermissions.toArray(new String[0]), 1);
            return;
        }
        initialize();
    }
}