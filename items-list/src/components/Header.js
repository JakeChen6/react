import Logo from './Logo';
import './Header.css';

import Button from './Button';

function Header({ onExport, onImport, onAdd, onRefresh }) {
  return (
    <div className='Header'>
      <Logo />

      <div>
        <Button href='data.csv' onClick={onExport}>
          Export CSV
        </Button>
      </div>

      <div>
        <Button onClick={onImport}>
          Import CSV
        </Button>
      </div>

      <div>
        <Button onClick={onAdd}>
        <b>&#65291;</b> Add Order
        </Button>
      </div>

      <div>
        <Button onClick={onRefresh}>
          Refresh Data
        </Button>
      </div>

    </div>
  );
}

export default Header;
