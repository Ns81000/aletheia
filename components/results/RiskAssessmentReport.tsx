'use client';

import { Shield, AlertTriangle, TrendingUp, Clock, Target } from 'lucide-react';
import { RiskAssessment, AttackVector, RemediationAction, RiskLevel } from '@/lib/security/risk-assessment';

interface RiskAssessmentReportProps {
  assessment: RiskAssessment;
}

export function RiskAssessmentReport({ assessment }: RiskAssessmentReportProps) {
  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <Shield className="w-5 h-5 text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-white">Risk Assessment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive security risk analysis
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-3xl font-bold text-black dark:text-white">{assessment.overallRiskScore}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Risk Score</div>
          </div>
        </div>

        <div className="mb-6">
          <RiskLevelBadge level={assessment.riskLevel} />
        </div>

        {/* Risk Factors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <RiskFactorCard 
            title="Vulnerabilities" 
            score={assessment.riskFactors.vulnerabilities}
          />
          <RiskFactorCard 
            title="Compliance" 
            score={assessment.riskFactors.compliance}
          />
          <RiskFactorCard 
            title="Configuration" 
            score={assessment.riskFactors.configuration}
          />
          <RiskFactorCard 
            title="Exposure" 
            score={assessment.riskFactors.exposure}
          />
        </div>
      </div>

      {/* Business Impact */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-black dark:text-white" strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-black dark:text-white">Business Impact</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <ImpactCard title="Confidentiality" level={assessment.businessImpact.confidentiality} />
          <ImpactCard title="Integrity" level={assessment.businessImpact.integrity} />
          <ImpactCard title="Availability" level={assessment.businessImpact.availability} />
        </div>
      </div>

      {/* Attack Vectors */}
      {assessment.attackVectors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
            Potential Attack Vectors
          </h4>
          {assessment.attackVectors.map((vector, idx) => (
            <AttackVectorCard key={idx} vector={vector} />
          ))}
        </div>
      )}

      {/* Remediation Actions */}
      {assessment.remediationActions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4" strokeWidth={1.5} />
            Prioritized Remediation Actions
          </h4>
          {assessment.remediationActions.map((action, idx) => (
            <RemediationActionCard key={idx} action={action} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const configs = {
    critical: { bg: 'bg-gray-500', text: 'text-white', label: 'Critical Risk' },
    high: { bg: 'bg-gray-600', text: 'text-white', label: 'High Risk' },
    medium: { bg: 'bg-gray-400', text: 'text-white', label: 'Medium Risk' },
    low: { bg: 'bg-gray-300', text: 'text-black', label: 'Low Risk' },
    minimal: { bg: 'bg-gray-200', text: 'text-black', label: 'Minimal Risk' },
  };

  const config = configs[level];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${config.bg}`}>
      <div className={`text-sm font-semibold ${config.text}`}>{config.label}</div>
    </div>
  );
}

function RiskFactorCard({ title, score }: { title: string; score: number }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 sm:p-4">
      <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </div>
      <div className="text-2xl font-bold text-black dark:text-white mb-2">
        {score}
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ImpactCard({ title, level }: { title: string; level: RiskLevel }) {
  const labels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    minimal: 'Minimal',
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 sm:p-4">
      <div className="text-sm font-semibold text-black dark:text-white mb-2">
        {title}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {labels[level]} Impact
      </div>
    </div>
  );
}

function AttackVectorCard({ vector }: { vector: AttackVector }) {
  const likelihoodColors = {
    'very-high': 'text-gray-700 dark:text-gray-300',
    'high': 'text-gray-600 dark:text-gray-400',
    'medium': 'text-gray-500 dark:text-gray-500',
    'low': 'text-gray-400 dark:text-gray-600',
    'very-low': 'text-gray-300 dark:text-gray-700',
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-black dark:text-white" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
            <h4 className="font-semibold text-black dark:text-white">{vector.name}</h4>
            <div className="flex gap-2 flex-shrink-0">
              <span className={`text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-900 whitespace-nowrap ${likelihoodColors[vector.likelihood]}`}>
                {vector.likelihood.toUpperCase().replace('-', ' ')}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {vector.description}
          </p>

          <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 mb-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
              Exploitability
            </div>
            <div className="text-sm text-black dark:text-white">
              {vector.exploitability}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
              Mitigation
            </div>
            <div className="text-sm text-black dark:text-white">
              {vector.mitigation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemediationActionCard({ action, rank }: { action: RemediationAction; rank: number }) {
  const priorityColors = {
    critical: 'bg-gray-600 text-white',
    high: 'bg-gray-500 text-white',
    medium: 'bg-gray-400 text-white',
    low: 'bg-gray-300 text-black',
  };

  const effortLabels = {
    low: 'Low Effort',
    medium: 'Medium Effort',
    high: 'High Effort',
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white dark:text-black">{rank}</span>
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
            <h4 className="font-semibold text-black dark:text-white">{action.title}</h4>
            <span className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${priorityColors[action.priority]}`}>
              {action.priority.toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {action.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Effort</div>
              <div className="text-sm font-semibold text-black dark:text-white">
                {effortLabels[action.effort]}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" strokeWidth={1.5} />
                Timeframe
              </div>
              <div className="text-sm font-semibold text-black dark:text-white">
                {action.timeframe}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Benefit</div>
              <div className="text-sm font-semibold text-black dark:text-white truncate">
                {action.benefit.split('.')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
