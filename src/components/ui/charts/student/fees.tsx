import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../chart";
import { ClassAttributes, HTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import { convertToAbbreviation } from "@/shared/helpers";

export function StudentFeeChart(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement> & {
      feesByMonth: Array<{ month: string; amount: number }>;
    }
) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          amount: {
            label: "Fees Paid",
            color: "var(--background-primary)",
          },
        }}
        className="min-h-[300px]"
      >
        <BarChart
          accessibilityLayer
          data={props.feesByMonth}
          dataKey={"amount"}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            dataKey="amount"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            tickFormatter={(value) => convertToAbbreviation(value)}
          />
          <ChartTooltip
            cursor={true}
            formatter={(value) =>
              convertToAbbreviation(Number(value.toString()))
            }
            labelStyle={{ display: "flex", alignItems: "stretch" }}
            content={<ChartTooltipContent />}
          />
          <Bar dataKey="amount" barSize={30} fill="var(--background-primary)" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
