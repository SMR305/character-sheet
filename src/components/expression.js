import React, {useState, useEffect, useRef} from "react";
import rules from '../rules/variantrules.json';
import conditions from '../rules/conditionsdiseases.json';
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

    const draggableRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleDrag = (e, data) => {
        setMousePosition({ x: data.x, y: data.y});
    };

    if (input.includes("variantrule")) {
        const r = rules.variantrule.find(rule => rule.name.toLowerCase() === input.split(regex)[2].split('|')[0].toLowerCase());
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
                <Draggable onDrag={handleDrag} position={mousePosition} nodeRef={draggableRef}>
                    <div ref={draggableRef} style={{position: 'absolute'}} className={`discover ${theme}`}>
                        {r.entries.map((item, index) => {
                            return <Entry key={index} entry={item}/>
                        })}
                    </div>
                </Draggable>
            ) : null}
            </>
        )
    }
    else if (input.includes("condition")) {
        const r = conditions.condition.find(cond => (cond.name.toLowerCase() === input.split(regex)[2].split('|')[0].toLowerCase()) && (cond.source.toLowerCase() === (input.split(regex)[2].split('|')[1] ? input.split(regex)[2].split('|')[1].toLowerCase() : 'phb')));
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
                <Draggable onDrag={handleDrag} position={mousePosition} nodeRef={draggableRef}>
                    <div ref={draggableRef} style={{position: 'absolute'}} className={`discover ${theme}`}>
                        {r.entries.map((item, index) => {
                            return <Entry key={index} entry={item}/>
                        })}
                    </div>
                </Draggable>
            ) : null}
            </>
        )
    }
    else if (input.includes("disease") || input.includes("status")) {
        const r = conditions.disease.find(cond => (cond.name.toLowerCase() === input.split(regex)[2].split('|')[0].toLowerCase()) && (cond.source.toLowerCase() === (input.split(regex)[2].split('|')[1] ? input.split(regex)[2].split('|')[1].toLowerCase() : 'phb'))) || conditions.status.find(cond => (cond.name.toLowerCase() === input.split(regex)[2].split('|')[0].toLowerCase()) && (cond.source.toLowerCase() === (input.split(regex)[2].split('|')[1] ? input.split(regex)[2].split('|')[1].toLowerCase() : 'phb')));
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
                <Draggable onDrag={handleDrag} position={mousePosition} nodeRef={draggableRef}>
                    <div ref={draggableRef} style={{position: 'absolute'}} className={`discover ${theme}`}>
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
        return <strong style={{ textDecoration: "underline", cursor: "pointer" }}>{input.split(regex2)}</strong>;
    }
};

export default Expression;