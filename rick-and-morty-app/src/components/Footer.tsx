// components/Footer.tsx
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CompactLanguageSwitcher from './LanguageSwitcher';

const FooterContainer = styled('footer')({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(26, 6, 48, 0.85)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(156, 39, 176, 0.4)',
  padding: '20px 25px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  height: '58px',
});

const FooterContent = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '24px',
  width: '100%',
  maxWidth: '1200px',
});

const CopyrightText = styled(Typography)({
  color: '#e0d6eb',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
});

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <CopyrightText variant="body2">
          © {currentYear} Rick and Morty Universe
        </CopyrightText>
        <CompactLanguageSwitcher />
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;