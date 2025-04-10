// components/LanguageSwitcher.tsx (compact version)
import { ButtonGroup, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CompactLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = {
    en: 'English',
    de: 'Deutsch',
    es: 'Spañol',
  };

  return (
    <ButtonGroup size="small" variant="text" sx={{ ml: 2 }}>
      {Object.entries(languages).map(([code, label]) => (
        <Button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          sx={{
            color: i18n.language === code ? '#ffffff' : '#ce93d8',
            minWidth: '32px',
            fontSize: '0.75rem',
          }}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default CompactLanguageSwitcher;