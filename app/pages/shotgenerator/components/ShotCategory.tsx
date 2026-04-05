import { Label } from "@/components/ui/label";
import { ShotData } from "../data/shot.data";

interface ShotCategory {
  shotData: ShotData;
}

export default function ShotCategory({ shotData }: Readonly<ShotCategory>) {
  return (
    <div>
      <h3 className="font-bold">{shotData.category}</h3>
      <div className="flex flex-col gap-2">
        {shotData.items.map((shot) => (
          <div key={shot.title} className="flex gap-2">
            <input type="checkbox" defaultChecked={shot.isActive}></input>
            <Label>{shot.title}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
