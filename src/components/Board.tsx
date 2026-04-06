import React from 'react';
import type { Tile, Player } from '../hooks/useGameLogic';

interface BoardProps {
  tiles: Tile[];
  players: Player[];
}

const PLAYER_COLORS = ['#FF8C69', '#70C8E8', '#FFD166', '#C4A8E0'];
const PLAYER_EMOJIS = ['🏠', '⭐', '🌸', '🎪'];

const getTileDisplay = (tile: Tile) => {
  if (tile.type === 'START')   return { icon: '✈️', label: '出發', extra: 'tile-start' };
  if (tile.type === 'PRISON')  return { icon: '😵', label: '困境', extra: 'tile-prison' };
  if (tile.type === 'CHANCE')  return { icon: '🎲', label: '機會', extra: 'tile-chance' };
  if (tile.toiletType === 'LARGE')  return { icon: '🚿', label: tile.nameZh || tile.name, extra: 'tile-upgraded' };
  if (tile.toiletType === 'SMALL')  return { icon: '🚽', label: tile.nameZh || tile.name, extra: 'tile-upgraded' };
  return { icon: '🏚️', label: tile.nameZh || tile.name, extra: 'tile-village' };
};

const Board: React.FC<BoardProps> = ({ tiles, players }) => {
  return (
    <div className="board-wrapper w-full max-w-2xl mx-auto">
      <div
        className="grid gap-1"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(7, 1fr)',
          aspectRatio: '1 / 1',
        }}
      >
        {/* Center decoration (rows 1-5, cols 1-5 in 0-indexed) */}
        {Array.from({ length: 49 }).map((_, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const isEdge = row === 0 || row === 6 || col === 0 || col === 6;

          if (!isEdge) {
            // Center piece spanning the middle
            if (row === 1 && col === 1) {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-center"
                  style={{
                    gridColumn: '2 / 7',
                    gridRow: '2 / 7',
                    background: 'rgba(255, 254, 242, 0.7)',
                    borderRadius: '1.25rem',
                    border: '2px dashed rgba(94, 171, 120, 0.4)',
                    padding: '0.5rem',
                  }}
                >
                  <div className="text-4xl mb-2 float-anim">🌏</div>
                  <p
                    className="font-bold leading-tight"
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      color: '#5EAB78',
                      fontSize: 'clamp(0.6rem, 1.5vw, 1rem)',
                    }}
                  >
                    THE WAY
                  </p>
                  <p
                    className="leading-tight mt-0.5"
                    style={{
                      color: '#9C7A6A',
                      fontSize: 'clamp(0.45rem, 1vw, 0.7rem)',
                    }}
                  >
                    柬埔寨廁所計劃
                  </p>
                  <div className="flex gap-1 mt-2 text-xs">
                    <span title="月経困境">🩸</span>
                    <span title="騷擾困境">🌙</span>
                    <span title="安全困境">🛡️</span>
                  </div>
                </div>
              );
            }
            // Skip all other interior cells (they're covered by the spanning div)
            if (row >= 1 && row <= 5 && col >= 1 && col <= 5) return null;
            return <div key={index} />;
          }

          // Map grid index → tile index
          let tileIndex = -1;
          if (row === 0)      tileIndex = col;
          else if (col === 6) tileIndex = 6 + row;
          else if (row === 6) tileIndex = 12 + (6 - col);
          else if (col === 0) tileIndex = 18 + (6 - row);

          const tile = tiles[tileIndex];
          if (!tile) return <div key={index} />;
          const playersOnTile = players.filter(p => p.position === tileIndex);
          const { icon, label, extra } = getTileDisplay(tile);

          return (
            <div
              key={index}
              className={`board-tile-base ${extra} relative`}
              style={{ minWidth: 0 }}
            >
              {/* Tile number */}
              <span
                style={{
                  fontSize: '0.5rem',
                  color: '#9C7A6A',
                  alignSelf: 'flex-start',
                  lineHeight: 1,
                }}
              >
                {tileIndex}
              </span>

              {/* Tile icon */}
              <div
                style={{
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.5rem)',
                  lineHeight: 1,
                  margin: 'auto 0',
                }}
              >
                {icon}
              </div>

              {/* Tile name */}
              <span
                style={{
                  fontSize: 'clamp(0.35rem, 0.9vw, 0.6rem)',
                  color: '#5C3D2E',
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  wordBreak: 'break-all',
                  width: '100%',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {label}
              </span>

              {/* Player tokens */}
              {playersOnTile.length > 0 && (
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 pointer-events-none p-1">
                  {playersOnTile.map((p, i) => (
                    <div
                      key={p.id}
                      title={p.role}
                      style={{
                        width: 'clamp(12px, 3vw, 20px)',
                        height: 'clamp(12px, 3vw, 20px)',
                        borderRadius: '50%',
                        background: PLAYER_COLORS[players.indexOf(p)] || '#FF8C69',
                        border: '2px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(6px, 1.5vw, 10px)',
                        fontWeight: 800,
                        color: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        zIndex: 20,
                      }}
                    >
                      {p.role === 'VILLAGER' ? '村' : (i).toString()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
