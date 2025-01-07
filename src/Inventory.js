import React, {useState} from 'react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [item, setItem] = useState({name: "", weight: undefined, description: "", number: undefined, tags: ""});
    const [expanded, setExpanded] = useState([]);
    
    const handleItemChange = (e) => {
        setItem({...item, [e.target.name] : `${e.target.value}`})
    };

    const toggleExpand = (index) => {
        if (expanded.includes(index)) {
            setExpanded(expanded.filter((item) => item !== index));
        }
        else {
            setExpanded([...expanded, index]);
        }
    };

    const addItem = () => {
        console.log(items.length);

        setItems([...items, item]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleNumberChange = (index, newValue) => {
        setItems((prevItems) =>
            prevItems.map((item, i) =>
                i === index ? { ...item, number: newValue } : item
            )
        );
    };

    return (
        <div>
            <input
                type='text'
                name='name'
                value={item.name}
                onInput={handleItemChange}
                placeholder='name...'
            />
            <input
                type='number'
                name='weight'
                value={item.weight}
                onInput={handleItemChange}
                placeholder='weight...'
            />
            <textarea
                className={`notes-box`}
                name='description'
                value={item.description}
                onInput={handleItemChange}
                placeholder='description...'
            />
            <input
                type='text'
                name='tags'
                value={item.tags}
                onInput={handleItemChange}
                placeholder='tags...'
            />
            <input
                type='number'
                name='number'
                value={item.number}
                onInput={handleItemChange}
                placeholder='number...'
            />

            <button onClick={addItem}> Add Item</button>
            <br />
            <br />

            <div style={{backgroundColor: '#ddd', padding: '5px', width: '780px', borderRadius: '10px'}}>
                <h3>Items</h3>

                {items.map((i, index) => (
                    <div style={{backgroundColor: '#ccc', borderRadius: '5px', padding: '10px', textAlign: 'left', margin: '5px'}}>
                            <span onClick={() => toggleExpand(index)}> {i.name}, Weight: {i.weight}, Number: {i.number}, Tags: {i.tags} </span>
                            {expanded.includes(index)
                                ?
                                    <div style={{background: 'white', borderRadius: '5px', width: '770px'}}>
                                        <span style={{whiteSpace: 'pre-wrap'}}> {i.description}</span> <br /> <span style={{whiteSpace: 'pre-wrap'}}> </span>
                                        <input
                                            type='number'
                                            name='number'
                                            value={i.number}
                                            onInput={(e) => handleNumberChange(index, e.target.value)}
                                            placeholder='number...'
                                        />
                                        <button onClick={() => removeItem(index)} className='red-button'> Delete </button>
                                    </div>
                                : null
                            }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;