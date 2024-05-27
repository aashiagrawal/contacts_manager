import ConnectionTable from "@/components/frontend/ConnectionTable";

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="w-4/5">
        <div>
          All contacts
        </div>
        <ConnectionTable/>
      </div>
    </div>
  )
}