import React from 'react';
import type { Tile, Player } from '../hooks/useGameLogic';

interface BoardProps {
  tiles: Tile[];
  players: Player[];
}

const getTileIcon = (tile: Tile) => {
  if (tile.type === 'START') return <i className="fas fa-flag-checkered text-2xl"></i>;
  if (tile.type === 'PRISON') return <i className="fas fa-handcuffs text-2xl"></i>;
  if (tile.type === 'CHANCE') return <i className="fas fa-bolt-lightning text-2xl"></i>;
  
  if (tile.toiletType === 'NONE') return <i className="fas fa-house-chimney-crack opacity-30 text-2xl"></i>;
  if (tile.toiletType === 'SMALL') return <i className="fas fa-toilet text-[var(--vital-blue)] text-2xl"></i>;
  if (tile.toiletType === 'LARGE') return <i className="fas fa-restroom text-[var(--vital-blue)] text-3xl"></i>;
  
  return null;
};

const Board: React.FC<BoardProps> = ({ tiles, players }) => {
  // A standard 24-tile board(7x7 minus middle)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tileOrder= [
    0, 1, 2, 3, 4, 5, 6,
    23,             7,
    22,            8,
    21,             9,
    20,             10,
    19,             11,
    18, 17, 16, 15, 14, 13, 12
  ];

  return (
    <div className="grid grid-cols-7 grid-rows-7 gap-1 sm:gap-2 w-full max-w-4xl aspect-square mx-auto p-2 sm:p-4 bg-[#111] border-2 sm:border-4 border-[#333] relative">
      {/* Decorative background logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <i className="fas fa-toilet-paper text-[12rem] sm:text-[20rem] rotate-12"></i>
      </div>

      {Array.from({ length: 49 }).map((_, index) => {
       const row = Math.floor(index / 7);
       const col = index % 7;
       const isEdge = row === 0 || row === 6 || col === 0 || col === 6;

       if (!isEdge) {
           if (row === 3 && col === 3) {
                return (
                    <div key={index} className="col-span-1 row-span-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--construction-orange)] p-2">
                        <span className="text-[var(--construction-orange)] font-bold text-lg text-center leading-none">THE WAY: CAMBODIA</span>
                    </div>
                );
            }
            return <div key={index} />;
        }

        // Map grid index back to Monopoly tile index
        // This is a simplified mapping for a 7x7 board
        let tileIndex = -1;
       if (row === 0) tileIndex = col;
        else if (col === 6) tileIndex = 6 + row;
        else if (row === 6) tileIndex = 12 + (6 - col);
        else if (col === 0) tileIndex = 18 + (6 - row);

       const tile = tiles[tileIndex];
       const playersOnTile = players.filter(p => p.position === tileIndex);

        return (
          <div 
            key={index}
            className={`
              relative flex flex-col items-center justify-between p-2 border-2 transition-all duration-300
              ${tileIndex === 0 ? 'bg-[var(--vital-blue)] text-black border-white' : 'bg-[#222] border-[#444]'}
              ${tile.type === 'CHANCE' ? 'border-[var(--construction-orange)]' : ''}
              ${tile.type === 'PRISON' ? 'border-[var(--danger-red)]' : ''}
              hover:border-[var(--construction-orange)] hover:scale-105 z-10
            `}
          >
            <span className="text-[10px] font-bold opacity-50 self-start">{tileIndex}</span>
            <div className="flex-1 flex items-center justify-center">
                {getTileIcon(tile)}
            </div>
            <span className="text-[10px] uppercase font-bold text-center leading-tight truncate w-full">
              {tile.nameZh || tile.name}
            </span>

            {/* Players on tile */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 pointer-events-none">
                {playersOnTile.map(p => (
                    <div 
                        key={p.id} 
                        className={`
                            w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold shadow-lg transform scale-125
                            ${p.role === 'VILLAGER' ? 'bg-green-500' : 'bg-[var(--construction-orange)]'}
                        `}
                    >
                        {p.role === 'VILLAGER' ? 'V' : p.role.split('_')[1]}
                    </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Board;
