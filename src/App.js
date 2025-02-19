import React, { useState, useEffect, useRef } from 'react';
import { ref, set, onValue, update } from 'firebase/database';
import { database } from './firebase';
import ConfirmationBox from './ConfirmationBox';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRef = useRef(null);

  // Fetch items from Firebase
  useEffect(() => {
    const itemsRef = ref(database, 'items');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const itemList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setItems(itemList);
    }, (err) => {console.log(err)});
  }, []);

  // Add item with description to Firebase
  const addItem = () => {
    if (newItem.trim() !== '' && newDescription.trim() !== '') {
      const newItemRef = ref(database, `items/${Date.now()}`);
      set(newItemRef, { text: newItem, description: newDescription });
      setNewItem('');
      setNewDescription('');
    }
  };

  // Start editing item
  const startEdit = (item) => {
    setEditingItem(item);
    setEditedValue(item.text);
    setEditedDescription(item.description);
  };

  // Save edited item to Firebase
  const saveEdit = () => {
    const itemRef = ref(database, `items/${editingItem.id}`);
    update(itemRef, { text: editedValue, description: editedDescription }).then(() => {
      setEditingItem(null);
      setEditedValue('');
      setEditedDescription('');
    });
  };

  return (
    <div className="App">
      <h1>Escolha um presente!</h1>
      <h2>Digite seu nome completo e confirme.</h2>

      {process.env.REACT_APP_AMBIENTE === "local" && (
        <>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter item name"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter item description"
          />
          <button onClick={addItem}>Add</button>
        </>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {items.map((item) => {
          if (!item.description) {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "8px",
                  width: "100%",
                  justifyContent: "start"
                }} key={item.id}>
                {(
                  <>
                    <label
                      style={{ fontSize: "22px" }}
                      htmlFor={item.id}
                    >
                      {item.text}
                    </label>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <input
                        ref={inputRef}
                        id={item.id}
                        type="text"
                        minLength="3"
                        maxLength="50"
                        value={editingItem?.id === item.id ? editedDescription : item.description}
                        pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+"
                        placeholder="Nome completo"
                        onClick={() => startEdit(item)}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                      <button 
                        disabled={editingItem?.id !== item.id}
                        onClick={() => {
                          setShowConfirm(true);
                        }}
                      >
                        {"Confirmar"}
                      </button>
                    </div>                    
                  </>
                )}
              </div>
            )
          }
          return null;
        })}
        {showConfirm && (
          <ConfirmationBox 
            title={`Você escolheu: ${editingItem.text}`}
            description="Confirma sua escolha?" 
            onConfirm={() => {
              setTimeout(() => setShowConfirm(false), 250);
              saveEdit();
            }}
            confirmText="Sim"
            onCancel={() => {
              setTimeout(() => setShowConfirm(false), 250);
            }}
            cancelText="Não"
          />
        )}
      </div>
    </div>
  );
}

export default App;
