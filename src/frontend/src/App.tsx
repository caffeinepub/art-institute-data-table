import { ArtworkTable } from './components/ArtworkTable';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ArtworkTable />
      </main>
      <Footer />
    </div>
  );
}

export default App;
