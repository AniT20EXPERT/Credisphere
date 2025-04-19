import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const RiskScoreGauge = ({ score }) => {
  // Determine color based on risk score (0-1 scale)
  const getColor = () => {
    if (score === null) return 'bg-gray-300';
    if (score < 0.3) return 'bg-green-500';
    if (score < 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Determine risk level text
  const getRiskLevel = () => {
    if (score === null) return 'Unknown';
    if (score < 0.3) return 'Low Risk';
    if (score < 0.6) return 'Medium Risk';
    return 'High Risk';
  };
  
  // Calculate position for the indicator (0-100%)
  // Convert from 0-1 scale to 0-100% for display
  const gaugePosition = score !== null ? Math.min(Math.max(score * 100, 0), 100) : 50;

  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Risk Score Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {score !== null ? (
            <div className="text-3xl font-bold mb-2">{score.toFixed(2)}</div>
          ) : (
            <div className="text-xl text-gray-400 mb-2">No score available</div>
          )}
          
          <div className="text-lg font-medium mb-4">
            {getRiskLevel()}
          </div>
          
          {/* Gauge visual */}
          <div className="w-full h-4 bg-gray-200 rounded-full mb-2">
            <div 
              className={`h-full rounded-full ${getColor()}`}
              style={{ width: `${gaugePosition}%` }}
            ></div>
          </div>
          
          {/* Scale labels */}
          <div className="w-full flex justify-between text-sm text-gray-500">
            <span>0.0</span>
            <span>0.25</span>
            <span>0.5</span>
            <span>0.75</span>
            <span>1.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScoreGauge;