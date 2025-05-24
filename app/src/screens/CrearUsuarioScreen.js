import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { getHostname } from '../utils';
import { useTranslation } from 'react-i18next';

const CreateUserScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);
    const [isFocusedNombre, setIsFocusedNombre] = useState(false);
    const [isFocusedCorreo, setIsFocusedCorreo] = useState(false);
    const { t } = useTranslation();





 const handleCreateUser = async () => {
    // Validación de campos
    if (!nombre.trim()) {
      Alert.alert(t('error'), t('name_required'));
      return;
    }

    // Preparación del objeto usuario
    const nuevoUsuario = {
      nombre,
      correo: correo.trim() || t('not_specified'),
      password,
      tipo: 'agricultor',
    };

    try {
      const res = await fetch(getHostname() + 'api/usuarios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.status === 201) {
        navigation.replace('Login');
        Alert.alert(t('success'), t('registration_success'));
      } else {
        Alert.alert(t('error'), t('registration_error'));
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert(t('error'), t('connection_error'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={require('../assets/farmer2.png')}
            style={styles.headerImage}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('farmer_registration')}</Text>
          <Text style={styles.subtitle}>{t('complete_data_to_start')}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('full_name')}*</Text>
            <TextInput
              placeholder={t('name_example')}
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
              style={[styles.input, isFocusedNombre && styles.inputFocused]}
              onFocus={() => setIsFocusedNombre(true)}
              onBlur={() => setIsFocusedNombre(false)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
              placeholder={t('email_example')}
              placeholderTextColor="#999"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, isFocusedCorreo && styles.inputFocused]}
              onFocus={() => setIsFocusedCorreo(true)}
              onBlur={() => setIsFocusedCorreo(false)}
            />
            <Text style={styles.optionalText}>({t('optional')})</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('password')}</Text>
            <TextInput
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={[styles.input, isFocusedCorreo && styles.inputFocused]}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateUser}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('register')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{t('go_back')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5fff6',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        height: 300,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerImage: {
        width: 120,
        height: 180,
        // tintColor: 'white',
    },
    formContainer: {
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#333',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputFocused: {
        borderColor: '#4caf50',
        backgroundColor: '#f8fff8',
    },
    optionalText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#4caf50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#2e7d32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 15,
        padding: 12,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#4caf50',
        fontSize: 15,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});

export default CreateUserScreen;