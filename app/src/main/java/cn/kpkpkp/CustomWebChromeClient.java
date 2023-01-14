package cn.kpkpkp;

import android.content.pm.ActivityInfo;
import android.util.Log;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.widget.FrameLayout;


public class CustomWebChromeClient extends WebChromeClient {
    private MainActivity mMainActivity;
    private View mCustomView;
    private WebChromeClient.CustomViewCallback mCustomViewCallback;
    protected FrameLayout mFullscreenContainer;
    private int mOriginalOrientation;
    private int mOriginalSystemUiVisibility;

    public CustomWebChromeClient(MainActivity mainActivity) {
        mMainActivity = mainActivity;
    }

    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        //Log.e("B5aOx2", String.format("onConsoleMessage, %s\n%s", consoleMessage.message(), consoleMessage.lineNumber()));
        return super.onConsoleMessage(consoleMessage);
    }

    public void onHideCustomView() {
        ((FrameLayout) mMainActivity.getWindow().getDecorView()).removeView(this.mCustomView);
        this.mCustomView = null;
        mMainActivity.getWindow().getDecorView().setSystemUiVisibility(this.mOriginalSystemUiVisibility);
        mMainActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        this.mCustomViewCallback.onCustomViewHidden();
        this.mCustomViewCallback = null;
    }

    @Override
    public void onShowCustomView(View paramView, CustomViewCallback paramCustomViewCallback) {
        if (this.mCustomView != null) {
            onHideCustomView();
            return;
        }
        this.mCustomView = paramView;
        this.mOriginalSystemUiVisibility = mMainActivity.getWindow().getDecorView().getSystemUiVisibility();
        this.mOriginalOrientation = mMainActivity.getRequestedOrientation();
        this.mCustomViewCallback = paramCustomViewCallback;
        ((FrameLayout) mMainActivity.getWindow().getDecorView()).addView(this.mCustomView, new FrameLayout.LayoutParams(-1, -1));
        mMainActivity.getWindow().getDecorView().setSystemUiVisibility(3846 | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        mMainActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

    }


}