interface AuctionTypeCardProps {
  title: string;
  description: string;
}

export default function AuctionTypeCard({
  title,
  description,
}: AuctionTypeCardProps) {
  return (
    <div className="bg-cloud-white p-6 rounded-lg shadow hover:shadow-lg transition-all border border-slate-grey/20">
      <h3 className="text-2xl font-bold text-sage-green mb-4">{title}</h3>
      <p className="text-slate-grey6">{description}</p>
    </div>
  );
}
