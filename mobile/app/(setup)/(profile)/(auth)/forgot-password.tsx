import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { AlertCircleIcon, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Container } from '@/components/layout/Container';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { PAGES } from '@/constants/pages.constants';
import { loginSchema } from '@/features/auth/auth.schema';
import { Api } from '@/services/api.client';
import { handleServerErrors } from '@/utils/form-errors';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Використовуємо одну форму для обох кроків
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      if (step === 'email') {
        try {
          // Крок 1: Запит на бекенд для перевірки
          await Api.auth.validateEmail(value.email);
          setUserEmail(value.email);
          setStep('password');
        } catch (error: any) {
          handleServerErrors(form, error);
        }
      } else {
        try {
          // Крок 2: Фінальне скидання
          await Api.auth.resetPassword(userEmail, value.password);
          router.push(PAGES.AUTH);
          // Можна додати toast: Пароль успішно змінено
        } catch (error: any) {
          handleServerErrors(form, error);
        }
      }
    },
  });

  return (
    <Container>
      <View className="mt-4 w-full flex-1 flex-col items-center justify-between gap-3">
        <View className="items-center gap-2">
          <Heading size="3xl" className="text-center" bold accent>
            {step === 'email' ? 'Reset Password' : 'Security Check'}
          </Heading>
          <Heading className="text-center text-muted-foreground">
            {step === 'email'
              ? 'Enter email to find your account'
              : `Set a new password for ${userEmail}`}
          </Heading>
        </View>

        <View className="w-full flex-1 flex-col justify-between gap-6">
          <View />
          <View className="flex w-full flex-col items-center gap-4">
            {step === 'email' ? (
              <form.Field name="email" validators={{ onChange: loginSchema.shape.email }}>
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
                        <Input
                          isInvalid={isInvalid}>
                          <InputSlot className="pl-3">
                            <InputIcon as={Mail} />
                          </InputSlot>
                          <InputField
                            placeholder="user@example.com"
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
              </form.Field>
            ) : (
              <form.Field name="password" validators={{ onChange: loginSchema.shape.password }}>
                {(field) => (
                  <View className="w-full gap-2">
                    <Heading className="ml-1 text-muted-foreground">New Password</Heading>
                    <Input
                      isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}>
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
                  </View>
                )}
              </form.Field>
            )}
          </View>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting}
                onPress={form.handleSubmit}
                variant="default"
                size="none"
                className="w-full py-7">
                <ButtonText size="title-xl" className="text-yellow">
                  {isSubmitting
                    ? 'Processing...'
                    : step === 'email'
                      ? 'Find Account'
                      : 'Reset Password'}
                </ButtonText>
              </Button>
            )}
          </form.Subscribe>
        </View>

        <Heading
          size="sm"
          underline
          className="text-center"
          onPress={() => (step === 'email' ? router.push(PAGES.AUTH) : setStep('email'))}>
          {step === 'email'
            ? 'Remember your email? Login!'
            : 'Entered wrong email? Use different email!'}
        </Heading>
      </View>
    </Container>
  );
}
