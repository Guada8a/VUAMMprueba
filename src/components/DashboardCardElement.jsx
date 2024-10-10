import React from 'react';
import { createComponent } from '@lit-labs/react';
import DashboardCard from './DashboardCard';

const DashboardCardElement = createComponent({
  tagName: 'dashboard-card',
  elementClass: DashboardCard,
  react: React,
});

customElements.define('vuamm-card', DashboardCardElement);