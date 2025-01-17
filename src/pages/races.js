import React, {useState, useEffect} from "react";
import racesFile from '../races/races.json';
import Entry from "../components/Entry";
import sourceRef from '../sourceRef.json';

const Races = () => {

    const [theme, setTheme] = useState("light");

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    const sources = sourceRef.data;
    const racesList = racesFile.race;
    const [totalList, setTList] = useState([...racesList]);
    const [displayList, setDisplay] = useState([...totalList]);
    const [keyPhrase, setKey] = useState('');

    useEffect(() => {
        let newList = [];
        racesList.forEach((race) => {
            if (race && race._copy) {
                let c_race = racesList.find(item => item.name === race._copy.name && item.source === race._copy.source);
                if (race._copy._mod) {
                    let e = Array.isArray(race._copy._mod.entries) ? race._copy._mod.entries : [race._copy._mod.entries];
                    e.forEach(element => {
                        if (element.mode === 'replaceArr') {
                            if (typeof element.replace === 'string') {
                                const index = c_race.entries.findIndex(item => item.name === element.replace);
                                if (index !== -1) {
                                    c_race.entries[index] = element.items;
                                }
                            }
                            else {
                                c_race[element.replace.index] = element.items;
                            }
                        }
                        else if (element.mode === 'insertArr') {
                            let b = Array.isArray(element.items) ? element.items : [element.items];
                            b.forEach((item, index) => {
                                c_race.entries.splice(index + element.index, 0, item);
                            });
                        }
                    });
                }
                newList.push({...c_race, 'name': race.name, 'source': race.source, 'page': race.page, 'reprintedAs': race.reprintedAs, 'hasFluff': race.hasFluff, 'hasFluffImages': race.hasFluffImages});
            } else {
                newList.push(race);
            }
        })
        setTList([...newList]);
    }, [racesList]);

    useEffect(() => {
        setDisplay([...totalList]);
    }, [totalList]);

    const [expanded, setExpanded] = useState([]);

    const toggleExpand = (index) => {
        if (expanded.includes(index)) {
            setExpanded(expanded.filter((item) => item !== index));
        }
        else {
            setExpanded([...expanded, index]);
        }
    };

    const [subSet, setSubSet] = useState(() => JSON.parse(localStorage.getItem('subSet')) || 1);
    const [totalSubSets, setTotalSubSets] = useState(() => JSON.parse(localStorage.getItem('totalSubSets')) || 1);

    useEffect(() => {
        setTotalSubSets(Math.ceil(displayList.length / 20));
        setSubSet(1);
    }, [displayList]);

    useEffect(() => {
        localStorage.setItem('subSet', JSON.stringify(subSet));
    }, [subSet]);

    useEffect(() => {
        localStorage.setItem('totalSubSets', JSON.stringify(totalSubSets));
    }, [totalSubSets]);

    useEffect(() => {
        localStorage.setItem('totalList', JSON.stringify(totalList));
    }, [totalList]);

    useEffect(() => {
        localStorage.setItem('displayList', JSON.stringify(displayList));
        setTotalSubSets(Math.ceil(displayList.length / 20));
    }, [displayList]);

    const handleKeyChange = (e) => {
        setKey(e.target.value);
        setDisplay(racesList.filter(item => item.name.includes(e.target.value)));
    };

    return (
        <div className={`container ${theme}`}>
            <h1>Races</h1>
            <span>
                The place where you can find all the information on the races/species of 5th edition and 5.5 (2024) edition.
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

            {displayList.map((item, index) => {
                return (
                    (index / 20 < subSet) && (index / 20 >= subSet - 1) ?
                        <div key={index} className={`spell ${theme}`}>
                            <button onClick={() => toggleExpand(index)} className={'spell-item'} >{item.name} : {item.source}</button>
                                { (expanded.includes(index)) ?
                                    <div className={`spell-description ${theme}`}>
                                        <p>Source: {sources.find(element => element.id.toLowerCase() === item.source.toLowerCase()) ? sources.find(element => element.id.toLowerCase() === item.source.toLowerCase()).title : item.source}</p>
                                        {item.entries ? <>{item.entries.map((element, index) => { return <Entry key={index} entry={element}/>})}</> : null}
                                    </div>
                                    : null
                                }
                        </div>
                        : null
                );
            })}

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
};

export default Races;