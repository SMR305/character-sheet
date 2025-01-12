import React from "react";
import rules from '../rules/variantrules.json';

const Expression = ({input}) => {

    const regex = /{@(\w+)\s([^}]+)}/g;
    const regex2 = /{@(\w+\s[^}]+)}/g;

    if (input.includes("variantrule")) {
        return (
            <strong>{rules.variantrule.find(rule => rule.name === input.split(regex)[2].split('|')[0]).name}</strong>
        )
    }
    else {
        return <strong>{input.split(regex2)}</strong>;
    }
};

export default Expression;