import { IconUsers, IconMail } from '@tabler/icons-react';

const audience = {
  id: 'audience-group',
  title: 'Community & Audience',
  type: 'group',
  children: [
    {
      id: 'users-all',
      title: 'User Accounts',
      type: 'item',
      url: '/users',
      icon: IconUsers,
      breadcrumbs: true,
    },
    {
      id: 'newsletter-all',
      title: 'Newsletter Subscribers',
      type: 'item',
      url: '/newsletter',
      icon: IconMail,
      breadcrumbs: true,
    },
  ],
};

export default audience;
