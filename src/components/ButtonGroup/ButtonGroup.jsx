import './ButtonGroup.css';

const ButtonGroup = ({ onClick, rows, cols, mines }) => {
  return (
    <>
      <div className='buttonGroup'>
        <div className="mines">
          <button onClick={() => onClick('decrement', 'mines')}>-</button>
          <span>{mines} M</span>
          <button onClick={() => onClick('increment', 'mines')}>+</button>
        </div>

        <div className='rowsCols'>
          <div className='rows'>
            <button onClick={() => onClick('decrement', 'rows')}>-</button>
            <span>{rows} R</span>
            <button onClick={() => onClick('increment', 'rows')}>+</button>
          </div>

          <div className='cols'>
            <button onClick={() => onClick('decrement', 'cols')}>-</button>
            <span>{cols} C</span>
            <button onClick={() => onClick('increment', 'cols')}>+</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonGroup;
