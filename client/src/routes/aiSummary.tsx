import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/aiSummary')({
  component: RouteComponent,
})

function RouteComponent() {
  // Hardcoded sample summary values (replace with API later)
  const summary = {
    plasticsKg: 250,
    co2Saved: "1.2 tons",
    earnings: "4,500 Ksh",
    totalRecycled: "380 kg"
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
        Recycling Impact Summary
      </h1>

      {/* Impact Summary Card */}
      <Card>
        <CardHeader>🎉 Your Impact</CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700">
            You’ve recycled <span className="font-semibold">{summary.plasticsKg} kg</span> of plastic,
            earning <span className="font-semibold">{summary.earnings}</span> and
            preventing <span className="font-semibold">{summary.co2Saved}</span> of CO₂ emissions.  
          </p>
          <p className="text-lg text-gray-700 mt-3">
            In total, you’ve diverted <span className="font-semibold">{summary.totalRecycled}</span> of recyclables from landfills.
          </p>
        </CardContent>
      </Card>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Plastics Recycled</CardHeader>
          <CardContent>
            <Progress value={80} />
            <p className="text-sm text-gray-600 mt-2">{summary.plasticsKg} kg recycled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>CO₂ Saved</CardHeader>
          <CardContent>
            <Progress value={65} />
            <p className="text-sm text-gray-600 mt-2">{summary.co2Saved}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ---------- Inline UI Components ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      {children}
    </div>
  )
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold mb-3">{children}</h2>
  )
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

function Progress({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-green-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
