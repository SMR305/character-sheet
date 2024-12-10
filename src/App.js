import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import handleDownload from "./DownloadFile";
import FileUploader from "./UploadFile";
import { core_2014, core_2024 } from "./autoCompletes/classes";
import { bg_PHB, bg_XPHB, bg_backgroundSources } from "./autoCompletes/backgrounds";
import { race_PHB, race_XPHB, race_DMG } from "./autoCompletes/races";

const App = () => {
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
  const [skills, setSkills] = useState([]);
  const [totalLevel, setTLevel] = useState(0);
  const [charClass, setClass] = useState('');
  const [charData, setData] = useState([]);
  const [notes, setNotes] = useState('');

  // suggestions
  const [listClasses, updateClasses] = useState([...core_2014, ...core_2024]);
  const [listBackgrounds, updateBackgrounds] = useState([...bg_PHB, ...bg_XPHB]);
  const [listRaces, updateRaces] = useState([...race_PHB, ...race_DMG, ...race_XPHB]);

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
    let input = "Wizard";
    try {
      const module = await import(`./Class-Files/${input}.json`); // Adjust the path as needed
      setData([...charData, module.default]);
    } catch (error) {
      console.error("Error loading JSON:", error);
    }
  };

  const saveNotes = (e) => {
    setNotes(e.target.value);
  }

  const calculateProfBonus = () => Math.ceil(totalLevel / 4) + 1;

  const calculateModifier = (score, prof) => {
    return (Math.floor((score - 10) / 2) + ((Number(prof) === 1) ? calculateProfBonus() : 0));
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
  }

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
  }

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

  return (
    <div className="container">
      <h1>D&D 5e Character Sheet</h1>
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
      <h2>Skills</h2>
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
      {charData[0] === undefined
        ? (<text> Waiting </text>)
        : (<span>{charData[0].name} {charData[0].spellSlots}</span>)
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

