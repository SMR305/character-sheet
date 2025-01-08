import React, { useState, useEffect } from 'react';
import Entry from '../components/Entry';

const Spells = () => {

  const [theme, setTheme] = useState("light");

  // Load the theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme; // Set initial theme on body
  }, []);

  const [spells, setSpells] = useState([]);
  const [subSet, setSubSet] = useState(() => JSON.parse(localStorage.getItem('subSet')) || 1);
  const [totalSubSets, setTotalSubSets] = useState(() => JSON.parse(localStorage.getItem('totalSubSets')) || 1);
  const [expanded, setExpanded] = useState([]);

  // Source Options
  const [settingsText, changeSettingsText] = useState("Source Options +");
  const [showSettings, changeShow] = useState(false);
  const allSources = ['aag', 'ai', 'aitfr-avt', 'bmt', 'dodk', 'egw', 'ftd', 'ggr', 'ghloe', 'hwcs', 'idrotf', 'llk', 'phb', 'xphb', 'sato', 'scc', 'tce', 'tdcsr', 'xge'];
  const [checkedItems, setCheckedItems] = useState(
    JSON.parse(localStorage.getItem('checkedItems')) || 
    allSources.reduce((acc, item) => ({ ...acc, "phb": true, "xphb": true, [item]: false }), {})
  );

  const handleCheckboxChange = (item) => {
    setCheckedItems((prev) => {
      const newCheckedItems = {
        ...prev,
        [item]: !prev[item], // Toggle the checkbox state
      };
      localStorage.setItem('checkedItems', JSON.stringify(newCheckedItems));
      return newCheckedItems;
    });
  };

  useEffect(() => {
    const savedSpells = JSON.parse(localStorage.getItem('spells'));
    if (savedSpells) {
      setSpells(savedSpells);
      setTotalSubSets(Math.ceil(savedSpells.length / 20));
    } else {
      async function go() {
        let input = "spells-phb";
        try {
          const module = await import(`../spells/${input}.json`); // Adjust the path as needed
          setSpells([...module["spell"]]);
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
    localStorage.setItem('subSet', JSON.stringify(subSet));
  }, [subSet]);

  useEffect(() => {
    localStorage.setItem('totalSubSets', JSON.stringify(totalSubSets));
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

  const loadSources = async (r) => {
    let list = [];
    
    if (r) {
      for (let i = 0; i < allSources.length; i++) {
        if (checkedItems[allSources[i]] === true) {
          list.push(allSources[i]);
        }
      }
    }
    else {
      list.push("phb");
      list.push("xphb");
      let temp = allSources.reduce((acc, item) => ({ ...acc, "phb": true, "xphb": true, [item]: false }), {});
      setCheckedItems(temp);
      localStorage.setItem('checkedItems', JSON.stringify(temp));
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

  return (
    <div className={`container ${theme}`}>
      <div style={{textAlign:"right"}}>
        <span onClick={handleSettings}>{`${settingsText}`}</span>
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
                    {item}
                </div>
              </label>
            ))}
          </div>
          <button className="blue-button" onClick={() => loadSources(true)}> Load New Sources </button>
          <button className="blue-button" onClick={() => loadSources(false)}> Reset Sources </button>
          </>)
          : null
        }
      </div>
      
      <h1> Spells</h1>
      <span>
          This is where you can find all the spells for Dungeons and Dragons 5th edition and 5.5 edition (2024).
      </span>

      <>
        {spells.map((spell, index) => (
          (index / 20 < subSet) && (index / 20 >= subSet - 1) ?
            <div key={index} className={`spell ${theme}`}>
              <button onClick={() => toggleExpand(index)} className={'spell-item'} > {index} {spell.name}</button>
              { (expanded.includes(index))
                ?
                  <div className={`spell-description ${theme}`}>
                    <p>Source: {spell.source}</p>
                    <p>Page: {spell.page}</p>
                    <p>Level: {spell.level}</p>
                    <p>School: {spell.school}</p>
                    <p>Components: {Object.keys(spell.components).join(", ")}</p>
                    <p>Duration Type: {spell.duration[0].type}</p>
                    <p>Duration: {spell.duration[0].duration ? Object.values(spell.duration[0].duration).join(" ") : "None"}
                        {spell.duration[0].concentration ? " : Concentration" : ''}</p>
                    {spell.entries.map((entry, index) => (<div key={index}><Entry entry={entry}/></div>))}
                  </div>
                : null
              }
          </div>
        : null
        ))}
      </>

      <div>
        <button className={'button'} onClick={() => setSubSet(subSet - 1)} disabled={subSet <= 1}>Previous</button>

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

        <button className={'button'} onClick={() => setSubSet(subSet + 1)} disabled={subSet >= totalSubSets}>Next</button>
      </div>
    </div>
  );
}

export default Spells;