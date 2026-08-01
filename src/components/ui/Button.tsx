import type { ComponentProps } from 'react';
import { Button as AriaButton } from 'react-aria-components';

type Props = ComponentProps<typeof AriaButton> & { variant?: 'primary' | 'secondary' | 'quiet' | 'icon' };
export function Button({ variant = 'secondary', className = '', ...props }: Props) {
  return <AriaButton {...props} className={`button button--${variant} ${className}`} />;
}
