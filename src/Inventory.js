import React, {useState} from 'react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [item, setItem] = useState({name: "", weight: undefined, description: "", number: undefined, tags: "", id: undefined});
    const [expanded, setExpanded] = useState([]);
    // Use Id's to delete items instead of names
    const [id, setId] = useState(0);
    
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

    const removeItem = (name) => {
        setItems(items.filter((a => a.name !== name)));
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

            {items.map((i, index) => (
                <div>
                    <button style={{width: '400px', backgroundColor: '#ddd', borderRadius: '5px', padding: '10px', textAlign: 'left'}} onClick={() => toggleExpand(index)}>
                        {i.name}, Weight: {i.weight}, Number: {i.number}, Tags: {i.tags}
                        {expanded.includes(index)
                            ?
                                <div style={{backgroundColor: '#ccc', borderRadius: '5px'}}>
                                    <span> {i.description} </span>
                                    <button onClick={() => removeItem(i.name)} className='red-button'> Delete </button>
                                </div>
                            : null
                        }
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Inventory;