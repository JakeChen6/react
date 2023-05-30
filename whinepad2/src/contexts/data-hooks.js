import { createContext, useContext, useState } from 'react';

import schema from '../config/schema.json';

const emptyData = [];

const sampleData = schema.createdTime.samples.map((_, i) => {
  const row = {};
  for (let key in schema) {
    row[key] = schema[key].samples[i];
  }
  return row;
});

// data context
const DataContext = createContext({
  data: [],
  setData: () => {},
});

export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const [data, setData] = useState(emptyData);
  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
