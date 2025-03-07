import React from "react";

export const ScrollArea = ({ children, className }) => {
    return (
        <div className={`overflow-y-auto ${className}`} style={{ maxHeight: "320px" }}>
            {children}
        </div>
    );
};
