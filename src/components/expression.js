import React, {useState, useEffect} from "react";
import rules from '../rules/variantrules.json';
import Entry from './Entry';
import Draggable from 'react-draggable';

const Expression = ({input}) => {

    const [theme, setTheme] = useState('light');

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    const regex = /{@(\w+)\s([^}]+)}/g;
    const regex2 = /{@(\w+\s[^}]+)}/g;

    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
        setMousePosition({x: 0, y: 0});
    };

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleDrag = (e, data) => {
        setMousePosition({ x: data.x, y: data.y});
    };

    const r = rules.variantrule.find(rule => rule.name.toLowerCase() === input.split(regex)[2].split('|')[0].toLowerCase());

    if (input.includes("variantrule")) {
        return (
            <>
            <strong
                onMouseEnter={() => setIsHovered(true)} // Show on hover
                onMouseLeave={() => setIsHovered(false)} // Hide when not hovering
                onClick={() => {handleClick()}}
                style={{ textDecoration: "underline", cursor: "pointer" }}
            >
                {r.name}
            </strong>

            {(isHovered || isClicked) ? (
                <Draggable onDrag={handleDrag} position={mousePosition}>
                    <div style={{position: 'absolute'}} className={`discover ${theme}`}>
                        {r.entries.map((item, index) => {
                            return <Entry key={index} entry={item}/>
                        })}
                    </div>
                </Draggable>
            ) : null}
            </>
        )
    }
    else {
        return <strong>{input.split(regex2)}</strong>;
    }
};

export default Expression;