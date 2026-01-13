import 'dotenv/config';

export default {
    expo: {
        name: "miApp",
        slug: "miApp-Preventum",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./src/assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./src/assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            googleServicesFile: "./src/assets/GoogleService-Info.plist",
            bundleIdentifier: "preventum.ios"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./src/assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            googleServicesFile: "./src/assets/google-services.json",
            package: "preventum.android",
            edgeToEdgeEnabled: true,
            config: {
                googleSignIn: {
                    certificateHash: "6fc5457475ac4a760fef2335c6c0a64560eb20ba"
                },
                googleMaps: {
                    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
                }
            }
        },
        web: {
            favicon: "./src/assets/favicon.png"
        },
        plugins: [
            "@react-native-google-signin/google-signin"
        ],
        runtimeVersion: {
            policy: "appVersion"
        },
        extra: {
            eas: {
                projectId: "0837d766-787c-4dd8-80fc-47a65f9997cb"
            }
        },
        updates: {
            url: "https://u.expo.dev/6da92484-f940-4701-a102-80a949e7fcec"
        }
    }
};
