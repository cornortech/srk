import { CardVariant } from 'apps/grow/src/lib/types/dashboard';
import { ReactNode } from 'react';
import {
  ERROR,
  GOLD_LIGHT,
  GOLD_PRIMARY,
  INFO,
  SUCCESS,
} from '../../constants';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: CardVariant;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  padding?: 'sm' | 'md' | 'lg';
  blur?: 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  variant = 'neutral',
  colSpan = 1,
  rowSpan = 1,
  padding = 'md',
  blur = 'md',
}) => {
  const getVariantColor = (): string => {
    switch (variant) {
      case 'gold':
        return GOLD_PRIMARY;
      case 'emerald':
        return SUCCESS;
      case 'violet':
        return '#8B5CF6';
      case 'blue':
        return INFO;
      case 'rose':
        return ERROR;
      case 'cyan':
        return '#06B6D4';
      default:
        return GOLD_LIGHT;
    }
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
  };

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-1 md:row-span-2',
  };

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const variantColor = getVariantColor();

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        transition-all duration-300
        ${colSpanClasses[colSpan]}
        ${rowSpanClasses[rowSpan]}
        ${paddingClasses[padding]}
        ${blurClasses[blur]}
        ${hoverEffect ? 'hover:scale-[1.02] hover:shadow-2xl' : ''}
        ${className}
      `}
      style={{
        background:
          variant === 'neutral'
            ? 'rgba(20, 17, 14, 0.7)'
            : `linear-gradient(135deg, ${variantColor}05, transparent 70%)`,
        border: `1px solid ${
          variant === 'neutral'
            ? 'rgba(225, 186, 115, 0.15)'
            : `${variantColor}30`
        }`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {hoverEffect && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${variantColor}15, transparent 70%)`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
