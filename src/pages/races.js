import React, {useState, useEffect} from "react";
import racesFile from '../races/races.json';
import Entry from "../components/Entry";

const Races = () => {

    const [theme, setTheme] = useState("light");

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    const racesList = racesFile.race;
    const [totalList, setTList] = useState([...racesList]);
    const [displayList, setDisplay] = useState([...totalList]);

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
                                c_race.entries[c_race.entries.indexOf(item => item.name === element.replace)] = element.items;
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

    return (
        <div className={`container ${theme}`}>
            {displayList.map((item, index) => {
                return (
                    <div key={index}>
                        <h2>{item.name} : {item.source}</h2>
                                {item.entries ? <>{item.entries.map((element, index) => {
                                    return <Entry key={index} entry={element}/>
                                })}</> : null}
                    </div>
                );
            })};
        </div>
    );
};

export default Races;