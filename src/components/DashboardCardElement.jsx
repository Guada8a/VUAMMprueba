import React from 'react';
import { createComponent } from '@lit-labs/react/deprecated';
import DashboardCard from './DashboardCard';

// Convierte DashboardCard a un Custom Element
const DashboardCardElement = createComponent(React, 'dashboard-card', DashboardCard, { useShadowDOM: false });

// Registra el elemento personalizado en el navegador
customElements.define('vuamm-card', DashboardCardElement);
