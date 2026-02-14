"use client";
interface Props {
  name: string;
  value: number;
}

export default function ReportItem({ name, value }: Props) {
  return (
    <div className="border p-2 rounded">
      <span className="font-mono font-semibold">{name}</span>  : {value}
    </div>
  );
}
