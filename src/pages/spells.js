import React from 'react';

const Spells = () => {

    const [spells, setSpells] = React.useState([]);
    const [show, setShow] = React.useState(false);

    const go = async () => {
        let input = "spells-phb";
        try {
          const module = await import(`../spells/${input}.json`); // Adjust the path as needed
          setSpells([...module["spell"]]);
          if (show) {
            setShow(false);
          }
          else {
            setShow(true);
          }
        } catch (error) {
          console.error("Error loading JSON:", error);
        }
    };

    return (
        <div className="container">
            <h1> Spells</h1>
            <span>
                This is where you can find all the spells for Dungeons and Dragons 5th edition and 5.5 edition (2024).
            </span>

            <button onClick={go}>Press Me</button>

            {show ? <div>
                {spells.map((spell, index) => (
                    <div key={index} className="spell">
                        <h2>{spell.name}</h2>
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
                ))}
            </div> : null}
        </div>
    );
}

export default Spells;