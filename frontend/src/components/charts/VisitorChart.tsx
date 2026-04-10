import { useQuery } from '@tanstack/react-query'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import api from '../../lib/api'

interface VisitorStat {
  date: string
  pageViews: number
  uniqueVisitors: number
  avgDurationSec: number
}

interface PredictedPoint {
  date: string
  pageViews: number
  uniqueVisitors: number
}

interface TrendResponse {
  actual: VisitorStat[]
  predicted: PredictedPoint[]
  growthRate: number
}

interface ChartDataPoint {
  date: string
  pageViews?: number
  uniqueVisitors?: number
  predictedPageViews?: number
  predictedUniqueVisitors?: number
  isPredicted?: boolean
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function VisitorChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['trend'],
    queryFn: () => api.get<{ data: TrendResponse }>('/stats/trend?days=30').then(r => r.data.data),
  })

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
        통계 데이터 불러오는 중...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="h-64 flex items-center justify-center text-red-400">
        통계 데이터를 불러올 수 없습니다.
      </div>
    )
  }

  // 실제 데이터 + 예측 데이터를 하나의 배열로 합산
  const actualData: ChartDataPoint[] = data.actual.map(d => ({
    date: formatDate(d.date),
    pageViews: d.pageViews,
    uniqueVisitors: d.uniqueVisitors,
  }))

  const predictedData: ChartDataPoint[] = data.predicted.map(d => ({
    date: formatDate(d.date),
    predictedPageViews: d.pageViews,
    predictedUniqueVisitors: d.uniqueVisitors,
    isPredicted: true,
  }))

  const chartData = [...actualData, ...predictedData]
  const splitDate = actualData.length > 0 ? actualData[actualData.length - 1].date : undefined

  const growthColor = data.growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
  const growthLabel = data.growthRate >= 0 ? `+${data.growthRate}%` : `${data.growthRate}%`

  return (
    <div className="space-y-4">
      {/* 성장률 배지 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">최근 7일 성장률</span>
        <span className={`text-lg font-bold ${growthColor}`}>{growthLabel}</span>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
          점선: AI 예측 (7일)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-surface, #fff)',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Legend iconSize={10} />

          {/* 실제 데이터 — Bar */}
          <Bar dataKey="pageViews" name="페이지뷰" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="uniqueVisitors" name="순방문자" fill="#10b981" radius={[2, 2, 0, 0]} />

          {/* 예측 데이터 — Line (점선) */}
          <Line
            type="monotone"
            dataKey="predictedPageViews"
            name="예측 페이지뷰"
            stroke="#93c5fd"
            strokeDasharray="5 3"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="predictedUniqueVisitors"
            name="예측 순방문자"
            stroke="#6ee7b7"
            strokeDasharray="5 3"
            dot={false}
            strokeWidth={2}
          />

          {/* 실제/예측 구분선 */}
          {splitDate && (
            <ReferenceLine x={splitDate} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '오늘', fontSize: 10 }} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
