interface CountrySelectProps {
  onSelect?: (item: string) => void;
  onClose?: () => void;
  language?: string;
  height?: number;
  letterListHide?: boolean;
  arrowHide?: boolean;
}

declare module 'react-select-country-mw' {
  const CountrySelect: React.FC<CountrySelectProps>;
  export default CountrySelect;
} 