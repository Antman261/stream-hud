import { FunctionComponent } from 'preact';

export const Defined: FunctionComponent<{ value: unknown | undefined }> = ({
  value,
  children,
}) => (value != null ? <>{children}</> : null);

export const Truthy: FunctionComponent<{ value: unknown | undefined }> = ({
  value,
  children,
}) => (value ? <>{children}</> : null);
