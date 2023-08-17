import './Child.css';

const Child = (props) => {
  let cn = 'child';
  if (!props.cellView.revealed) {
    cn = cn + ' hidden';
  }
  if (props.cellView.flagged) {
    cn = cn + ' flagged';
  }

  return (
    <>
      <div
        onClick={props.onClick}
        onContextMenu={props.onContextMenu}
        className={cn}
      >
        {/* {props.cellView.revealed ? props.data : ''} */}
        <p>{props.data}</p>
      </div>
    </>
  );
};

export default Child;
