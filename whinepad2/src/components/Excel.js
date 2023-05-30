import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Excel.css';
import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import clone from '../modules/clone.js';


function Excel({schema, initialData, onRequest}) {
  const [data, setData] = useState(initialData);
  const [state, setState] = useState({
    sortBy: null,
    sortOrder: null,
    searchTexts: {}
  });
  // pop-up modal dialog
  const [dialog, setDialog] = useState(null);
  const form = useRef(null);


  // invoke callback
  function sendRequest(action) {
    let request = null;
    if (action.type === 'delete') {
      request = {
        type: 'DELETE',
        data: data[action.payload.rowidx]
      };
    } else if (action.type === 'edit') {
      const row = { ...data[action.payload.rowidx] };
      Array.from(action.payload.form.current).forEach(
        input => (row[input.id] = input.value)
      );
      request = {
        type: 'PATCH',
        data: row
      };
    }
    //setTimeout(() => onRequest(request));
    console.log(request);
  }

  useEffect(() => {
    console.log(data);
    console.log(state);
  }, [state, data]);

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
    updateData(newState);
  }

  // sort
  function sort(e) {
    const column = e.target.dataset.id;
    if (!column) {  // The last "Action" column is not sortable
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
    // sort only when a column is clicked and sort order is not null
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
        readonly={type !== 'edit'}
      />
    );
    // delete row
    if (type === 'delete') {
      setDialog(
        <Dialog
          modal
          header="Confirm deletion"
          confirmLabel="Delete"
          onAction={(action) => {
            setDialog(null);
            if (action === 'Confirm') {
              sendRequest({
                type: 'delete',
                payload: { rowidx }
              });
            }
          }}>
          {dialogForm}
        </Dialog>
      );
    }
    // edit row
    if (type === 'edit') {
      setDialog(
        <Dialog
          modal
          extendedDismiss={false}
          header="Edit order"
          confirmLabel="Save"
          hasCancel={true}
          onAction={(action) => {
            setDialog(null);
            if (action === 'Confirm') {
              sendRequest({
                type: 'edit',
                payload: { rowidx, form }
              });
            }
          }}>
          {dialogForm}
        </Dialog>
      );
    }
  }

  return (
    <div className="Excel">
      <table>
        <thead onClick={sort}>
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
          <tr onChange={search}>
            {Object.keys(schema).map((key, idx) => (
              !schema[key].show ? null :
                <td key={idx}>
                  <input type="text" data-id={key} />
                </td>
            ))}
          </tr>
          {data.map((row, rowidx) => {
            return (
              <tr key={rowidx} data-row={rowidx}>
                {Object.keys(schema).map((key, columnidx) => {
                  let { show, align } = schema[key];
                  if (!show) {
                    return null;
                  }
                  let content = row[key];
                  return (
                    <td
                      key={columnidx}
                      data-schema={key}
                      className={classNames({
                        [`schema-${key}`]: true,
                        ExcelEditable: true,
                        ExcelDataLeft: align === 'left',
                        ExcelDataRight: align === 'right',
                        ExcelDataCenter: align !== 'left' && align !== 'right'
                    })}>
                      {content}
                    </td>
                  );
                })}
                <td>
                  <Actions onAction={handleAction.bind(null, rowidx)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {dialog}
    </div>
  );
}

Excel.propTypes = {
  schema: PropTypes.object,
  initialData: PropTypes.arrayOf(PropTypes.object),
  onRequest: PropTypes.func,
};

export default Excel;
