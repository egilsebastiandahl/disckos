"use client";

import Button from "@/app/components/button/Button";
import { FlightNumber } from "@/app/types/flight-number.enum";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface DiscInputProps {
  max: number;
  min: number;
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

export default function DiscInput({
  max,
  min,
  title,
  description,
  value,
  onChange,
}: DiscInputProps) {
  return (
    <Card className="min-w-32 md:min-w-3xs">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-background">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1
          className={
            value == FlightNumber.NO_RATING
              ? "text-2xl"
              : "text-2xl text-background"
          }
        >
          {value == FlightNumber.NO_RATING ? "-" : value}
        </h1>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-2">
          <Slider
            min={min}
            max={max}
            defaultValue={[1]}
            value={[value ?? FlightNumber.NO_RATING]}
            onValueChange={(v) => onChange?.(v[0])}
          />
          <Button
            className="bg-background text-foreground hover:bg-foreground hover:text-background border-foreground hover:border-background hover:shadow"
            onClick={() => onChange?.(FlightNumber.NO_RATING)}
          >
            Nullstill
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
