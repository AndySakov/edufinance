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
      <div className="flex flex-wrap justify-center md:justify-between gap-4 my-6 md:my-0 w-full">
        {cards.map((card, index) => (
          <Card
            key={index}
            variant="outline"
            className="my-2 min-w-72 max-w-72"
          >
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
