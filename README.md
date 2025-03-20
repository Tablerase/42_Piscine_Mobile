# Piscine Mobile

## Mobile

- [AWS - Mobile App Dev](https://aws.amazon.com/mobile/mobile-application-development/)
- [IBM - Mobile App Dev](https://www.ibm.com/think/topics/mobile-application-development)

There are 4 main ways to develop mobile applications:

```mermaid
flowchart TB
    subgraph Native["Native Apps"]
      direction TB
        N["Platform-Specific Code
        • iOS: Swift/Objective-C
        • Android: Java/Kotlin"]
        NA["Direct Hardware Access
        Best Performance"]
    end

    subgraph Cross["Cross-Platform"]
      direction TB
        CP["Shared Codebase
        • React Native
        • Flutter
        • Xamarin"]
        CA["Compiled to Native
        Near-Native Performance"]
    end

    subgraph Hybrid["Hybrid Apps"]
      direction TB
        H["Web Technologies
        • HTML/CSS/JS
        • Cordova/Ionic"]
        HA["Web Container
        Good Performance"]
    end

    subgraph PWA["Progressive Web Apps"]
      direction TB
        P["Web Technologies
        • HTML/CSS/JS
        • Modern APIs"]
        PA["Browser Runtime
        Limited Device Access"]
    end

    N --> NA
    CP --> CA
    H --> HA
    P --> PA

    classDef native fill:#ff9999,stroke:#ff0000,color:#000
    classDef cross fill:#99ff99,stroke:#00ff00,color:#000
    classDef hybrid fill:#9999ff,stroke:#0000ff,color:#000
    classDef pwa fill:#ffff99,stroke:#ffff00,color:#000

    class N,NA native
    class CP,CA cross
    class H,HA hybrid
    class P,PA pwa
```

Breakdown of Each Approach:

- Native Applications
  - Written specifically for each platform
  - Best performance and direct hardware access
  - Requires separate codebases for iOS and Android
  - Higher initial investment but optimal results
- Cross-Platform Development
  - Single codebase for multiple platforms
  - Popular frameworks include Flutter and Xamarin
  - Better resource utilization compared to hybrid apps
  - Ideal for complex applications needing native performance
- Hybrid Applications
  - Built using web technologies (HTML/CSS/JavaScript)
  - Runs in a web container with native bridge
  - Easier to maintain but may have performance limitations
  - Good for simpler applications or web-first experiences
- Progressive Web Apps (PWAs)
  - Web applications with app-like features
  - No installation required
  - Works across devices through browsers
  - Limited access to device hardware

### Mobile Development Environment

#### Front-end Components

- Visual and interactive parts users experience directly
- Resides on the device or accessible through browser
- Focuses on user interface and experience

#### Back-end Services

- Handles data processing and storage
- Manages API connections
- Provides cloud services integration

### Key Considerations for Mobile Development

#### Resource Management

- Mobile devices have limited processing power and memory
- Apps must be optimized for performance
- Consider offloading heavy processing to cloud services

#### User Experience

- Design for touch interfaces
- Keep navigation simple and intuitive
- Optimize for mobile screen sizes

#### Distribution

- App store requirements differ between platforms
- iOS requires $99/year developer program fee
- Android charges a one-time $25 registration fee

### Best Practices

#### Development Process

- Start with core features and expand gradually
- Test thoroughly on multiple devices
- Consider platform-specific optimizations

#### Performance Optimization

- Use cloud services for heavy processing
- Implement efficient data caching
- Optimize resource usage

#### Security

- Implement proper authentication
- Secure data transmission
- Follow platform security guidelines

## ADB

ADB stands for Android Debug Bridge, a versatile command-line tool that lets you communicate with an emulator instance or connected Android device. It is a client-server program that includes three components:

- A client, which runs on your development machine
- A daemon (adbd), which runs on the device
- A server, which manages communication between the client and the daemon
  The client sends commands to the server, which forwards them to the daemon running on the device. The daemon executes the commands and returns the results to the client.
  The ADB client can be used to perform various tasks, such as installing and debugging apps, copying files, and running shell commands on the device. The ADB server manages communication between the client and the daemon, ensuring that commands are executed correctly.

[Android Debug Bridge](https://developer.android.com/studio/command-line/adb)

## React Native

[Expo: Template to Setup](https://docs.expo.dev/more/create-expo/#--template)
[React Native: Setup](https://reactnative.dev/docs/set-up-your-environment)

```bash
npx create-expo-app --template blank-typescript
```

### Running

#### Running with emulator

[Android studio](https://docs.expo.dev/workflow/android-studio-emulator/)

#### Running On device (sudo needed)

[ReactNative - Running on Device](https://reactnative.dev/docs/running-on-device)

Setup adb and run the following commands:

```bash
# Show devices and start adb daemon if not running
adb devices
```

```bash
# Allow connections from the device to the host machine
# (useful for debugging)
adb reverse tcp:8081 tcp:8081
```

```bash
# Allow connections for the Expo Go app
adb reverse tcp:8087 tcp:8087
```

Start the React Native server:
