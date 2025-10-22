# Script to write screen files
$basePath = "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc\src\screens"

# SignupScreen
$signupContent = @'
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import supabaseService from '../services/supabase';

interface SignupScreenProps { navigation: any; }

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      await supabaseService.signUp(email, password, firstName, lastName);
      Alert.alert('Success!', 'Account created! Please check your email to confirm your account.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>Kolaba</Text>
          <Text style={styles.tagline}>Join as a Creator</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor={Colors.textTertiary} value={name} onChangeText={setName} autoCapitalize="words" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={Colors.textTertiary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor={Colors.textTertiary} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput style={styles.input} placeholder="Confirm your password" placeholderTextColor={Colors.textTertiary} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" />
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  logo: { fontSize: Typography.fontSize['4xl'], fontWeight: Typography.fontWeight.bold, color: Colors.primary, marginBottom: Spacing.sm },
  tagline: { fontSize: Typography.fontSize.base, color: Colors.textSecondary },
  form: { width: '100%' },
  inputContainer: { marginBottom: Spacing.lg },
  label: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium, color: Colors.text, marginBottom: Spacing.xs },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: Typography.fontSize.base, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  signupButton: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.md, ...Shadow.md },
  signupButtonText: { color: Colors.white, fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  loginText: { color: Colors.textSecondary, fontSize: Typography.fontSize.base },
  loginLink: { color: Colors.primary, fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold }
});

export default SignupScreen;
'@

Set-Content -Path "$basePath\SignupScreen.tsx" -Value $signupContent -Encoding UTF8

Write-Host "Screen files created successfully!"
