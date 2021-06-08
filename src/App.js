import { useCallback, useEffect, useState } from 'react';
import './App.css';

const eachSlice = ( array, sliceSize ) => {
  return [ ...new Array( array.length / sliceSize ).keys() ]
    .map( multiple => array.slice( multiple * sliceSize, multiple * sliceSize + sliceSize ) );
}

const NoteButtons = ( { noteIndex } ) => <section className="note-buttons">
  <button
    name="save"
    data-index={ noteIndex }
  >
    💾
  </button>
  <button
    name="delete"
    data-index={ noteIndex }
  >
    ❌
  </button>
</section>;

const Note = ( { noteIndex, currentEdit, setCurrentEdit, notesState, setNotesState } ) => {
  return <div
      className={ noteIndex === currentEdit.index ? "note selected" : "note" }
      data-index={ noteIndex }
    >
    <img src="stickyNote.png" alt="" />
    <textarea
      maxLength="255"
      className="note-field"
      value={ currentEdit.index === noteIndex ? currentEdit.content : notesState[ noteIndex ] }
      onChange={ changeEvent => setCurrentEdit( { index: noteIndex, content: changeEvent.target.value } ) }
    />
    <NoteButtons noteIndex={ noteIndex } />
  </div>;
}

const NoteRows = ( { notes, currentEdit, setCurrentEdit, setNotesState } ) => <>
  { eachSlice( notes, 6 ).map( ( rowOfNotes, rowNumber ) => <section className="row" key={ rowNumber * 100 }>
      { rowOfNotes.map( ( note, columnNumber ) => <Note
        key={ rowNumber * 6 + columnNumber }
        noteIndex={ rowNumber * 6 + columnNumber }
        notesState={ notes }
        currentEdit={ currentEdit }
        setCurrentEdit={ setCurrentEdit }
        setNotesState={ setNotesState }
      /> ) }
    </section>
  ) }
</>;

function App() {

  const [ notes, setNotes ] = useState(
    Array(36).fill( "" )
  );
  
  const [ currentEdit, setCurrentEdit ] = useState( { index: null, content: null } );
  console.log('currentEdit: ', currentEdit);

  const updateNote = useCallback( ( noteIndex, contentToUpdate ) => {
    const newNotesState = [ ...notes ];
    newNotesState[ noteIndex ] = contentToUpdate;
    setNotes( newNotesState );
  }, [ notes ] );

  const deleteNote = useCallback( ( noteIndex ) => {
    const newNotesState = [ ...notes ];
    newNotesState[ noteIndex ] = "";
    setNotes( newNotesState );
  }, [ notes ] );

  const swapNotes = useCallback( ( thisIndex, thatIndex ) => {
    const newNotesState = [ ...notes ];
    [ newNotesState[ thisIndex ], newNotesState[ thatIndex ] ] = [ newNotesState[ thatIndex ], newNotesState[ thisIndex ] ];
    setNotes( newNotesState );
    // setCurrentEdit( { index: thatIndex, content: newNotesState[ thatIndex ] } );
    setCurrentEdit( { index: null, content: null } );
  }, [ notes ] );

  const handleClick = useCallback( clickEvent => {
    const clickedNoteIndex = clickEvent.target.closest("div").dataset && parseInt( clickEvent.target.closest("div").dataset.index );
    if ( clickEvent.target.name === "save" ) {
      updateNote( currentEdit.index, currentEdit.content );
      // return;
    }
    if ( clickEvent.target.name === "delete" ) {
      deleteNote( clickedNoteIndex );
      // return;
    }
    if ( typeof clickedNoteIndex == "number" && typeof currentEdit.index == "number" && clickedNoteIndex !== currentEdit.index ) {
      swapNotes( clickedNoteIndex, currentEdit.index );
      return;
    }
    if ( !isNaN( clickedNoteIndex ) ) {
      setCurrentEdit( { index: clickedNoteIndex, content: notes[ clickedNoteIndex ] } );
      // return;
    }
    if ( clickedNoteIndex === currentEdit.index ) {
      setCurrentEdit( { index: null, content: null } );
      // return;
    }
  }, [ updateNote, deleteNote, swapNotes, notes, currentEdit ] );

  useEffect( () => {
    window.addEventListener( "click", handleClick );
    return () => window.removeEventListener( "click", handleClick );
  }, [ handleClick ] );

  return (
    <div className="app">
      { notes && <NoteRows
        notes={ notes }
        currentEdit={ currentEdit }
        setCurrentEdit={ setCurrentEdit }
        setNotesState={ setNotes }
      /> }
    </div>
  );

}

export default App;
