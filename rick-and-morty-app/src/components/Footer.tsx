// components/Footer.tsx
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import i18n from '../i18n';

const FooterContainer = styled('footer')({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(26, 6, 48, 0.85)',
  backdropFilter: 'blur(6px)',
  borderTop: '1px solid rgba(156, 39, 176, 0.4)',
  padding: '8px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  height: '48px',
});

const FooterContent = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr', // Three-column layout
  width: '100%',
  maxWidth: '1200px',
  alignItems: 'center',
});

const CenteredContent = styled(Box)({
  gridColumn: 2, // Middle column
  display: 'flex',
  justifyContent: 'center',
});

const RightContent = styled(Box)({
  gridColumn: 3, // Right column
  display: 'flex',
  justifyContent: 'flex-end',
});

const CopyrightText = styled(Typography)({
  color: '#e0d6eb',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
});

const LanguageSelect = styled(Select)({
  color: '#ffffff',
  fontSize: '0.75rem',
  height: '32px',
  minWidth: '100px',
  '& .MuiSelect-icon': {
    color: '#ffffff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(156, 39, 176, 0.4)',
  },
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '@media (max-width: 400px)': {
    minWidth: '80px',
    fontSize: '0.65rem',
  },
});

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'es', name: 'ES' },
  ];

  return (
    <FooterContainer>
      <FooterContent>
        {/* Empty left column */}
        <div></div>
        
        <CenteredContent>
          <CopyrightText variant="body2">
            © {currentYear} Rick and Morty Universe
          </CopyrightText>
        </CenteredContent>
        
        <RightContent>
          <LanguageSelect
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value as string)}
            variant="outlined"
            size="small"
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1a0630',
                  color: '#e0d6eb',
                },
              },
            }}
          >
            {languages.map((lang) => (
              <MenuItem 
                key={lang.code} 
                value={lang.code}
                sx={{ fontSize: '0.75rem' }}
              >
                {lang.name}
              </MenuItem>
            ))}
          </LanguageSelect>
        </RightContent>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;