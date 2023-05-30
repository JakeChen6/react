
const schema = {
  createdTime: {
    label: 'CreatedTime',
    show: false,
    initByUser: false,
    editable: false,
    samples: ["2022-08-01 10:00:00", "2022-08-01 10:00:00", "2022-08-01 10:30:00"]
  },
  market: {
    label: 'Market',
    show: true,
    initByUser: false,
    editable: false,
    samples: ['CN', 'CN', 'CN']
  },
  client: {
    label: 'Client',
    show: true,
    initByUser: true,
    editable: false,
    samples: ['Citadel', 'MLP', 'BR']
  },
  coverage: {
    label: 'Coverage',
    show: true,
    initByUser: true,
    editable: false,
    samples: ['KT', 'KT', 'CZ']
  },
  ric: {
    label: 'RIC',
    show: true,
    initByUser: true,
    editable: false,
    samples: ["000001.SZ", "000001.SZ", "000004.SZ"]
  },
  side: {
    label: 'Side',
    type: 'side',
    show: true,
    initByUser: true,
    editable: true,
    samples: ["BUY", "SELL", "BUY"]
  },
  quantity: {
    label: 'Quantity',
    type: 'number',
    show: true,
    initByUser: true,
    editable: true,
    samples: [100, 200, 300]
  },
  price: {
    label: 'Price',
    type: 'number',
    show: true,
    initByUser: true,
    editable: true,
    samples: [12, 11, 12]
  },
  expiryDate: {
    label: 'Expiry',
    show: true,
    initByUser: true,
    editable: true,
    samples: ["2022-10-01", "2022-10-01", "2022-10-01"]
  },
  comment: {
    label: 'Comment',
    show: true,
    initByUser: false,
    editable: false,
    samples: ["", "", "wrong RIC?"]
  }
};

export default schema;
