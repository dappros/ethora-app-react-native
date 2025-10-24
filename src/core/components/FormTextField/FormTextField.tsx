import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { TextField, TextFieldProps } from '../TextField';

type Props<T extends FieldValues> =
  UseControllerProps<T> &
  Omit<TextFieldProps, 'value' | 'onChangeText' | 'onBlur' | 'error'>;

export function FormTextField<T extends FieldValues>({
  control,
  name,
  rules,
  defaultValue,
  ...rest
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue as any}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <TextField
          {...rest}
          value={value as any}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}
