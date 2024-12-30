import React, { useState, useEffect} from "react";
import Autocomplete from "./Autocomplete";
import handleDownload from "./DownloadFile";
import FileUploader from "./UploadFile";
import { core_2014, core_2024, crit_roll } from "./autoCompletes/classes";
import { bg_PHB, bg_XPHB, backgroundSources } from "./autoCompletes/backgrounds";
import { race_PHB, race_XPHB, race_DMG, raceSources } from "./autoCompletes/races";

const App = () => {
  // Character Stuff
  const [character, setCharacter] = useState({
    name: "",
    race: "",
    background: "",
    alignment: "",
  });
  const [levels, setLevels] = useState([]);
  const [abilityScores, setAbilityScores] = useState({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  const [health_info, setHealth] = useState({ cur: 0, max: 0, temp: 0});
  const [skills, setSkills] = useState([]);
  const [totalLevel, setTLevel] = useState(0);
  const [charClass, setClass] = useState('');
  const [Data, setData] = useState([]);
  const [notes, setNotes] = useState('');

  // suggestions
  const listClasses = [...core_2014, ...core_2024, ...crit_roll];
  const [listBackgrounds, updateBackgrounds] = useState([...bg_PHB, ...bg_XPHB]);
  const [listRaces, updateRaces] = useState([...race_PHB, ...race_DMG, ...race_XPHB]);

  // settings information
  const [settingsText, changeSettingsText] = useState("Source Options +");
  const [showSettings, changeShow] = useState(false);
  const allSources = [...new Set([...backgroundSources, ...raceSources])];
  const [checkedItems, setCheckedItems] = useState(
    allSources.reduce((acc, item) => ({ ...acc, "PHB": true, "XPHB": true, "DMG":true, [item]: false }), {})
  );
  
  // Handle checkbox toggle
  const handleCheckboxChange = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item], // Toggle the checkbox state
    }));
  };
  

  useEffect(() => {
    const defaultSkills = [
      { name: "Acrobatics", ability: "dexterity", prof: 0 },
      { name: "Animal Handling", ability: "wisdom", prof: 0 },
      { name: "Arcana", ability: "intelligence", prof: 0 },
      { name: "Athletics", ability: "strength", prof: 0 },
      { name: "Deception", ability: "charisma", prof: 0 },
      { name: "History", ability: "intelligence", prof: 0 },
      { name: "Insight", ability: "wisdom", prof: 0 },
      { name: "Intimidation", ability: "charisma", prof: 0 },
      { name: "Investigation", ability: "intelligence", prof: 0 },
      { name: "Medicine", ability: "wisdom", prof: 0 },
      { name: "Nature", ability: "intelligence", prof: 0 },
      { name: "Perception", ability: "wisdom", prof: 0 },
      { name: "Performance", ability: "charisma", prof: 0 },
      { name: "Persuasion", ability: "charisma", prof: 0 },
      { name: "Religion", ability: "intelligence", prof: 0 },
      { name: "Sleight of Hand", ability: "dexterity", prof: 0 },
      { name: "Stealth", ability: "dexterity", prof: 0 },
      { name: "Survival", ability: "wisdom", prof: 0 },
    ];
    setSkills(defaultSkills);
  }, []);
  
  const loadJson = async () => {
    let input = "spells-phb";
    try {
      const module = await import(`./spells/${input}.json`); // Adjust the path as needed
      setData([...module["spell"]]);
    } catch (error) {
      console.error("Error loading JSON:", error);
    }
  };

  const saveNotes = (e) => {
    setNotes(e.target.value);
  };

  const calculateProfBonus = () => Math.ceil(totalLevel / 4) + 1;

  const calculateModifier = (score, prof) => {
    return (Math.floor((score - 10) / 2) + ((Number(prof) >= 1) ? (Number(prof) * calculateProfBonus()) : 0));
  };

  const handleCharacterChange = (e) => {
    setCharacter({ ...character, [e.target.name]: e.target.value });
  };

  const handleRaceChange = (input) => {
    setCharacter({...character, 'race': input });
  };

  const handleBackgroundChange = (input) => {
    setCharacter({...character, 'background': input });
  };

  const handleAbilityScoreChange = (e) => {
    setAbilityScores({
      ...abilityScores,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const handleClass = (input) => {
    setClass(input);
  };

  const addLevel = () => {
    if (charClass) {
      setLevels([...levels, { className: charClass, level: 1 }]);
      setTLevel(totalLevel + 1);
    }
  };

  const removeLevel = (index) => {
    setTLevel(totalLevel - levels[index].level);
    setLevels(levels.filter((_, i) => i !== index));
  };

  const handleLevelChange = (e) => {
    let t_level = 0;
    for (let i = 0; i < levels.length; i += 1) {
      if (levels[i].className === e.target.name) {
        levels[i].level = Number(e.target.value);
      }
      t_level += levels[i].level;
    }
    setLevels([...levels]);
    setTLevel(t_level);
  };

  const addSkill = () => {
    const skillName = prompt("Enter skill name (e.g., Animal Handling):", "");
    if (skillName) {
      setSkills([...skills, { name: skillName, ability: "", prof: 0 }]);
    }
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    if (value === "1" || value === "0") {
      updatedSkills[index][field] = Number(value);
    }
    else {
      updatedSkills[index][field] = value;
    }
    setSkills(updatedSkills);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleUpload = (input) => {
    console.log(input);
    setCharacter(input.character);
    setLevels(input.levels);
    let t_level = 0;
    for (let i = 0; i < input.levels.length; i++) {
      t_level = input.levels[i].level;
    }
    setTLevel(t_level);
    setAbilityScores(input.abilityScores);
    setSkills(input.skills);
    setNotes(input.notes);
  }

  const handleSave = () => {
    console.log("Character Data:", { character, levels, abilityScores, skills, notes } );
    handleDownload({ character, levels, abilityScores, skills, notes });
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

  const loadSources = async () => {
    let list = [];
    for (let i = 0; i < allSources.length; i++) {
      if (checkedItems[allSources[i]] === true) {
        list.push(allSources[i]);
      }
    }

    let final_races = [];
    let final_bg = [];

    for (let i = 0; i < list.length; i++) {
      try {
        const module = await import("./autoCompletes/races.js"); // Adjust path if necessary
        if (module["race_" + list[i]]) {
          final_races.push(...module["race_" + list[i]]);
        }
      } catch (error) {
        console.error("Error importing a source:", error);
      }

      try {
        const module = await import("./autoCompletes/backgrounds.js"); // Adjust path if necessary
        if (module["bg_" + list[i]]) {
          final_bg.push(...module["bg_" + list[i]]);
        }
      } catch (error) {
        console.error("Error importing a source:", error);
      }
    }

    updateRaces([...final_races]);
    updateBackgrounds([...final_bg]);
  };

  const handleHealthChange = (e) => {
    setHealth({ ...health_info, [e.target.name]: parseInt(e.target.value) });
  };

  return (
    <div className="container">
      <h1>D&D 5e Character Sheet</h1>
      <div style={{textAlign:"right"}}>
        <text onClick={handleSettings}>{`${settingsText}`}</text>
        {showSettings ?
          (
          <div style={{display:"flex", flexWrap:"wrap", alignContent:"space-evenly", backgroundColor:"#ccc"}}>
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
            <button className="blue-button" onClick={loadSources}> Load New Sources </button>
          </div>)
          : (<span></span>)
        }
      </div>
      <div className="form-group">
        <label>Character Name</label>
        <input
          type="text"
          name="name"
          value={character.name}
          onChange={handleCharacterChange}
        />
      </div>
      <div className="form-group">
        <label>Race</label>
        <Autocomplete
          filler="Select Race..."
          onChange={handleRaceChange}
          display={character.race}
          newSuggestions={listRaces}
        />
      </div>
      <div className="form-group">
        <label>Background</label>
        <Autocomplete
          filler="Select Background..."
          onChange={handleBackgroundChange}
          display={character.background}
          newSuggestions={listBackgrounds}
        />
      </div>
      <div className="form-group">
        <label>Alignment</label>
        <select
          name="alignment"
          value={character.alignment}
          onChange={handleCharacterChange}
        >
          <option value="">Select Alignment</option>
          <option value="lawful-good">Lawful Good</option>
          <option value="neutral-good">Neutral Good</option>
          <option value="chaotic-good">Chaotic Good</option>
          <option value="lawful-neutral">Lawful Neutral</option>
          <option value="true-neutral">True Neutral</option>
          <option value="chaotic-neutral">Chaotic Neutral</option>
          <option value="lawful-evil">Lawful Evil</option>
          <option value="neutral-evil">Neutral Evil</option>
          <option value="chaotic-evil">Chaotic Evil</option>
        </select>
      </div>
      <br />
      <hr />
      <h2>Level: {totalLevel}</h2>
      <Autocomplete
        filler="Class..."
        onChange={handleClass}
        newSuggestions={listClasses}
      />
      {levels.map((level, index) => (
        <div key={index} className="modifier-display">
          <span style={{whiteSpace: "pre-wrap"}}>
            {`${level.className}`.padEnd(10)}
          </span>
          <select
            name={level.className}
            value={level.level}
            onChange={handleLevelChange}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={13}>13</option>
            <option value={14}>14</option>
            <option value={15}>15</option>
            <option value={16}>16</option>
            <option value={17}>17</option>
            <option value={18}>18</option>
            <option value={19}>19</option>
            <option value={20}>20</option>
          </select>
          <span style={{whiteSpace: "pre-wrap"}}>{''.padEnd(5)}</span>
          <button className="red-button" onClick={() => removeLevel(index)}>
            Delete
          </button>
        </div>
      ))}
      <button className="blue-button" onClick={addLevel}>
        Add Levels
      </button>
      <h2>Ability Scores</h2>
      <div className="ability-scores">
        {Object.keys(abilityScores).map((ability) => (
          <div key={ability} className="form-group">
            <label>{ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
            <input
              type="number"
              name={ability}
              value={abilityScores[ability]}
              onChange={handleAbilityScoreChange}
            />
            <div className="modifiers">
              {isNaN(calculateModifier(abilityScores[ability], 0))
                ? `+0`
                : calculateModifier(abilityScores[ability], 0) >= 0
                  ? `+${calculateModifier(abilityScores[ability], 0)}` 
                  : calculateModifier(abilityScores[ability], 0)}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2>Stats</h2>
        <span style={{whiteSpace: "pre-wrap"}}>Hp:       </span>
        <input
          type="number"
          name="cur"
          value={health_info.cur}
          onChange={handleHealthChange}
          style={{ maxWidth: '50px' }}
        />
        <span><b> / </b></span>
        <input
          type="number"
          name="max"
          value={health_info.max}
          onChange={handleHealthChange}
          style={{ maxWidth: '50px' }}
        />
        <br />
        <span style={{whiteSpace: "pre-wrap"}}>Temp Hp:  </span>
        <input
          type="number"
          name="temp"
          value={health_info.temp}
          onChange={handleHealthChange}
          style={{ maxWidth: '50px' }}
        />
        <br />
        <span>Proficiency Bonus: {calculateProfBonus()}</span> <br />
        <span>Saving Throws: </span> <br/>

      </div>
      <h2>Skills</h2>
      <span>* - profieient, # - expert</span>
      {skills.map((skill, index) => (
        <div key={index} className="modifier-display">
          <select
            value={skill.ability}
            onChange={(e) => handleSkillChange(index, "ability", e.target.value)}
          >
            <option value="">Select Ability</option>
            <option value="strength">STR</option>
            <option value="dexterity">DEX</option>
            <option value="constitution">CON</option>
            <option value="intelligence">INT</option>
            <option value="wisdom">WIS</option>
            <option value="charisma">CHA</option>
          </select>
          <select
            value={skill.prof}
            onChange={(e) => handleSkillChange(index, "prof", e.target.value)}
          >
            <option value={0}></option>
            <option value={1}>*</option>
            <option value={2}>#</option>
          </select>
          <span style={{whiteSpace: "pre-wrap"}}>
            {`   ${skill.name}: `.padEnd(20)}
            {calculateModifier(abilityScores[skill.ability] || 10, skill.prof) >= 0
              ? `+${calculateModifier(abilityScores[skill.ability] || 10, skill.prof)}`.padEnd(13)
              : `${calculateModifier(abilityScores[skill.ability] || 10, skill.prof)}`.padEnd(13)}
          </span>
          <button className="red-button" onClick={() => removeSkill(index)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={addSkill}>Add Skill</button> <br /> <br />
      <hr />
      <button onClick={loadJson}>Test Loading</button>
      <br />
      {Data[0] === undefined
        ? (<span> Waiting </span>)
        : (<span>{Data[0].name} {Data[0].entries}</span>)
      }
      <hr />
      <h2>Notes</h2>
      <textarea
        className="notes-box"
        value={notes}
        onInput={saveNotes}
      >
      </textarea>
      <br />
      <hr />
      <button onClick={handleSave}>Save Character</button> <br /> <br />
      <FileUploader onSubmit={handleUpload}/>
    </div>
  );
};

export default App;

