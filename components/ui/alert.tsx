'use client';

import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-4', {
  variants: {
    variant: {
      default: 'bg-background border-border text-foreground',
      accent:  'bg-accent/50 border-accent text-accent-foreground',
      destructive: 'bg-destructive/50 border-destructive text-destructive-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
          VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);

Alert.displayName = 'Alert';

export { Alert };