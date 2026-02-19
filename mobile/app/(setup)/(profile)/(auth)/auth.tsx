import { Container } from '@/components/layout/Container';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { HEADINGS } from '@/config/text.config';
import { PAGES } from '@/constants/pages.constants';
import { loginSchema, registerSchema } from '@/features/auth/auth.schema'; // шлях до схеми
import { Api } from '@/services/api.client';
import { useCommonStore } from '@/store/common.store';
import { useGameStore } from '@/store/game.store';
import { handleServerErrors } from '@/utils/form-errors';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function AuthPage() {
  const { setHeaderLabel } = useCommonStore((state) => state);
  const { setUser, setToken } = useGameStore((state) => state);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setHeaderLabel(
      authMode === 'login'
        ? HEADINGS.PROFILE.AUTH.HEADING.SIGN_IN
        : HEADINGS.PROFILE.AUTH.HEADING.SIGN_UP
    );
  }, [authMode, setHeaderLabel]);

  const toggleAuthMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
  };

  const registerForm = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const { user, refresh_token, access_token } = await Api.auth.register(value);

        console.log('User registered:', user);
        console.log('Access token:', access_token);

        setUser(user);
        setToken(access_token, refresh_token);

        router.push(PAGES.HOME);
      } catch (error: any) {
        handleServerErrors(registerForm, error);
      }
    },
  });

  const loginForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const { user, refresh_token, access_token } = await Api.auth.login(value);

        console.log('User login:', user);
        console.log('Access token login:', access_token);

        setUser(user);
        setToken(access_token, refresh_token);

        router.push(PAGES.HOME);
      } catch (error: any) {
        handleServerErrors(loginForm, error);
      }
    },
  });

  const renderLogin = () => (
    <View className="w-full flex-1 flex-col items-center justify-between gap-4">
      <View />
      <View className="flex w-full flex-col items-center gap-4">
        <loginForm.Field name="email" validators={{ onChange: loginSchema.shape.email }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <View className="w-full gap-2">
                <FormControl isInvalid={isInvalid}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      <Heading className="ml-1 text-muted-foreground">Email</Heading>
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input isInvalid={isInvalid}>
                    <InputSlot className="pl-3">
                      <InputIcon as={Mail} />
                    </InputSlot>
                    <InputField
                      placeholder="user@example.com"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Input>
                  {field.state.meta.errors.length ? (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red" />
                      <FormControlErrorText className="text-red">
                        {field.state.meta.errors
                          .map((err: any) => (typeof err === 'object' ? err.message : err))
                          .join(', ')}
                        {/* At least 6 characters are required. */}
                      </FormControlErrorText>
                    </FormControlError>
                  ) : null}
                </FormControl>
              </View>
            );
          }}
        </loginForm.Field>

        {/* Password Field */}
        <loginForm.Field name="password" validators={{ onChange: loginSchema.shape.password }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <View className="w-full gap-2">
                <FormControl isInvalid={isInvalid}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      <Heading className="ml-1 text-muted-foreground">Password</Heading>
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input isInvalid={isInvalid}>
                    <InputSlot className="pl-3">
                      <InputIcon as={Lock} />
                    </InputSlot>
                    <InputField
                      placeholder="••••••••"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      secureTextEntry={!showPassword}
                    />
                    <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                      <InputIcon as={showPassword ? Eye : EyeOff} />
                    </InputSlot>
                  </Input>
                  {field.state.meta.errors.length ? (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red" />
                      <FormControlErrorText className="text-red">
                        {field.state.meta.errors
                          .map((err: any) => (typeof err === 'object' ? err.message : err))
                          .join(', ')}
                        {/* At least 6 characters are required. */}
                      </FormControlErrorText>
                    </FormControlError>
                  ) : null}
                  <FormControlHelper className="mt-2 pt-2">
                    <FormControlHelperText>
                      <Heading
                        size="sm"
                        underline
                        onPress={() => router.push(PAGES.FORGOT_PASSWORD)}>
                        {'forgot password'}
                      </Heading>
                    </FormControlHelperText>
                  </FormControlHelper>
                </FormControl>
              </View>
            );
          }}
        </loginForm.Field>
      </View>

      <loginForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            disabled={!canSubmit}
            onPress={loginForm.handleSubmit}
            variant={'default'}
            size="none"
            className="w-full py-7">
            <ButtonText size="title-xl" className="text-yellow">
              {isSubmitting ? 'Signing in...' : 'Login'}
            </ButtonText>
          </Button>
        )}
      </loginForm.Subscribe>
    </View>
  );

  const renderRegister = () => (
    <View className="w-full flex-1 flex-col items-center justify-between gap-4">
      <View />
      <View className="flex w-full flex-col items-center gap-2">
        <registerForm.Field
          name="username"
          validators={{ onChange: registerSchema.shape.username }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <View className="w-full gap-2">
                <FormControl isInvalid={isInvalid}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      <Heading className="ml-1 text-muted-foreground">Username</Heading>
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input isInvalid={isInvalid}>
                    <InputSlot className="pl-3">
                      <InputIcon as={User} />
                    </InputSlot>
                    <InputField
                      placeholder="username"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      autoCapitalize="none"
                    />
                  </Input>
                  {field.state.meta.errors.length ? (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red" />
                      <FormControlErrorText className="text-red">
                        {field.state.meta.errors
                          .map((err: any) => (typeof err === 'object' ? err.message : err))
                          .join(', ')}
                        {/* At least 6 characters are required. */}
                      </FormControlErrorText>
                    </FormControlError>
                  ) : null}
                </FormControl>
              </View>
            );
          }}
        </registerForm.Field>

        <registerForm.Field name="email" validators={{ onChange: registerSchema.shape.email }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <View className="w-full gap-2">
                <FormControl isInvalid={isInvalid}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      <Heading className="ml-1 text-muted-foreground">Email</Heading>
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input isInvalid={isInvalid}>
                    <InputSlot className="pl-3">
                      <InputIcon as={Mail} />
                    </InputSlot>
                    <InputField
                      placeholder="user@example.com"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </Input>
                  {field.state.meta.errors.length ? (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red" />
                      <FormControlErrorText className="text-red">
                        {field.state.meta.errors
                          .map((err: any) => (typeof err === 'object' ? err.message : err))
                          .join(', ')}
                        {/* At least 6 characters are required. */}
                      </FormControlErrorText>
                    </FormControlError>
                  ) : null}
                </FormControl>
              </View>
            );
          }}
        </registerForm.Field>

        <registerForm.Field
          name="password"
          validators={{ onChange: registerSchema.shape.password }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <View className="w-full gap-2">
                <FormControl isInvalid={isInvalid}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      <Heading className="ml-1 text-muted-foreground">Password</Heading>
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input isInvalid={isInvalid}>
                    <InputSlot className="pl-3">
                      <InputIcon as={Lock} />
                    </InputSlot>
                    <InputField
                      placeholder="••••••••"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      secureTextEntry={!showPassword}
                    />
                    <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                      <InputIcon as={showPassword ? Eye : EyeOff} />
                    </InputSlot>
                  </Input>
                  {field.state.meta.errors.length ? (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red" />
                      <FormControlErrorText className="text-red">
                        {field.state.meta.errors
                          .map((err: any) => (typeof err === 'object' ? err.message : err))
                          .join(', ')}
                        {/* At least 6 characters are required. */}
                      </FormControlErrorText>
                    </FormControlError>
                  ) : null}
                </FormControl>
              </View>
            );
          }}
        </registerForm.Field>
      </View>

      <registerForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            disabled={!canSubmit}
            onPress={registerForm.handleSubmit}
            variant={'default'}
            size="none"
            className="w-full py-7">
            <ButtonText size="title-xl" className="text-yellow">
              {isSubmitting ? 'Loading...' : 'Register'}
            </ButtonText>
          </Button>
        )}
      </registerForm.Subscribe>
    </View>
  );

  return (
    <Container>
      <View className="mt-4 w-full flex-1 flex-col items-center justify-between gap-3">
        <View className="items-center gap-2">
          <Heading size="3xl" className="text-center" bold accent>
            {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </Heading>
          <Heading className="text-center text-muted-foreground">
            {authMode === 'login' ? 'Please sign in to continue' : 'Sign up to get started'}
          </Heading>
        </View>

        {authMode === 'login' ? renderLogin() : renderRegister()}

        <Heading
          size="sm"
          underline
          onPress={() => toggleAuthMode(authMode === 'login' ? 'register' : 'login')}>
          {authMode === 'login'
            ? "Still don't have an account? Register!"
            : 'Already have an account? Login!'}
        </Heading>
      </View>
    </Container>
  );
}
