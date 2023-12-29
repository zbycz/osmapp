import { ClimbingRoute } from '../types';

export const routes1: ClimbingRoute[] = [
  {
    id: 'a',
    name: 'Krutý řím',
    difficulty: { grade: '5', gradeSystem: 'uiaa' },
    length: '',
    paths: {
      '/images/rock.png': [
        { x: 0.30677425023430177, y: 0.8325, units: 'percentage' },
        { x: 0.35644622774133083, y: 0.6975, units: 'percentage' },
        { x: 0.41080424086223055, y: 0.58125, units: 'percentage' },
        {
          x: 0.37987640581068416,
          y: 0.4825,
          units: 'percentage',
          type: 'bolt',
        },
        { x: 0.46703666822867856, y: 0.3575, units: 'percentage' },
        { x: 0.4342344189315839, y: 0.3225, units: 'percentage' },
        {
          x: 0.46422504686035615,
          y: 0.18625,
          units: 'percentage',
          type: 'anchor',
        },
      ],
    },
  },
  {
    id: 'b',
    name: 'Krutý řím (varianta pro borce)',
    difficulty: { grade: '8', gradeSystem: 'uiaa' },
    length: '',
    paths: {
      '/images/rock2.jpg': [
        { x: 0.5390193370166, y: 0.85311929307, units: 'percentage' },
      ],
      '/images/rock.png': [
        { x: 0.3907890193370166, y: 0.8586156111929307, units: 'percentage' },
        { x: 0.41080424086223055, y: 0.58125, units: 'percentage' },
        {
          x: 0.37987640581068416,
          y: 0.4825,
          units: 'percentage',
          type: 'bolt',
        },
        { x: 0.46703666822867856, y: 0.3575, units: 'percentage' },
        { x: 0.4342344189315839, y: 0.3225, units: 'percentage' },
        {
          x: 0.46422504686035615,
          y: 0.18625,
          units: 'percentage',
          type: 'anchor',
        },
      ],
    },
  },
  {
    id: 'c',
    name: 'Krajina Snů',
    difficulty: { grade: '6', gradeSystem: 'uiaa' },
    length: '',
    paths: {
      '/images/rock2.jpg': [
        { x: 0.4604762183692596, y: 0.86875, units: 'percentage' },
        {
          x: 0.46141342549203374,
          y: 0.7425,
          units: 'percentage',
          type: 'bolt',
        },
        { x: 0.4679738753514527, y: 0.645, units: 'percentage' },
        { x: 0.5185830599812559, y: 0.54125, units: 'percentage' },
        { x: 0.51952026710403, y: 0.41, units: 'percentage', type: 'bolt' },
        { x: 0.5120226101218369, y: 0.3425, units: 'percentage' },
        { x: 0.540138823805061, y: 0.23375, units: 'percentage' },
        { x: 0.5513853092783505, y: 0.18, units: 'percentage', type: 'anchor' },
      ],
    },
  },
  {
    id: 'd',
    name: 'Krajina snů direkt',
    difficulty: { grade: '6+', gradeSystem: 'uiaa' },
    length: '',
    paths: {
      '/images/rock2.jpg': [
        { x: 0.5532597235238987, y: 0.84625, units: 'percentage' },
        { x: 0.5626317947516402, y: 0.645, units: 'percentage', type: 'bolt' },
        { x: 0.5185830599812559, y: 0.54125, units: 'percentage' },
        { x: 0.51952026710403, y: 0.41, units: 'percentage', type: 'bolt' },
        { x: 0.5120226101218369, y: 0.3425, units: 'percentage' },
        { x: 0.540138823805061, y: 0.23375, units: 'percentage', type: 'bolt' },
        { x: 0.5513853092783505, y: 0.18, units: 'percentage', type: 'anchor' },
      ],
    },
  },
  {
    id: 'e',
    name: 'Sfinga',
    difficulty: { grade: '7-', gradeSystem: 'uiaa' },
    length: '',
    paths: {
      '/images/rock2.jpg': [
        { x: 0.6310479147141518, y: 0.81625, units: 'percentage' },
        { x: 0.6291735004686035, y: 0.59375, units: 'percentage' },
        { x: 0.6722850281162137, y: 0.395, units: 'percentage', type: 'bolt' },
        { x: 0.6104293580131209, y: 0.33875, units: 'percentage' },
        {
          x: 0.5720038659793815,
          y: 0.32875,
          units: 'percentage',
          type: 'bolt',
        },
        { x: 0.540138823805061, y: 0.23375, units: 'percentage' },
        { x: 0.5513853092783505, y: 0.18, units: 'percentage', type: 'anchor' },
      ],
    },
  },
  {
    id: 'f',
    name: 'Supito presto',
    difficulty: { grade: '8', gradeSystem: 'uiaa' },
    length: '',
    paths: {
      '/images/rock2.jpg': [
        { x: 0.7222807320441988, y: 0.8232695139911634, units: 'percentage' },
        { x: 0.716, y: 0.628, units: 'percentage' },
        { x: 0.742, y: 0.5133333333333333, units: 'percentage' },
        { x: 0.795, y: 0.4026666666666667, units: 'percentage', type: 'sling' },
        { x: 0.815, y: 0.31466666666666665, units: 'percentage' },
        { x: 0.792, y: 0.25866666666666666, units: 'percentage' },
      ],
    },
  },
  {
    id: 'g',
    name: 'Další prosím',
    difficulty: { grade: '4+', gradeSystem: 'uiaa' },
    length: '',
    paths: {
      '/images/rock2.jpg': [
        { x: 0.7222807320441988, y: 0.8232695139911634, units: 'percentage' },
        { x: 0.716, y: 0.628, units: 'percentage' },
        { x: 0.742, y: 0.5133333333333333, units: 'percentage' },
        {
          x: 0.735,
          y: 0.38533333333333336,
          units: 'percentage',
          type: 'piton',
        },
        {
          x: 0.716,
          y: 0.24266666666666667,
          units: 'percentage',
          type: 'anchor',
        },
      ],
    },
  },
  {
    id: 'h',
    name: 'Rock oslav',
    difficulty: { grade: '7-', gradeSystem: 'uiaa' },
    length: '',
    paths: { '/images/rock2.jpg': [] },
  },
  {
    id: 'i',
    name: 'Příliš vzdálená hvězda',
    difficulty: { grade: '5', gradeSystem: 'uiaa' },
    length: '',
    paths: { '/images/rock2.jpg': [] },
  },
  {
    id: 'j',
    name: 'Epizoda ze života',
    difficulty: { grade: '7', gradeSystem: 'uiaa' },
    length: '',
    paths: {},
  },
  { id: 'k', name: 'Sans Souci', difficulty: '4', length: '', paths: {} },
  { id: 'l', name: 'Ostudy kabát', difficulty: '8+', length: '', paths: {} },
  { id: 'm', name: 'Přepište dějiny', difficulty: '7', length: '', paths: {} },
];
