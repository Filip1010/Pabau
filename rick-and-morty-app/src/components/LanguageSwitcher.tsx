// components/LanguageSwitcher.tsx
import { ButtonGroup, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CompactLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = {
    en: 'EN',
    de: 'DE',
    es: 'ES',
  };

  return (
    <ButtonGroup 
      size="small" 
      variant="text" 
      sx={{
        '& .MuiButton-root': {
          minWidth: '32px',
          fontSize: '0.75rem',
          px: 1,
          color: '#ce93d8',
          borderRight: '1px solid rgba(255, 255, 255, 0.1) !important',
          '&:last-child': {
            borderRight: 'none !important'
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        },
      }}
    >
      {Object.entries(languages).map(([code, label]) => (
        <Button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          sx={{
            fontWeight: i18n.language === code ? 700 : 400,
            color: i18n.language === code ? '#ffffff' : 'inherit',
          }}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default CompactLanguageSwitcher;