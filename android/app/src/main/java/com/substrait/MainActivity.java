package com.substrait;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.Editable;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.substrait.databinding.ActivityMainBinding;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

     binding = ActivityMainBinding.inflate(getLayoutInflater());
     setContentView(binding.getRoot());

        BottomNavigationView navView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.navigation_home, R.id.navigation_dashboard, R.id.navigation_notifications)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_main);
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(binding.navView, navController);


        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                /*
                Snackbar.make(view, "Here's a Snackbar", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();

                 */
                AlertDialog.Builder alert = new AlertDialog.Builder(MainActivity.this);
                alert.setTitle(R.string.addurl_prompt);
                EditText input = new EditText(getApplicationContext());
                input.setTextColor(getResources().getColor(R.color.white));
                input.setHint(R.string.addurl_hint);

                input.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                    @Override
                    public void onFocusChange(View v, boolean hasFocus) {
                        input.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                InputMethodManager inputMethodManager= (InputMethodManager) MainActivity.this.getSystemService(Context.INPUT_METHOD_SERVICE);
                                inputMethodManager.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT);
                            }
                        }, 100);
                    }
                });
                input.requestFocus();

                alert.setView(input);
                alert.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    //@Override
                    public void onClick(DialogInterface dialog, int which) {
                        // EditText input = (EditText) dialog.findViewById("myInput");
                        Editable value = input.getText();
                        String out = value.toString();
                        Log.d("dfsdf", out);
                        new JsonTask().execute(out);
                    }
                });
                alert.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {

                    public void onClick(DialogInterface dialog, int which) {

                    }
                });
                alert.show();

            }
        });

    }

    private class JsonTask extends AsyncTask<String, String, String> {

        protected void onPreExecute() {
            super.onPreExecute();

        }

        protected String doInBackground(String... params) {

            HttpURLConnection connection = null;
            BufferedReader reader = null;
            try {
                URL url = new URL(params[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.connect();


                InputStream stream = connection.getInputStream();

                reader = new BufferedReader(new InputStreamReader(stream));

                StringBuffer buffer = new StringBuffer();
                String line = "";

                while ((line = reader.readLine()) != null) {
                    buffer.append(line+"\n");
                    Log.d("Response: ", "> " + line);   //here u ll get whole response...... :-)

                }

                String jsonString = buffer.toString();
                Log.d("sadfasdf", jsonString);

                return jsonString;

            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
                try {
                    if (reader != null) {
                        reader.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            return null;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            Log.d("asdfsdf", result);


            JSONObject jsonObject = null;
            try {
                jsonObject = new JSONObject(result);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            Log.d("sadfasdf", jsonObject.toString());

            // convert the JSON object into a real java object
            ULApp theApp = new ULApp();

            try {

                theApp.name.bundle = (jsonObject.getJSONObject("name")).getString("bundle");
                theApp.name.display = (jsonObject.getJSONObject("name")).getString("display");
                theApp.author = jsonObject.getString("author");
                theApp.version = jsonObject.getString("version");

                JSONArray modules = jsonObject.getJSONArray("modules");
                theApp.modules = new ULModule[modules.length()];

                for (int i = 0; i < modules.length(); i++) {

                    theApp.modules[i] = new ULModule();

                    theApp.modules[i].name = modules.getJSONObject(i).getString("name");

                    JSONArray videos = modules.getJSONObject(i).getJSONArray("videos");
                    theApp.modules[i].videos = new ULVideo[videos.length()];

                    for (int j = 0; j < videos.length(); j++) {

                        theApp.modules[i].videos[j] = new ULVideo();

                        theApp.modules[i].videos[j].name = videos.getJSONObject(j).getString("name");
                        theApp.modules[i].videos[j].source = videos.getJSONObject(j).getString("source");

                    }

                }

                Log.d("dsafsdf", theApp.toString());

            } catch (JSONException e) {
                e.printStackTrace();
            }

        }

    }

    public class ULApp {

        public ULApp() {

            name = new ULAppName();

        }

        public ULAppName name;
        public String author;
        public String version;
        public ULModule[ ] modules;

        public class ULAppName {
            public String bundle;
            public String display;
        }

    }

    public class ULModule {

        public ULModule() {

        }
        public String name;
        public ULVideo[ ] videos;

    }

    public class ULVideo {

        public ULVideo() {

        }

        public String name;
        public String source;
    }
}
