import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🎨 Brand & Design',
      items: [
        'branding',
        'style_guide',
      ],
    },
    {
      type: 'category',
      label: '🏗️ System Architecture',
      items: [
        'classes_diagram',
        'database_schema',
      ],
    },
    {
      type: 'category',
      label: '🚀 API & Development',
      items: [
        'api_documentation',
        'development_setup',
      ],
    },
  ],
};

export default sidebars;
