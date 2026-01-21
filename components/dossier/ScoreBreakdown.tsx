interface ScoreItem {
  category: string;
  score: number;
  maxScore: number;
  description: string;
  details: string[];
}

interface ScoreBreakdownProps {
  items: ScoreItem[];
  totalScore: number;
  maxTotalScore: number;
}

export default function ScoreBreakdown({ items, totalScore, maxTotalScore }: ScoreBreakdownProps) {
  const percentage = Math.round((totalScore / maxTotalScore) * 100);
  
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-3 sm:gap-0">
          <h3 className="text-heading-3 font-bold text-black dark:text-white">Overall Score</h3>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
              {totalScore}
              <span className="text-2xl text-gray-400">/{maxTotalScore}</span>
            </div>
            <div className="text-label uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {percentage}% Security Rating
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
          <div
            className="h-full bg-black transition-all duration-500 dark:bg-white"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const categoryPercentage = Math.round((item.score / item.maxScore) * 100);
          const isFullScore = item.score === item.maxScore;
          
          return (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
            >
              {/* Category Header */}
              <div className="mb-4 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
                <div className="flex-1 w-full sm:w-auto">
                  <div className="mb-1 flex flex-wrap items-center gap-2 sm:gap-3">
                    <h4 className="text-body font-semibold text-black dark:text-white">
                      {item.category}
                    </h4>
                    <span
                      className={`text-technical ${
                        isFullScore
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                <div
                  className={`rounded-lg px-3 py-1 text-label font-semibold flex-shrink-0 ${
                    isFullScore
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : categoryPercentage >= 70
                      ? 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                  }`}
                >
                  {categoryPercentage}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                <div
                  className={`h-full transition-all duration-500 ${
                    isFullScore
                      ? 'bg-black dark:bg-white'
                      : categoryPercentage >= 70
                      ? 'bg-gray-600 dark:bg-gray-400'
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                  style={{ width: `${categoryPercentage}%` }}
                />
              </div>

              {/* Details */}
              {item.details.length > 0 && (
                <ul className="space-y-1.5">
                  {item.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-start gap-2 text-body-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-600" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Methodology Note */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <h4 className="mb-2 text-label font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          Scoring Methodology
        </h4>
        <p className="text-body-sm text-gray-600 dark:text-gray-400">
          Scores are calculated based on industry best practices and current security standards.
          Each category evaluates specific aspects of certificate security including protocol
          versions, encryption strength, certificate authority trust, and operational practices.
        </p>
      </div>
    </div>
  );
}
