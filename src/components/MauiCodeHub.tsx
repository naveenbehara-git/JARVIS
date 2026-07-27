import React, { useState } from "react";
import { Copy, Check, FileCode, BookOpen, Smartphone, ShieldAlert, Cpu } from "lucide-react";
import { MauiFileTemplate } from "../types";

export default function MauiCodeHub() {
  const [framework, setFramework] = useState<"kotlin" | "maui">("kotlin");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const kotlinTemplates: MauiFileTemplate[] = [
    {
      name: "1. Kotlin Setup Guide",
      path: "ReadMe_Kotlin.md",
      language: "markdown",
      description: "Step-by-step guide to creating and installing the JARVIS app in Android Studio using Kotlin.",
      code: `# Native Kotlin Android JARVIS Assistant Setup Guide

Build and install a native Android JARVIS application on your mobile device using **Kotlin** and **Jetpack Compose**.

## Prerequisites
1. **Android Studio** (Ladybug / Jellyfish or higher).
2. Android Device with **Developer Options & USB Debugging** enabled (or Android Emulator).
3. **JDK 17+** (included with Android Studio).

---

## Step 1: Create New Android Studio Project
1. Launch Android Studio and click **New Project**.
2. Select **Empty Activity** (Jetpack Compose) and click Next.
3. Set Project Parameters:
   - **Name**: \`JarvisAssistant\`
   - **Package name**: \`com.stark.jarvis\`
   - **Language**: **Kotlin**
   - **Minimum SDK**: **API 24 (Android 7.0)** or higher.
4. Click **Finish** and let Gradle sync.

---

## Step 2: Add Permissions & Gradle Dependencies
1. Copy the code from **\`AndroidManifest.xml\`** into \`app/src/main/AndroidManifest.xml\`.
2. Copy the code from **\`build.gradle.kts\`** into \`app/build.gradle.kts\` to add Retrofit, Gson, and Coroutines.
3. Click **Sync Now** in the top-right banner.

---

## Step 3: Copy Kotlin Source Files
Copy the remaining files from the tabs on the left into your package folder (\`com/stark/jarvis\`):
- **\`JarvisApiService.kt\`**: Retrofit HTTP network client.
- **\`JarvisViewModel.kt\`**: ViewModel handling state, speech recognition, and Gemini responses.
- **\`JarvisHomeScreen.kt\`**: Futuristic Jetpack Compose HUD screen with Arc Reactor canvas.
- **\`MainActivity.kt\`**: Main entry point initializing SpeechRecognizer and TextToSpeech.

---

## Step 4: Install & Run on Mobile
1. Connect your Android phone to your PC via USB.
2. Enable **USB Debugging** in Phone Settings -> Developer Options.
3. Select your phone in Android Studio's top device dropdown menu.
4. Click the green **Run (▶)** button!
5. Accept the Microphone Permission popup on your phone and start talking to J.A.R.V.I.S.!
`
    },
    {
      name: "2. Android Manifest",
      path: "app/src/main/AndroidManifest.xml",
      language: "xml",
      description: "Permissions for Internet access, microphone recording, and audio output.",
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.stark.jarvis">

    <!-- Permissions required for JARVIS AI and Speech -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="J.A.R.V.I.S."
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.JarvisAssistant"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="J.A.R.V.I.S."
            android:theme="@style/Theme.JarvisAssistant">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
    },
    {
      name: "3. Gradle Dependencies",
      path: "app/build.gradle.kts",
      language: "groovy",
      description: "Dependencies for Jetpack Compose, Retrofit 2, Gson, and Kotlin Coroutines.",
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.stark.jarvis"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.stark.jarvis"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.10.0")
    
    // Jetpack Compose UI
    implementation(platform("androidx.compose:compose-bom:2025.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")

    // Retrofit 2 & Gson for REST API
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}
`
    },
    {
      name: "4. Network Service",
      path: "com/stark/jarvis/JarvisApiService.kt",
      language: "kotlin",
      description: "Retrofit interface & data models calling the Gemini API backend endpoint.",
      code: `package com.stark.jarvis

import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

data class ChatMessagePayload(
    val role: String,
    val text: String
)

data class ChatRequest(
    val message: String,
    val history: List<ChatMessagePayload>? = null
)

data class ChatResponse(
    val text: String,
    val isDemo: Boolean? = false
)

data class DiagnosticsResponse(
    val arcReactor: ReactorData,
    val markArmor: ArmorData
)

data class ReactorData(
    val status: String,
    val output: String,
    val coreTemp: String,
    val efficiency: String
)

data class ArmorData(
    val model: String,
    val powerLevel: String,
    val thrusters: String,
    val weaponsStatus: String
)

interface JarvisApiService {
    @POST("api/gemini/chat")
    suspend fun sendChatCommand(@Body request: ChatRequest): Response<ChatResponse>

    @GET("api/system/diagnostics")
    suspend fun getDiagnostics(): Response<DiagnosticsResponse>

    companion object {
        // Connected to the live Cloud Run backend!
        private const val BASE_URL = "https://ais-dev-txcns3xlhlm7sxjvenmyvr-1039471340028.asia-southeast1.run.app/"

        fun create(): JarvisApiService {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(JarvisApiService::class.java)
        }
    }
}
`
    },
    {
      name: "5. View Model & Speech Handler",
      path: "com/stark/jarvis/JarvisViewModel.kt",
      language: "kotlin",
      description: "Kotlin ViewModel holding chat logs, speech synthesis state, and Retrofit network calls.",
      code: `package com.stark.jarvis

import android.app.Application
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.util.Locale

data class JarvisMessage(
    val sender: String,
    val text: String,
    val isUser: Boolean
)

enum class ReactorState {
    IDLE, LISTENING, THINKING, SPEAKING
}

class JarvisViewModel(application: Application) : AndroidViewModel(application) {

    private val apiService = JarvisApiService.create()

    private val _messages = MutableStateFlow<List<JarvisMessage>>(
        listOf(
            JarvisMessage("J.A.R.V.I.S.", "Good day, Sir. All systems online. How may I assist you today?", false)
        )
    )
    val messages: StateFlow<List<JarvisMessage>> = _messages

    private val _reactorState = MutableStateFlow(ReactorState.IDLE)
    val reactorState: StateFlow<ReactorState> = _reactorState

    private val _statusText = MutableStateFlow("SYSTEM ONLINE. AWAITING COMMAND.")
    val statusText: StateFlow<String> = _statusText

    private var speechRecognizer: SpeechRecognizer? = null
    private var textToSpeech: TextToSpeech? = null

    init {
        // Initialize Native Android Text To Speech
        textToSpeech = TextToSpeech(application) { status ->
            if (status == TextToSpeech.SUCCESS) {
                textToSpeech?.language = Locale.UK // British English Accent
            }
        }

        // Initialize Speech Recognizer
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(application)
        speechRecognizer?.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {}
            override fun onBeginningOfSpeech() {
                _reactorState.value = ReactorState.LISTENING
                _statusText.value = "LISTENING TO VOICE INPUT..."
            }
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {
                _reactorState.value = ReactorState.THINKING
            }
            override fun onError(error: Int) {
                _reactorState.value = ReactorState.IDLE
                _statusText.value = "VOICE INPUT ERROR. STANDING BY."
            }
            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (!matches.isNullOrEmpty()) {
                    val spokenText = matches[0]
                    sendUserMessage(spokenText)
                } else {
                    _reactorState.value = ReactorState.IDLE
                }
            }
            override fun onPartialResults(partialResults: Bundle?) {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
    }

    fun startVoiceListening() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.US)
        }
        _reactorState.value = ReactorState.LISTENING
        speechRecognizer?.startListening(intent)
    }

    fun sendUserMessage(text: String) {
        if (text.isBlank()) return

        val currentList = _messages.value.toMutableList()
        currentList.add(JarvisMessage("SIR", text, true))
        _messages.value = currentList

        _reactorState.value = ReactorState.THINKING
        _statusText.value = "CALCULATING VECTORS WITH GEMINI..."

        viewModelScope.launch {
            try {
                val response = apiService.sendChatCommand(ChatRequest(text))
                if (response.isSuccessful && response.body() != null) {
                    val reply = response.body()!!.text
                    
                    val updatedList = _messages.value.toMutableList()
                    updatedList.add(JarvisMessage("J.A.R.V.I.S.", reply, false))
                    _messages.value = updatedList

                    _reactorState.value = ReactorState.SPEAKING
                    _statusText.value = "TRANSMITTING AUDIO..."
                    speakText(reply)
                } else {
                    handleError("Core transmission severed, Sir.")
                }
            } catch (e: Exception) {
                handleError("Network link anomaly: \${e.localizedMessage}")
            }
        }
    }

    private fun speakText(text: String) {
        val clean = text.replace(Regex("[*#\`-]"), "")
        textToSpeech?.speak(clean, TextToSpeech.QUEUE_FLUSH, null, "JARVIS_TTS")
    }

    private fun handleError(errorMsg: String) {
        val updated = _messages.value.toMutableList()
        updated.add(JarvisMessage("J.A.R.V.I.S.", errorMsg, false))
        _messages.value = updated
        _reactorState.value = ReactorState.IDLE
        _statusText.value = "SYSTEM ERROR. STANDING BY."
    }

    override fun onCleared() {
        super.onCleared()
        speechRecognizer?.destroy()
        textToSpeech?.stop()
        textToSpeech?.shutdown()
    }
}
`
    },
    {
      name: "6. Jetpack Compose UI",
      path: "com/stark/jarvis/JarvisHomeScreen.kt",
      language: "kotlin",
      description: "Jetpack Compose view with Canvas animated Arc Reactor, terminal logs, and controls.",
      code: `package com.stark.jarvis

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun JarvisHomeScreen(viewModel: JarvisViewModel) {
    val messages by viewModel.messages.collectAsState()
    val reactorState by viewModel.reactorState.collectAsState()
    val statusText by viewModel.statusText.collectAsState()

    var textInput by remember { mutableStateOf("") }

    val bgDark = Color(0xFF020617)
    val cyanGlow = Color(0xFF06B6D4)
    val cyanText = Color(0xFF67E8F9)
    val purpleGlow = Color(0xFFA855F7)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgDark)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "J.A.R.V.I.S. KOTLIN HUD",
                color = cyanGlow,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
            Text(
                text = "STARK-OS v10.4",
                color = Color.Gray,
                fontFamily = FontFamily.Monospace,
                fontSize = 10.sp
            )
        }

        // Animated Arc Reactor Canvas
        Box(
            modifier = Modifier
                .size(180.dp)
                .clickable { viewModel.startVoiceListening() },
            contentAlignment = Alignment.Center
        ) {
            AnimatedArcReactor(reactorState = reactorState)
            
            Text(
                text = "JARVIS",
                color = Color.White,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
            )
        }

        Text(
            text = statusText,
            color = cyanText,
            fontFamily = FontFamily.Monospace,
            fontSize = 11.sp,
            modifier = Modifier.padding(top = 12.dp, bottom = 16.dp)
        )

        // Terminal Chat Feed
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp))
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { msg ->
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = if (msg.isUser) Alignment.End else Alignment.Start
                ) {
                    Text(
                        text = "[\${msg.sender}]",
                        color = if (msg.isUser) cyanGlow else purpleGlow,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.sp
                    )
                    Box(
                        modifier = Modifier
                            .background(
                                if (msg.isUser) Color(0xFF0F172A) else Color(0xFF1E1B4B),
                                RoundedCornerShape(8.dp)
                            )
                            .padding(10.dp)
                    ) {
                        Text(
                            text = msg.text,
                            color = Color.White,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }

        // Voice Mic & Input
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = textInput,
                onValueChange = { textInput = it },
                placeholder = { Text("Command JARVIS...", color = Color.Gray, fontSize = 12.sp) },
                modifier = Modifier.weight(1f),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = cyanGlow,
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedTextColor = Color.White
                )
            )

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = {
                    viewModel.sendUserMessage(textInput)
                    textInput = ""
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0891B2))
            ) {
                Text("SEND", fontFamily = FontFamily.Monospace)
            }
        }
    }
}

@Composable
fun AnimatedArcReactor(reactorState: ReactorState) {
    val infiniteTransition = rememberInfiniteTransition()
    val angle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )

    val activeColor = when (reactorState) {
        ReactorState.LISTENING -> Color(0xFFA855F7)
        ReactorState.THINKING -> Color(0xFFF59E0B)
        ReactorState.SPEAKING -> Color(0xFF10B981)
        else -> Color(0xFF06B6D4)
    }

    Canvas(modifier = Modifier.fillMaxSize()) {
        val center = this.center
        val radius = size.minDimension / 2.2f

        drawCircle(
            color = activeColor.copy(alpha = 0.3f),
            radius = radius,
            style = Stroke(width = 4.dp.toPx())
        )

        rotate(angle, center) {
            drawArc(
                color = activeColor,
                startAngle = 0f,
                sweepAngle = 120f,
                useCenter = false,
                style = Stroke(width = 6.dp.toPx())
            )
        }

        drawCircle(
            color = activeColor.copy(alpha = 0.8f),
            radius = radius * 0.4f
        )
    }
}
`
    },
    {
      name: "7. Main Activity Entry Point",
      path: "com/stark/jarvis/MainActivity.kt",
      language: "kotlin",
      description: "Android Activity requesting RECORD_AUDIO permission and rendering Jetpack Compose view.",
      code: `package com.stark.jarvis

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.material3.MaterialTheme
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {

    private val viewModel: JarvisViewModel by viewModels()

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            viewModel.startVoiceListening()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        }

        setContent {
            MaterialTheme {
                JarvisHomeScreen(viewModel = viewModel)
            }
        }
    }
}
`
    }
  ];

  const mauiTemplates: MauiFileTemplate[] = [
    {
      name: "1. MAUI Project Overview",
      path: "ReadMe_MAUI.md",
      language: "markdown",
      description: "Quick-start guide to setting up your .NET MAUI Blazor Hybrid project in Visual Studio.",
      code: `# .NET MAUI Blazor Hybrid J.A.R.V.I.S. Setup Guide

This guide will help you instantiate a native mobile assistant application for iOS, Android, Windows, and macOS using **.NET MAUI Blazor Hybrid**.

## Prerequisites
1. **Visual Studio 2022** (with the ".NET Multi-platform App UI development" workload enabled).
2. **.NET 8.0 SDK** or later.

## Setup Steps
1. **Create the Project**:
   - Open Visual Studio.
   - Click "Create a new project", search for **.NET MAUI Blazor Hybrid App**, and name it \`JarvisMobileApp\`.
   - Choose **.NET 8.0** or **.NET 9.0** as the target framework.

2. **Add NuGet Packages**:
   Install \`System.Net.Http.Json\` for JSON serialization.

3. **Configure Permissions**:
   - **Android**: Open \`Platforms/Android/AndroidManifest.xml\` and add:
     \`\`\`xml
     <uses-permission android:name="android.permission.RECORD_AUDIO" />
     <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
     \`\`\`

4. **Add the Code Files**:
   Copy the C# and Razor files into your project folders!
`
    },
    {
      name: "2. Service Handler",
      path: "Services/JarvisService.cs",
      language: "csharp",
      description: "Secure proxy and direct calling service for Gemini AI models written in C#.",
      code: `using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace JarvisMobileApp.Services
{
    public interface IJarvisService
    {
        Task<string> SendChatMessageAsync(string prompt);
    }

    public class JarvisService : IJarvisService
    {
        private readonly HttpClient _httpClient;
        private const string USE_PROXY_URL = "https://ais-dev-txcns3xlhlm7sxjvenmyvr-1039471340028.asia-southeast1.run.app";

        public JarvisService()
        {
            _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
        }

        public async Task<string> SendChatMessageAsync(string prompt)
        {
            try
            {
                var payload = new { message = prompt };
                var response = await _httpClient.PostAsJsonAsync($"{USE_PROXY_URL}/api/gemini/chat", payload);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<JarvisResponse>();
                    return result?.Text ?? "Telemetry parsing error, Sir.";
                }
                return "I apologize, Sir. Connection severed.";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }
    }

    public class JarvisResponse
    {
        public string Text { get; set; }
    }
}
`
    },
    {
      name: "3. Holographic HUD UI",
      path: "Pages/Home.razor",
      language: "razor",
      description: "Full Blazor Razor view with animated pulsing orb, chat feed, and native .NET mobile TTS integration.",
      code: `@page "/"
@inject JarvisMobileApp.Services.IJarvisService JarvisService
@using Microsoft.Maui.Media

<div class="jarvis-container">
    <div class="reactor-core">
        <span>J.A.R.V.I.S.</span>
    </div>
    <div class="chat-logs">
        @foreach (var log in Logs)
        {
            <p><strong>@log.Sender:</strong> @log.Text</p>
        }
    </div>
    <input @bind="UserPrompt" placeholder="Ask Jarvis..." />
    <button @onclick="Transmit">Transmit</button>
</div>

@code {
    private string UserPrompt = "";
    private List<LogItem> Logs = new();

    private async Task Transmit()
    {
        if (string.IsNullOrWhiteSpace(UserPrompt)) return;
        var prompt = UserPrompt;
        UserPrompt = "";
        Logs.Add(new LogItem { Sender = "SIR", Text = prompt });

        var reply = await JarvisService.SendChatMessageAsync(prompt);
        Logs.Add(new LogItem { Sender = "JARVIS", Text = reply });

        try {
            await TextToSpeech.Default.SpeakAsync(reply);
        } catch {}
    }

    public class LogItem {
        public string Sender { get; set; }
        public string Text { get; set; }
    }
}
`
    }
  ];

  const currentTemplates = framework === "kotlin" ? kotlinTemplates : mauiTemplates;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="mobile-code-hub-container">
      {/* Intro header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-mono font-bold text-cyan-400 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            NATIVE MOBILE SOURCE CODE EXPORT HUB
          </h2>
          <p className="text-xs text-cyan-500/60 font-mono">
            Build and install JARVIS on your mobile phone using Kotlin or .NET MAUI.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md font-mono text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {/* Framework Switcher */}
      <div className="flex bg-slate-950 p-1.5 border border-cyan-500/20 rounded-xl gap-2 font-mono text-xs">
        <button
          onClick={() => {
            setFramework("kotlin");
            setActiveTab(0);
          }}
          className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            framework === "kotlin"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-cyan-500/60 hover:text-cyan-300 hover:bg-cyan-500/5"
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>🤖 NATIVE KOTLIN (ANDROID JETPACK COMPOSE)</span>
        </button>
        <button
          onClick={() => {
            setFramework("maui");
            setActiveTab(0);
          }}
          className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            framework === "maui"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-cyan-500/60 hover:text-cyan-300 hover:bg-cyan-500/5"
          }`}
        >
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>📱 .NET MAUI BLAZOR HYBRID (CROSS PLATFORM)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* File Navigator List */}
        <div className="lg:col-span-1 space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold text-cyan-500/60 font-mono uppercase tracking-wider">
            {framework === "kotlin" ? "KOTLIN FILES" : "MAUI FILES"}
          </div>
          {currentTemplates.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`w-full text-left p-3 rounded-lg border font-mono text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                activeTab === idx
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                  : "border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-cyan-500"
              }`}
            >
              <FileCode className="w-4.5 h-4.5 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold truncate">{file.name}</div>
                <div className="text-[10px] text-cyan-500/50 truncate mt-0.5">{file.path}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-3 flex flex-col border border-cyan-500/20 bg-slate-950/70 rounded-lg overflow-hidden backdrop-blur-md">
          {/* File Header Details */}
          <div className="flex items-center justify-between bg-slate-950 px-4 py-3 border-b border-cyan-500/10">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300">{currentTemplates[activeTab]?.path}</span>
                <p className="text-[10px] text-cyan-500/50 font-mono mt-0.5">{currentTemplates[activeTab]?.description}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(currentTemplates[activeTab]?.code || "", activeTab)}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs font-medium border border-cyan-500/30 active:scale-95 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedIndex === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>

          {/* Code Blocks */}
          <div className="p-4 overflow-x-auto max-h-[480px] text-xs font-mono text-cyan-300/90 scrollbar-thin scrollbar-thumb-cyan-500/20">
            <pre className="whitespace-pre">
              <code>{currentTemplates[activeTab]?.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
