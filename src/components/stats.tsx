import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  id: string;
  label: string;
  value: string;
  image: string;
  alt: string;
}

const stats: StatItem[] = [
  {
    id: "users",
    label: "Registered Users",
    value: "25,000+",
    image: "/images/stats/users.jpg",
    alt: "Group of players smiling while checking their phones",
  },
  {
    id: "prize-pool",
    label: "Total Prize Pool",
    value: "$150,000",
    image: "/images/stats/prize-pool.jpg",
    alt: "Winner celebrating after receiving their prize",
  },
  {
    id: "draws",
    label: "Draws Completed",
    value: "47",
    image: "/images/stats/draws.jpg",
    alt: "Admin team reviewing a completed draw",
  },
  {
    id: "countries",
    label: "Countries",
    value: "120+",
    image: "/images/stats/countries.jpg",
    alt: "World map dotted with players from different countries",
  },
];

export function StatsSection() {
  return (
    <section className="border-t border-border/60 bg-card/30 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(({ id, label, value, image, alt }) => (
            <Card key={id} className="overflow-hidden">
              <div className="relative h-32 w-full sm:h-36">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
              <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
                <p className="text-2xl font-semibold sm:text-3xl">{value}</p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
