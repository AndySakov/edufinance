import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface CardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
  color: "default" | "primary" | "secondary" | "accent" | "muted";
}

export interface StatGroupProps {
  cards: CardProps[];
}

export function StatGroup({ cards }: StatGroupProps) {
  return (
    <div>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card, index) => (
          <Card key={index} variant="outline">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="font-bold text-3xl">{card.value}</div>
              <p className="text-sm">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
