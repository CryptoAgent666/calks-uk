# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Preserve line numbers so Play can deobfuscate stack traces with mapping.txt.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# @capgo/capacitor-updater ships these in android/proguard-rules.pro but not as
# consumer rules, so the app has to carry them (autoSplashscreen uses reflection).
-keepattributes *Annotation*, Signature
-keep class ee.forgr.capacitor_updater.** { *; }
-keep class com.getcapacitor.Bridge {
    com.getcapacitor.MessageHandler msgHandler;
}
-keep class com.getcapacitor.MessageHandler { *; }
-keep class com.getcapacitor.PluginCall {
    <init>(com.getcapacitor.MessageHandler, java.lang.String, java.lang.String, java.lang.String, com.getcapacitor.JSObject);
}
-keep class * implements com.getcapacitor.PluginHandle {
    public void invoke(java.lang.String, com.getcapacitor.PluginCall);
}
# Capgo reaches androidx.webkit reflectively (document-start stats script).
-keep class androidx.webkit.WebViewFeature {
    public static final java.lang.String DOCUMENT_START_SCRIPT;
    public static boolean isFeatureSupported(java.lang.String);
}
-keep class androidx.webkit.WebViewCompat {
    public static ** addDocumentStartJavaScript(android.webkit.WebView, java.lang.String, java.util.Set);
}
