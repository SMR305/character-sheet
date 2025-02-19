import React, { useState, useEffect, useMemo } from 'react';
import Entry from '../components/Entry';
import sourceRef from '../sourceRef.json';
import spellSource from '../spells/sources.json';

const Spells = () => {

    const bookList = sourceRef.data;
    const [theme, setTheme] = useState("light");

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    const [allSpells, setAllSpells] = useState([]);
    const [spells, setSpells] = useState([]);
    const [subSet, setSubSet] = useState(() => JSON.parse(localStorage.getItem('spell-subSet')) || 1);
    const [totalSubSets, setTotalSubSets] = useState(() => JSON.parse(localStorage.getItem('spell-totalSubSets')) || 1);
    const [expanded, setExpanded] = useState([]);
    const [keyPhrase, setKey] = useState('');

    // Source Options
    const [settingsText, changeSettingsText] = useState("Source Options +");
    const [showSettings, changeShow] = useState(false);
    const allSources = useMemo(() => ['aag', 'ai', 'aitfr-avt', 'bmt', 'dodk', 'egw', 'ftd', 'ggr', 'ghloe', 'hwcs', 'idrotf', 'llk', 'phb', 'xphb', 'sato', 'scc', 'tce', 'tdcsr', 'xge'], []);
    const [checkedItems, setCheckedItems] = useState(
        JSON.parse(localStorage.getItem('spell-checkedItems')) || 
        allSources.reduce((acc, item) => ({ ...acc, "phb": true, "xphb": true, [item]: false }), {})
    );

    const handleCheckboxChange = (item) => {
        setCheckedItems((prev) => {
            const newCheckedItems = {
                ...prev,
                [item]: !prev[item], // Toggle the checkbox state
            };
            localStorage.setItem('spell-checkedItems', JSON.stringify(newCheckedItems));
            return newCheckedItems;
        });
    };

    useEffect(() => {
        const savedSpells = JSON.parse(localStorage.getItem('spells'));
        if (savedSpells) {
            setAllSpells(savedSpells);
            setTotalSubSets(Math.ceil(savedSpells.length / 20));
        } else {
            async function go() {
                let input = "spells-phb";
                try {
                    const module = await import(`../spells/${input}.json`); // Adjust the path as needed
                    setAllSpells([...module["spell"]]);
                    const total = Math.ceil(module["spell"].length / 20);
                    setTotalSubSets(total);
                    localStorage.setItem('spells', JSON.stringify(module["spell"]));
                } catch (error) {
                    console.error("Error loading JSON:", error);
                }
            }
            go();
        }
    }, []);

    useEffect(() => {
        setSpells([...allSpells]);
    }, [allSpells]);

    useEffect(() => {
        setTotalSubSets(Math.ceil(spells.length / 20));
        setSubSet(1);
    }, [spells]);

    const handleKeyChange = (e) => {
        setKey(e.target.value);
        setSpells(allSpells.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
    };

    useEffect(() => {
        localStorage.setItem('spells-subSet', JSON.stringify(subSet));
    }, [subSet]);

    useEffect(() => {
        localStorage.setItem('spells-totalSubSets', JSON.stringify(totalSubSets));
    }, [totalSubSets]);

    const toggleExpand = (index) => {
        if (expanded.includes(index)) {
            setExpanded(expanded.filter((item) => item !== index));
        }
        else {
            setExpanded([...expanded, index]);
        }
    };

    const handleSettings = () => {
        if (showSettings) {
            changeSettingsText("Source Options +");
            changeShow(0);
        }
        else {
            changeSettingsText("Source Options -");
            changeShow(1);  
        }
    };

    const setSources = async (r) => {
        let list = [];
        if (r) {
            allSources.forEach(item => {
                list.push(item);
            });
            let temp = allSources.reduce((acc, item) => ({ ...acc, [item]: true }), {});
            setCheckedItems(temp);
            localStorage.setItem('spell-checkedItems', JSON.stringify(temp));
        }
        else {
            list.push("phb");
            list.push("xphb");
            let temp = allSources.reduce((acc, item) => ({ ...acc, "phb": true, "xphb": true, [item]: false }), {});
            setCheckedItems(temp);
            localStorage.setItem('spell-checkedItems', JSON.stringify(temp));
        }
        
        let finalList = [];
        
        for (let i = 0; i < list.length; i++) {
            let input = "spells-" + list[i];
            try {
                const module = await import(`../spells/${input}.json`); // Adjust the path as needed
                finalList = [...finalList ,...module["spell"]];
            } catch (error) {
                console.error("Error loading JSON:", error);
            }
        }

        setAllSpells([...finalList]);
        setExpanded([]);
        setSubSet(1);
        setTotalSubSets(Math.ceil(finalList.length / 20));
        localStorage.setItem('spells', JSON.stringify(finalList));
    };

    useEffect(() => {
        async function loadSources() {
            let list = [];

            for (let i = 0; i < allSources.length; i++) {
                if (checkedItems[allSources[i]] === true) {
                    list.push(allSources[i]);
                }
            }

            let finalList = [];
        
            for (let i = 0; i < list.length; i++) {
                let input = "spells-" + list[i];
                try {
                    const module = await import(`../spells/${input}.json`); // Adjust the path as needed
                    finalList = [...finalList ,...module["spell"]];
                } catch (error) {
                    console.error("Error loading JSON:", error);
                }
            }
    
            setSpells([...finalList]);
            setExpanded([]);
            setSubSet(1);
            setTotalSubSets(Math.ceil(finalList.length / 20));
            localStorage.setItem('spells', JSON.stringify(finalList));
        };

        loadSources();
    }, [allSources, checkedItems]);

    return (
        <div className={`container ${theme}`}>
            <div style={{textAlign:"right"}}>
                <span onClick={handleSettings} style={{ textDecoration: "underline", cursor: "pointer" }}>{`${settingsText}`}</span>
                {showSettings ?
                    (<>
                    <div className={`menu ${theme}`}>
                        {allSources.map((item) => (
                            <label key={item + " label"} style={{padding:"10px", fontWeight:"bold"}}>
                                <div key={item}>
                                    <input
                                        type="checkbox"
                                        checked={checkedItems[item]}
                                        onChange={() => handleCheckboxChange(item)}
                                    />
                                    {bookList.find(book => book.id === item.toLowerCase()) ? bookList.find(book => book.id === item.toLowerCase()).title : item}
                                </div>
                            </label>
                        ))}
                    </div>
                    <button className="blue-button" onClick={() => setSources(true)}> Set All Sources </button>
                    <button className="blue-button" onClick={() => setSources(false)}> Reset Sources </button>
                    </>)
                    : null
                }
            </div>
            
            <h1> Spells</h1>
            <span>
                This is where you can find all the spells for Dungeons and Dragons 5th edition and 5.5 (2024) edition.
            </span>
            <br />

            <br />
            <div className={`form-group  ${theme}`}>
                <input
                    placeholder='Search...'
                    type='text'
                    value={keyPhrase}
                    onChange={handleKeyChange}
                    className={`inventory-input ${theme}`}
                    width='100%'
                />
            </div>
            <br />
            <hr />

            <div>
                <button className={'button'} onClick={() => setSubSet(1)} disabled={subSet <= 1}>{"<<"}</button>
                <button className={'button'} onClick={() => setSubSet(subSet - 1)} disabled={subSet <= 1}>{"<"}</button>

                {subSet <= 2 && totalSubSets > 4 ?
                    <>
                        <button className={'button'} onClick={() => setSubSet(1)} style={subSet === 1 ? {background: '#0056b3'} : {}}> 1 </button>
                        <button className={'button'} onClick={() => setSubSet(2)} style={subSet === 2 ? {background: '#0056b3'} : {}}> 2 </button>
                        <button className={'button'} onClick={() => setSubSet(3)} style={subSet === 3 ? {background: '#0056b3'} : {}}> 3 </button>
                        <button className={'button'} onClick={() => setSubSet(4)} style={subSet === 4 ? {background: '#0056b3'} : {}}> 4 </button>
                        <button className={'button'} onClick={() => setSubSet(5)} style={subSet === 5 ? {background: '#0056b3'} : {}}> 5 </button>
                    </>
                    : null
                }

                {subSet > 2 && subSet <= totalSubSets - 2 ?
                    <>
                        <button className={'button'} onClick={() => setSubSet(subSet - 2)}> {subSet - 2} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet - 1)}> {subSet - 1} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet)} style={{background: '#0056b3'}}> {subSet} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet + 1)}> {subSet + 1} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet + 2)}> {subSet + 2} </button>
                    </>
                    : null
                }

                {subSet > totalSubSets - 2 && totalSubSets > 4 ?
                    <>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 4)} style={subSet === totalSubSets - 4 ? {background: '#0056b3'} : {}}> {totalSubSets - 4} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 3)} style={subSet === totalSubSets - 3 ? {background: '#0056b3'} : {}}> {totalSubSets - 3} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 2)} style={subSet === totalSubSets - 2 ? {background: '#0056b3'} : {}}> {totalSubSets - 2} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 1)} style={subSet === totalSubSets - 1 ? {background: '#0056b3'} : {}}> {totalSubSets - 1} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets)} style={subSet === totalSubSets ? {background: '#0056b3'} : {}}> {totalSubSets} </button>
                    </>
                    : null
                }

                {totalSubSets < 5 ? 
                    <>
                        {Array.from({length: totalSubSets}, (_, i) => i + 1).map((item) => (
                            <button className={'button'} key={item} onClick={() => setSubSet(item)} style={subSet === item ? {background: '#0056b3'} : {}}> {item} </button>
                        ))}
                    </>
                    : null
                }

                <button className={'button'} onClick={() => setSubSet(subSet + 1)} disabled={subSet >= totalSubSets}>{">"}</button>
                <button className={'button'} onClick={() => setSubSet(totalSubSets)} disabled={subSet >= totalSubSets}>{">>"}</button>
            </div>

            <>
                {spells.map((spell, index) => (
                    (index / 20 < subSet) && (index / 20 >= subSet - 1) ?
                        <div key={index} className={`spell ${theme}`}>
                            <button onClick={() => toggleExpand(index)} className={'spell-item'} >{spell.name}</button>
                            { (expanded.includes(index))
                                ?
                                    <div className={`spell-description ${theme}`}>
                                        <p>Source: {bookList.find(book => book.id === spell.source.toLowerCase()) ? bookList.find(book => book.id === spell.source.toLowerCase()).title : spell.source}</p>
                                        <p>Page: {spell.page}</p>
                                        <p>Level: {spell.level}</p>
                                        <p>School: {spell.school}</p>
                                        <p>Components: {Object.keys(spell.components).join(", ")}</p>
                                        <p>Duration Type: {spell.duration[0].type}</p>
                                        <p>Duration: {spell.duration[0].duration ? Object.values(spell.duration[0].duration).join(" ") : "None"}
                                            {spell.duration[0].concentration ? " : Concentration" : ''}</p>
                                        <p>{spellSource[`${spell.source}`][`${spell.name}`].class ? <>Classes:{spellSource[`${spell.source}`][`${spell.name}`].class.map((item, index) => (
                                            <span key={index}> 
                                                {(index !== spellSource[`${spell.source}`][`${spell.name}`].class.length)
                                                    ? <span> {item.source === 'XPHB' ? <>{item.name} (2024),</> : <>{item.name},</>}</span>
                                                    : <span> {item.name}{item.source === 'XPHB' ? <> (2024)</> : null}</span>}
                                            </span>))}</> : null}
                                        </p>
                                        {spell.entries.map((entry, index) => (<div key={index}><Entry entry={entry}/></div>))}
                                    </div>
                                : null
                            }
                        </div>
                    : null
                ))}
            </>

            <div>
                <button className={'button'} onClick={() => setSubSet(1)} disabled={subSet <= 1}>{"<<"}</button>
                <button className={'button'} onClick={() => setSubSet(subSet - 1)} disabled={subSet <= 1}>{"<"}</button>

                {subSet <= 2 && totalSubSets > 4 ?
                    <>
                        <button className={'button'} onClick={() => setSubSet(1)} style={subSet === 1 ? {background: '#0056b3'} : {}}> 1 </button>
                        <button className={'button'} onClick={() => setSubSet(2)} style={subSet === 2 ? {background: '#0056b3'} : {}}> 2 </button>
                        <button className={'button'} onClick={() => setSubSet(3)} style={subSet === 3 ? {background: '#0056b3'} : {}}> 3 </button>
                        <button className={'button'} onClick={() => setSubSet(4)} style={subSet === 4 ? {background: '#0056b3'} : {}}> 4 </button>
                        <button className={'button'} onClick={() => setSubSet(5)} style={subSet === 5 ? {background: '#0056b3'} : {}}> 5 </button>
                    </>
                    : null
                }

                {subSet > 2 && subSet <= totalSubSets - 2 ?
                    <>
                        <button className={'button'} onClick={() => setSubSet(subSet - 2)}> {subSet - 2} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet - 1)}> {subSet - 1} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet)} style={{background: '#0056b3'}}> {subSet} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet + 1)}> {subSet + 1} </button>
                        <button className={'button'} onClick={() => setSubSet(subSet + 2)}> {subSet + 2} </button>
                    </>
                    : null
                }

                {subSet > totalSubSets - 2 && totalSubSets > 4 ?
                    <>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 4)} style={subSet === totalSubSets - 4 ? {background: '#0056b3'} : {}}> {totalSubSets - 4} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 3)} style={subSet === totalSubSets - 3 ? {background: '#0056b3'} : {}}> {totalSubSets - 3} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 2)} style={subSet === totalSubSets - 2 ? {background: '#0056b3'} : {}}> {totalSubSets - 2} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets - 1)} style={subSet === totalSubSets - 1 ? {background: '#0056b3'} : {}}> {totalSubSets - 1} </button>
                        <button className={'button'} onClick={() => setSubSet(totalSubSets)} style={subSet === totalSubSets ? {background: '#0056b3'} : {}}> {totalSubSets} </button>
                    </>
                    : null
                }

                {totalSubSets < 5 ? 
                    <>
                        {Array.from({length: totalSubSets}, (_, i) => i + 1).map((item) => (
                            <button className={'button'} key={item} onClick={() => setSubSet(item)} style={subSet === item ? {background: '#0056b3'} : {}}> {item} </button>
                        ))}
                    </>
                    : null
                }

                <button className={'button'} onClick={() => setSubSet(subSet + 1)} disabled={subSet >= totalSubSets}>{">"}</button>
                <button className={'button'} onClick={() => setSubSet(totalSubSets)} disabled={subSet >= totalSubSets}>{">>"}</button>
            </div>
        </div>
    );
}

export default Spells;