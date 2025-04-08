import CharacterList from "./components/CharacterList";
import "./i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Rick and Morty Characters</h1>
      <LanguageSwitcher />
      <CharacterList />
    </div>
  );
}

export default App;