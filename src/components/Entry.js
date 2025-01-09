import React, { useState, useEffect } from 'react';

const Entry = ({ entry }) => {
    const [theme, setTheme] = useState("light");

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    if (typeof entry === 'string') {
        return <span>{entry}</span>;
    } else if (entry.type === 'entries') {
        return (
            <div>
                <h4>{entry.name}</h4>
                {entry.entries.map((subEntry, index) => (
                    <Entry key={index} entry={subEntry} />
                ))}
            </div>
        );
    } else if (entry.type === 'table') {
        return (
            <div>
                <table className={`table ${theme}`}>
                    <thead>
                        <tr>
                            
                            {typeof entry.colLabels === 'undefined' ? 
                            (typeof entry.colLabelRows !== 'undefined' ?
                                entry.colLabelRows.map((label, index) => {
                                    return (
                                        <th className={`th ${theme}`} key={index}><Entry entry={label}/></th>
                                    )
                                }) : (null))
                            :
                                (entry.colLabels.map((label, index) => {
                                    return (
                                        <th className={`th ${theme}`} key={index}><Entry entry={label}/></th>
                                    )
                                }))}
                        </tr>
                    </thead>
                    <tbody>
                        {entry.rows.map((item, index) => {
                            return (
                                <tr key={index}>{
                                    typeof item.row !== 'undefined' ?
                                        item.row.map((rowStuff, key) => {
                                            return (
                                                <td className={`td ${theme}`} key={key}>
                                                    <Entry entry={rowStuff}/>
                                                </td>
                                            )
                                        })
                                    :
                                    item.map((rowStuff, key) => {
                                        return (
                                            <td className={`td ${theme}`} key={key}>
                                                <Entry entry={rowStuff}/>
                                            </td>
                                        )
                                    })
                                }</tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    } else if (entry.type === 'cell') {
        return (
            entry.roll ?
                (entry.roll.exact ? <span>{entry.roll.exact}</span>
                    : <span>{entry.roll.min}-{entry.roll.max}</span>)
                : (<Entry entry={entry.entry}/>)
        )
    } else if (entry.type === 'list') {
        return (
            <>
                <h3>{entry.name}</h3>
                <ul>
                    {entry.items.map((item, index) => {
                        return (
                            <li key={index}><Entry entry={item}/></li>
                        )
                    })}
                </ul>
            </>
        )
    } else if (entry.type === 'item') {
        return (
            <div>
                <span style={{fontWeight: 'bold'}}>{entry.name} </span>
                <span>{entry.entry}</span>
            </div>
        )
    }
    else if (entry.type === 'section') {
        return (
            <>
                <h2>{entry.name}</h2>
                {entry.entries.map((entry, index) => (
                    <Entry key={index} entry={entry} />
                ))}
            </>
        )
    }
    return null;
};

export default Entry;