"use client";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { mix, palette } from "@/lib/palette-helper";

type Stat = { value: string; label: string };

export function StatsBarClient({ stats }: { stats: Stat[] }) {
  return (
    <section
      className="border-y"
      style={{
        borderColor: mix(palette.section.accent, 16, "#e2e8f0"),
        backgroundColor: mix(palette.section.accent, 6, "white"),
      }}
    >
      {/* แก้: เอา <dl> ข้างนอกออก ใช้ <div> แทน เพราะ StaggerContainer render <dl> อยู่แล้ว */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <StaggerContainer
          as="dl"
          staggerChildren={0.12}
          className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label} as="div" y={16} className="text-center lg:text-left">
              <dt
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ color: palette.section.accent }}
              >
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm text-slate-600">{stat.label}</dd>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}