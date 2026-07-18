export type SdgInfo = {
  id: string
  title: string
  summary: string
  exampleIndicators: string[]
}

export const SDG_INFO: Record<string, SdgInfo> = {
  'SDG 1': {
    id: 'SDG 1',
    title: 'No Poverty',
    summary:
      'End poverty in all its forms everywhere by improving social protection, access to basic services, and resilience to shocks.',
    exampleIndicators: ['Population below national poverty line', 'Access to social protection', 'Resilience to disasters'],
  },
  'SDG 2': {
    id: 'SDG 2',
    title: 'Zero Hunger',
    summary:
      'End hunger and improve nutrition through sustainable agriculture, resilient food systems, and support to smallholders.',
    exampleIndicators: ['Prevalence of undernourishment', 'Child stunting/wasting', 'Smallholder productivity'],
  },
  'SDG 3': {
    id: 'SDG 3',
    title: 'Good Health and Well-being',
    summary:
      'Ensure healthy lives and promote well-being for all at all ages, including maternal care, disease prevention, and health systems.',
    exampleIndicators: ['Maternal mortality ratio', 'Immunization coverage', 'Access to primary healthcare'],
  },
  'SDG 4': {
    id: 'SDG 4',
    title: 'Quality Education',
    summary:
      'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
    exampleIndicators: ['Learning outcomes', 'School completion rates', 'Digital literacy access'],
  },
  'SDG 5': {
    id: 'SDG 5',
    title: 'Gender Equality',
    summary:
      'Achieve gender equality and empower all women and girls by reducing discrimination and improving access to opportunities.',
    exampleIndicators: ['Women in leadership', 'Gender-based violence prevalence', 'Access to reproductive health'],
  },
  'SDG 6': {
    id: 'SDG 6',
    title: 'Clean Water and Sanitation',
    summary:
      'Ensure availability and sustainable management of water and sanitation for all.',
    exampleIndicators: ['Safely managed drinking water', 'Sanitation coverage', 'Water-use efficiency'],
  },
  'SDG 7': {
    id: 'SDG 7',
    title: 'Affordable and Clean Energy',
    summary:
      'Ensure access to affordable, reliable, sustainable and modern energy for all.',
    exampleIndicators: ['Household electricity access', 'Renewables share in energy mix', 'Energy efficiency improvements'],
  },
  'SDG 8': {
    id: 'SDG 8',
    title: 'Decent Work and Economic Growth',
    summary:
      'Promote sustained, inclusive economic growth, productive employment, and decent work for all.',
    exampleIndicators: ['Youth employment rate', 'Skills training participation', 'Formalization of work'],
  },
  'SDG 9': {
    id: 'SDG 9',
    title: 'Industry, Innovation and Infrastructure',
    summary:
      'Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.',
    exampleIndicators: ['Digital/public infrastructure access', 'R&D investment', 'SME access to finance'],
  },
  'SDG 10': {
    id: 'SDG 10',
    title: 'Reduced Inequalities',
    summary:
      'Reduce inequality within and among countries through inclusive policies and equal opportunity.',
    exampleIndicators: ['Income growth of bottom 40%', 'Social inclusion measures', 'Equitable service access'],
  },
  'SDG 11': {
    id: 'SDG 11',
    title: 'Sustainable Cities and Communities',
    summary:
      'Make cities inclusive, safe, resilient and sustainable through better planning, services, and risk reduction.',
    exampleIndicators: ['Affordable housing access', 'Air quality', 'Disaster risk preparedness'],
  },
  'SDG 12': {
    id: 'SDG 12',
    title: 'Responsible Consumption and Production',
    summary:
      'Ensure sustainable consumption and production patterns through efficiency, circularity, and waste reduction.',
    exampleIndicators: ['Waste generation per capita', 'Recycling rate', 'Sustainable procurement adoption'],
  },
  'SDG 13': {
    id: 'SDG 13',
    title: 'Climate Action',
    summary:
      'Take urgent action to combat climate change and its impacts through mitigation, adaptation, and resilience.',
    exampleIndicators: ['GHG emissions trends', 'Climate risk resilience', 'Early warning coverage'],
  },
  'SDG 14': {
    id: 'SDG 14',
    title: 'Life Below Water',
    summary:
      'Conserve and sustainably use oceans, seas and marine resources for sustainable development.',
    exampleIndicators: ['Coastal water quality', 'Sustainable fisheries', 'Marine protected areas coverage'],
  },
  'SDG 15': {
    id: 'SDG 15',
    title: 'Life on Land',
    summary:
      'Protect, restore and promote sustainable use of terrestrial ecosystems, forests, and biodiversity.',
    exampleIndicators: ['Forest cover change', 'Biodiversity index', 'Land degradation neutrality'],
  },
  'SDG 16': {
    id: 'SDG 16',
    title: 'Peace, Justice and Strong Institutions',
    summary:
      'Promote peaceful and inclusive societies, provide access to justice for all, and build effective institutions.',
    exampleIndicators: ['Access to legal aid', 'Public service transparency', 'Violence prevalence'],
  },
  'SDG 17': {
    id: 'SDG 17',
    title: 'Partnerships for the Goals',
    summary:
      'Strengthen the means of implementation and revitalize global partnerships for sustainable development.',
    exampleIndicators: ['Multi-stakeholder partnerships', 'Technology transfer', 'Financing mobilized'],
  },
}

