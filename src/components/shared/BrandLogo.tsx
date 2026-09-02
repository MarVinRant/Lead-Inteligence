import horizontalLight from '../../assets/brand/logo-horizontal-light.svg';
import horizontalDark from '../../assets/brand/logo-horizontal-dark.svg';
import verticalLight from '../../assets/brand/logo-vertical-light.svg';
import verticalDark from '../../assets/brand/logo-vertical-dark.svg';
import symbolLight from '../../assets/brand/symbol-light.svg';
import symbolDark from '../../assets/brand/symbol-dark.svg';

type Orientation = 'horizontal' | 'vertical' | 'symbol';
type Theme = 'light' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const sourceByVariant: Record<`${Orientation}-${Theme}`, string> = {
  'horizontal-light': horizontalLight, 'horizontal-dark': horizontalDark,
  'vertical-light': verticalLight, 'vertical-dark': verticalDark,
  'symbol-light': symbolLight, 'symbol-dark': symbolDark,
};

const dimensions: Record<Size, Record<Orientation, string>> = {
  sm: { horizontal: 'h-6 w-auto', vertical: 'h-10 w-auto', symbol: 'h-7 w-7' },
  md: { horizontal: 'h-8 w-auto', vertical: 'h-14 w-auto', symbol: 'h-9 w-9' },
  lg: { horizontal: 'h-10 w-auto', vertical: 'h-20 w-auto', symbol: 'h-11 w-11' },
};

export function BrandLogo({ orientation = 'horizontal', theme = 'light', size = 'md', compact = false, className = '' }: { orientation?: Orientation; theme?: Theme; size?: Size; compact?: boolean; className?: string }) {
  const resolvedOrientation = compact ? 'symbol' : orientation;
  return <img src={sourceByVariant[`${resolvedOrientation}-${theme}`]} alt="RanTech" className={`${dimensions[size][resolvedOrientation]} block shrink-0 object-contain ${className}`} />;
}
