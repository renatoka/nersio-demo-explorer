import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import ToggleButton from '../button/ToggleButton';
import {
  faUtensils,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

interface Tab {
  key: string;
  label: string;
  icon: IconDefinition;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  className?: string;
}

export const ANIMAL_DETAIL_TABS = [
  {
    key: 'prey',
    label: 'Prey',
    icon: faUtensils,
  },
  {
    key: 'predators',
    label: 'Predators',
    icon: faTriangleExclamation,
  },
];

export default function TabSwitcher({
  tabs,
  activeTab,
  onTabChange,
  className = 'flex h-9 w-full gap-2 rounded-md bg-neutral-100 p-1',
}: TabSwitcherProps) {
  return (
    <div className={className}>
      {tabs.map((tab) => (
        <ToggleButton
          key={tab.key}
          icon={tab.icon}
          label={tab.label}
          isActive={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
        />
      ))}
    </div>
  );
}
