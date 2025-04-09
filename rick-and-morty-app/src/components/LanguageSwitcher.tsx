import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select 
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="absolute top-4 right-4 p-2 border rounded"
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="es">Spanish </option>

    </select>
  );
}