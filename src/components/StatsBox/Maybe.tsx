import { FunctionComponent } from 'preact';

export const Maybe: FunctionComponent<{ value: unknown | undefined }> = ({
  value,
  children,
}) => (value != null ? <>{children}</> : null);
