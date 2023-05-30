import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';

import Header from "./Header";
import Body from "./Body";
import Dialog from "./Dialog";
import Excel from "./Excel";
import Form from "./Form";
import schema from '../config/schema.json';

const emptyData = [];

const sampleData = schema.createdTime.samples.map((_, i) => {
  const row = {};
  for (let key in schema) {
    row[key] = schema[key].samples[i];
  }
  return row;
});

// DataFlow combines all the components and passes around data and callbacks.
// It interacts with a REST API to get data.
// It also gathers and sends updates from the components to the REST API.

function DataFlow({ display }) {
  const [buyData, setBuyData] = useState(emptyData);
  const [sellData, setSellData] = useState(sampleData.slice(0, 2));
  // whether or not to show an Add dialog
  const [addDialogOn, setAddDialogOn] = useState(false);
  // reference: provides direct access to the DOM element
  const form = useRef(null);

  function updateData(newData) {
    //newData = clone(newData);
    //setData(newData);
  }

  // side effect to fetch data once after the initial render
  useEffect(
    () => refreshTable(),
    []
  );

  function dispatch(action) {
    if (action.type === 'GET') {
      setTimeout(() => {
        fetch("https://jsonplaceholder.typicode.com/todos", {
          method: "POST",
          body: JSON.stringify({"userId": 1, "title": "Buy milk", "completed": false})
        })
          .then(console.log)
          .then(() => setBuyData(sampleData))
          .then(() => display(`Last refresh: ${new Date()}`))
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

  function separateData(data) {
    setBuyData(
      data.filter(row => row['Side'] === 'Buy')
    );
    setSellData(
      data.filter(row => row['Side'] === 'Sell')
    );
  }

  // GET
  function refreshTable() {
    display("Loading data...");
    dispatch({ type: 'GET' });
  }

  // POST - post a new row
  function addNew(action) {
    setAddDialogOn(false);
    if (action === 'dismiss') return;

    const formData = {};
    Array.from(form.current).forEach(
      (input) => (formData[input.id] = input.value)
    );

    dispatch({
      type: 'POST',
      payload: formData,
    });
  }

  // callback to
  // PATCH - update a row
  // DELETE - delete a row
  function onExcelRequest(request) {
    dispatch({
      type: request.type,
      payload: request.data,
    });
  }

  // PUT
  function importCSV() {
    
  }

  function downloadCSV(e) {
    const dataArray = buyData.concat(sellData).map(row => (
      Object.keys(schema).map(key => row[key])
    ));
    const columns = Object.values(schema).map(obj => obj.label);
    const contents = columns.join(',') + '\n' + 
      dataArray.map(row => row.join(',')).join('\n') + '\n';
    const URL = window.URL || window.webkitURL;
    const blob = new Blob([contents], {type: 'text/csv'});
    e.target.href = URL.createObjectURL(blob);
    e.target.download = 'data.csv';
  }
  
  return (
    <div className="DataFlow">
      <Header
        onExport={ev => downloadCSV(ev)}
        onImport={() => importCSV()}
        onAdd={() => setAddDialogOn(true)}
        onRefresh={() => refreshTable()}
      />
      <Body>
        <div className="container">
          <div className="horizontal">
            <Excel
              key={buyData}
              schema={schema}
              initialData={buyData}
              onRequest={(request) => onExcelRequest(request)}
            />
            <Excel
              key={sellData}
              schema={schema}
              initialData={sellData}
              onRequest={(request) => onExcelRequest(request)}
            />
          </div>
        </div>
      {addDialogOn ? (
        <Dialog
          modal={true}
          header="Add new indicative order"
          confirmLabel="Add"
          onAction={action => addNew(action)}>
          <Form ref={form} fields={schema} />
        </Dialog>
      ) : null}
      </Body>
    </div>
  );
}

DataFlow.propTypes = {
  display: PropTypes.func
};

export default DataFlow;
