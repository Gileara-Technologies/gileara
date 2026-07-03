"use client";

import dynamic from "next/dynamic";

const TeamOrgChart = dynamic(() => import("@/components/about/TeamOrgChart"), { ssr: false });

export default function TeamOrgChartWrapper() {
  return <TeamOrgChart />;
}
