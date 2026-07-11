"use client";

import { Icon } from "@iconify/react";
import type { DashboardIconName } from "@/types/dashboard";

interface DashboardIconProps {
  readonly icon: DashboardIconName;
  readonly width: number | string;
}

export function DashboardIcon({ icon, width }: DashboardIconProps) {
  return <Icon icon={icon} width={width} />;
}
