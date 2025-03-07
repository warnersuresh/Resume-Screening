import React from "react";

export const Table = ({ children }) => {
    return <table className="w-full border-collapse">{children}</table>;
};

export const TableHeader = ({ children }) => {
    return <thead className="bg-gray-200">{children}</thead>;
};

export const TableBody = ({ children }) => {
    return <tbody>{children}</tbody>;
};

export const TableRow = ({ children }) => {
    return <tr className="border-b">{children}</tr>;
};

export const TableHead = ({ children }) => {
    return <th className="p-2 text-left">{children}</th>;
};

export const TableCell = ({ children }) => {
    return <td className="p-2">{children}</td>;
};
