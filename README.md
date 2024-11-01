# MyDailyHealthApp

## Descrição

Projeto Expo realizado para estudo de caso na utilização da API Health Connect do Android.

## Bibliotecas utilizadas

- `react-native-health-connect`
- `expo-health-connect`
- `expo-dev-client`
- `expo-build-properties`
- `expo-font`
- `@expo-google-fonts/inter`
- `expo-splash-screen`
- `react-native-safe-area-context`
- `react-native-paper`
- `@react-native-community/datetimepicker`

> **OBS**: Certifique-se de ter o app **Health Connect** instalado no dispositivo ou emulador Android.

## Instruções para Execução

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute o aplicativo no emulador/dispositivo Android:
   ```bash
   npx expo run:android
   ```
3. Conceda as permissões solicitadas no dispositivo/emulador.

## Pré-build
**OBS** : Necessário apenas se precisar refazer o build (diretório android), em caso de adicionar alguma biblioteca e/ou permissões no app.json

```bash
npx expo prebuild --platform android --clean
```

## Documentação de apoio
- [Configuração do ambiente Expo](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build&buildEnv=local)
- [Documentação react-native-health-connect](https://matinzd.github.io/react-native-health-connect/docs/intro)
- [Guia de integração com Android Health Connect](https://www.notjust.dev/projects/step-counter/android-health-connect)
- [Referência oficial Android Health Connect](https://developer.android.com/reference/android/health/connect/package-summary)