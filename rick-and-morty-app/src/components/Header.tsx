import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';

// Styled component for title with Bungee Tint font
const TitleText = styled('h1')({
  fontFamily: '"Bungee Tint", sans-serif',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '4rem',
  background: 'linear-gradient(to right, #c084fc, #ec4899)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  marginBottom: '1rem',
  textAlign: 'center',
  '@media (max-width: 768px)': {
    fontSize: '3rem'
  }
});

// Styled component for subtitle with Underdog font
const SubtitleText = styled('p')({
  fontFamily: '"Underdog", system-ui',
  fontWeight: 400,
  fontStyle: 'normal',
  color: '#e9d5ff',
  fontSize: '1.5rem',
  marginTop: '0.5rem',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  textAlign: 'center',
  width: '100%',
  '@media (max-width: 768px)': {
    fontSize: '1.25rem'
  }
});

// Styled arrow component
const ArrowBackground = styled(motion.div)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '-100px',
    width: 'calc(100% + 200px)',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(156, 39, 176, 0.6), transparent)',
    transform: 'translateY(-50%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    right: '-20px',
    width: '40px',
    height: '40px',
    borderRight: '2px solid rgba(156, 39, 176, 0.6)',
    borderTop: '2px solid rgba(156, 39, 176, 0.6)',
    transform: 'translateY(-50%) rotate(45deg)',
  }
});

// Styled container for centered content with border
const CenteredContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  paddingBottom: '2rem',
  borderBottom: '1px solid rgba(156, 39, 176, 0.3)',
  marginBottom: '1rem'
});

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="relative w-full min-h-[70vh] flex items-center justify-center mb-8">
      {/* Arrow Background */}
      <ArrowBackground
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { duration: 1 }
        }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ 
            x: '100%',
            transition: { 
              duration: 8,
              repeat: Infinity,
              ease: "linear" 
            }
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100px',
            height: '2px',
            background: 'rgba(156, 39, 176, 0.6)'
          }}
        />
      </ArrowBackground>

      {/* Centered Content with Border */}
      <CenteredContent>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TitleText>
            {t('title')}
          </TitleText>
          <SubtitleText>
            {t('subtitle')}
          </SubtitleText>
        </motion.div>
      </CenteredContent>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bungee+Tint&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Underdog&display=swap');
      `}</style>
    </header>
  );
}