import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

createInertiaApp({
  title: (title) => (title ? `${title} - Multi Model AI SaaS` : 'Multi Model AI SaaS'),
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    let page = pages[`./Pages/${name}.jsx`];
    // Define the routes that should use the DashboardLayout
    const dashboardRoutes = ['Blog','Dashboard', 'SubscriptionPlans','AdminPlans','ProviderIndex','AppSettings','EmailConfig','Profile/Edit', "Subscription"];

    if (dashboardRoutes.some(prefix => name.startsWith(prefix))) {
      page.default.layout = ((page) => <DashboardLayout>{page}</DashboardLayout>);
    }
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    delay: 250,
    color: '#fff',
  },
});
