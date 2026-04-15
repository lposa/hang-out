import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture/system-overview', 'architecture/supabase-schema'],
    },
    {
      type: 'category',
      label: 'Product Flows',
      items: [
        'flows/account-onboarding',
        'flows/profile-and-favorites',
        'flows/activity-lifecycle',
        'flows/ai-match',
        'flows/chat',
      ],
    },
    'appendix/table-reference',
  ],
};

export default sidebars;
