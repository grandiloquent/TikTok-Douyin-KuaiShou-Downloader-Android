package cn.kpkpkp;

import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.inputmethodservice.InputMethodService;
import android.inputmethodservice.Keyboard;
import android.inputmethodservice.KeyboardView;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.InputConnection;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

import cn.kpkpkp.R;
import cn.kpkpkp.Shared;


// InputServiceHelper
public class InputService extends InputMethodService implements KeyboardView.OnKeyboardActionListener {

    private KeyboardView kv;
    private Keyboard keyboard;
    private String mCurrentString = "";

    private boolean caps = false;
    private final Pattern mChinese = Pattern.compile("[\\u4e00-\\u9fa5]");



    private Database mDatabase;


    @Override
    public void onCreate() {
        super.onCreate();
        ClipboardManager clipboardManager = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
        clipboardManager.addPrimaryClipChangedListener(() -> {
            ClipData clipData = clipboardManager.getPrimaryClip();
            if (clipData == null) return;
            if (clipData.getItemCount() > 0) {
                CharSequence charSequence = clipData.getItemAt(0).getText();
                if (charSequence == null || mCurrentString.equals(charSequence.toString())) {
                    return;
                }
                mCurrentString = charSequence.toString();
                if (mCurrentString.startsWith("http://") || mCurrentString.startsWith("https://"))
                {

                }
            }
        });

    }

    @Override
    public View onCreateInputView() {
        kv = (KeyboardView) getLayoutInflater().inflate(R.layout.keyboard, null);
        keyboard = new Keyboard(this, R.xml.qwerty);
        // keyboard_sym = new Keyboard(this, R.xml.symbol);
        kv.setKeyboard(keyboard);
        kv.setOnKeyboardActionListener(this);
        return kv;
    }


    @Override
    public void onKey(int primaryCode, int[] keyCodes) {
        InputConnection ic = getCurrentInputConnection();
        switch (primaryCode) {
            case Keyboard.KEYCODE_DELETE:
                ic.deleteSurroundingText(1, 0);
                break;
//            case Keyboard.KEYCODE_SHIFT:
//                caps = !caps;
//                keyboard.setShifted(caps);
//                kv.invalidateAllKeys();
//                break;
//            case Keyboard.KEYCODE_DONE:
//                ic.sendKeyEvent(new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER));
//                break;
//            case 1000: {
//                // kv.setKeyboard(keyboard_sym);
//                break;
//            }
//            case 1001: {
//                //  kv.setKeyboard(keyboard);
//                break;
//            }
//            default:
//                char code = (char) primaryCode;
//                if (Character.isLetter(code) && caps) {
//                    code = Character.toUpperCase(code);
//                }
//                ic.commitText(String.valueOf(code), 1);
        }

    }

    @Override
    public void onPress(int primaryCode) {
        Log.e("SimpleKeyboard", "Hello3 " + primaryCode);

    }

    @Override
    public void onRelease(int primaryCode) {
    }

    @Override
    public void onText(CharSequence text) {
        Log.e("SimpleKeyboard", "Hello2 " + text);
    }

    @Override
    public void swipeDown() {
    }

    @Override
    public void swipeLeft() {
    }

    @Override
    public void swipeRight() {
    }

    @Override
    public void swipeUp() {
    }

    public static class Database extends SQLiteOpenHelper {

        public Database(Context context, String name) {
            super(context, name, null, 1);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL("create table if not exists words (_id integer primary key,word text unique, en text, create_at integer)");
        }

        public String query(String word) {
            Cursor cursor = getReadableDatabase().rawQuery("select en from words where word = ? limit 1", new String[]{word});
            String result = null;
            if (cursor.moveToNext()) {
                result = cursor.getString(0);
            }
            cursor.close();
            return result;
        }

        public void insert(String word, String en) {
            ContentValues values = new ContentValues();
            values.put("word", word);
            values.put("en", en);
            values.put("create_at", System.currentTimeMillis());
            getWritableDatabase().insert("words", null, values);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        }
    }
}
