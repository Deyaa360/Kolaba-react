import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import supabaseService from '../services/supabase';
import { AnimatedButton, Toast } from '../components';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as any });

  const handleLogin = async () => {
    if (!email || !password) {
      setToast({ visible: true, message: 'Please fill in all fields', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await supabaseService.signIn(email, password);
      setToast({ visible: true, message: 'Welcome back!', type: 'success' });
    } catch (error: any) {
      setToast({ 
        visible: true, 
        message: error.message || 'Invalid credentials', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section - Improved */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="campaign" size={56} color={Colors.primary} />
          </View>
          <Text style={styles.logo}>Kolaba</Text>
          <Text style={styles.subtitle}>Creator Platform</Text>
          <Text style={styles.tagline}>Welcome back! Sign in to continue</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Icon name="email" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                accessible={true}
                accessibilityLabel="Email address input"
                accessibilityHint="Enter your email address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                accessible={true}
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                accessible={true}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
              >
                <Icon
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPassword}
            accessible={true}
            accessibilityLabel="Forgot password"
            accessibilityRole="button"
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button - Using AnimatedButton */}
          <AnimatedButton
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="large"
            loading={loading}
            disabled={loading}
            fullWidth={true}
            style={styles.loginButton}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>New to Kolaba?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign Up Button - Using AnimatedButton */}
          <AnimatedButton
            title="Create Account"
            onPress={() => navigation.navigate('Signup')}
            variant="outline"
            size="large"
            disabled={loading}
            fullWidth={true}
            icon={<Icon name="person-add" size={20} color={Colors.primary} />}
          />
        </View>
      </ScrollView>
      
      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  logo: {
    ...Typography.title1,
    color: Colors.black,
    marginBottom: Spacing.xxs,
  },
  subtitle: {
    ...Typography.callout,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...Typography.subheadline,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.footnote,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
  },
  eyeIcon: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
    padding: Spacing.xs,
  },
  forgotPasswordText: {
    ...Typography.footnote,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  loginButton: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.footnote,
    marginHorizontal: Spacing.md,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default LoginScreen;
