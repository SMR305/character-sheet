import React from 'react';

const Spells = () => {

  const [spells, setSpells] = React.useState([]);
  const [showList, setShow] = React.useState(false);
  const [expanded, setExpanded] = React.useState([]);

  const go = async () => {
    let input = "spells-phb";
    try {
      const module = await import(`../spells/${input}.json`); // Adjust the path as needed
      setSpells([...module["spell"]]);
      setShow(!showList);
    } catch (error) {
      console.error("Error loading JSON:", error);
    }
  };

  // const expand = (e) => {
  //   console.log(e);
  //   if (expanded.findIndex((item) => item === e) !== -1) {
  //     setExpanded(expanded.filter(spell => spell !== e));
  //   }
  //   else {
  //     setExpanded([...expanded, e]);
  //   }
  // };

  return (
    <div className="container">
      <h1> Spells</h1>
      <span>
          This is where you can find all the spells for Dungeons and Dragons 5th edition and 5.5 edition (2024).
      </span>

      <button onClick={go} style={{margin: '20px'}}>Press Me</button>

      {showList ? <ul>
        {spells.map((spell, index) => (
          <div key={index} className="spell">
            <h2>{spell.name}</h2>
            {/* { (expanded.findIndex((item) => item === spell.name) !== -1)
              ?
                ( */}
                <div style={{backgroundColor: '#ccc', borderRadius: '5px', padding: '10px'}}>
                  <p>Source: {spell.source}</p>
                  <p>Page: {spell.page}</p>
                  <p>Level: {spell.level}</p>
                  <p>School: {spell.school}</p>
                  <p>Components: {Object.keys(spell.components).join(", ")}</p>
                  <p>Duration Type: {spell.duration[0].type}</p>
                  <p>Duration: {spell.duration[0].duration ? Object.values(spell.duration[0].duration).join(" ") : "None"}
                      {spell.duration[0].concentration ? " : Concentration" : ''}</p>
                  <p>Entries: {Object.values(spell.entries).join(" ")}</p>
                </div>
                {/* )
              : null
            } */}
        </div>
        ))}
      </ul> : null}
    </div>
  );
}

export default Spells;