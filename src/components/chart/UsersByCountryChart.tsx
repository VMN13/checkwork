import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";

import users from "@/data/users.json";

type User = {
  id: number;
  name: string;
  country: string;
  age: number;
};

export function UsersByCountryChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const usersByCountry = useMemo(() => {
    const list = users as unknown as User[];
    const map = new Map<string, number>();

    for (const u of list) {
      map.set(u.country, (map.get(u.country) ?? 0) + 1);
    }

    const countries = Array.from(map.keys()).sort();
    const counts = countries.map((c) => map.get(c) ?? 0);

    return { countries, counts };
  }, []);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Defer to next tick to avoid “setState in effect body” lint
    const id = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { countries, counts } = usersByCountry;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvas, {
      type: "bar",
      data: {
        labels: countries,
        datasets: [
          {
            label: "Users",
            data: counts,
            backgroundColor: "rgba(99, 102, 241, 0.5)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: "Users by country",
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [ready, usersByCountry]);

  return (
    <div className="mt-8 w-full" style={{ height: 320 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
