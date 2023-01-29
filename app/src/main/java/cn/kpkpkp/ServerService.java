package cn.kpkpkp;

import static cn.kpkpkp.MainActivity.KEY_PORT;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Environment;
import android.os.IBinder;
import android.preference.PreferenceManager;

import java.io.File;

public class ServerService extends Service {
    public static final String ACTION_DISMISS = "cn.kpkpkp.ServerService.ACTION_DISMISS";
    private static final String KP_NOTIFICATION_CHANNEL_ID = "kp_notification_channel";
    SharedPreferences mSharedPreferences;
    private String mLogFileName;
    private NotificationChannel mNotificationChannel;

    public native static boolean startServer(
            ServerService context,
            String ip, int port);

    public String getString(String key) {
        return mSharedPreferences.getString(key, "");
    }

    public void setString(String key, String value) {
        mSharedPreferences.edit().putString(key, value).apply();
    }

    @Override
    public IBinder onBind(Intent intent) {

        Shared.log(mLogFileName, "onBind");
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mSharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        mLogFileName = new File(getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS),
                "service.txt").getAbsolutePath();
        Shared.log(mLogFileName, "onCreate");
        createNotificationChannel();

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Shared.log(mLogFileName, "onStartCommand",
                intent == null ? "intent is null" : intent.getAction());
        if (intent != null) {
            String action = intent.getAction();
            if (action != null && action.equals(ACTION_DISMISS)) {
                stopForeground(true);
                stopSelf();
                return START_NOT_STICKY;
            }
        }
        // https://developer.android.com/guide/components/foreground-services
        createNotification();
        startServer();
        return START_STICKY;
    }

    private void createNotification() {
        Notification notification =
                null;
        PendingIntent piDismiss = getPendingIntentDismiss();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notification = new Notification.Builder(this, KP_NOTIFICATION_CHANNEL_ID)
                    .setContentTitle("视频下载器")
                    .setSmallIcon(android.R.drawable.stat_sys_download)
                    .addAction(getAction(piDismiss))
                    .build();
        }
        startForeground(1, notification);
    }

    private PendingIntent getPendingIntentDismiss() {
        Intent dismissIntent = new Intent(this, ServerService.class);
        dismissIntent.setAction(ACTION_DISMISS);
        return PendingIntent.getService(this, 0, dismissIntent, 0);
    }

    private Notification.Action getAction(PendingIntent piDismiss) {
        return new Notification.Action.Builder(null, "关闭", piDismiss).build();
    }

    private void startServer() {
        new Thread(() -> {
            int port = PreferenceManager.getDefaultSharedPreferences(this)
                    .getInt(KEY_PORT, 10808);
            String tempHost = Shared.getDeviceIP(this);
            String host = tempHost == null ? "0.0.0.0" : tempHost;
            startServer(ServerService.this, host, port);
        }).start();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            mNotificationChannel =
                    new NotificationChannel(
                            KP_NOTIFICATION_CHANNEL_ID,
                            "视频下载器",
                            NotificationManager.IMPORTANCE_LOW);
            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE))
                    .createNotificationChannel(mNotificationChannel);
        }
    }

    @Override
    public void onDestroy() {
        Shared.log(mLogFileName, "onDestroy");
        super.onDestroy();
    }


}