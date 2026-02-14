import { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('karambola_isPlaying');
    return saved ? JSON.parse(saved) : false;
  });

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('karambola_players');
    return saved ? JSON.parse(saved) : [];
  });

  const [gameStartTime, setGameStartTime] = useState(() => {
    const saved = localStorage.getItem('karambola_startTime');
    return saved ? JSON.parse(saved) : null;
  });

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('karambola_isPlaying', JSON.stringify(isPlaying));
    localStorage.setItem('karambola_players', JSON.stringify(players));
    localStorage.setItem('karambola_startTime', JSON.stringify(gameStartTime));
  }, [isPlaying, players, gameStartTime]);

  // Setup Handler
  const handleStartGame = (initialPlayers) => {
    setPlayers(initialPlayers);
    setIsPlaying(true);
    setGameStartTime(Date.now());
  };

  // Game Logic Handlers
  const handleUpdateScore = (playerId, change) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== playerId) return p;

      const newScore = p.score + change;
      const newHistory = [...p.history, { val: change, timestamp: Date.now() }];

      return { ...p, score: newScore, history: newHistory };
    }));
  };

  const handleSetManualWinner = (playerId) => {
    setPlayers(prev => prev.map(p => {
      // Toggle if already winner, otherwise set as winner and unset others?
      // "Mark some player as winner". Usually only one winner.
      // Let's toggle. If ID matches and already true -> false.
      // If ID matches and false -> true.
      // Others -> false (exclusive winner).
      if (p.id === playerId) {
        return { ...p, manualWinner: !p.manualWinner };
      }
      return { ...p, manualWinner: false };
    }));
  };

  const handleResetScores = () => {
    if (confirm('Vuoi davvero azzerare tutti i punteggi?')) {
      setPlayers(prev => prev.map(p => ({ ...p, score: 0, history: [] })));
      setGameStartTime(Date.now()); // Reset timer on match restart
    }
  };

  const handleResetGame = () => {
    if (confirm('Vuoi terminare la partita e tornare al menu?')) {
      setIsPlaying(false);
      setPlayers([]);
      setGameStartTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 font-sans text-gray-900">
      {isPlaying ? (
        <GameScreen
          players={players}
          gameStartTime={gameStartTime}
          onUpdateScore={handleUpdateScore}
          onSetWinner={handleSetManualWinner}
          onResetGame={handleResetGame}
          onRestartMatch={handleResetScores}
        />
      ) : (
        <SetupScreen onStartGame={handleStartGame} />
      )}
    </div>
  );
}
