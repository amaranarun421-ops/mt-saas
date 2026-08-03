"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Sparkles, Clock } from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { formatMonthDay, formatNumber } from "@/lib/format";

interface UsageDashboardProps {
  dailyGenerations: { date: string; count: number }[];
  styleDistribution: { style: string; count: number }[];
  creditsUsed: number;
  imagesGenerated: number;
  favoritesCount: number;
  publicCount: number;
}

const STYLE_COLORS: Record<string, string> = {
  photographic: "#7c3aed",
  anime: "#ff3d81",
  "3d-render": "#3b82f6",
  painting: "#f59e0b",
  sketch: "#10b981",
};

const STYLE_LABELS: Record<string, string> = {
  photographic: "Photographic",
  anime: "Anime",
  "3d-render": "3D Render",
  painting: "Painting",
  sketch: "Sketch",
};

export function UsageDashboard({
  dailyGenerations,
  styleDistribution,
  creditsUsed,
  imagesGenerated,
  favoritesCount,
  publicCount,
}: UsageDashboardProps) {
  const maxDaily = Math.max(1, ...dailyGenerations.map((d) => d.count));
  const totalStyleCount = Math.max(1, styleDistribution.reduce((sum, item) => sum + item.count, 0));

  return (
    <div className="driftframe-container-wide space-y-6 py-6">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#7c3aed]" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">Usage</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          How you&apos;ve been using Driftframe. Updated in real time.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Images generated" value={formatNumber(imagesGenerated)} icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Credits used" value={formatNumber(creditsUsed)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Favorites" value={formatNumber(favoritesCount)} icon={<BarChart3 className="h-4 w-4" />} />
        <StatCard label="Public images" value={formatNumber(publicCount)} icon={<Clock className="h-4 w-4" />} />
      </div>

      <GlassPanel>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-medium">Generations - last 30 days</h2>
          <span className="text-xs text-muted-foreground">
            {dailyGenerations.reduce((sum, item) => sum + item.count, 0)} total
          </span>
        </div>
        <div className="mt-6">
          <GenerationsChart data={dailyGenerations} max={maxDaily} />
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassPanel>
          <h2 className="font-display text-base font-medium">Style distribution</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Which presets you reach for most.
          </p>
          <div className="mt-6 space-y-3">
            {styleDistribution.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No generations yet - start creating to see your style mix.
              </p>
            ) : (
              styleDistribution.map((row) => {
                const pct = (row.count / totalStyleCount) * 100;
                return (
                  <div key={row.style}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{STYLE_LABELS[row.style] ?? row.style}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {row.count} - {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: STYLE_COLORS[row.style] ?? "#7c3aed",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassPanel>

        <GlassPanel>
          <h2 className="font-display text-base font-medium">Credits used</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Cumulative credits consumed by generations.
          </p>
          <div className="mt-6 flex items-baseline gap-2">
            <p className="font-display text-5xl font-semibold tabular-nums text-[#7c3aed]">
              {formatNumber(creditsUsed)}
            </p>
            <p className="text-sm text-muted-foreground">credits</p>
          </div>
          <div className="mt-4 rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
            <p>
              Each generation consumes <span className="font-medium text-foreground">4 credits</span>{" "}
              and produces <span className="font-medium text-foreground">4 images</span>.
            </p>
            <p className="mt-1">
              You&apos;ve generated <span className="font-medium text-foreground">{imagesGenerated} images</span>{" "}
              across all time.
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <GlassPanel>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </GlassPanel>
  );
}

function GenerationsChart({
  data,
  max,
}: {
  data: { date: string; count: number }[];
  max: number;
}) {
  const width = 800;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 28, left: 28 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const barGap = 2;
  const barW = Math.max(2, innerW / data.length - barGap);
  const yTicks = [0, Math.round(max / 2), max];

  return (
    <div className="driftframe-scroll w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[600px]" role="img" aria-label="Generations over the last 30 days">
        {yTicks.map((tick) => {
          const y = padding.top + innerH - (tick / max) * innerH;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
              <text
                x={padding.left - 4}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill="currentColor"
                fillOpacity="0.5"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((item, index) => {
          const barH = (item.count / max) * innerH;
          const x = padding.left + index * (barW + barGap);
          const y = padding.top + innerH - barH;
          return (
            <g key={item.date}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(0, barH)}
                rx="1.5"
                fill="#7c3aed"
                fillOpacity={item.count > 0 ? 0.85 : 0.15}
              >
                <title>{`${item.date}: ${item.count} generations`}</title>
              </rect>
            </g>
          );
        })}

        {[0, Math.floor(data.length / 2), data.length - 1]
          .filter((index, itemIndex, arr) => arr.indexOf(index) === itemIndex)
          .map((index) => {
            const item = data[index];
            if (!item) return null;
            const x = padding.left + index * (barW + barGap) + barW / 2;
            return (
              <text
                key={item.date}
                x={x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                fillOpacity="0.5"
              >
                {formatMonthDay(item.date)}
              </text>
            );
          })}
      </svg>
    </div>
  );
}