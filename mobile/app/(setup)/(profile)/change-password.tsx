import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { AlertCircleIcon, Eye, EyeOff, Lock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ArrowLeft } from '@/components/icons';
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
import { HEADINGS } from '@/config/text.config';
import { PAGES } from '@/constants/pages.constants';
import { loginSchema, registerSchema } from '@/features/auth/auth.schema'; // Використовуємо валідацію пароля
import { Api } from '@/services/api.client';
import { useCommonStore } from '@/store/common.store';
import { handleServerErrors } from '@/utils/form-errors';

export default function ChangePasswordPage() {
  const { setHeaderLabel, setHeaderRight, setHeaderLeft } = useCommonStore((state) => state);

  const [step, setStep] = useState<'old' | 'new'>('old');
  const [showPassword, setShowPassword] = useState(false);
  const [verifiedOldPass, setVerifiedOldPass] = useState('');

  useEffect(() => {
    setHeaderLabel(HEADINGS.PROFILE.AUTH.CHANGE_PASSWORD.HEADING);
    setHeaderLeft(() => router.push(PAGES.PROFILE), ArrowLeft);
    setHeaderRight(null);
  }, []);

  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (step === 'old') {
        try {
          // Крок 1: Верифікація на беку
          await Api.auth.verifyCurrentPassword(value.oldPassword);
          setVerifiedOldPass(value.oldPassword);
          setStep('new');
          setShowPassword(false); // Скидаємо видимість для безпеки
        } catch (error: any) {
          handleServerErrors(form, error);
        }
      } else {
        try {
          // Крок 2: Оновлення
          await Api.auth.updatePassword(value.newPassword);
          alert('Password successfully changed!');
          router.push(PAGES.PROFILE);
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
            {step === 'old' ? 'Security Check' : 'New Credentials'}
          </Heading>
          <Heading className="text-center text-muted-foreground">
            {step === 'old'
              ? 'Enter your current password to continue'
              : 'Now set a strong new password'}
          </Heading>
        </View>

        <View className="w-full flex-1 flex-col justify-center gap-6">
          {step === 'old' ? (
            <form.Field name="oldPassword" validators={{ onChange: loginSchema.shape.password }}>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <View className="w-full gap-2">
                    <FormControl isInvalid={isInvalid}>
                      <FormControlLabel>
                        <FormControlLabelText>
                          <Heading className="ml-1 text-muted-foreground">Current Password</Heading>
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
            </form.Field>
          ) : (
            <form.Field name="newPassword" validators={{ onChange: loginSchema.shape.password }}>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <View className="w-full gap-2">
                    <Heading className="ml-1 text-muted-foreground">New Password</Heading>
                    <FormControl isInvalid={isInvalid}>
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
            </form.Field>
          )}
        </View>

        <View className="w-full gap-4">
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
                    : step === 'old'
                      ? 'Verify Password'
                      : 'Change Password'}
                </ButtonText>
              </Button>
            )}
          </form.Subscribe>

          <Heading
            size="sm"
            underline
            className="text-center"
            onPress={() => (step === 'old' ? router.push(PAGES.PROFILE) : setStep('old'))}>
            {step === 'old' ? 'Cancel and go back' : 'Back to verification'}
          </Heading>
        </View>
      </View>
    </Container>
  );
}
