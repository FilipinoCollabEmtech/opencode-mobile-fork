# Android Build Setup

This document explains how to set up and run Android builds for the OpenCode Mobile app.

## Prerequisites

### 1. GitHub Account
- A GitHub account with sufficient permissions to create repositories and workflows
- GitHub CLI (gh) authenticated with your account

### 2. Android Development Environment
While the CI/CD pipeline is set up to build on GitHub Actions, you'll also want a local development environment:

#### macOS
```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Android Studio (includes SDK)
brew install --cask android-studio

# Set ANDROID_HOME
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

#### Ubuntu/Debian
```bash
# Install Android SDK components
sudo apt update
sudo apt install -y wget curl unzip git software-properties-common

# Install Android SDK (download from official site or use SDK manager)
wget -q https://dl.google.com/android/repository/commandline-tools_latest-linux.zip
cd ~
mkdir -p android-sdk
unzip -d android-sdk ~/commandline-tools_latest-linux.zip
cd android-sdk/commandlinetools
./pkg install --force

# Set ANDROID_HOME
export ANDROID_HOME="$HOME/android-sdk/commandlinetools"
```

#### Windows
1. Download Android Studio from https://developer.android.com/studio
2. During installation, choose "Customize" and ensure "Android SDK" is selected
3. Set `ANDROID_HOME` environment variable:
   ```
   setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
   ```

### 3. GitHub Repository Setup

1. Fork this repository on GitHub
2. Add the forked repository as a remote (if you plan to push changes):
   ```bash
   git remote add forked-repo https://github.com/YOUR_USERNAME/opencode-mobile-fork.git
   ```

### 4. GitHub Secrets

Go to your forked repository's **Settings → Secrets and variables → Actions** and add the following secrets:

#### For Google Play Console (if publishing to Play Store)
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` - Service account JSON key
- `PLAYSTORE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `PLAYSTORE_PACKAGE_NAME` - Your app's package name (`cc.agentlabs.opencode`)

#### For APK Signing (if using external signing)
- `ANDROID_SIGNING_KEY_BASE64` - Base64 encoded signing key
- `ANDROID_SIGNING_KEY_ALIAS` - Key alias
- `ANDROID_SIGNING_KEY_PASSWORD` - Key password
- `ANDROID_SIGNING_KEY_STORE_PASSWORD` - Keystore password

#### For Other Services
- `SENTRY_AUTH_TOKEN` - Sentry authentication token (if using Sentry)
- Any other API keys or tokens your app requires

## Building Locally

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/opencode-mobile-fork.git
   cd opencode-mobile-fork
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build for Android:
   ```bash
   npx expo export -p android --platform android --output-dir dist
   cd android
   ./gradlew assembleRelease
   ./gradlew assembleDebug
   ```

4. Find APKs in:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Advanced Options

#### Build Variants
You can build specific variants:
```bash
# Build only debug
./gradlew assembleDebug

# Build only release
./gradlew assembleRelease

# Build all variants
./gradlew assemble
```

#### Clean Build
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

## GitHub Actions CI/CD Pipeline

### How It Works

The repository includes a GitHub Actions workflow that automatically builds Android APKs on every push to main/develop branches or when manually triggered.

### Workflow Triggers

- **Push events**: Any push to `main` or `develop` branches
- **Pull requests**: PRs targeting the main branch
- **Manual trigger**: Workflow_dispatch allows manual builds for releases

### Build Process

1. **Checkout** the repository
2. **Set up Java** (JDK 17)
3. **Set up Node.js** (version 18)
4. **Cache dependencies** (Gradle, npm)
5. **Install npm dependencies**
6. **Export for Android** (Expo CLI)
7. **Set up Android SDK** (including NDK)
8. **Build the Android project** (debug and release APKs)
9. **Upload artifacts** (debug and release APKs)
10. **Create GitHub Release** (if manually triggered)

### Using the Workflow

#### Manual Build (for Testing)

1. Go to the Actions tab in your forked repository
2. Find the "Build Android APK" workflow
3. Click "Run workflow" and select:
   - **Release Type**: alpha, beta, or stable
4. Wait for the build to complete

#### Monitoring Builds

- You can track the build progress in real-time in the Actions tab
- Download the built APKs as artifacts once the build completes
- For manual releases, the workflow will automatically create a GitHub Release with the built APKs attached

### Local vs CI/CD Differences

**Local Build**:
- Uses your local Android SDK
- May have different build configurations
- Slower but easier to debug

**CI/CD Build**:
- Uses specific Android SDK versions (controlled by the workflow)
- Consistent environment across runs
- Faster for repeated builds
- Automatic artifact upload and release creation

## Troubleshooting

### Common Issues

#### "Failed to find platform tools"

**Solution**: Ensure the Android SDK platform tools are installed:
```bash
$ANDROID_HOME/platform-tools/$ ls
```

#### "Unable to find tool 'android'"

**Solution**: Install the SDK command-line tools:
```bash
cd $ANDROID_HOME
cat platforms.ini | grep packages
```

#### "Gradle dependency resolution failed"

**Solution**:
```bash
cd android
./gradlew clean dependencyInsight --dependency com.facebook.react
```

### Getting Help

1. **GitHub Actions Logs**: Check the Actions tab for detailed error messages
2. **Android Studio**: If you encounter build errors, you can open the project in Android Studio to get more detailed error information
3. **Stack Overflow**: Search for common Android build errors with relevant keywords
4. **GitHub Discussions**: Ask questions in the repository's discussions

## License

This project is licensed under the MIT License.