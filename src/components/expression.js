import React, {useState, useEffect} from "react";
import rules from '../rules/variantrules.json';
import Entry from './Entry'

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
    const [show, setShow] = useState('absolute');

    const handleClick = () => {
        setIsClicked(!isClicked)
        if (show === '') {
            setShow('absolute');
        }
        else {
            setShow('');
        }
    }

    if (input.includes("variantrule")) {
        return (
            <>
            <strong
                onMouseEnter={() => setIsHovered(true)} // Show on hover
                onMouseLeave={() => setIsHovered(false)} // Hide when not hovering
                onClick={() => {handleClick()}}
                style={{ textDecoration: "underline", cursor: "pointer" }}
            >
                {rules.variantrule.find(rule => rule.name === input.split(regex)[2].split('|')[0]).name}
            </strong>

            {(isHovered || isClicked) ? (
                <div style={{position: `${show}`}} className={`discover ${theme}`}>
                    {rules.variantrule.find(rule => rule.name === input.split(regex)[2].split('|')[0]).entries.map((item, index) => {
                        return <Entry key={index} entry={item}/>
                    })}
                </div>
            ) : null}
            </>
        )
    }
    else {
        return <strong>{input.split(regex2)}</strong>;
    }
};

export default Expression;