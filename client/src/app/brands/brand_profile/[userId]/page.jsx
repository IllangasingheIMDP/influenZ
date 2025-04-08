"use client";
import BrandCard from '@/components/brandProfile';
import CampaignsCard from '@/components/brandcard2';
import Interacted from '@/components/brandcard3';
import {use} from 'react'
import { useSelector } from 'react-redux';
export default function BrandDashboard({params}) {
  const { userId } = use(params);
  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 py-4 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 h-1/2">
          {/* Left card - 1/3 width on large screens */}
          <div className="lg:col-span-1 h-full">
            <BrandCard userId={userId} />
          </div>
          
          {/* Right card - 2/3 width on large screens */}
          <div className="lg:col-span-2 h-full">
            <CampaignsCard public_available={true} userId={userId} />
          </div>
        </div>
        
        {/* Bottom section - full width */}
        <div className="h-2/5">
          <Interacted userId={userId} />
        </div>
      </div>
    </div>
  );
}