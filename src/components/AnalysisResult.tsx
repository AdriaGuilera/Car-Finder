import React from 'react';
import { CarAnalysis } from '../types/analysis';
import { Car, DollarSign, Gauge, Activity, Star } from 'lucide-react';

interface AnalysisResultProps {
  analysis: CarAnalysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-700">Car Details</h3>
          </div>
          <p className="text-sm text-gray-600">Make: {analysis["Car Make"] || 'N/A'}</p>
          <p className="text-sm text-gray-600">Model: {analysis["Model"] || 'N/A'}</p>
          <p className="text-sm text-gray-600">
            Year: {analysis["Year"]?.[0] || 'N/A'} - {analysis["Year"]?.[1] || 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-700">Price Range</h3>
          </div>
          <p className="text-sm text-gray-600">
            {analysis["Price"]?.min?.toLocaleString() || 'N/A'} - {analysis["Price"]?.max?.toLocaleString() || 'N/A'} {analysis["Price"]?.unit || 'USD'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-700">Performance</h3>
          </div>
          <p className="text-sm text-gray-600">
            Horsepower: {analysis["HP"]?.[0] || 'N/A'} - {analysis["HP"]?.[1] || 'N/A'} HP
          </p>
          <p className="text-sm text-gray-600">
            Top Speed: {analysis["Speed"]?.max?.[0] || 'N/A'} - {analysis["Speed"]?.max?.[1] || 'N/A'} {analysis["Speed"]?.unit || 'km/h'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg md:col-span-2 lg:col-span-3">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-700">Rarity</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Level: <span className="font-semibold">{analysis["Chances"]?.Rarity || 'N/A'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Chance: <span className="font-semibold">{analysis["Chances"]?.Chance || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}