import { CablePlan } from './plans.dto';

export const cables = [
  { cable_id: 1, cable_name: 'GOTV' },
  { cable_id: 2, cable_name: 'DSTV' },
  { cable_id: 3, cable_name: 'STARTIMES' },
];

const dstvPlans: CablePlan[] = [
  { id: 33, cableplan_id: '33', cable: 'DSTV', package: 'ExtraView Access' },
  { id: 20, cableplan_id: '20', cable: 'DSTV', package: 'DStv Padi' },
  {
    id: 32,
    cableplan_id: '32',
    cable: 'DSTV',
    package: 'DStv HDPVR Access Service',
  },
  { id: 6, cableplan_id: '6', cable: 'DSTV', package: 'DStv Yanga' },
  {
    id: 28,
    cableplan_id: '28',
    cable: 'DSTV',
    package: 'DStv Padi + ExtraView',
  },
  {
    id: 27,
    cableplan_id: '27',
    cable: 'DSTV',
    package: 'DStv Yanga + ExtraView',
  },
  { id: 19, cableplan_id: '19', cable: 'DSTV', package: 'DStv Confam' },
  {
    id: 26,
    cableplan_id: '26',
    cable: 'DSTV',
    package: 'DStv Confam + ExtraView',
  },
  { id: 7, cableplan_id: '7', cable: 'DSTV', package: 'DStv Compact' },
  { id: 23, cableplan_id: '23', cable: 'DSTV', package: 'DStv Asia' },
  {
    id: 29,
    cableplan_id: '29',
    cable: 'DSTV',
    package: 'DStv Compact + Extra View',
  },
  {
    id: 31,
    cableplan_id: '31',
    cable: 'DSTV',
    package: 'DStv Compact Plus - Extra View',
  },
  { id: 8, cableplan_id: '8', cable: 'DSTV', package: 'DStv Compact Plus' },
  { id: 25, cableplan_id: '25', cable: 'DSTV', package: 'DStv Premium Asia' },
  {
    id: 30,
    cableplan_id: '30',
    cable: 'DSTV',
    package: 'DStv Premium + Extra View',
  },
  { id: 9, cableplan_id: '9', cable: 'DSTV', package: 'DStv Premium' },
  { id: 24, cableplan_id: '24', cable: 'DSTV', package: 'DStv Premium French' },
];

const gotvPlans: CablePlan[] = [
  {
    id: 34,
    cableplan_id: '34',
    cable: 'GOTV',
    package: 'GOtv Smallie - Monthly',
  },

  {
    id: 35,
    cableplan_id: '35',
    cable: 'GOTV',
    package: 'GOtv Smallie - Quarterly',
  },
  {
    id: 16,
    cableplan_id: '16',
    cable: 'GOTV',
    package: 'GOtv Jinja',
  },
  {
    id: 17,
    cableplan_id: '17',
    cable: 'GOTV',
    package: 'GOtv Jolli',
  },
  {
    id: 2,
    cableplan_id: '2',
    cable: 'GOTV',
    package: 'GOtv Max',
  },
  {
    id: 36,
    cableplan_id: '36',
    cable: 'GOTV',
    package: 'GOtv Smallie - Yearly',
  },
];

const startimesPlans: CablePlan[] = [
  {
    id: 42,
    cableplan_id: '42',
    cable: 'STARTIMES',
    package: 'Nova - 220 Naira - 1 Day',
  },
  {
    id: 43,
    cableplan_id: '43',
    cable: 'STARTIMES',
    package: 'Basic - 370 Naira - 1 Day',
  },
  {
    id: 44,
    cableplan_id: '44',
    cable: 'STARTIMES',
    package: 'Smart - 370 Naira - 1 Day',
  },
  {
    id: 37,
    cableplan_id: '37',
    cable: 'STARTIMES',
    package: 'Nova - 650 Naira - 1 Week',
  },
  {
    id: 39,
    cableplan_id: '39',
    cable: 'STARTIMES',
    package: 'Smart - 1550 Naira - 1 Week',
  },
  {
    id: 14,
    cableplan_id: '14',
    cable: 'STARTIMES',
    package: 'Nova - 1750 Naira - 1 Month',
  },
  {
    id: 38,
    cableplan_id: '38',
    cable: 'STARTIMES',
    package: 'Basic - 2300 Naira - 1 Week',
  },
  {
    id: 40,
    cableplan_id: '40',
    cable: 'STARTIMES',
    package: 'Classic - 2400 Naira - 1 Week',
  },
  {
    id: 41,
    cableplan_id: '41',
    cable: 'STARTIMES',
    package: 'Super - 3200 Naira - 1 Week',
  },
  {
    id: 13,
    cableplan_id: '13',
    cable: 'STARTIMES',
    package: 'Smart - 4400 Naira - 1 Month',
  },
  {
    id: 12,
    cableplan_id: '12',
    cable: 'STARTIMES',
    package: 'Basic - 4250 Naira - 1 Month',
  },
  {
    id: 11,
    cableplan_id: '11',
    cable: 'STARTIMES',
    package: 'Classic - 6250 Naira - 1 Mont',
  },
  {
    id: 15,
    cableplan_id: '15',
    cable: 'STARTIMES',
    package: 'Super - 8500 Naira - 1 Month',
  },
];

export const cablePlans = [...dstvPlans, ...gotvPlans, ...startimesPlans];
