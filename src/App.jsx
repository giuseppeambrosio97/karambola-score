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
      const newHistory = [...p.history, { val: change, scoreAfter: newScore, timestamp: Date.now() }];

      return { ...p, score: newScore, history: newHistory };
    }));
  };

  // Rollback: remove the last N history entries (from the end) up to and including the target index
  const handleRollbackScore = (playerId, historyIndex) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== playerId) return p;

      // historyIndex is the index in the original (non-reversed) history array
      const newHistory = p.history.slice(0, historyIndex);
      const newScore = newHistory.length > 0
        ? newHistory[newHistory.length - 1].scoreAfter ?? 0
        : 0;

      return { ...p, score: newScore, history: newHistory };
    }));
  };

  // Undo single entry: remove just one entry, recalculate subsequent scoreAfter values
  const handleUndoSingleEntry = (playerId, historyIndex) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== playerId) return p;

      const newHistory = [...p.history];
      newHistory.splice(historyIndex, 1);

      // Recalculate scoreAfter for all entries from the removed index onward
      let runningScore = historyIndex > 0
        ? (newHistory[historyIndex - 1].scoreAfter ?? 0)
        : 0;

      for (let i = historyIndex; i < newHistory.length; i++) {
        runningScore += newHistory[i].val;
        newHistory[i] = { ...newHistory[i], scoreAfter: runningScore };
      }

      const newScore = newHistory.length > 0
        ? newHistory[newHistory.length - 1].scoreAfter ?? 0
        : 0;

      return { ...p, score: newScore, history: newHistory };
    }));
  };

  const handleSetManualWinner = (playerId) => {
    setPlayers(prev => prev.map(p => {
      // Toggle winner status for the selected player
      if (p.id === playerId) {
        return { ...p, manualWinner: !p.manualWinner };
      }
      return p;
    }));
  };

  const handleResetScores = () => {
    if (confirm('Vuoi davvero azzerare tutti i punteggi?')) {
      setPlayers(prev => prev.map(p => ({ ...p, score: 0, history: [], manualWinner: false })));
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
          onRollbackScore={handleRollbackScore}
          onUndoSingleEntry={handleUndoSingleEntry}
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
