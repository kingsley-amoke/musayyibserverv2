import { airtelPlans } from './airtel.plans';
import { etisalatPlans } from './etisalat.plans';
import { gloPlans } from './glo.plans';
import { mtnPlans } from './mtn.plans';
import { DataPlan } from './plans.dto';

export const network = [
  { network_id: 1, network_name: 'MTN' },
  { network_id: 2, network_name: 'GLO' },
  { network_id: 3, network_name: '9MOBILE' },
  { network_id: 4, network_name: 'AIRTEL' },
  { network_id: 5, network_name: 'SMILE' },
];

export const allPlans: Array<DataPlan> = [
  ...mtnPlans,
  ...gloPlans,
  ...airtelPlans,
  ...etisalatPlans,
];
