import React, {useState, useEffect} from 'react';

const Inventory = ({ stuff, addStuff, removeStuff, changeNumber, cap, changeCapacity }) => {

    const [item, setItem] = useState({name: "", weight: '', description: "", number: '', tags: ""});
    const [expanded, setExpanded] = useState([]);
    const [tWeight, setWeight] = useState(0);
    
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

    const [theme, setTheme] = useState("light");

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    useEffect(() => {
        let w = 0;
        for (let i = 0; i < stuff.length; i++) {
            w += (parseInt(stuff[i].weight) || 0) * (parseInt(stuff[i].number) || 1);
        }
        setWeight(w);
    }, [stuff]);

    return (
        <div>
            <input
                type='text'
                name='name'
                value={item.name}
                onInput={handleItemChange}
                placeholder='name...'
                className={`inventory-input ${theme}`}
            />
            <input
                type='number'
                name='weight'
                value={item.weight}
                onInput={handleItemChange}
                placeholder='weight...'
                className={`inventory-input ${theme}`}
            />
            <textarea
                className={`notes-box ${theme}`}
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
                className={`inventory-input ${theme}`}
            />
            <input
                type='number'
                name='number'
                value={item.number}
                onInput={handleItemChange}
                placeholder='number...'
                className={`inventory-input ${theme}`}
            />

            <button onClick={() => addStuff(item)} className={`inventory-input ${theme}`}> Add Item</button>
            <br />
            <br />

            <div className={`items ${theme}`}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h3 style={{marginRight: 'auto'}}>Items</h3>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span>Carry Capacity Option:</span>
                        <select
                            value={cap.switch}
                            onChange={(e) => changeCapacity(cap.capacity, e.target.value)}
                            className={`inventory-input ${theme}`}
                        >
                            <option value={0}>STR x 15</option>
                            <option value={1}>STR x 5</option>
                            <option value={2}>Custom</option>
                        </select>
                        { cap.switch === '2'?
                            <input
                                type='number'
                                name='capacity'
                                value={cap.capacity}
                                onInput={(e) => changeCapacity(e.target.value, cap.switch)}
                                placeholder='Carry Capacity...'
                                className={`inventory-input ${theme}`}
                            />
                            : null
                        }
                        <span>Carry Capacity: {tWeight}/{(cap.capacity || 0)}</span>
                    </div>
                </div>

                {stuff.map((i, index) => (
                    <div className={`inventory ${theme}`} key={index}>
                            <span onClick={() => toggleExpand(index)}> {i.name}, Weight: {(i.weight || 0)}, Number: {(i.number || 1)}, Tags: {i.tags} </span>
                            {expanded.includes(index)
                                ?
                                    <div className={`item ${theme}`}>
                                        <span style={{whiteSpace: 'pre-wrap'}}>{i.description}</span> <br /> <span style={{whiteSpace: 'pre-wrap'}}> </span>
                                        <input
                                            type='number'
                                            name='number'
                                            value={i.number}
                                            onInput={(e) => changeNumber(index, e.target.value)}
                                            placeholder='number...'
                                            className={`inventory-input ${theme}`}
                                        />
                                        <button onClick={() => removeStuff(index)} className='red-button'> Delete </button>
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