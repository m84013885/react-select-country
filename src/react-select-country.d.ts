/// <reference types="vite/client" />

interface CountrySelectProps {
    onSelect?: (item: string) => void;
    onClose?: () => void;
    language?: string;
    height?: number;
    letterListHide?: boolean;
    arrowHide?: boolean;
    className?: string;
}

declare module 'react-select-country-mw' {
    const CountrySelect: React.FC<CountrySelectProps>;
    export default CountrySelect;
} 