package cn.kpkpkp;

import android.Manifest.permission;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.DownloadManager;
import android.app.DownloadManager.Request;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.hardware.biometrics.BiometricManager.Strings;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.json.JSONArray;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


public class MainActivity extends Activity {
    public static final int ITEM_ID_REFRESH = 1;
    public static final String KEY_DIRECTORY = "key_directory";
    public static final String KEY_KUAISHOU_COOKIE = "key_kuaishou_cookie";
    public static final String KEY_PORT = "key_port";
    public static final String KEY_TOUTIAO_COOKIE = "key_toutiao_cookie";
    public static final String KEY_XVIDEOS_COOKIE = "key_xvideos_cookie";

    public static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36";
    private static final int ITEM_ID_OPEN = 2;


    WebView mWebView;

    SharedPreferences mSharedPreferences;

    public Thread generateVideoThumbnails() {
        return new Thread(() -> {
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
        });
    }


    public void setString(String key, String value) {
        mSharedPreferences.edit().putString(key, value).apply();
    }

    private void initialize() {
        mSharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        if (mSharedPreferences.getString(KEY_DIRECTORY, null) == null) {
            mSharedPreferences.edit().putString(KEY_DIRECTORY, getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath()).apply();
        }
//        if (Shared.isDeviceRooted()) {
//            Shared.requestRoot();
//        }
        generateVideoThumbnails().start();
        startServer();
        new Thread(this::triggerMediaScan).start();
    }

    private void triggerMediaScan() {
        if (VERSION.SDK_INT >= VERSION_CODES.R) {
            if (!Environment.isExternalStorageManager()) {
                try {
                    Uri uri = Uri.parse("package:" + BuildConfig.APPLICATION_ID);
                    Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, uri);
                    startActivity(intent);
                } catch (Exception ex) {
                    Intent intent = new Intent();
                    intent.setAction(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
                    startActivity(intent);
                }
            }
        }
        if (VERSION.SDK_INT >= VERSION_CODES.O) {
            try {
                Files.list(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).toPath())
                        .filter(x -> Files.isRegularFile(x))
                        .forEach(x -> {
                            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                            Uri contentUri = Uri.fromFile(x.toFile()); // out is your output file
                            mediaScanIntent.setData(contentUri);
                            this.sendBroadcast(mediaScanIntent);
                        });
            } catch (IOException e) {
            }
        }
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

    private void open() {
        CharSequence strings = Shared.getText(this);
        if (strings == null) return;
        List<String> patterns = new ArrayList<>();
        // Pattern pattern=Pattern.compile("https://m.toutiao.com/is/[^/]+/");
        patterns.add("https://m.toutiao.com/is/[^/]+/");
        patterns.add("https://v.kuaishou.com/[^ ]+");
        patterns.add("https://www.xvideos.com/[^ ]+");
        String url = Shared.matches(strings.toString(), patterns);
        if (url == null) return;
        mWebView.loadUrl(url);
    }

    private void refresh() {
        mWebView.clearCache(true);
        mWebView.reload();
    }

    private void startServer() {
        int port = mSharedPreferences.getInt(KEY_PORT, 10808);
        String tempHost = Shared.getDeviceIP(this);
        String host = tempHost == null ? "0.0.0.0" : tempHost;
        initializeWebView();
        mWebView.loadUrl("http://" + host + ":" + port);
        Intent intent = new Intent(this, ServerService.class);
        startService(intent);
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
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, ITEM_ID_REFRESH, 0, R.string.refresh);
        menu.add(0, ITEM_ID_OPEN, 0, R.string.open);
        menu.add(0, 3, 0, "复制");
        menu.add(0, 4, 0, "下载");
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
            case 3:
                Shared.setText(this, mWebView.getUrl());
                break;
            case 4:
                downloadFolder(Shared.getText(this).toString());
                break;

        }
        return super.onOptionsItemSelected(item);
    }

    public static File getFileName(String uri) {
        String path = Uri.parse(uri).getQueryParameter("path");
        String[] parts = path.split("\\\\");
        path = parts[parts.length - 2];
        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), path);
        if (!dir.exists()) {
            dir.mkdir();
        }
        return new File(dir, parts[parts.length - 1]);
    }

    public static void downloadFile(String uri) {
        try {
            File f = getFileName(uri);
            URL u = new URL(uri);
            HttpURLConnection c = (HttpURLConnection) u.openConnection();
//                c.getHeaderFields().forEach((k, v) -> {
//                    Log.e("", String.format("downloadFolder, %s,%s", k, v.stream().collect(Collectors.joining(";"))));
//                });
            if (f.exists() && f.length() < c.getContentLength()) {
                f.delete();
            }
            if (!f.exists() && VERSION.SDK_INT >= VERSION_CODES.O) {
                Files.copy(c.getInputStream(), f.toPath());
            }
        } catch (Exception e) {
        }
    }

    private void downloadFolder(String uri) {
        new Thread(() -> {
            String path = Uri.parse(uri).getQueryParameter("path");
            Log.e("B5aOx2", String.format("downloadFolder, %s", path));
            try {
                URL u = new URL("http://192.168.8.189:8080/api/files?path=" + Uri.encode(path));
                HttpURLConnection c = (HttpURLConnection) u.openConnection();
                JSONArray jsonArray = new JSONArray(new BufferedReader(new InputStreamReader(c.getInputStream()))
                        .lines().collect(Collectors.joining("\n")));
                for (int i = 0; i < jsonArray.length(); i++) {
                    if (!jsonArray.getJSONObject(i).getBoolean("isDirectory")) {
                        String filePath = jsonArray.getJSONObject(i).getString("path");
                        downloadFile("http://192.168.8.189:8080/api/file?path=" + Uri.encode(filePath));
                    }
                }
            } catch (Exception e) {
            }
        }).start();
    }
}