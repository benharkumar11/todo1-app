import React, {useState} from "react";

const SortDropDown = ({label, sortKey, onSort}) => {
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSortChange = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        onSort(sortKey, newOrder); // Passes column key and order to sorting function
    };

    return (
        <button onClick={handleSortChange} style={{ border: "none", background: "none", cursor: "pointer" }}>
            {label} {sortOrder === "asc" ? "UP" : "Down"}
        </button>
    )
}

export default SortDropDown