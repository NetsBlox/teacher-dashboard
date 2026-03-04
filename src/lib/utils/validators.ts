import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';

type PasswordFields = {
  password: string;
  repeat: string;
};

type ValidationError<T> = {
  data: T;
  field: keyof T;
  msg: string;
};

export function validatePasswordFields(
  data: PasswordFields,
): Result<PasswordFields, ValidationError<PasswordFields>> {
  if (data.password.length < 3) {
    return err({ data, field: 'password', msg: 'Password too short.' });
  } else if (data.password !== data.repeat) {
    return err({ data, field: 'repeat', msg: 'Passwords do not match.' });
  } else {
    return ok(data);
  }
}

export function validateEmailField(data: {
  email: string;
}): Result<{ email: string }, ValidationError<{ email: string }>> {
  const emailRegex = /\S+@\S+\.\S+/;
  if (emailRegex.test(data.email)) {
    return ok(data);
  } else {
    return err({ data, field: 'email', msg: 'Email is invalid.' });
  }
}

export function validateGroupNameField(data: {
  name: string;
}): Result<{ name: string }, ValidationError<{ name: string }>> {
  if (data.name.length < 1) {
    return err({
      data,
      field: 'name',
      msg: 'Group name required.',
    });
  } else {
    return ok(data);
  }
}

export function validateAssignmentNameField(data: {
  name: string;
}): Result<{ name: string }, ValidationError<{ name: string }>> {
  if (data.name.length < 1) {
    return err({
      data,
      field: 'name',
      msg: 'Group name required.',
    });
  } else {
    return ok(data);
  }
}
