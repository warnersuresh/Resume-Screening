import React from "react";

export const Card = ({ children, className }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className }) => {
    return <div className={className}>{children}</div>;
};
