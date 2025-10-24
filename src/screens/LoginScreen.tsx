import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validateEmail, validatePassword } from '../utils/validation';
import analytics from '../services/analytics';
import { AnimatedButton } from '../components';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();
  const toast = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  // Track screen view
  useEffect(() => {
    analytics.logScreenView('Login');
  }, []);

  // Validate email on blur only (more professional)
  useEffect(() => {
    if (touched.email) {
      if (!email) {
        setEmailError('');
      } else {
        const result = validateEmail(email);
        setEmailError(result.isValid ? '' : result.error || '');
      }
    }
  }, [touched.email, email]);

  // Validate password on blur only
  useEffect(() => {
    if (touched.password) {
      if (!password) {
        setPasswordError('');
      } else {
        const result = validatePassword(password);
        setPasswordError(result.isValid ? '' : result.error || '');
      }
    }
  }, [touched.password, password]);

  const isFormValid = () => {
    const emailValid = validateEmail(email).isValid;
    const passwordValid = validatePassword(password).isValid;
    return emailValid && passwordValid;
  };

  const handleLogin = async () => {
    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate before submitting
    if (!isFormValid()) {
      toast.showWarning('Please fix the errors before continuing');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      analytics.logLogin('email');
      toast.showSuccess('Welcome back!');
    } catch (error: any) {
      analytics.logError(error.message, 'Login');
      toast.showError(error.message || 'Invalid credentials');
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
        {/* Hero Section - Enhanced */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
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
            <Text style={styles.label}>📧 Email Address</Text>
            <View style={[styles.inputWrapper, emailError && touched.email && styles.inputWrapperError]}>
              <Icon name="email" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                onBlur={() => setTouched({ ...touched, email: true })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                accessible={true}
                accessibilityLabel="Email address input"
                accessibilityHint="Enter your email address"
              />
            </View>
            {emailError && touched.email && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Password</Text>
            <View style={[styles.inputWrapper, passwordError && touched.password && styles.inputWrapperError]}>
              <Icon name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setTouched({ ...touched, password: true })}
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
            {passwordError && touched.password && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
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
            disabled={loading || !isFormValid()}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#E0F2F1',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  logoGlow: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    opacity: 0.1,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapperError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  errorText: {
    ...Typography.caption1,
    color: '#EF4444',
    marginTop: Spacing.xs,
    marginLeft: Spacing.xxs,
    fontWeight: Typography.fontWeight.medium,
  },
  eyeIcon: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 4,
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    marginHorizontal: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default LoginScreen;
