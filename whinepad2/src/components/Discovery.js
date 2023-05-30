import { useRef, useState } from "react";

import Excel from "./Excel";
import Logo from "./Logo";
import Body from "./Body";
import Button from "./Button";
import FormInput from "./FormInput";
import Form from "./Form";
import Actions from "./Actions";
import Dialog from "./Dialog";

import schema from "../config/schema";


function DialogExample() {
  const [example, setExample] = useState(null);
  return (
    <>
      <p>
        <Button onClick={() => setExample(1)}>Example 1</Button>{' '}
        <Button onClick={() => setExample(2)}>Example 2</Button>
      </p>
      {example === 1 ? (
        <Dialog
          modal
          header="Out-of-the-box example"
          onAction={(type) => {
            alert(type);
            setExample(null);
          }}>
          Hello, dialog!
        </Dialog>
      ) : null}
      {example === 2 ? (
        <Dialog
          header="Not modal, custom dismiss button"
          hasCancel={false}
          confirmLabel="Whatever"
          onAction={(type) => {
            alert(type);
            setExample(null);
          }}>
          Anything goes here, like a <Button>a button</Button> for example
        </Dialog>
      ) : null}
    </>
  );
}

function Discoery() {
  const form = useRef();

  return (
    <div className="Discovery">
      <h2>Logo</h2>
      <div style={{background: '#f6f6f6', display: 'inline-block'}}>
        <Logo />
      </div>

      <h2>Body</h2>
      <Body>I am content inside the body</Body>

      <h2>Buttons</h2>
      <p>
        Button with onClick:{' '}
        <Button onClick={() => alert('ouch')}>Click me</Button>
      </p>
      <p>
        A link: <Button href="https://reactjs.org/">Follow me</Button>
      </p>
      <p>
        Custom class name:{' '}
        <Button className="Discovery-custom-button">I do nothing</Button>
      </p>

      <h2>Form inputs</h2>
      <table className="Discovery-pad">
        <tbody>
          <tr>
            <td>Vanilla input</td>
            <td><FormInput /></td>
          </tr>
          <tr>
            <td>Prefilled</td>
            <td><FormInput defaultValue="with a default" /></td>
          </tr>
          <tr>
            <td>Year</td>
            <td><FormInput type="year" /></td>
          </tr>
          <tr>
            <td>Vanilla textarea</td>
            <td><FormInput type="textarea" /></td>
          </tr>
        </tbody>
      </table>

      <h2>Form</h2>
      <Form
        ref={form}
        fields={{
          freetext: {label: 'Greetings'},
        }}
        initialData={{freetext: 'Hello'}}
      />
      <p>
        <Button
          onClick={() => {
            const data = {};
            Array.from(form.current).forEach(
              (input) => (data[input.id] = input.value),
            );
            alert(JSON.stringify(data));
          }}>
          Submit
        </Button>
      </p>

      <h2>Actions</h2>
      <p>
        <Actions onAction={(type) => alert(type)} />
      </p>

      <h2>Dialog</h2>
      <DialogExample />

      <h2>Excel</h2>
      <Excel
        schema={schema}
        initialData={schema.createdTime.samples.map((_, idx) => {
          const element = {};
          for (let key in schema) {
            element[key] = schema[key].samples[idx];
          }
          return element;
        })}
        onDataChange={(data) => {
          console.log(data);
        }}
      />

    </div>
  );
}

export default Discoery;