'use client';

import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface BatteryVisualProps {
  level: number;
  extensionPacks: number;
  isCharging?: boolean;
  className?: string;
}

export function BatteryVisual({ level, extensionPacks, isCharging, className }: BatteryVisualProps) {
  const totalUnits = 1 + extensionPacks;
  
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="flex items-end gap-2">
        {/* Main Powerwall */}
        <div className="relative">
          <div className="relative w-24 h-36 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 overflow-hidden shadow-2xl">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-700 rounded-t-md" />
            <div 
              className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out"
              style={{ height: `${level}%` }}
            >
              <div className="w-full h-full bg-gradient-to-t from-volt-500 to-volt-400 opacity-90" />
              {isCharging && (
                <div className="absolute inset-0 bg-gradient-to-t from-volt-400 to-transparent animate-pulse" />
              )}
            </div>
            <div className="absolute inset-0 opacity-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-slate-600" style={{ height: '25%' }} />
              ))}
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <Zap className={cn('w-6 h-6 transition-colors duration-500', level > 20 ? 'text-white' : 'text-slate-500')} />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-mono text-sm font-bold">
              {level}%
            </div>
          </div>
          <p className="text-xs text-center text-slate-500 mt-2 font-medium">Powerwall 3</p>
        </div>
        
        {/* Extension packs */}
        {[...Array(extensionPacks)].map((_, i) => (
          <div key={i} className="relative">
            <div className="relative w-20 h-32 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 overflow-hidden shadow-xl opacity-90">
              <div 
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out"
                style={{ height: `${level}%` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-volt-600 to-volt-500 opacity-80" />
              </div>
              <div className="absolute inset-0 opacity-20">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="border-b border-slate-600" style={{ height: '25%' }} />
                ))}
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center">
                <span className="text-slate-400 text-xs">+</span>
              </div>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">Ext. {i + 1}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-2xl font-display font-bold text-slate-900">
          {(13.5 * totalUnits).toFixed(1)} kWh
        </p>
        <p className="text-sm text-slate-500">Total Capacity</p>
      </div>
    </div>
  );
}
