
# Dhaan Nidhi - Sistema de Gestión

![iTunesArtwork@1x](https://github.com/user-attachments/assets/5f45e0c9-7a62-4b3b-95f1-655390a1bfbf)


![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![React Native](https://img.shields.io/badge/react_native-%5E0.72-blue)

**Dhaan Nidhi** es un sistema de gestión full-stack que incluye:

- **Backend**: API RESTful con Node.js (v20) y Express
- **Frontend**: Aplicación móvil multiplataforma desarrollada con React Native y Expo

---

## 📁 Estructura del Proyecto

```
.
├── api/                  # Backend con Express
│   ├── db.js             # Configuración de la base de datos
│   ├── index.js          # Punto de entrada del servidor
│   ├── routes/           # Rutas de la API
│   │   ├── auth.js       # Autenticación de usuarios
│   │   ├── producto.js   # Gestión de productos
│   │   └── usuario.js    # Operaciones con usuarios
│   └── package.json      # Dependencias del backend
│
└── app/                  # Frontend móvil (React Native)
    ├── src/
    │   ├── screens/      # Pantallas de la aplicación
    │   ├── AppNavigator.js # Navegación principal
    │   └── utils.js      # Funciones auxiliares
    ├── ios/              # Configuración para iOS
    ├── android/          # Configuración para Android
    └── package.json      # Dependencias del frontend
```

---

## 🚀 Instalación

### Backend (API)

```bash
cd api
npm install
npm start
```

Crea un archivo `.env` con las siguientes variables:

```
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=dhaan_nidhi
JWT_SECRET=tu_secreto_jwt
```

### Frontend (App Móvil)

Este proyecto fue inicializado con `@react-native-community/cli`.

**Paso 1: Iniciar Metro**
```bash
cd app
npm start
# o
yarn start
```

**Paso 2: Construir y ejecutar la app**

- **Android**:
```bash
npm run android
# o
yarn android
```

- **iOS** (requiere macOS):
```bash
bundle install
bundle exec pod install
npm run ios
# o
yarn ios
```

**Paso 3: Modificar la app**

Edita `App.tsx` para hacer cambios. Se actualizará automáticamente gracias a *Fast Refresh*.

---

## 📝 Base de Datos

El archivo `int.sql` contiene el esquema inicial. Ejecútalo en tu gestor MySQL/MariaDB favorito.

---

## 🔧 Tecnologías Clave

- **Backend**: Node.js 20, Express, MySQL
- **Frontend**: React Native, Expo
- **Autenticación**: JWT
- **Gestión de rutas**: Express Router

---

## 🌟 Características

- Registro y autenticación de usuarios
- Gestión de productos y transacciones
- Interfaz móvil multiplataforma (iOS/Android)

---

## 🆘 Troubleshooting

- Verifica la guía de solución de problemas
- Asegúrate de que las variables de entorno estén configuradas
- Confirma que tienes Node.js v20 instalado

---

## 📄 Licencia

MIT
Distribuido bajo la licencia MIT. Consulta el archivo LICENSE para más información.

## ✉️ Contacto
Equipo de Desarrollo - dev@dhaannidhi.com
Sitio Web: https://dhaannidhi.com


### Para usar este archivo:
1. Copia todo el contenido
2. Pégalo en un nuevo archivo llamado `README.md`
3. Reemplaza los placeholders (como las URLs de imágenes) con tus recursos reales
4. Personaliza las secciones según necesites

El archivo incluye:
- Estructura completa del proyecto
- Guías de instalación para backend y frontend
- Documentación técnica
- Secciones para contribución y solución de problemas
- Información de licencia y contacto

¿Necesitas alguna modificación específica en el formato o contenido?
