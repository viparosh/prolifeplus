const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
  user_ID: {
    type: String,
    default: '',
  },
  sessionNo: {
    type: String,
    default: 0,
  },
  contact: {
    type: String,
  },
  name: {
    type: String,
  },
  month: [
    {
      monthNumber: {
        type: String,
      },
      visit: [
        {
          ultrasound1: {
            type: String,
            default:''
          },
          ultrasound2: {
            type: String,
            default:''
          },
          ultrasound3: {
            type: String,
            default:''
          },
          visitNumber: {
            type: String,
          },
          semester: {
            type: String,
            default: 0,
          },
          date: {
            type: String,
            default: null,
          },
          aogInWeeks: {
            type: String,
            default: 0,
          },
          weight: {
            type: String,
            default: 0,
          },
          cr: {
            type: String,
            default: '',
          },
          temp: {
            type: String,
            default: 0,
          },
          fh: {
            type: String,
            default: 0,
          },
          fht: {
            type: String,
            default: 0,
          },
          bp: {
            type: String,
            default: '',
          },
          pres: {
            type: String,
            default: '',
          },
          remarks: {
            type: String,
            default: '',
          },
          bloodType: {
            type: String,
            default: '',
          },
          hgb: {
            type: String,
            default: '',
          },
          urinalysis: {
            type: String,
            default: '',
          },
          respiratoryRate: {
            type: String,
            default: '',
          },
          vdr: {
            type: String,
            default: '',
          },
          heartRate: {
            type: String,
            default: '',
          },
          measurement: {
            type: String,
            default: 0,
          },
          ironFotateRx: {
            type: String,
            default: '',
          },
          mibf: {
            type: String,
            default: '',
          },
          adviseDangerSigns: {
            type: String,
            default: '',
          },
          emergencyPlan: {
            type: String,
            default: '',
          },
          nextVisit: {
            type: String,
            default: null,
          },
          tuberculosis: {
            type: String,
            default: 'no',
          },
          heartDisease: {
            type: String,
            default: 'no',
          },
          goiter: {
            type: String,
            default: 'no',
          },
          diabetes: {
            type: String,
            default: 'no',
          },
          bronchil: {
            type: String,
            default: 'no',
          },
        },
      ],
    },
  ],

  //Labor
  ibf: {
    type: String,
    default: '',
  },
  typeOfDelivery: {
    type: String,
    default: '',
  },
  dateOfDelivery: {
    type: Date,
    default: '',
  },
  placeOfDelivery: {
    type: String,
    default: '',
  },
  birthWeight: {
    type: String,
    default: 0,
  },
  postpartumHemorrhage: {
    type: String,
    default: '',
  },
  babyAlive: {
    type: String,
    default: '',
  },
  babyHealthy: {
    type: String,
    default: '',
  },
  babyName: {
    type: String,
    default: '',
  },
  //Vaccine
  tt1: {
    type: String,
    default: '',
  },
  tt2: {
    type: String,
    default: '',
  },
  tt3: {
    type: String,
    default: '',
  },
  tt4: {
    type: String,
    default: '',
  },
  tt5: {
    type: String,
    default: '',
  },
  //Post Partum
  ebfHomeVisit: {
    type: String,
    default: '',
  },
  ebfClinicVisit: {
    type: String,
    default: '',
  },
  familyPlanningHomeVisit: {
    type: String,
    default: '',
  },
  familyPlanningClinicVisit: {
    type: String,
    default: '',
  },
  feverHomeVisit: {
    type: String,
    default: '',
  },
  feverClinicVisit: {
    type: String,
    default: '',
  },
  vaginalBleedingHomeVisit: {
    type: String,
    default: '',
  },
  vaginalBleedingClinicVisit: {
    type: String,
    default: '',
  },
  excessiveBleedingHomeVisit: {
    type: String,
    default: '',
  },
  excessiveBleedingClinicVisit: {
    type: String,
    default: '',
  },
  polioHomeVisit: {
    type: String,
    default: '',
  },
  polioClinicVisit: {
    type: String,
    default: '',
  },
  cordOkHomeVisit: {
    type: String,
    default: '',
  },
  cordOkClinicVisit: {
    type: String,
    default: '',
  },
})

module.exports =
  mongoose.models.Session || mongoose.model('Session', SessionSchema)
