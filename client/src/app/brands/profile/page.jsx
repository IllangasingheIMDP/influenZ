"use client";
import BrandCard from '@/components/brandProfile';
import CampaignsCard from '@/components/brandcard2';
import Interacted from '@/components/brandcard3';

export default function BrandDashboard() {
  return (
    <div className="h-screen bg-gray-50 py-4 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Brand Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 h-1/2">
          {/* Left card - 1/3 width on large screens */}
          <div className="lg:col-span-1 h-full">
            <BrandCard />
          </div>
          
          {/* Right card - 2/3 width on large screens */}
          <div className="lg:col-span-2 h-full">
            <CampaignsCard />
          </div>
        </div>
        
        {/* Bottom section - full width */}
        <div className="h-2/5">
          <Interacted />
        </div>
      </div>
    </div>
  );
}