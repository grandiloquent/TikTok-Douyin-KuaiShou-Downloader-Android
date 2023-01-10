
package cn.kpkpkp;


import java.io.File;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.os.Build.VERSION_CODES;


@TargetApi(VERSION_CODES.KITKAT)
class ContextCompat {
    static File[] getExternalFilesDirs(Context context, String type) {
        if (Build.VERSION.SDK_INT >= 19) {
            return context.getExternalFilesDirs(type);
        } else {
            return new File[] { context.getExternalFilesDir(type) };
        }
    }

    static File[] getExternalCacheDirs(Context context) {
        if (Build.VERSION.SDK_INT >= 19) {
            return context.getExternalCacheDirs();
        } else {
            return new File[] { context.getExternalCacheDir() };
        }
    }
}
