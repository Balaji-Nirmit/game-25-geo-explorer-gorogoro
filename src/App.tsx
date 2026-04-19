import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Globe2, MapPin, Trophy, ArrowRight, Play } from 'lucide-react';
import { PhotoLocation, getRandomPhotoLocation, LatLng, calculateDistance, calculateScore, PHOTO_LOCATIONS } from './lib/geo';
import { StreetViewFree } from './components/StreetViewFree';
import { GuessMap } from './components/GuessMap';
import { ResultMap } from './components/ResultMap';

type GameState = 'MENU' | 'PLAYING' | 'RESULT' | 'FINAL';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  
  const [playedLocations, setPlayedLocations] = useState<string[]>([]);
  const [targetLocation, setTargetLocation] = useState<PhotoLocation | null>(null);
  const [userGuess, setUserGuess] = useState<LatLng | null>(null);
  
  const [roundDistance, setRoundDistance] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  
  const MAX_ROUNDS = 10;

  const startGame = () => {
    setRound(1);
    setTotalScore(0);
    setPlayedLocations([]);
    startRound([]);
  };

  const startRound = (history: string[]) => {
    setUserGuess(null);
    const newLoc = getRandomPhotoLocation(history);
    setTargetLocation(newLoc);
    setPlayedLocations([...history, newLoc.id]);
    setGameState('PLAYING');
  };

  const handleGuess = (guess: LatLng) => {
    if (!targetLocation) return;
    
    const distanceKm = calculateDistance(targetLocation.lat, targetLocation.lng, guess.lat, guess.lng);
    const score = calculateScore(distanceKm);
    
    setRoundDistance(distanceKm);
    setRoundScore(score);
    setUserGuess(guess);
    setTotalScore(prev => prev + score);
    
    if (score >= 4500) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#eab308']
      });
    }

    setGameState('RESULT');
  };

  const nextRound = () => {
    if (round < MAX_ROUNDS) {
      setRound(prev => prev + 1);
      startRound(playedLocations);
    } else {
      setGameState('FINAL');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[150px] rounded-full" 
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* MENU STATE */}
        {gameState === 'MENU' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, blur: 20 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 z-10"
          >
            {/* Semantic SEO content for crawlers */}
            <div className="sr-only">
              <h1>Geo Explorer - The Best Free Geo Guesser Game</h1>
              <section>
                <h2>Play Geo Guesser Free Online</h2>
                <p>Geo Explorer is the premier free alternative to traditional geography guessing games. Our platform allows you to explore the world through high-fidelity 360° panoramas. With over 520 hand-picked locations across every continent, you'll never run out of new destinations to discover.</p>
              </section>
              <section>
                <h2>How to Play Geo Explorer</h2>
                <ul>
                  <li><strong>Drop in:</strong> You are spawned in a random location using Google Street View technology.</li>
                  <li><strong>Explore:</strong> Look for visual clues like street signs, architecture, flora, and sunlight direction.</li>
                  <li><strong>Pinpoint:</strong> Use the interactive world map to guess your exact location.</li>
                  <li><strong>Score:</strong> The closer your guess, the higher your score. Aim for a perfect 5000 points!</li>
                </ul>
              </section>
              <section>
                <h2>Why Choose Our Geography Challenge?</h2>
                <p>Unlike other geo guessing services, we offer a completely free experience without mandatory subscriptions. Our curated "World Expedition" mode ensures you see the most diverse and interesting parts of our planet.</p>
              </section>
            </div>

            <div className="max-w-4xl w-full flex flex-col items-center space-y-6 sm:space-y-16 py-8">
              <div className="text-center space-y-4 sm:space-y-6">
                <motion.div 
                  initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="inline-flex p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 border border-white/10 shadow-inner mb-2 sm:mb-4"
                >
                  <Globe2 className="w-12 h-12 sm:w-20 sm:h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                </motion.div>
                
                <div className="space-y-1 sm:space-y-2 px-4">
                  <h1 className="text-4xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-none truncate max-w-[90vw]">
                    GEO <span className="text-emerald-500">EXPLORER</span>
                  </h1>
                  <p className="text-[10px] sm:text-xl md:text-2xl text-stone-500 font-medium tracking-[0.2em] uppercase">World Expedition Alpha</p>
                </div>
              </div>

              <div className="w-full max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-14 space-y-6 sm:space-y-10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from- emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <p className="text-sm sm:text-xl text-stone-300 leading-relaxed relative z-10 px-2">
                  Drop into a high-fidelity 360° panorama and test your global intuition. 
                  <span className="hidden sm:inline"> Search for clues in the environment, then pinpoint your location on the map.</span>
                  <span className="block mt-2 sm:mt-4 text-emerald-400 font-bold uppercase tracking-widest text-[8px] sm:text-sm">
                    {PHOTO_LOCATIONS.length} High-Res Curated Destinations
                  </span>
                </p>

                <div className="pt-1 sm:pt-4 relative z-10">
                  <button
                    onClick={startGame}
                    className="w-full bg-white text-black font-black text-lg sm:text-2xl py-4 sm:py-7 rounded-xl sm:rounded-2xl hover:bg-emerald-400 hover:text-white hover:scale-[1.02] transition-all duration-300 shadow-2xl active:scale-95 flex items-center justify-center gap-2 sm:gap-4"
                  >
                    <Play className="w-5 h-5 sm:w-8 sm:h-8 fill-current" />
                    Begin Deployment
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'PLAYING' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 z-[60] p-3 sm:p-8 flex justify-between items-start pointer-events-none gap-2">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-black/60 sm:bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-white/10 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-3 sm:gap-5"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <span className="text-emerald-400 font-black text-sm sm:text-xl">{round}</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-stone-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Progress</div>
                  <div className="text-xs sm:text-lg font-bold text-white leading-none">
                    Round {round} <span className="text-stone-500 font-medium">/ {MAX_ROUNDS}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-black/60 sm:bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-white/10 pointer-events-auto text-right shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-row-reverse items-center gap-3 sm:gap-5"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
                  <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-stone-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 whitespace-nowrap">Total Score</div>
                  <div className="text-base sm:text-2xl font-black font-mono tracking-tighter text-white leading-none">
                    {totalScore.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 360 Open Sphere View */}
            <div className="w-full h-full flex-grow relative z-10">
              <StreetViewFree location={targetLocation} />
            </div>

            {/* Guess Minimap (Leaflet integration on top) */}
            <GuessMap onGuess={handleGuess} disabled={!targetLocation} />
          </motion.div>
        )}

        {/* RESULT STATE */}
        {gameState === 'RESULT' && targetLocation && userGuess && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex p-2 sm:p-12 bg-zinc-950/95 backdrop-blur-2xl z-[200]"
          >
            <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-0 bg-zinc-900 border border-white/10 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              
              {/* Result Info Sidebar */}
              <div className="w-full lg:w-[400px] flex flex-col justify-between p-6 sm:p-12 bg-zinc-900 z-10 shrink-0">
                <div className="space-y-6 sm:space-y-12">
                  <div>
                    <div className="text-emerald-500 font-bold mb-3 tracking-[0.2em] uppercase text-[10px] sm:text-xs">Destination Found</div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white mb-4 line-clamp-3">{targetLocation.name}</h2>
                    <div className="w-12 sm:w-16 h-1 bg-emerald-500 rounded-full" />
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-stone-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Accuracy</p>
                    <div className="flex items-baseline gap-2">
                       <div className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
                        {roundDistance < 1 
                          ? `${(roundDistance * 1000).toFixed(0)}` 
                          : `${roundDistance.toFixed(1)}`}
                      </div>
                      <span className="text-lg sm:text-2xl font-bold text-stone-500">{roundDistance < 1 ? 'm' : 'km'}</span>
                    </div>
                    <div className="text-stone-500 font-medium text-xs sm:text-sm italic">from ground zero</div>
                  </div>

                  <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 space-y-1">
                    <div className="text-stone-400 font-bold uppercase tracking-widest text-[8px] sm:text-[10px]">Round Score</div>
                    <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tighter">
                       +{roundScore.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-6 sm:pt-8">
                  <button
                    onClick={nextRound}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg sm:text-xl py-4 sm:py-6 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
                  >
                    {round < MAX_ROUNDS ? 'Continue Journey' : 'Final Results'}
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Map Display (Leaflet) */}
              <div className="flex-grow min-h-[300px] sm:min-h-[400px] h-full relative border-t lg:border-t-0 border-white/10">
                <ResultMap actual={targetLocation} guess={userGuess} />
                <div className="absolute inset-0 pointer-events-none border-l border-white/10 hidden lg:block" />
              </div>
            </div>
          </motion.div>
        )}

        {/* FINAL STATE */}
        {gameState === 'FINAL' && (
          <motion.div 
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center p-6 bg-zinc-950 z-[300]"
          >
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/10 blur-[150px] rounded-full" />
              <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-2xl w-full text-center space-y-12 bg-zinc-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 sm:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative z-10"
            >
              <div className="space-y-6 relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.4 }}
                  className="mx-auto w-32 h-32 bg-gradient-to-tr from-yellow-500 to-amber-300 rounded-[2rem] flex items-center justify-center shadow-[0_10px_40px_rgba(245,158,11,0.3)] rotate-3 mb-10"
                >
                  <Trophy className="w-16 h-16 text-black" strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-6xl font-black tracking-tight text-white italic">GRAND FINALE</h2>
                <p className="text-stone-400 text-lg font-medium">Your expedition has concluded.</p>
              </div>

              <div className="py-4 sm:py-8 border-y border-white/5 space-y-2">
                <div className="text-stone-500 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs">Consolidated Score</div>
                <div className="text-6xl sm:text-[8rem] font-black font-mono leading-none tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
                  {totalScore.toLocaleString()}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 pt-4">
                <button
                  onClick={() => setGameState('MENU')}
                  className="w-full bg-white text-black font-black text-xl sm:text-2xl py-5 sm:py-7 rounded-2xl sm:rounded-[1.5rem] hover:scale-[1.02] transition-all active:scale-[0.98] shadow-2xl shadow-white/5"
                >
                  Embark Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
