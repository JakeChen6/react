import { useState, useReducer, useRef, useEffect } from 'react';

import Header from './Header';
import Body from './Body';
import Dialog from './Dialog';
import Excel from './Excel';
import Form from './Form';

import schema from '../config/schema';

const emptyData = [];

function dispatch(action) {
  if (action.type === 'GET') {
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        body: JSON.stringify({"userId": 1, "title": "Buy milk", "completed": false})
      })
        .then(console.log)
        //.then(() => setBuyData(sampleData))
        //.then(() => display(`Last refresh: ${new Date()}`))
        .catch(console.error);
    }, 1000);
  }
  if (action.type === 'POST') {

  }
  if (action.type === 'PUT') {

  }
  if (action.type === 'DELETE') {
    console.log(action.payload);
  }
  if (action.type === 'PATCH') {
    console.log(action.payload);
  }
}

function reducer(data, action) {
  const newData = {
    buy: emptyData,
    sell: emptyData
  };

  if (action.type === 'GET') {
    const sampleData = schema.createdTime.samples.map((_, i) => {
      const row = {};
      for (let key in schema) {
        row[key] = schema[key].samples[i];
      }
      return row;
    });
    newData['buy'] = sampleData.filter(
      row => row.side === 'BUY'
    );
    newData['sell'] = sampleData.filter(
      row => row.side === 'SELL'
    );
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        body: JSON.stringify({"userId": 1, "title": "Buy milk", "completed": false})
      })
        .then(console.log)
        .catch(console.error);
    }, 1000);
  }

  return newData;
}

function DataFlow() {
  const [data, dispatch] = useReducer(reducer, {buy: emptyData, sell: emptyData});
  const [addNewDialog, setAddNewDialog] = useState(false);

  // reference provides direct access to a DOM element
  // used to harvest data from the form shown in the Add dialog
  const form = useRef(null);

  // side effect to fetch data after the initial render
  useEffect(
    () => refreshData(),
    []
  );

  function refreshData() {
    dispatch({
      type: 'GET'
    });
  }

  // GET
  function refreshTable() {
    //display("Loading data...");
    dispatch({ type: 'GET' });
  }

  function addNew() {
    setAddNewDialog(false);
    
    const formData = [];
    Array.from(form.current).forEach(
      input => formData[input.id] = input.value
    );

    dispatch({
      type: 'POST',
      payload: formData
    });
  }

  function onExcelDataChangeRequest(request) {
    dispatch({
      type: request.type,
      payload: request.data
    });
  }

  function importCSV() {

  }

  function downloadCSV(e) {
    // can output empty CSV as template?
  }

  return (
    <div className='DataFlow'>
      <Header
        onExport={e => downloadCSV(e)}
        onImport={() => importCSV()}
        onAdd={() => setAddNewDialog(true)}
        onRefresh={() => refreshData()}
      />
      <Body>
      <div className='container'>
        <div className='horizontal'>
          <Excel
            key={['buy', data.buy]}
            schema={schema}
            initialData={data.buy}
            onDataChangeRequest={request => onExcelDataChangeRequest(request)}
          />
          <Excel
            key={['sell', data.sell]}
            schema={schema}
            initialData={data.sell}
            onDataChangeRequest={request => onExcelDataChangeRequest(request)}
          />
        </div>
      </div>
        {addNewDialog ? (
          <Dialog
            modal
            header="Add New Indicative Order"
            confirmLabel="Add"
            onConfirm={() => addNew()}
            onDismiss={() => setAddNewDialog(false)}
          >
            <Form ref={form} fields={schema} />
          </Dialog>
        ) : null}
      </Body>
    </div>
  );
}

export default DataFlow;
