/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, Team } from '../types';
import { Award } from 'lucide-react';

interface RecordsViewProps {
  players: Player[];
  teams: Team[];
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  players,
  teams
}) => {
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'team' | 'milestones'>( 'batting' );
  const [battingMetric, setBattingMetric] = useState<'runs' | 'hs' | 'sixes' | 'fours'>('runs');

  const getTeam = (id: string) => teams.find(t => t.id === id) || { emoji: '🛡️', name: 'N/A' };

  // Bowling lists
  const bowlersByWickets = [...players].filter(p => p.wickets > 0).sort((a,b)=>b.wickets - a.wickets).slice(0, 8);
  const bowlersByMaidens = [...players].filter(p => p.maidens > 0).sort((a,b)=>b.maidens - a.maidens).slice(0, 8);
  const playersByCatches = [...players].filter(p => p.catches > 0).sort((a,b)=>b.catches - a.catches).slice(0, 8);

  const renderLeaderboardRows = (list: Player[], key: 'runs' | 'hs' | 'sixes' | 'fours', label: string, color: string) => {
    const sorted = [...list].sort((a, b) => b[key] - a[key]).slice(0, 8);
    const maxVal = sorted[0]?.[key] || 1;
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 mb-2.5">
          <span className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-700">{label}</span>
          <span className="bg-amber-50 text-amber-808 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-lg font-display uppercase tracking-wider">TOP TIER</span>
        </div>
        <div className="space-y-4">
          {sorted.map((p, i) => {
            const tm = getTeam(p.team);
            const percent = Math.max(5, (p[key] / maxVal) * 100);
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg font-black font-display text-xs flex items-center justify-center shrink-0 border ${
                  i === 0 ? 'bg-amber-50 border-amber-300 text-amber-800' :
                  i === 1 ? 'bg-slate-50 border-slate-300 text-slate-705' :
                  i === 2 ? 'bg-amber-50/50 border-amber-200 text-amber-705' :
                  'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {i + 1}
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-250 bg-white flex items-center justify-center shrink-0 font-black font-display text-xs overflow-hidden select-none">
                  {p.photoUrl ? <img src={p.photoUrl} alt="avatar" className="w-full h-full object-cover" /> : p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-black leading-none">
                    <span className="text-slate-905 truncate">{p.name}</span>
                    <span className={color}>{p[key]}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-bold truncate">{tm.emoji} {tm.name}</div>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${
                      key === 'runs' ? 'from-amber-500 to-amber-400' :
                      key === 'hs' ? 'from-[#0B9B4D] to-[#0A4D2E]' :
                      key === 'sixes' ? 'from-purple-500 to-purple-400' :
                      'from-blue-500 to-blue-405'
                    } rounded-full`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <div className="text-xs text-slate-400 font-semibold tracking-wider mb-1 uppercase">Home / <span className="text-[#0B9B4D]">Records</span></div>
        <h2 className="font-display font-extrabold text-3xl text-slate-900 flex items-center gap-2.5 tracking-tight">
          Records & Leaderboards
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Historical season-bests, high milestones, and team championship ratings.</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex bg-slate-100 rounded-xl p-1 max-w-sm">
        {[
          { id: 'batting', label: 'Batting' },
          { id: 'bowling', label: 'Bowling' },
          { id: 'team', label: 'Teams' },
          { id: 'milestones', label: 'Milestones' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
              activeTab === t.id 
                ? 'bg-white text-[#0B9B4D] shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* RENDER CONTENT BASED ON TABS */}
      <div className="space-y-4">
        
        {/* BATTING RECORDS */}
        {activeTab === 'batting' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-slate-500 font-sans">Filter metric board:</span>
              <select 
                value={battingMetric} 
                onChange={e => setBattingMetric(e.target.value as any)}
                className="px-3.5 py-2 border border-slate-205 rounded-xl text-xs font-bold bg-white focus:outline-[#0B9B4D] focus:outline-2 cursor-pointer"
              >
                <option value="runs">Most Runs</option>
                <option value="hs">Highest Score</option>
                <option value="sixes">Most Sixes</option>
                <option value="fours">Most Fours</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {battingMetric === 'runs' && renderLeaderboardRows(players, 'runs', '🏏 All-Time Roster Runs Leaderboard', 'text-amber-600 font-black')}
              {battingMetric === 'hs' && renderLeaderboardRows(players, 'hs', '⚡ All-Time Highest Roster Scores', 'text-[#0B9B4D] font-black')}
              {battingMetric === 'sixes' && renderLeaderboardRows(players, 'sixes', '🔥 All-Time Most Sixes Hit', 'text-purple-605 font-black')}
              {battingMetric === 'fours' && renderLeaderboardRows(players, 'fours', '🔒 All-Time Most Fours Hit', 'text-blue-600 font-black')}
            </div>
          </div>
        )}

        {/* BOWLING RECORDS */}
        {activeTab === 'bowling' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wickets */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="border-b pb-2.5 mb-2.5">
                <span className="font-display font-extrabold text-xs uppercase text-slate-705 tracking-wider">🎯 Most Wickets</span>
              </div>
              <div className="divide-y divide-slate-100">
                {bowlersByWickets.map((p, i) => (
                  <div key={p.id} className="flex justify-between items-center text-xs py-2.5 font-bold text-slate-755 hover:bg-slate-50/50">
                    <span>{i+1}. {p.name}</span>
                    <span className="font-display font-black text-rose-600">{p.wickets} wkts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Maidens */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="border-b pb-2.5 mb-2.5">
                <span className="font-display font-extrabold text-xs uppercase text-slate-705 tracking-wider">🔒 Most Maidens</span>
              </div>
              <div className="divide-y divide-slate-100">
                {bowlersByMaidens.map((p, i) => (
                  <div key={p.id} className="flex justify-between items-center text-xs py-2.5 font-bold text-slate-755 hover:bg-slate-50/50">
                    <span>{i+1}. {p.name}</span>
                    <span className="font-display font-black text-blue-600">{p.maidens} overs</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catches */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="border-b pb-2.5 mb-2.5">
                <span className="font-display font-extrabold text-xs uppercase text-slate-705 tracking-wider">🧤 Most Catches</span>
              </div>
              <div className="divide-y divide-slate-100">
                {playersByCatches.map((p, i) => (
                  <div key={p.id} className="flex justify-between items-center text-xs py-2.5 font-bold text-slate-755 hover:bg-slate-50/50">
                    <span>{i+1}. {p.name}</span>
                    <span className="font-display font-black text-[#0B9B4D]">{p.catches} catches</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TEAM RECORDS */}
        {activeTab === 'team' && (
          <div className="max-w-md">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="border-b pb-2.5 mb-2.5">
                <span className="font-display font-extrabold text-xs uppercase text-slate-705 tracking-wider font-display">🏆 Club Championship Victories</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[...teams].sort((a,b)=>b.wins - a.wins).map((t, i) => (
                  <div key={t.id} className="flex justify-between items-center text-xs py-2.5 font-bold text-slate-855 hover:bg-slate-50/50">
                    <span className="font-extrabold text-slate-900">{i+1}. {t.emoji} {t.name}</span>
                    <span className="font-display font-black text-[#0B9B4D]">{t.wins} wins</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === 'milestones' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5 mb-2.5">
              <h3 className="font-display font-extrabold text-slate-850 text-sm uppercase tracking-wider flex items-center gap-1.5">
                🎖️ Season-High Career Milestones
              </h3>
            </div>
            <div className="space-y-4">
              {players.filter(p => p.runs >= 1000 || p.wickets >= 50 || p.hundreds > 0).map(p => {
                const tm = getTeam(p.team);
                return (
                  <div key={p.id} className="flex justify-between items-center text-xs pb-3.5 border-b border-slate-100 last:border-none">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-slate-250 bg-white flex items-center justify-center font-black text-xs shrink-0 select-none overflow-hidden">
                        {p.photoUrl ? <img src={p.photoUrl} alt="pic" className="w-full h-full object-cover" /> : p.initials}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{tm.emoji} {tm.name}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap shrink-0">
                      {p.runs >= 1000 && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 font-black rounded-lg text-[9px] uppercase font-display">🏏 1000+ Runs</span>}
                      {p.wickets >= 50 && <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-250 font-black rounded-lg text-[9px] uppercase font-display">🎯 50+ Wkts</span>}
                      {p.hundreds > 0 && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-250 font-black rounded-lg text-[9px] uppercase font-display">💯 {p.hundreds} Tons</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
