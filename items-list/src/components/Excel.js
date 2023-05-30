import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clone from '../modules/clone';
import './Excel.css';

import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';


function Excel({ schema, initialData, onDataChangeRequest }) {
  const [data, setData] = useState(initialData);
  const [state, setState] = useState({
    sortBy: null,
    sortOrder: null,
    searchTexts: {}
  });
  // modal dialog for delete/update
  const [dialog, setDialog] = useState(null);
  const form = useRef(null);


  // search
  function search(e) {
    // update the dict of search texts
    const texts = clone(state.searchTexts);
    const needle = e.target.value.toLowerCase();
    const column = e.target.dataset.id;
    texts[column] = needle;
    const newState = {
      ...state,
      searchTexts: texts
    };
    setState(newState);
    // update data
    updateData(newState);
  }

  // sort
  function sort(e) {
    const column = e.target.dataset.id;
    if (!column) {
      return;
    }
    // update sorting state
    const mapping = {
      null: 'asc',
      'asc': 'desc',
      'desc': null
    };
    const newState = {
      ...state,
      sortBy: column,
      sortOrder: state.sortBy === column
        ? mapping[state.sortOrder]
        : 'asc'
    };
    setState(newState);
    // update data
    updateData(newState);
  }

  // apply search and sort on initialData
  function updateData({ sortBy, sortOrder, searchTexts }) {
  
    // search
    const data = Object.keys(searchTexts).reduce((data, key) => {
      const needle = searchTexts[key];
      return !needle
        ? data
        : data.filter(row => (
          row[key].toString().toLowerCase().indexOf(needle) > -1
        ));
    }, clone(initialData));
  
    // sort
    if (sortBy != null && sortOrder != null) {
      data.sort((a, b) => {
        if (a[sortBy] === b[sortBy]) {
          return 0;
        }
        return sortOrder === 'asc'
          ? a[sortBy] > b[sortBy]
            ? 1
            : -1
          : a[sortBy] < b[sortBy]
            ? 1
            : -1;
      });
    }
  
    setData(data);
  }

  function handleAction(rowidx, type) {
    const formPrefill = data[rowidx];
    const dialogForm = (
      <Form
        ref={form}
        type={type}
        fields={schema}
        initialData={formPrefill}
        readonly={type === 'delete'}
      />
    );
    if (type === 'edit') {
      setDialog(
        <Dialog
          modal
          extendedDismiss={false}
          header="Edit Order"
          confirmLabel="Save"
          onConfirm={() => {
            setDialog(null);
            sendRequest({
              type: 'update',
              payload: { rowidx, form }
            });
          }}
          onDismiss={() => setDialog(null)}
        >
          {dialogForm}
        </Dialog>
      );
    } else if (type === 'delete') {
      setDialog(
        <Dialog
          modal
          header="Confirm Deletion"
          confirmLabel="Delete"
          onConfirm={() => {
            setDialog(null);
            sendRequest({
              type: 'delete',
              payload: { rowidx }
            });
          }}
          onDismiss={() => setDialog(null)}
        >
          {dialogForm}
        </Dialog>
      );
    }
  }

  function sendRequest(action) {
    const request = {};
    if (action.type === 'delete') {
      request['type'] = 'DELETE';
      request['data'] = clone(data[action.payload.rowidx]);
    } else if (action.type === 'update') {
      const row = clone(data[action.payload.rowidx]);
      Array.from(action.payload.form.current).forEach(
        input => row[input.id] = input.value
      );
      request['type'] = 'UPDATE';
      request['data'] = row;
    }
    setTimeout(() => onDataChangeRequest(request));
  }

  return (
    <div className='Excel'>
      <table>
        <thead onClick={sort}>
          {/* column names */}
          <tr>
            {Object.keys(schema).map(key => {
              let { label, show } = schema[key];
              if (!show) {
                return null;
              }
              if (state.sortBy === key && state.sortOrder != null) {
                label += state.sortOrder === 'asc' ? ' \u2191' : ' \u2193';
              }
              return (
                <th key={key} data-id={key}>
                  {label}
                </th>
              );
            })}
            <th className='ExcelNotSortable'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* search texts */}
          <tr onChange={search}>
            {Object.keys(schema).map(key => (
              !schema[key].show ? null :
                <td key={key}>
                  <input type='text' data-id={key} />
                </td>
            ))}
          </tr>
          {/* table data */}
          {data.map((row, rowidx) => (
            <tr key={rowidx} data-row={rowidx}>
              {Object.keys(schema).map((key, columnidx) => {
                if (!schema[key].show) {
                  return null;
                }
                let content = row[key];
                return (
                  <td key={columnidx}>
                    {content}
                  </td>
                );
              })}
              <td>
                <Actions onAction={handleAction.bind(null, rowidx)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {dialog}
    </div>
  );
}

Excel.propTypes = {
  schema: PropTypes.object.isRequired,
  initialData: PropTypes.arrayOf(PropTypes.object),
  onDataChangeRequest: PropTypes.func,
};

export default Excel;
